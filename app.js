/* «Что приготовить» — домашняя PWA. Без сборки и зависимостей. */
'use strict';

// ───────── утилиты ─────────
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const round = (n, d = 0) => { const m = 10 ** d; return Math.round(n * m) / m; };
const fmtNum = (n, d = 0) => round(n, d).toLocaleString('ru-RU');
const rub = (n) => `${fmtNum(Math.max(1, Math.round(n / 5) * 5))} ₽`;

function plural(n, one, few, many) {
  if (!Number.isInteger(n)) return few;
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

const store = {
  get(key, def) {
    try { const v = localStorage.getItem('wtc:' + key); return v == null ? def : JSON.parse(v); } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('wtc:' + key, JSON.stringify(val)); } catch { /* хранилище недоступно */ }
  },
};

// ───────── состояние ─────────
const state = {
  tab: 'home',
  filter: store.get('filter', { cat: 'all', quick: false, healthy: false, light: false }),
  current: store.get('current', []),        // id трёх показанных вариантов
  aiCurrent: store.get('aiCurrent', []),    // id последних ИИ-вариантов
  likes: store.get('likes', []),
  dislikes: store.get('dislikes', []),
  recent: store.get('recent', []),
  cart: store.get('cart', []),              // [{ id, mult }]
  checked: store.get('checked', {}),        // ключ продукта → куплено
  ai: store.get('ai', []),                  // сохранённые ИИ-рецепты (сырые)
  settings: store.get('settings', { key: '', model: 'google/gemini-2.5-flash' }),
  slots: store.get('slots', []),            // подписи «Завтрак / Обед / Ужин» к трём вариантам
  aiSlots: store.get('aiSlots', []),
  detail: null,                             // { id, mult, per: 'serving'|'dish', done: [] }
  aiLoading: false,
  aiError: '',
  wish: '',
};
const save = (...keys) => keys.forEach((k) => store.set(k, state[k]));

// ───────── рецепты ─────────
function buildDbRecipe(raw) {
  const items = raw.ing.map(([key, g, note]) => {
    const pr = PRODUCTS[key];
    if (!pr) throw new Error('Нет продукта ' + key + ' в рецепте ' + raw.id);
    return {
      key, g, note, name: pr.n, sec: pr.sec, pantry: !!pr.pantry, loose: pr.loose,
      nutr: { k: pr.k, p: pr.p, f: pr.f, c: pr.c },
      pack: pr.pack, pc: pr.pc, unit: pr.unit, sp: pr.sp, ml: pr.ml,
    };
  });
  const total = { kcal: 0, p: 0, f: 0, c: 0 };
  let cost = 0;
  for (const it of items) {
    total.kcal += it.g / 100 * it.nutr.k;
    total.p += it.g / 100 * it.nutr.p;
    total.f += it.g / 100 * it.nutr.f;
    total.c += it.g / 100 * it.nutr.c;
    cost += it.g / it.pack.g * it.pack.price;
  }
  return enrich({ ...raw, source: 'db', items, total, per: divK(total, raw.servings), cost });
}

function buildAiRecipe(raw) {
  const servings = clampInt(raw.servings, 1, 12, 2);
  const items = (raw.ingredients || []).filter((i) => i && i.name).map((i) => {
    const g = Math.max(0, Number(i.grams) || 0);
    const packG = Math.max(1, Number(i.pack_grams) || g || 1);
    return {
      key: 'x:' + String(i.name).trim().toLowerCase(), g, amount: i.amount, name: String(i.name).trim(),
      sec: SECTIONS[i.section] ? i.section : 'other', pantry: !!i.pantry,
      loose: packG === 1000 && ['veg', 'meat', 'frozen'].includes(i.section),
      pack: { g: packG, label: i.pack_label || (packG + ' г'), price: Math.max(0, Number(i.price) || 0) },
    };
  });
  const ps = raw.per_serving || {};
  const per = { kcal: +ps.kcal || 0, p: +ps.p || 0, f: +ps.f || 0, c: +ps.c || 0 };
  const cost = items.reduce((s, it) => s + it.g / it.pack.g * it.pack.price, 0);
  return enrich({
    id: raw.id, name: String(raw.name || 'Блюдо'), emoji: raw.emoji || '✨', own: !!raw.own, kids: !!raw.kids,
    cat: CATEGORIES[raw.category] ? raw.category : 'main', time: clampInt(raw.time, 5, 300, 30), servings,
    tags: Array.isArray(raw.tags) ? raw.tags.slice(0, 6).map(String) : [], healthy: !!raw.healthy,
    steps: Array.isArray(raw.steps) ? raw.steps.map(String) : [], source: 'ai', items,
    per, total: mulK(per, servings), cost,
  });
}

// ───────── лёгкость, «детское», аллергены ─────────
// heavy: 0 — лёгкое блюдо, 1+ — тяжёлое (жирное, мучное, калорийное, с майонезом/салом)
const FLOURY = new Set(['flour', 'semolina', 'pasta', 'white_loaf', 'lavash', 'breadcrumbs', 'starch', 'bread']);
const FLOURY_RE = /мук|макарон|спагет|лапш|вермишел|тесто|батон|хлеб|лаваш|манк|крахмал/i;
const HEAVY_KEYS = { mayo: 1.5, lard: 1.5, heavy_cream: 0.8, processed_cheese: 0.6 };
const HEAVY_RE = /майонез|сало|сливки (2|3)/i;
function enrich(r) {
  const k = r.per, kcal = k.kcal || 1;
  const fatShare = k.f * 9 / kcal;
  const solid = r.items.filter((i) => !i.pantry);
  const weight = solid.reduce((s, i) => s + i.g, 0) || 1;
  const isAi = (i) => i.key.startsWith('x:');
  const flour = solid.filter((i) => FLOURY.has(i.key) || (isAi(i) && FLOURY_RE.test(i.name))).reduce((s, i) => s + i.g, 0) / weight;
  let h = 0;
  if (kcal > 600) h += (kcal - 600) / 150;
  if (fatShare > 0.45) h += (fatShare - 0.45) * 6;
  const flourLimit = r.cat === 'dessert' ? 0.4 : 0.25;
  if (flour > flourLimit) h += (flour - flourLimit) * 4;
  for (const i of r.items) h += HEAVY_KEYS[i.key] || (isAi(i) && HEAVY_RE.test(i.name) ? 1.2 : 0);
  r.heavy = round(h, 2);
  r.kids = !!r.kids || KIDS.has(r.id) || r.tags.includes('детям') || /детск|школьн/i.test(r.name);
  r.allergens = Object.entries(ALLERGENS)
    .filter(([, al]) => r.items.some((i) => al.keys.includes(i.key) || (isAi(i) && al.re.test(i.name))))
    .map(([id]) => id);
  return r;
}
const myAllergens = () => state.settings.allergens || ['honey'];
const warnFor = (r) => r.allergens.filter((a) => myAllergens().includes(a));
const hasAllergen = (it) => myAllergens().some((a) => ALLERGENS[a].keys.includes(it.key) || (it.key.startsWith('x:') && ALLERGENS[a].re.test(it.name)));

const clampInt = (v, min, max, def) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const divK = (t, n) => ({ kcal: t.kcal / n, p: t.p / n, f: t.f / n, c: t.c / n });
const mulK = (t, n) => ({ kcal: t.kcal * n, p: t.p * n, f: t.f * n, c: t.c * n });

// ───────── цены выбранного магазина ─────────
const STORES = { avg: 'Среднее по трём', '5ka': 'Пятёрочка', perekrestok: 'Перекрёсток', auchan: 'Ашан' };
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function applyStore(store) {
  if (typeof STORE_PRICES === 'undefined') return;
  for (const [key, pr] of Object.entries(PRODUCTS)) {
    const sp = STORE_PRICES[key];
    if (!sp) continue;
    const pick = sp[store];
    // На развес и для «среднего» оставляем нашу упаковку и пересчитываем цену за грамм
    if (!pick || pr.loose || pick.perKg) {
      const ppg = pick ? pick.ppg : median(Object.values(sp).map((x) => x.ppg));
      pr.pack = { ...pr.pack, price: ppg * pr.pack.g };
    } else {
      pr.pack = { g: pick.g, label: pick.label, price: pick.price };
    }
  }
}
applyStore(state.settings.store || 'avg');

const DB = RECIPES.map(buildDbRecipe);
let AI = state.ai.map(buildAiRecipe);
const byId = new Map();
function reindex() { byId.clear(); for (const r of [...DB, ...AI]) byId.set(r.id, r); }
reindex();
const getR = (id) => byId.get(id);
const pool = () => [...DB, ...AI.filter((r) => r.own || state.likes.includes(r.id))];

// ───────── похожесть и рекомендации ─────────
const featCache = new Map();
function features(r) {
  if (featCache.has(r.id)) return featCache.get(r.id);
  const f = new Set(['cat:' + r.cat]);
  r.tags.forEach((t) => f.add('t:' + t.toLowerCase()));
  if (r.healthy) f.add('healthy');
  r.items.filter((i) => !i.pantry && i.g >= 50).forEach((i) => f.add('i:' + i.key));
  featCache.set(r.id, f);
  return f;
}
function sim(a, b) {
  const fa = features(a), fb = features(b);
  let inter = 0;
  fa.forEach((x) => { if (fb.has(x)) inter += x.startsWith('cat:') ? 2 : 1; });
  return inter / (fa.size + fb.size - inter + 1);
}
function taste(r) {
  const liked = state.likes.map(getR).filter(Boolean).filter((x) => x.id !== r.id);
  const disliked = state.dislikes.map(getR).filter(Boolean);
  if (!liked.length && !disliked.length) return 0;
  const top = liked.map((x) => sim(r, x)).sort((a, b) => b - a).slice(0, 3);
  const plus = top.length ? top.reduce((a, b) => a + b, 0) / top.length : 0;
  const minus = disliked.length ? Math.max(...disliked.map((x) => sim(r, x))) : 0;
  return plus - 0.5 * minus;
}
function recommendations(n = 6) {
  if (!state.likes.length) return [];
  return pool()
    .filter((r) => !state.likes.includes(r.id) && !state.dislikes.includes(r.id))
    .map((r) => ({ r, s: taste(r) }))
    .filter((x) => x.s > 0.05)
    .sort((a, b) => b.s - a.s)
    .slice(0, n).map((x) => x.r);
}
function similar(r, n = 6) {
  return pool().filter((x) => x.id !== r.id && !state.dislikes.includes(x.id))
    .map((x) => ({ x, s: sim(r, x) })).sort((a, b) => b.s - a.s).slice(0, n).map((o) => o.x);
}

// ───────── три варианта ─────────
const MEALS = [
  { label: '☀️ Завтрак', cats: { breakfast: 1 } },
  { label: '🍲 Обед', cats: { soup: 1.6, main: 1 } },
  { label: '🌙 Ужин', cats: { main: 1, salad: 0.7 } },
];
const dayMode = () => state.filter.cat === 'all' || state.filter.cat === 'kids';
function matchesFilter(r) {
  const f = state.filter;
  if (f.cat === 'kids' && !r.kids) return false;
  if (!dayMode() && r.cat !== f.cat) return false;
  if (f.quick && r.time > 30) return false;
  if (f.healthy && !r.healthy) return false;
  if (f.light && r.per.kcal > 450) return false;
  return true;
}
// Вес блюда при случайном выборе: лёгкое, сытное (белок) и похожее на любимое — чаще
function weightOf(r) {
  let w = (1 + 3 * Math.max(0, taste(r))) * Math.exp(-1.6 * r.heavy);
  if (r.healthy) w *= 1.25;
  if ((r.cat === 'main' || r.cat === 'soup') && r.per.p >= 15) w *= 1.3;
  return w;
}
function pickWeighted(weights) {
  const total = [...weights.values()].reduce((a, b) => a + b, 0);
  let x = Math.random() * total;
  for (const [k, w] of weights) { x -= w; if (x <= 0) return k; }
  return [...weights.keys()][0];
}
function roll() {
  let cands = pool().filter((r) => matchesFilter(r) && !state.dislikes.includes(r.id));
  const fresh = cands.filter((r) => !state.recent.includes(r.id) && !state.current.includes(r.id));
  if (fresh.length >= 9) cands = fresh;
  const picked = [], slots = [];
  if (dayMode()) {
    // Меню на день: завтрак, обед, ужин
    for (const meal of MEALS) {
      const weights = new Map();
      for (const r of cands) {
        if (picked.includes(r.id) || !meal.cats[r.cat]) continue;
        let w = weightOf(r) * meal.cats[r.cat];
        if (meal.label.includes('Ужин') && r.per.kcal > 550) w *= 0.35;
        // ужин не повторяет обед по основным продуктам
        if (picked.length && picked.some((id) => sim(getR(id), r) > 0.35)) w *= 0.3;
        weights.set(r.id, w);
      }
      if (!weights.size) continue;
      picked.push(pickWeighted(weights));
      slots.push(meal.label);
    }
  } else {
    const weights = new Map(cands.map((r) => [r.id, weightOf(r)]));
    while (picked.length < 3 && weights.size) {
      const id = pickWeighted(weights);
      picked.push(id);
      weights.delete(id);
    }
  }
  state.current = picked;
  state.slots = slots;
  state.recent = [...picked, ...state.recent].slice(0, 24);
  save('current', 'recent', 'slots');
}

// ───────── количества ─────────
function amountText(it, mult = 1) {
  const g = it.g * mult;
  if (it.key === 'spices' || it.key === 'salt') return 'по вкусу';
  if (it.amount && mult === 1 && it.key.startsWith('x:')) return String(it.amount);
  if (it.pc) {
    const n = Math.round(g / it.pc * 2) / 2;
    if (n >= 1) {
      const unit = it.unit === 'зубчик' ? plural(n, 'зубчик', 'зубчика', 'зубчиков')
        : it.unit === 'луковица' ? plural(n, 'луковица', 'луковицы', 'луковиц') : 'шт';
      const showG = !['egg', 'garlic', 'lemon', 'avocado'].includes(it.key);
      return `${fmtNum(n, 1)} ${unit}` + (showG ? ` · ${weightText(g, it.ml)}` : '');
    }
  }
  if (it.sp && g <= it.sp * 5) {
    const t = Math.round(g / it.sp * 2) / 2;
    if (t >= 1) return `${fmtNum(t, 1)} ст. л.`;
    return `${Math.max(1, Math.round(g / it.sp * 3))} ч. л.`;
  }
  return weightText(g, it.ml);
}
function weightText(g, ml) {
  if (g >= 1000) return `${fmtNum(g / 1000, 1)} ${ml ? 'л' : 'кг'}`;
  const r5 = g >= 100 ? Math.round(g / 10) * 10 : Math.round(g / 5) * 5 || Math.round(g);
  return `${r5} ${ml ? 'мл' : 'г'}`;
}

// ───────── список покупок ─────────
// Сколько брать в магазине: целые упаковки или вес на развес
function buyInfo(it, g) {
  if (it.loose) {
    const w = Math.max(g, 100);
    return { packs: 1, price: w / it.pack.g * it.pack.price, label: `~${weightText(w, it.ml)} на развес` };
  }
  const packs = Math.max(1, Math.ceil(g / it.pack.g - 0.08));
  return { packs, price: packs * it.pack.price, label: (packs > 1 ? packs + ' × ' : '') + it.pack.label };
}

function cartAggregate() {
  const agg = new Map();
  for (const { id, mult } of state.cart) {
    const r = getR(id);
    if (!r) continue;
    for (const it of r.items) {
      const a = agg.get(it.key) || { ...it, g: 0, from: new Set() };
      a.g += it.g * mult;
      a.from.add(r.name);
      agg.set(it.key, a);
    }
  }
  return [...agg.values()].map((a) => ({ ...a, ...buyInfo(a, a.g), amount: undefined }));
}
function inCart(id) { return state.cart.find((c) => c.id === id); }
function toggleCart(id, mult = 1) {
  if (inCart(id)) state.cart = state.cart.filter((c) => c.id !== id);
  else state.cart.push({ id, mult });
  save('cart');
  updateBadge();
}
function updateBadge() {
  const b = $('#cartBadge');
  b.hidden = !state.cart.length;
  b.textContent = state.cart.length;
}

// ───────── рендер: общие куски ─────────
const MASCOT = `
<svg class="mascot" viewBox="0 0 120 120" aria-hidden="true">
  <g class="steam" stroke="var(--steam)" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M44 30c-5-6 5-10 0-17"/><path d="M60 26c-5-6 5-10 0-17"/><path d="M76 30c-5-6 5-10 0-17"/>
  </g>
  <rect x="10" y="62" width="14" height="9" rx="4.5" fill="var(--pot-dark)"/>
  <rect x="96" y="62" width="14" height="9" rx="4.5" fill="var(--pot-dark)"/>
  <rect x="20" y="50" width="80" height="54" rx="22" fill="var(--pot)"/>
  <rect x="15" y="42" width="90" height="13" rx="6.5" fill="var(--pot-dark)"/>
  <circle cx="60" cy="38" r="6" fill="var(--pot-dark)"/>
  <g class="face">
    <circle cx="47" cy="74" r="4.5" fill="var(--ink)"/><circle cx="73" cy="74" r="4.5" fill="var(--ink)"/>
    <circle cx="48.6" cy="72.4" r="1.4" fill="#fff"/><circle cx="74.6" cy="72.4" r="1.4" fill="#fff"/>
    <path d="M53 83q7 6 14 0" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="37" cy="84" rx="6" ry="3.6" fill="var(--blush)"/><ellipse cx="83" cy="84" rx="6" ry="3.6" fill="var(--blush)"/>
  </g>
</svg>`;

function catChip(cat) {
  const c = CATEGORIES[cat];
  return `<span class="chip-cat" style="--cc:${c.color}">${c.emoji} ${c.one}</span>`;
}
function emojiBubble(r, size = '') {
  return `<div class="bubble ${size}" style="--cc:${CATEGORIES[r.cat].color}">${esc(r.emoji)}</div>`;
}
function heart(id) {
  const on = state.likes.includes(id);
  return `<button class="heart ${on ? 'on' : ''}" data-act="like" data-id="${esc(id)}" aria-label="${on ? 'Убрать из любимого' : 'В любимое'}">${on ? '💛' : '🤍'}</button>`;
}
function macroBar(k) {
  const pk = k.p * 4, fk = k.f * 9, ck = k.c * 4, sum = pk + fk + ck || 1;
  return `<div class="mbar"><i style="flex:${pk / sum};background:var(--m-p)"></i><i style="flex:${fk / sum};background:var(--m-f)"></i><i style="flex:${ck / sum};background:var(--m-c)"></i></div>`;
}
function warnChips(r) {
  return warnFor(r).map((a) => `<span class="chip-warn">⚠️ ${ALLERGENS[a].name}</span>`).join('');
}
function card(r, i = 0, slot = '') {
  return `
  <article class="card pop" style="animation-delay:${i * 90}ms" data-act="open" data-id="${esc(r.id)}">
    ${emojiBubble(r)}
    <div class="card-body">
      <div class="card-top">${slot ? `<span class="chip-slot">${slot}</span>` : catChip(r.cat)}${r.source === 'ai' ? `<span class="chip-ai">${r.own ? '📝 мой' : '✨ ИИ'}</span>` : ''}${warnChips(r)}</div>
      <h3>${esc(r.name)}</h3>
      <div class="meta"><span>⏱ ${r.time} мин</span> <span>🔥 ${fmtNum(r.per.kcal)} ккал</span> <span>💰 ${rub(r.cost / r.servings)}/порц.</span></div>
      ${macroBar(r.per)}
      <div class="kbju-mini">Б ${fmtNum(r.per.p)} · Ж ${fmtNum(r.per.f)} · У ${fmtNum(r.per.c)}</div>
    </div>
    ${heart(r.id)}
  </article>`;
}
function miniCard(r) {
  return `<button class="mini" data-act="open" data-id="${esc(r.id)}">${emojiBubble(r, 'sm')}<span>${esc(r.name)}</span><small>${fmtNum(r.per.kcal)} ккал</small></button>`;
}

// ───────── экраны ─────────
function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Ночной перекус? 🌙';
  if (h < 12) return 'Доброе утро ☀️';
  if (h < 17) return 'Добрый день 🌤';
  return 'Добрый вечер 🌙';
}
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

function viewHome() {
  const f = state.filter;
  const chips = [['all', '📅 На день'], ['kids', '👶 Детям'], ...Object.entries(CATEGORIES).map(([k, c]) => [k, `${c.emoji} ${c.name}`])]
    .map(([k, label]) => `<button class="chip ${f.cat === k ? 'on' : ''}" data-act="cat" data-cat="${k}">${label}</button>`).join('');
  const toggles = [['quick', '⚡ До 30 мин'], ['healthy', '🥦 Полезное'], ['light', '🪶 До 450 ккал']]
    .map(([k, label]) => `<button class="chip soft ${f[k] ? 'on' : ''}" data-act="toggle" data-k="${k}">${label}</button>`).join('');
  const cur = state.current.map(getR).filter(Boolean);
  const aiCur = state.aiCurrent.map(getR).filter(Boolean);
  const hasKey = !!state.settings.key;
  const installTip = isIOS && !isStandalone && !store.get('tipClosed', false) ? `
    <div class="tip">
      <b>Добавь на экран «Домой»</b>
      <span>Нажми <span class="ios-share">⬆︎</span> «Поделиться» внизу Safari, затем «На экран Домой». Приложение будет открываться как обычное.</span>
      <button class="x" data-act="closeTip" aria-label="Закрыть">✕</button>
    </div>` : '';

  return `
  <header class="hero">
    <p class="hello">${greeting()}</p>
    <h1>Что приготовим?</h1>
  </header>
  ${installTip}
  <section class="roll-wrap">
    <div class="mascot-wrap" id="mascot">${MASCOT}</div>
    <button class="big-btn" data-act="roll">${cur.length ? 'Ещё варианты 🎲' : 'Придумай мне! 🎲'}</button>
  </section>
  <div class="chips">${chips}</div>
  <div class="chips">${toggles}</div>
  <section class="cards" id="cards">
    ${cur.length ? cur.map((r, i) => card(r, i, state.slots[i])).join('') : `<p class="empty">Нажми на кнопку, и кастрюлька предложит завтрак, обед и ужин 💫</p>`}
    ${cur.length && cur.length < 3 ? `<p class="empty small">Под эти фильтры больше ничего нет. Попробуй снять пару галочек.</p>` : ''}
  </section>
  <section class="ai-box">
    ${hasKey ? `
      <h2>✨ Придумать новое с ИИ</h2>
      <p class="muted">Только известные проверенные блюда: лёгкие, но сытные и вкусные. Учту фильтры, лайки и аллергии. Можно написать пожелание.</p>
      <div class="ai-row">
        <input id="wish" type="text" placeholder="например: из курицы и кабачка, без духовки" value="${esc(state.wish)}" enterkeyhint="go">
        <button class="btn" data-act="ai" ${state.aiLoading ? 'disabled' : ''}>${state.aiLoading ? '<span class="spin"></span>' : 'Придумать'}</button>
      </div>
      ${state.aiError ? `<p class="err">${esc(state.aiError)}</p>` : ''}
      <div class="cards">${aiCur.map((r, i) => card(r, i, state.aiSlots[i])).join('')}</div>
    ` : `<button class="link" data-act="tab" data-tab="settings">✨ Подключить ИИ, чтобы придумывать новые блюда →</button>`}
  </section>`;
}

function viewFav() {
  const liked = state.likes.map(getR).filter(Boolean);
  const own = AI.filter((r) => r.own);
  const recs = recommendations();
  const groups = [...Object.entries(CATEGORIES).map(([k, c]) => [c, DB.filter((r) => r.cat === k)]),
    [{ emoji: '👶', name: 'Детям' }, DB.filter((r) => r.kids)]];
  return `
  <header class="hero small"><h1>Любимое</h1></header>
  <button class="big-btn wide soft-btn" data-act="addOpen">➕ Добавить свой рецепт</button>
  ${own.length ? `<h2 class="sec">Мои рецепты <span class="count">${own.length}</span></h2><div class="scroller">${own.map(miniCard).join('')}</div>` : ''}
  ${recs.length ? `<h2 class="sec">Тебе может понравиться</h2><div class="scroller">${recs.map(miniCard).join('')}</div>` : ''}
  <h2 class="sec">Избранные блюда ${liked.length ? `<span class="count">${liked.length}</span>` : ''}</h2>
  <section class="cards">
    ${liked.length ? liked.map(card).join('') : `<div class="empty big"><div class="em">🤍</div>Пока пусто. Нажимай на сердечко у блюд, которые понравились, и я буду подбирать похожие.</div>`}
  </section>
  <h2 class="sec">Вся книга рецептов <span class="count">${DB.length}</span></h2>
  <div class="book">
    ${groups.map(([c, list]) => `
      <details>
        <summary>${c.emoji} ${c.name} <span class="count">${list.length}</span></summary>
        <div class="book-list">${list.map((r) => `
          <button class="row ${state.dislikes.includes(r.id) ? 'hidden-r' : ''}" data-act="open" data-id="${r.id}">
            <span>${r.emoji} ${esc(r.name)}${warnFor(r).length ? ' <small class="warn-t">⚠️</small>' : ''}</span><small>${fmtNum(r.per.kcal)} ккал · ${r.time} мин</small>
          </button>`).join('')}</div>
      </details>`).join('')}
  </div>`;
}

function viewCart() {
  const list = cartAggregate();
  if (!state.cart.length) {
    return `<header class="hero small"><h1>Покупки</h1></header>
      <div class="empty big"><div class="em">🛒</div>Список пуст. Открой рецепт и нажми «В список покупок», я соберу продукты и посчитаю сумму.</div>`;
  }
  const need = list.filter((i) => !i.pantry);
  const pantry = list.filter((i) => i.pantry);
  const total = need.reduce((s, i) => s + i.price, 0);
  const left = need.filter((i) => !state.checked[i.key]).reduce((s, i) => s + i.price, 0);
  const groups = Object.keys(SECTIONS).map((sec) => [sec, need.filter((i) => i.sec === sec)]).filter(([, l]) => l.length);
  const row = (i) => `
    <label class="buy ${state.checked[i.key] ? 'done' : ''}">
      <input type="checkbox" data-act="check" data-k="${esc(i.key)}" ${state.checked[i.key] ? 'checked' : ''}>
      <span class="box"></span>
      <span class="buy-main"><b>${esc(i.name)}</b><small>нужно ${esc(amountText(i))} · брать ${esc(i.label)}</small></span>
      <span class="price">${i.price ? rub(i.price) : ''}</span>
    </label>`;
  return `
  <header class="hero small"><h1>Покупки</h1></header>
  <div class="dishes">${state.cart.map(({ id, mult }) => { const r = getR(id); return r ? `
    <span class="dish-chip"><button data-act="open" data-id="${esc(id)}">${esc(r.emoji)} ${esc(r.name)}${mult !== 1 ? ` ×${fmtNum(mult, 1)}` : ''}</button><button class="x" data-act="uncart" data-id="${esc(id)}" aria-label="Убрать">✕</button></span>` : ''; }).join('')}</div>
  <div class="total-card">
    <div><small>Примерно в магазине${(state.settings.store || 'avg') !== 'avg' ? ' · ' + STORES[state.settings.store] : ''}</small><b>${rub(total)}</b></div>
    <div><small>Осталось купить</small><b>${rub(left)}</b></div>
  </div>
  ${groups.map(([sec, l]) => `<h2 class="sec">${SECTIONS[sec].emoji} ${SECTIONS[sec].name}</h2><div class="buy-list">${l.map(row).join('')}</div>`).join('')}
  ${pantry.length ? `<h2 class="sec">🏠 Проверь, есть ли дома</h2><div class="buy-list">${pantry.map(row).join('')}</div>` : ''}
  <div class="cart-actions">
    <button class="btn" data-act="share">📤 Отправить список</button>
    <button class="btn ghost" data-act="clearCart">Очистить</button>
  </div>
  <p class="muted small center">Цены по данным магазинов на октябрь 2026, без акций. Упаковки округлены вверх.</p>`;
}

function viewSettings() {
  const s = state.settings;
  return `
  <header class="hero small"><h1>Ещё</h1></header>
  <section class="panel">
    <h2>✨ ИИ через OpenRouter</h2>
    <p class="muted">По желанию. Без ключа приложение работает на встроенной книге рецептов. С ключом можно придумывать новые блюда по пожеланию.</p>
    <label class="field"><span>Ключ API</span>
      <div class="ai-row"><input id="apiKey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="sk-or-v1-…" value="${esc(state.keyDraft ?? s.key)}">
      <button class="btn ghost sm" data-act="showKey" aria-label="Показать ключ">👁</button></div>
    </label>
    <div class="field"><span>Модель</span>
      <button class="select" data-act="pickModel">
        <span><b>${esc(modelName(s.model))}</b><small>${esc(s.model)}</small></span><i>▾</i>
      </button>
    </div>
    <div class="cart-actions">
      <button class="btn" data-act="saveAi">Сохранить</button>
      <button class="btn ghost" data-act="testKey">Проверить ключ</button>
    </div>
    <p class="muted small" id="keyStatus"></p>
    <p class="muted small">Ключ хранится только на этом телефоне и отправляется лишь в OpenRouter. Ключ берётся на openrouter.ai → Keys. КБЖУ и цены у ИИ-рецептов — оценка модели.</p>
  </section>
  <section class="panel">
    <h2>⚠️ Аллергии</h2>
    <p class="muted">Блюда с этими продуктами не прячутся, но помечаются предупреждением. ИИ их не использует.</p>
    <div class="presets">${Object.entries(ALLERGENS).map(([k, al]) => `<button class="chip soft ${myAllergens().includes(k) ? 'on' : ''}" data-act="allergen" data-a="${k}">${al.emoji} ${al.name}</button>`).join('')}</div>
  </section>
  <section class="panel">
    <h2>🛒 Цены из магазина</h2>
    <p class="muted">По ним считается стоимость блюд и список покупок.</p>
    <div class="presets">${Object.entries(STORES).map(([k, n]) => `<button class="chip soft ${(s.store || 'avg') === k ? 'on' : ''}" data-act="store" data-s="${k}">${n}</button>`).join('')}</div>
    <p class="muted small">${typeof PRICES_DATE !== 'undefined' ? `Обычные цены без акций, Москва, на ${new Date(PRICES_DATE).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}.` : ''} Если товара нет в магазине, берётся средняя цена.</p>
  </section>
  <section class="panel">
    <h2>📱 Установка на iPhone</h2>
    <ol class="steps-s"><li>Открой эту страницу в Safari.</li><li>Нажми «Поделиться» (квадрат со стрелкой).</li><li>Выбери «На экран Домой» → «Добавить».</li></ol>
  </section>
  <section class="panel">
    <h2>🧺 Данные</h2>
    <div class="cart-actions">
      <button class="btn ghost" data-act="resetHidden" ${state.dislikes.length ? '' : 'disabled'}>Вернуть скрытые блюда (${state.dislikes.length})</button>
      <button class="btn ghost" data-act="clearAi" ${state.ai.length ? '' : 'disabled'}>Удалить ИИ-рецепты (${state.ai.length})</button>
    </div>
    <p class="muted small">В книге ${DB.length} рецептов. КБЖУ считается по граммовкам сырых продуктов. Цены — по Пятёрочке, Перекрёстку и Ашану; для редких продуктов — ориентировочные.</p>
  </section>
  <p class="muted small center">Сделано с любовью 💛</p>`;
}

const MODEL_PRESETS = ['google/gemini-2.5-flash', 'openai/gpt-4o-mini', 'deepseek/deepseek-chat-v3.1', 'anthropic/claude-sonnet-4.5', 'openai/gpt-5-mini'];

// ───────── карточка рецепта ─────────
function viewDetail() {
  const d = state.detail;
  const r = getR(d.id);
  if (!r) return '';
  const servings = r.servings * d.mult;
  const k = d.per === 'dish' ? mulK(r.total, d.mult) : r.per;
  const kcalShare = (x, m) => (x * m) / ((k.p * 4 + k.f * 9 + k.c * 4) || 1) * 100;
  const shop = r.items.filter((i) => !i.pantry).reduce((s, i) => s + buyInfo(i, i.g * d.mult).price, 0);
  const sims = similar(r);
  const servWord = plural(servings, 'порция', 'порции', 'порций');
  return `
  <div class="sheet-inner">
    <div class="sheet-bar">
      <button class="round" data-act="close" aria-label="Назад">←</button>
      ${heart(r.id)}
    </div>
    <div class="d-hero">
      ${emojiBubble(r, 'xl')}
      <div class="card-top center">${catChip(r.cat)}${r.source === 'ai' ? `<span class="chip-ai">${r.own ? '📝 мой рецепт' : '✨ ИИ'}</span>` : ''}${r.healthy ? '<span class="chip-ai green">🥦 полезное</span>' : ''}${r.kids ? '<span class="chip-ai">👶 детям</span>' : ''}${r.heavy >= 1 ? '<span class="chip-ai">🍖 сытное</span>' : ''}</div>
      <h2>${esc(r.name)}</h2>
      <div class="tags">${r.tags.map((t) => `<span>#${esc(t)}</span>`).join('')}</div>
    </div>
    ${warnFor(r).map((al) => `<div class="warn"><b>⚠️ Осторожно: ${ALLERGENS[al].name}</b><span>В этом блюде есть ${ALLERGENS[al].name}. ${ALLERGENS[al].hint}</span></div>`).join('')}

    <div class="d-meta">
      <div><b>${r.time}</b><small>минут</small></div>
      <div class="stepper"><button data-act="mult" data-d="-1" aria-label="Меньше">−</button><span><b>${fmtNum(servings, 1)}</b><small>${servWord}</small></span><button data-act="mult" data-d="1" aria-label="Больше">+</button></div>
      <div><b>${rub(r.cost * d.mult / servings)}</b><small>за порцию</small></div>
    </div>

    <section class="panel kbju">
      <div class="seg"><button class="${d.per === 'serving' ? 'on' : ''}" data-act="per" data-v="serving">На порцию</button><button class="${d.per === 'dish' ? 'on' : ''}" data-act="per" data-v="dish">Всё блюдо</button></div>
      <div class="kcal"><b>${fmtNum(k.kcal)}</b> ккал</div>
      <div class="macros">
        <div><i style="background:var(--m-p)"></i><b>${fmtNum(k.p)} г</b><small>белки · ${fmtNum(kcalShare(k.p, 4))}%</small></div>
        <div><i style="background:var(--m-f)"></i><b>${fmtNum(k.f)} г</b><small>жиры · ${fmtNum(kcalShare(k.f, 9))}%</small></div>
        <div><i style="background:var(--m-c)"></i><b>${fmtNum(k.c)} г</b><small>углеводы · ${fmtNum(kcalShare(k.c, 4))}%</small></div>
      </div>
      ${macroBar(k)}
      ${r.source === 'ai' ? '<p class="muted small">КБЖУ рассчитано ИИ, это оценка.</p>' : ''}
    </section>

    <h3 class="sec">🧺 Ингредиенты</h3>
    <ul class="ing">${r.items.map((i) => `
      <li class="${i.pantry ? 'pantry' : ''} ${hasAllergen(i) ? 'allergen' : ''}"><span>${hasAllergen(i) ? '⚠️ ' : ''}${esc(i.name)}${i.note ? ` <small>(${esc(i.note)})</small>` : ''}${i.pantry ? ' <small>· обычно есть дома</small>' : ''}</span><b>${esc(amountText(i, d.mult))}</b></li>`).join('')}
    </ul>
    <div class="cost-line">Продукты на блюдо ≈ <b>${rub(r.cost * d.mult)}</b><br>Чек в магазине ≈ <b>${rub(shop)}</b> <small>(целыми упаковками, без того, что есть дома)</small></div>
    <button class="big-btn wide ${inCart(r.id) ? 'done' : ''}" data-act="cart" data-id="${esc(r.id)}">${inCart(r.id) ? '✓ В списке покупок' : '🛒 В список покупок'}</button>

    <h3 class="sec">👩‍🍳 Как готовить</h3>
    <ol class="steps">${r.steps.map((s, i) => `<li class="${d.done.includes(i) ? 'done' : ''}" data-act="step" data-i="${i}"><span class="n">${i + 1}</span><span>${esc(s)}</span></li>`).join('')}</ol>
    <p class="muted small center">Нажми на шаг, чтобы отметить его выполненным</p>
    ${r.src ? `<p class="muted small center">Источник рецепта: <a class="src" href="${esc(r.src)}" target="_blank" rel="noopener noreferrer">${esc(new URL(r.src).hostname.replace(/^(www|m)\./, ''))}</a></p>` : ''}

    ${sims.length ? `<h3 class="sec">Похожие блюда</h3><div class="scroller">${sims.map(miniCard).join('')}</div>` : ''}
    <button class="link center-b" data-act="dislike" data-id="${esc(r.id)}">${state.dislikes.includes(r.id) ? '↩︎ Снова предлагать это блюдо' : '🙅 Не предлагать это блюдо'}</button>
    ${r.own ? `<button class="link center-b" data-act="delOwn" data-id="${esc(r.id)}">🗑 Удалить мой рецепт</button>` : ''}
  </div>`;
}

// ───────── отрисовка ─────────
function render() {
  const view = $('#view');
  view.innerHTML = { home: viewHome, fav: viewFav, cart: viewCart, settings: viewSettings }[state.tab]();
  document.querySelectorAll('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === state.tab));
  updateBadge();
}
function renderDetail() {
  const sheet = $('#sheet');
  if (!state.detail) { sheet.hidden = true; sheet.innerHTML = ''; document.body.classList.remove('locked'); return; }
  const y = sheet.scrollTop;
  sheet.innerHTML = viewDetail();
  sheet.hidden = false;
  sheet.scrollTop = y;
  document.body.classList.add('locked');
}
function openDetail(id) {
  const c = inCart(id);
  state.detail = { id, mult: c ? c.mult : 1, per: 'serving', done: [] };
  const sheet = $('#sheet');
  sheet.scrollTop = 0;
  renderDetail();
  sheet.classList.remove('in'); void sheet.offsetWidth; sheet.classList.add('in');
}
function closeDetail() { state.detail = null; renderDetail(); render(); }

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2200);
}

// ───────── действия ─────────
const actions = {
  tab: (el) => { state.tab = el.dataset.tab; render(); window.scrollTo(0, 0); },
  roll: () => {
    const m = $('#mascot');
    m?.classList.remove('wiggle'); void m?.offsetWidth; m?.classList.add('wiggle');
    roll();
    setTimeout(() => { render(); $('#cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 380);
  },
  cat: (el) => { state.filter.cat = el.dataset.cat; save('filter'); render(); },
  toggle: (el) => { state.filter[el.dataset.k] = !state.filter[el.dataset.k]; save('filter'); render(); },
  open: (el) => openDetail(el.dataset.id),
  close: () => closeDetail(),
  like: (el) => {
    const id = el.dataset.id;
    if (state.likes.includes(id)) state.likes = state.likes.filter((x) => x !== id);
    else { state.likes.unshift(id); state.dislikes = state.dislikes.filter((x) => x !== id); toast('Добавлено в любимое 💛'); }
    save('likes', 'dislikes');
    render(); renderDetail();
  },
  dislike: (el) => {
    const id = el.dataset.id;
    if (state.dislikes.includes(id)) { state.dislikes = state.dislikes.filter((x) => x !== id); toast('Снова будем предлагать'); }
    else {
      state.dislikes.push(id);
      state.likes = state.likes.filter((x) => x !== id);
      state.current = state.current.filter((x) => x !== id);
      toast('Больше не буду предлагать 👌');
    }
    save('likes', 'dislikes', 'current');
    renderDetail(); render();
  },
  cart: (el) => {
    const added = !inCart(el.dataset.id);
    toggleCart(el.dataset.id, state.detail?.mult || 1);
    toast(added ? 'Добавлено в покупки 🛒' : 'Убрано из покупок');
    renderDetail();
  },
  uncart: (el) => { toggleCart(el.dataset.id); render(); },
  mult: (el) => {
    const d = state.detail, r = getR(d.id);
    const servings = Math.max(1, Math.min(20, r.servings * d.mult + Number(el.dataset.d)));
    d.mult = servings / r.servings;
    const c = inCart(d.id);
    if (c) { c.mult = d.mult; save('cart'); }
    renderDetail();
  },
  per: (el) => { state.detail.per = el.dataset.v; renderDetail(); },
  step: (el) => {
    const i = Number(el.dataset.i), done = state.detail.done;
    state.detail.done = done.includes(i) ? done.filter((x) => x !== i) : [...done, i];
    renderDetail();
  },
  check: (el) => {
    state.checked[el.dataset.k] = el.checked;
    save('checked');
    render();
  },
  clearCart: () => {
    if (!confirm('Очистить список покупок?')) return;
    state.cart = []; state.checked = {}; save('cart', 'checked'); render();
  },
  share: async () => {
    const list = cartAggregate();
    const lines = ['🛒 Список покупок', ''];
    for (const sec of Object.keys(SECTIONS)) {
      const l = list.filter((i) => i.sec === sec && !i.pantry && !state.checked[i.key]);
      if (!l.length) continue;
      lines.push(SECTIONS[sec].emoji + ' ' + SECTIONS[sec].name);
      l.forEach((i) => lines.push(`• ${i.name} — ${i.label}`));
      lines.push('');
    }
    lines.push('Для: ' + state.cart.map((c) => getR(c.id)?.name).filter(Boolean).join(', '));
    const text = lines.join('\n');
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast('Список скопирован 📋'); }
    } catch { /* пользователь закрыл меню */ }
  },
  closeTip: () => { store.set('tipClosed', true); render(); },
  showKey: () => { const i = $('#apiKey'); i.type = i.type === 'password' ? 'text' : 'password'; },
  store: (el) => {
    state.settings = { ...state.settings, store: el.dataset.s };
    save('settings');
    location.reload();
  },
  allergen: (el) => {
    const cur = myAllergens(), k = el.dataset.a;
    state.settings = { ...state.settings, allergens: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] };
    save('settings');
    render();
  },
  addOpen: () => openAdd(),
  addParse: () => parseOwnRecipe(),
  delOwn: (el) => {
    if (!confirm('Удалить этот рецепт?')) return;
    const id = el.dataset.id;
    state.ai = state.ai.filter((x) => x.id !== id);
    state.likes = state.likes.filter((x) => x !== id);
    state.cart = state.cart.filter((x) => x.id !== id);
    AI = state.ai.map(buildAiRecipe); reindex();
    save('ai', 'likes', 'cart');
    closeDetail();
  },
  pickModel: () => openPicker(),
  closePicker: () => closePicker(),
  closeAdd: () => closePicker(),
  pickFilter: (el) => { picker.filter = el.dataset.f; renderPickerList(); },
  setModel: (el) => {
    state.settings = { ...state.settings, model: el.dataset.m };
    save('settings');
    closePicker();
    render();
    toast('Модель выбрана ✨');
  },
  saveAi: () => {
    state.settings = { ...state.settings, key: $('#apiKey').value.trim() };
    state.keyDraft = undefined;
    save('settings');
    toast(state.settings.key ? 'Сохранено. ИИ появился на главной ✨' : 'Сохранено');
  },
  testKey: async () => {
    const st = $('#keyStatus');
    const key = $('#apiKey').value.trim();
    if (!key) { st.textContent = 'Сначала вставь ключ.'; return; }
    st.textContent = 'Проверяю…';
    try {
      const res = await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: 'Bearer ' + key } });
      if (!res.ok) throw new Error(res.status === 401 ? 'Ключ не подходит' : 'Ошибка ' + res.status);
      const j = await res.json();
      const d = j.data || {};
      st.textContent = `✓ Ключ работает. Потрачено: $${round(d.usage || 0, 2)}${d.limit ? ` из $${d.limit}` : ''}.`;
    } catch (e) { st.textContent = '✕ ' + (e.message || 'Нет связи с OpenRouter'); }
  },
  resetHidden: () => { state.dislikes = []; save('dislikes'); render(); toast('Все блюда снова в игре'); },
  clearAi: () => {
    if (!confirm('Удалить все рецепты, придуманные ИИ?')) return;
    const ids = new Set(state.ai.map((x) => x.id));
    state.ai = []; AI = []; reindex();
    state.likes = state.likes.filter((x) => !ids.has(x));
    state.cart = state.cart.filter((x) => !ids.has(x.id));
    state.aiCurrent = []; state.current = state.current.filter((x) => !ids.has(x));
    save('ai', 'likes', 'cart', 'aiCurrent', 'current'); render();
  },
  ai: () => generateAi(),
};

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('#tabbar button');
  if (tabBtn) { actions.tab(tabBtn); return; }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'INPUT') return;
  const act = actions[el.dataset.act];
  if (!act) return;
  e.preventDefault();
  act(el);
});
document.addEventListener('change', (e) => {
  if (e.target.matches('input[data-act="check"]')) actions.check(e.target);
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'wish') state.wish = e.target.value;
  if (e.target.id === 'apiKey') state.keyDraft = e.target.value;
  if (e.target.id === 'modelSearch') { picker.q = e.target.value; renderPickerList(); }
});
document.addEventListener('keydown', (e) => { if (e.target.id === 'wish' && e.key === 'Enter') generateAi(); });

// ───────── выбор модели OpenRouter ─────────
// Список моделей публичный, ключ для него не нужен. Кэшируем на сутки для офлайна.
const picker = { models: store.get('models', null), loading: false, error: '', q: '', filter: 'all' };

function modelName(id) {
  const m = picker.models?.list.find((x) => x.id === id);
  return m ? m.name : id.split('/').pop();
}
function perMillion(x) { return Number(x) * 1e6; }
function priceText(m) {
  if (m.free) return 'бесплатно';
  const fmt = (v) => '$' + (v < 1 ? round(v, 2) : round(v, 1));
  return `${fmt(m.in)} / ${fmt(m.out)} за 1М токенов`;
}
async function loadModels() {
  const fresh = picker.models && Date.now() - picker.models.at < 24 * 3600e3;
  if (fresh || picker.loading) return;
  picker.loading = true; picker.error = '';
  renderPickerList();
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models');
    if (!res.ok) throw new Error('Ошибка ' + res.status);
    const j = await res.json();
    const list = (j.data || [])
      .filter((m) => m && typeof m.id === 'string' && !(m.architecture?.output_modalities || ['text']).every((x) => x !== 'text'))
      .map((m) => {
        const inP = perMillion(m.pricing?.prompt || 0), outP = perMillion(m.pricing?.completion || 0);
        return { id: m.id, name: String(m.name || m.id), in: inP, out: outP, free: inP === 0 && outP === 0, ctx: m.context_length || 0 };
      });
    picker.models = { at: Date.now(), list };
    store.set('models', picker.models);
  } catch (e) {
    picker.error = picker.models ? 'Нет связи, показываю сохранённый список.' : 'Не удалось загрузить список моделей. Проверь интернет.';
  } finally {
    picker.loading = false;
    renderPickerList();
  }
}
function openPicker() {
  picker.q = '';
  const el = $('#picker');
  el.innerHTML = `
  <div class="sheet-inner">
    <div class="sheet-bar"><button class="round" data-act="closePicker" aria-label="Закрыть">←</button><b>Модель ИИ</b><span style="width:44px"></span></div>
    <input id="modelSearch" class="search" type="search" placeholder="Поиск: gemini, gpt, claude, deepseek…" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="chips" id="pickFilters"></div>
    <div id="modelList"></div>
  </div>`;
  el.hidden = false;
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  document.body.classList.add('locked');
  renderPickerList();
  loadModels();
}
function closePicker() {
  const el = $('#picker');
  el.hidden = true; el.innerHTML = '';
  if (!state.detail) document.body.classList.remove('locked');
}
function renderPickerList() {
  const box = $('#modelList');
  if (!box) return;
  const all = picker.models?.list || MODEL_PRESETS.map((id) => ({ id, name: id.split('/').pop(), free: false, in: NaN }));
  const q = picker.q.trim().toLowerCase();
  let list = all.filter((m) => !q || m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  if (picker.filter === 'free') list = list.filter((m) => m.free);
  if (picker.filter === 'top') list = MODEL_PRESETS.map((id) => list.find((m) => m.id === id)).filter(Boolean);
  $('#pickFilters').innerHTML = [['all', `Все ${picker.models ? picker.models.list.length : ''}`], ['top', '⭐ Советую'], ['free', '🆓 Бесплатные']]
    .map(([f, l]) => `<button class="chip soft ${picker.filter === f ? 'on' : ''}" data-act="pickFilter" data-f="${f}">${l}</button>`).join('');
  const cur = state.settings.model;
  const custom = q && !all.some((m) => m.id.toLowerCase() === q) && /^[\w.-]+\/[\w.:-]+$/.test(q)
    ? `<button class="mrow" data-act="setModel" data-m="${esc(picker.q.trim())}"><span><b>Использовать «${esc(picker.q.trim())}»</b><small>свой ID модели</small></span></button>` : '';
  box.innerHTML = `
    ${picker.loading ? '<p class="muted center"><span class="spin dark"></span> Загружаю список моделей…</p>' : ''}
    ${picker.error ? `<p class="err center">${esc(picker.error)}</p>` : ''}
    <div class="buy-list">${custom}${list.slice(0, 300).map((m) => `
      <button class="mrow ${m.id === cur ? 'on' : ''}" data-act="setModel" data-m="${esc(m.id)}">
        <span><b>${esc(m.name)}</b><small>${esc(m.id)}${Number.isFinite(m.in) || m.free ? ' · ' + priceText(m) : ''}</small></span>${m.id === cur ? '<i>✓</i>' : ''}
      </button>`).join('') || (custom ? '' : '<p class="muted center">Ничего не нашлось</p>')}</div>
    ${list.length > 300 ? '<p class="muted small center">Показаны первые 300. Уточни поиск.</p>' : ''}
    <p class="muted small center">Цена — за миллион токенов (запрос / ответ). Один рецепт обычно ~3 тыс. токенов.</p>`;
}

// ───────── свой рецепт из текста ─────────
function openAdd() {
  const el = $('#picker');
  const hasKey = !!state.settings.key;
  el.innerHTML = `
  <div class="sheet-inner">
    <div class="sheet-bar"><button class="round" data-act="closeAdd" aria-label="Закрыть">←</button><b>Свой рецепт</b><span style="width:44px"></span></div>
    <p class="muted">Вставь текст рецепта с любого сайта, из заметок или сообщения: ингредиенты и шаги. ИИ разложит его по полочкам, посчитает КБЖУ и стоимость, а рецепт сохранится в книге на этом телефоне.</p>
    <textarea id="ownText" class="search area" rows="10" placeholder="Например:&#10;Куриное филе 500 г, кабачок 1 шт, сметана 2 ст. л.…&#10;1. Нарежь…"></textarea>
    ${hasKey ? '<button class="big-btn wide" data-act="addParse" id="addBtn">✨ Разобрать и сохранить</button>'
      : '<p class="err">Для этого нужен ключ OpenRouter.</p><button class="link" data-act="tab" data-tab="settings">Подключить ИИ в «Ещё» →</button>'}
    <p class="err" id="addErr"></p>
  </div>`;
  el.hidden = false;
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  document.body.classList.add('locked');
}
async function parseOwnRecipe() {
  const text = $('#ownText').value.trim();
  const btn = $('#addBtn'), err = $('#addErr');
  if (text.length < 40) { err.textContent = 'Вставь рецепт целиком: ингредиенты и шаги.'; return; }
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Разбираю…'; err.textContent = '';
  try {
    const data = await askJson(`Разбери этот рецепт в структуру. Не меняй сам рецепт: те же продукты, количества и шаги (шаги перескажи коротко, 4–8 штук, на «ты»). Если порций не указано — оцени.
Верни ТОЛЬКО JSON: {"recipes":[${RECIPE_JSON}]}
${JSON_RULES}

Текст рецепта (между линиями):
-----
${text.slice(0, 8000)}
-----`, 0.2);
    const raw = (data.recipes || [data])[0];
    if (!raw || !raw.name || !Array.isArray(raw.ingredients)) throw new Error('Не получилось разобрать рецепт. Попробуй ещё раз.');
    const id = 'own-' + Date.now().toString(36);
    state.ai = [{ ...raw, id, own: true }, ...state.ai];
    AI = state.ai.map(buildAiRecipe); reindex();
    save('ai');
    closePicker();
    render();
    openDetail(id);
    toast('Рецепт сохранён 📝');
  } catch (e) {
    err.textContent = e.message || 'Нет связи. Проверь интернет.';
    btn.disabled = false; btn.textContent = '✨ Разобрать и сохранить';
  }
}

// ───────── ИИ (OpenRouter) ─────────
const RECIPE_JSON = `{"name":"…","emoji":"одно эмодзи","category":"breakfast|soup|main|salad|dessert","meal":"breakfast|lunch|dinner","time":минуты,"servings":порций,"healthy":true,"kids":false,"tags":["курица","быстро"],
"ingredients":[{"name":"Куриное филе","amount":"500 г","grams":500,"section":"veg|meat|dairy|grocery|canned|frozen|bread|other","pack_label":"упаковка ~1 кг","pack_grams":1000,"price":480,"pantry":false}],
"steps":["…","…"],"per_serving":{"kcal":0,"p":0,"f":0,"c":0}}`;
const JSON_RULES = `pantry=true только для соли, сахара, специй и растительного масла. grams — вес в граммах (для штучных — примерный вес). price — цена всей упаковки pack_label в рублях (2026 год, обычные супермаркеты России). КБЖУ на одну порцию посчитай по граммовкам аккуратно. kids=true, если блюдо подходит ребёнку от 3 лет.`;

function aiPrompt() {
  const f = state.filter;
  const what = f.cat === 'all' ? 'меню на день: 1 завтрак (meal=breakfast), 1 обед — суп или основное блюдо (meal=lunch), 1 ужин полегче (meal=dinner)'
    : f.cat === 'kids' ? 'меню на день для ребёнка от 3 лет: завтрак, обед и ужин (meal=breakfast|lunch|dinner); мягко, без острого, без жарки во фритюре, kids=true'
    : `3 разных блюда категории «${CATEGORIES[f.cat].name}»`;
  const liked = state.likes.map(getR).filter(Boolean).slice(0, 12).map((r) => r.name);
  const known = [...DB, ...AI].map((r) => r.name).join(', ');
  const limits = [f.quick && 'готовка не дольше 30 минут', f.healthy && 'полезные блюда', f.light && 'не больше 450 ккал на порцию'].filter(Boolean);
  const banned = myAllergens().map((a) => ALLERGENS[a].name);
  return `Подбери ${what}.
${limits.length ? 'Ограничения: ' + limits.join(', ') + '.\n' : ''}${banned.length ? 'Аллергия, НЕ используй: ' + banned.join(', ') + '.\n' : ''}${state.wish ? 'Пожелание: ' + state.wish + '\n' : ''}${liked.length ? 'Семье нравятся: ' + liked.join(', ') + '. Учитывай этот вкус.\n' : ''}Не повторяй эти блюда: ${known}.

Для кого: семья, которая старается не есть тяжёлую еду, но любит вкусно поесть.
Требования:
- только настоящие, широко известные блюда домашней кухни, которые есть в проверенных кулинарных книгах и на сайтах вроде russianfood.com или iamcook.ru; не выдумывай необычных сочетаний и названий; пропорции, температура и время — как в проверенных рецептах;
- не жирно (жиры не больше ~35% калорий), не мучное (без теста, блинов, пирогов и горы макарон), без майонеза и сала, обычно не больше 550 ккал на порцию;
- полезно, но не постно: сытно, с нормальной порцией белка (на обед и ужин от 20 г), вкусно — со специями, зеленью, соусами на йогурте или сметане;
- только продукты, которые легко купить в обычных супермаркетах России (Пятёрочка, Магнит, Перекрёсток);
- шаги понятные, 4–7 штук, на «ты».

Верни ТОЛЬКО JSON: {"recipes":[${RECIPE_JSON}]}
${JSON_RULES}`;
}

async function callOpenRouter(useFormat, prompt = aiPrompt(), temperature = 0.7) {
  const { key, model } = state.settings;
  const body = {
    model: model || MODEL_PRESETS[0],
    temperature,
    messages: [
      { role: 'system', content: 'Ты — опытный домашний повар и нутрициолог из России. Предлагаешь только настоящие, проверенные рецепты. Пишешь по-русски, коротко и тепло. Отвечаешь строго валидным JSON без пояснений.' },
      { role: 'user', content: prompt },
    ],
  };
  if (useFormat) body.response_format = { type: 'json_object' };
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'X-Title': 'Chto prigotovit' },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = j.error?.message || 'Ошибка ' + res.status;
    const err = new Error(res.status === 401 ? 'Ключ не подходит. Проверь его в настройках.' : res.status === 402 ? 'На счёте OpenRouter закончились деньги.' : msg);
    err.status = res.status;
    throw err;
  }
  const text = j.choices?.[0]?.message?.content || '';
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('Модель ответила не в том формате. Попробуй ещё раз или другую модель.');
  return JSON.parse(text.slice(a, b + 1));
}

async function askJson(prompt, temperature) {
  try { return await callOpenRouter(true, prompt, temperature); }
  catch (e) { if (e.status === 400 || e instanceof SyntaxError) return callOpenRouter(false, prompt, temperature); throw e; }
}

const MEAL_LABEL = { breakfast: '☀️ Завтрак', lunch: '🍲 Обед', dinner: '🌙 Ужин' };
async function generateAi() {
  if (state.aiLoading) return;
  state.aiLoading = true; state.aiError = ''; render();
  try {
    const data = await askJson(aiPrompt(), 0.7);
    const list = (data.recipes || []).slice(0, 3).filter((x) => x && x.name && Array.isArray(x.ingredients));
    if (!list.length) throw new Error('Не получилось разобрать ответ. Попробуй ещё раз.');
    const stamp = Date.now().toString(36);
    const raws = list.map((x, i) => ({ ...x, id: `ai-${stamp}-${i}` }));
    // храним последние 30 ИИ-рецептов, понравившиеся не удаляем никогда
    state.ai = [...raws, ...state.ai].filter((x, i) => i < 30 || x.own || state.likes.includes(x.id));
    AI = state.ai.map(buildAiRecipe); reindex();
    state.aiCurrent = raws.map((x) => x.id);
    state.aiSlots = dayMode() ? raws.map((x) => MEAL_LABEL[x.meal] || '') : [];
    save('ai', 'aiCurrent', 'aiSlots');
  } catch (e) {
    state.aiError = e.message || 'Нет связи. Проверь интернет.';
  } finally {
    state.aiLoading = false;
    if (state.tab === 'home') render();
  }
}

// ───────── старт ─────────
render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
