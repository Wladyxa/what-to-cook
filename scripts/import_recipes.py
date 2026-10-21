"""Превращает собранные с сайтов рецепты (data/*.json) в js-файлы для приложения.

Запуск из корня репозитория:
  python3 scripts/import_recipes.py russianfood   # data/recipes.json -> recipes-rf.js
  python3 scripts/import_recipes.py iamcook       # data/recipes-iamcook.json -> recipes-ic.js
Ингредиенты сопоставляются с продуктами из recipes.js (PRODUCTS), КБЖУ и цены
считаются в приложении по этим продуктам.
"""
import json
import re
import subprocess
import sys

SOURCES = {
    'russianfood': {'src': 'data/recipes.json', 'out': 'recipes-rf.js', 'prefix': 'rf-', 'site': 'russianfood.com',
                    'id': r'rid=(\d+)'},
    'iamcook': {'src': 'data/recipes-iamcook.json', 'out': 'recipes-ic.js', 'prefix': 'ic-', 'site': 'iamcook.ru',
                'id': r'showrecipe/(\d+)'},
}

# Блюда, которые уже есть в книге в почти таком же виде
SKIP = {'Шакшука', 'Салат «Греческий»', 'Борщ с говядиной', 'Куриный суп с вермишелью',
        'Щи из свежей капусты с курицей', 'Блинчики на молоке', 'Рассыпчатый плов с курицей',
        'Пышные оладьи на кефире', 'Жюльен с курицей и шампиньонами в духовке', 'Гречка по-купечески с фаршем',
        'Ленивые голубцы как в детском саду', 'Суп с куриными фрикадельками', 'Тефтели с рисом в подливе',
        'Тыквенный суп-пюре', 'Цветная капуста со сметаной в духовке', 'Бефстроганов из говядины со сливками',
        'Сырный суп с грибами и курицей', 'Курица, запечённая с картошкой'}

# На сайте порции бывают очень большими: тут — сколько нормальных порций реально выходит
SERVINGS = {'Салат с грибами и курицей': 4, 'Салат «Красное море»': 4,
            'Свинина с грибами в сметанном соусе': 3, 'Бефстроганов классический': 3}

# Название ингредиента (как на сайте, без регистра) -> ключ продукта; None — не покупается
EXACT = {
    'вода': None, 'вода (кипяток)': None, 'вода или бульон': None, 'огуречный рассол': None,
    'сода': 'baking_powder', 'масло топлёное': 'butter', 'масло сливочное': 'butter',
    'масло оливковое': 'olive_oil', 'горчица дижонская': 'mustard',
    'базилик свежий': 'greens', 'зелень': 'greens', 'зелень (укроп, базилик)': 'greens',
    'укроп': 'greens', 'петрушка': 'greens', 'укроп/петрушка': 'greens',
    'лук зелёный': 'green_onion', 'морковь по-корейски': 'korean_carrot',
    'капуста квашеная': 'sauerkraut', 'капуста белокочанная': 'cabbage', 'капуста цветная': 'cauliflower',
    'огурцы солёные': 'pickles', 'огурец': 'cucumber', 'яблоко': 'apple', 'свёкла': 'beet',
    'курица (крылышки)': 'chicken_wings', 'курица': 'chicken_whole', 'курица (любая часть)': 'chicken_whole',
    'куриная грудка': 'chicken_fillet', 'куриное филе': 'chicken_fillet', 'печень куриная': 'chicken_liver',
    'фарш мясной': 'minced_mix', 'фарш свиной': 'minced_mix', 'сало свиное': 'lard',
    'сельдь солёная (филе)': 'herring', 'икра красная': 'red_caviar', 'рыбные консервы (сайра)': 'saira',
    'красная рыба (сёмга/форель)': 'salmon', 'хек (филе)': 'hake', 'минтай': 'pollock', 'филе минтая': 'pollock',
    'крабовые палочки': 'crab_sticks', 'маслины без косточки': 'olives', 'майонез': 'mayo',
    'кетчуп или томатный соус': 'ketchup', 'томатная паста': 'tomato_paste',
    'томат-пюре': 'canned_tomatoes', 'помидоры в собственном соку': 'canned_tomatoes',
    'сыр плавленый': 'processed_cheese', 'сыр сливочный': 'cream_cheese', 'сыр твёрдый': 'cheese',
    'сыр фета': 'feta', 'брынза': 'feta', 'творог': 'cottage', 'кефир': 'kefir',
    'молоко': 'milk', 'молоко или вода': 'milk', 'желтки': 'egg', 'яйца': 'egg', 'яйцо': 'egg',
    'крупа манная': 'semolina', 'крупа перловая': 'barley', 'крупа гречневая': 'buckwheat', 'пшено': 'millet',
    'рис': 'rice', 'рис круглозёрный': 'rice', 'вермишель': 'pasta', 'мука пшеничная': 'flour',
    'батон': 'white_loaf', 'хлеб белый чёрствый': 'white_loaf', 'сухарики': 'croutons',
    'сухари панировочные или мука': 'breadcrumbs', 'кунжут': 'sesame', 'сахар': 'sugar',
    'соевый соус': 'soy_sauce', 'брокколи': 'broccoli', 'шпинат': 'spinach', 'чеснок': 'garlic',
    'фасоль консервированная': 'beans', 'фасоль красная консервированная': 'beans',
    'вода или молоко': 'milk', 'листья салата': 'lettuce', 'томатный сок': 'tomato_juice', 'крахмал': 'starch',
    'сельдерей': 'celery', 'хлеб чёрный': 'bread', 'яйцо (белок)': 'egg', 'аджика': 'ketchup', 'ванилин': 'spices',
    'куриная голень': 'chicken_drumstick', 'куриные бёдра': 'chicken_drumstick', 'куриный окорочок': 'chicken_drumstick',
    'курица (ножки, крылья)': 'chicken_whole', 'филе индейки': 'turkey_fillet', 'фарш говяжий': 'minced_beef',
    'фарш куриный': 'chicken_mince', 'фарш свино-говяжий': 'minced_mix', 'фарш смешанный': 'minced_mix',
    'моцарелла': 'mozzarella', 'сыр моцарелла': 'mozzarella', 'сыр фета или брынза': 'feta',
    'тыква очищенная': 'pumpkin', 'спагетти': 'pasta', 'сухари панировочные': 'breadcrumbs',
    # отварной рис весит примерно втрое больше сухого
    'рис отварной': ('rice', 0.35),
}
# Префиксы: первое совпадение побеждает
PREFIX = [
    ('зелень,', 'spices'), ('сушёная зелень', 'spices'), ('петрушка сушёная', 'spices'), ('карри', 'spices'),
    ('орегано', 'spices'), ('прованские', 'spices'), ('изюм', 'raisins'), ('кабач', 'zucchini'), ('кефир', 'kefir'),
    ('макароны', 'pasta'), ('огурцы солёные', 'pickles'), ('зелень', 'greens'), ('петрушка', 'greens'),
    ('соль', 'salt'), ('уксус', 'vinegar'), ('масло', 'oil'), ('сметана', 'sour_cream'), ('сливки', 'heavy_cream'),
    ('перец болгарский', 'bell_pepper'), ('перец сладкий', 'bell_pepper'), ('перец', 'spices'), ('паприка', 'spices'),
    ('зира', 'spices'), ('кориандр', 'spices'), ('куркума', 'spices'), ('имбирь', 'spices'), ('мускат', 'spices'),
    ('итальянские', 'spices'), ('базилик сушёный', 'spices'), ('приправа', 'spices'), ('лавровый', 'spices'),
    ('лук репчатый', 'onion'), ('помидор', 'tomato'), ('кабачок', 'zucchini'), ('баклажан', 'eggplant'),
    ('картофель', 'potato'), ('морковь', 'carrot'), ('грибы', 'champignons'), ('шампиньоны', 'champignons'),
    ('говядина', 'beef'), ('свинина', 'pork'), ('лимон', 'lemon'), ('сок лимона', 'lemon'),
]

EMOJI = [('суп', '🍲'), ('яичная', '🍳'), ('картоф', '🥔'), ('картош', '🥔'), ('мусака', '🍆'), ('рататуй', '🍆'),
         ('кабачк', '🥒'), ('лазанья', '🥘'), ('спагетти', '🍝'), ('макароны', '🍝'), ('фрикадел', '🧆'), ('тефтел', '🧆'),
         ('гуляш', '🥩'), ('азу ', '🥩'), ('чашушули', '🥩'), ('мясо по-француз', '🥩'), ('индейк', '🦃'), ('капуст', '🥬'),
         ('отбивные', '🍗'), ('курин', '🍗'), ('курица', '🍗'), ('шкмерули', '🍗'), ('паприкаш', '🍗'),
         ('сырн', '🧀'), ('томатн', '🍅'), ('харчо', '🍲'), ('рассольник', '🍲'), ('щи', '🍲'), ('суп', '🍲'),
         ('каша', '🥣'), ('омлет', '🍳'), ('миш-маш', '🍳'), ('оладьи', '🥞'), ('запеканка', '🍰'),
         ('ёжики', '🧆'), ('котлет', '🍔'), ('голубцы', '🥬'), ('жюльен', '🍄'), ('рулетики', '🍗'),
         ('печень', '🍖'), ('бефстроганов', '🥩'), ('свинина', '🥩'), ('цветная капуста', '🥦'),
         ('рагу', '🥘'), ('овощи', '🥘'), ('гречка', '🍛'), ('минтай', '🐟'), ('рыб', '🐟'),
         ('корзинки', '🥔'), ('мимоза', '🌼'), ('красное море', '🦀'), ('краб', '🦀'), ('салат', '🥗')]

CLASSIC = ('борщ', 'щи', 'рассольник', 'харчо', 'голубцы', 'котлеты классические', 'бефстроганов',
           'мимоза', 'ёжики', 'жюльен', 'миш-маш', 'оладьи', 'пшённая', 'рисовая каша')
FISH = {'pollock', 'hake', 'salmon', 'herring', 'saira', 'crab_sticks', 'red_caviar'}
CHICKEN = {'chicken_fillet', 'chicken_whole', 'chicken_wings', 'chicken_liver'}
MEAT = {'beef', 'pork', 'minced_mix', 'lard'}
HEAVY = {'mayo', 'lard', 'heavy_cream', 'processed_cheese'}


def key_for(name):
    """Ключ продукта и множитель веса (для отварного риса и т.п.)."""
    n = name.strip().lower()
    if n in EXACT:
        v = EXACT[n]
        return v if isinstance(v, tuple) else (v, 1)
    for pre, key in PREFIX:
        if n.startswith(pre):
            return key, 1
    sys.exit(f'Нет сопоставления для ингредиента: {name}')


def products():
    js = "global.window={};" + open('recipes.js', encoding='utf8').read() + ";console.log(JSON.stringify(PRODUCTS))"
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)


def main():
    cfg = SOURCES[sys.argv[1] if len(sys.argv) > 1 else 'russianfood']
    P = products()
    data = json.load(open(cfg['src'], encoding='utf8'))
    out = []
    for r in data:
        if r['name'] in SKIP:
            continue
        rid = re.search(cfg['id'], r['url']).group(1)
        ing = {}
        notes = {}
        for i in r['ingredients']:
            k, factor = key_for(i['name'])
            if not k:
                continue
            g = float(i.get('grams_estimate') or 0) * factor
            if k in ('salt', 'spices'):
                g = min(g, 5) or 2
            ing[k] = ing.get(k, 0) + g
            if 'для подачи' in i.get('amount_text', ''):
                notes[k] = 'для подачи'
        servings = SERVINGS.get(r['name']) or max(1, int(r.get('servings') or 2))
        tot = {'k': 0, 'f': 0}
        for k, g in ing.items():
            tot['k'] += g / 100 * P[k]['k']
            tot['f'] += g / 100 * P[k]['f']
        kcal = tot['k'] / servings
        fat_share = tot['f'] * 9 / (tot['k'] or 1)
        keys = set(ing)
        healthy = kcal <= 450 and fat_share < 0.5 and not (keys & HEAVY)
        name_l = r['name'].lower()
        tags = []
        if keys & CHICKEN:
            tags.append('курица')
        if keys & FISH:
            tags.append('рыба')
        if keys & MEAT:
            tags.append('мясо')
        if not (keys & (CHICKEN | FISH | MEAT)):
            tags.append('вегетарианское')
        if keys & {'champignons'}:
            tags.append('грибы')
        if int(r.get('time_min') or 60) <= 30:
            tags.append('быстро')
        if any(c in name_l for c in CLASSIC):
            tags.append('классика')
        emoji = next((e for kw, e in EMOJI if kw in name_l), {'breakfast': '🍳', 'soup': '🍲', 'main': '🍽️', 'salad': '🥗', 'dessert': '🍰'}[r['category']])
        out.append({
            'id': cfg['prefix'] + rid, 'name': r['name'], 'emoji': emoji, 'cat': r['category'],
            'time': int(r.get('time_min') or 45), 'servings': servings, 'tags': tags, 'healthy': healthy,
            'ing': [[k, round(g)] + ([notes[k]] if k in notes else []) for k, g in ing.items()],
            'steps': r['steps'], 'src': r['url'],
        })
    body = json.dumps(out, ensure_ascii=False, indent=1)
    with open(cfg['out'], 'w', encoding='utf8') as f:
        f.write(f"// Рецепты с {cfg['site']} (шаги пересказаны), сгенерировано scripts/import_recipes.py.\n")
        f.write('// Не правь вручную: меняй data/recipes.json или скрипт и запускай его заново.\n')
        f.write('RECIPES.push(...' + body + ');\n')
    print(f"{len(out)} рецептов записано в {cfg['out']}")


if __name__ == '__main__':
    main()
