"""Превращает data/prices.json (цены Пятёрочки, Перекрёстка и Ашана) в prices.js.

Запуск из корня репозитория: python3 scripts/import_prices.py
Для каждого продукта и магазина считается цена за грамм и упаковка, которую там продают.
"""
import json
import re
import subprocess

SRC = 'data/prices.json'
OUT = 'prices.js'
DATE = '2026-10-20'


def products():
    js = "global.window={};" + open('recipes.js', encoding='utf8').read() + ";console.log(JSON.stringify(PRODUCTS))"
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)


def num(s):
    return float(s.replace(',', '.'))


def grams(pack, prod):
    """Вес упаковки в граммах по строке вида «930 мл», «1 шт (~300 г)», «2 шт»."""
    s = (pack or '').lower()
    m = re.search(r'\(~?\s*([\d.,]+)\s*(кг|г|мл|л)\)', s) or re.search(r'([\d.,]+)\s*(кг|г|мл|л)\b', s)
    if m:
        v, u = num(m.group(1)), m.group(2)
        return v * 1000 if u in ('кг', 'л') else v
    m = re.search(r'([\d.,]+)\s*шт', s)
    if m:
        n = num(m.group(1))
        return n * prod['pc'] if prod.get('pc') else n * prod['pack']['g']
    return None


def main():
    P = products()
    data = json.load(open(SRC, encoding='utf8'))
    out = {}
    for x in data:
        k, store, price = x['key'], x['store'], x.get('price')
        if k not in P or not price:
            continue
        prod = P[k]
        if x.get('per_kg'):
            g, label = 1000, '1 кг'
        else:
            g = grams(x.get('pack'), prod)
            label = x.get('pack') or ''
        if not g:
            print('пропуск: не понял упаковку', k, store, x.get('pack'))
            continue
        entry = {'g': round(g), 'label': label, 'price': round(price), 'ppg': price / g,
                 'perKg': bool(x.get('per_kg')), 'title': x.get('title', ''), 'url': x.get('url', '')}
        cur = out.setdefault(k, {}).get(store)
        # Для штучных продуктов (лимон) предпочитаем цену за штуки, а не за кг
        if cur and prod.get('pc') and cur['perKg'] is False and entry['perKg']:
            continue
        out[k][store] = entry
    with open(OUT, 'w', encoding='utf8') as f:
        f.write('// Цены из Пятёрочки, Перекрёстка и Ашана (обычные, без акций), сгенерировано scripts/import_prices.py.\n')
        f.write(f"const PRICES_DATE = '{DATE}';\n")
        f.write('const STORE_PRICES = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
    print(f'{len(out)} продуктов с ценами записано в {OUT}')


if __name__ == '__main__':
    main()
