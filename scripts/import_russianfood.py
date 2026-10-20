"""Превращает data/recipes.json (собрано с russianfood.com) в recipes-rf.js.

Запуск из корня репозитория: python3 scripts/import_russianfood.py
Ингредиенты сопоставляются с продуктами из recipes.js (PRODUCTS), КБЖУ и цены
считаются в приложении по этим продуктам.
"""
import json
import re
import subprocess
import sys

SRC = 'data/recipes.json'
OUT = 'recipes-rf.js'

# Блюда, которые уже есть в основной книге в почти таком же виде
SKIP = {'Шакшука', 'Салат «Греческий»', 'Борщ с говядиной', 'Куриный суп с вермишелью',
        'Щи из свежей капусты с курицей', 'Блинчики на молоке', 'Рассыпчатый плов с курицей'}

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
}
# Префиксы: первое совпадение побеждает
PREFIX = [
    ('соль', 'salt'), ('уксус', 'vinegar'), ('масло', 'oil'), ('сметана', 'sour_cream'), ('сливки', 'heavy_cream'),
    ('перец болгарский', 'bell_pepper'), ('перец сладкий', 'bell_pepper'), ('перец', 'spices'), ('паприка', 'spices'),
    ('зира', 'spices'), ('кориандр', 'spices'), ('куркума', 'spices'), ('имбирь', 'spices'), ('мускат', 'spices'),
    ('итальянские', 'spices'), ('базилик сушёный', 'spices'), ('приправа', 'spices'), ('лавровый', 'spices'),
    ('лук репчатый', 'onion'), ('помидор', 'tomato'), ('кабачок', 'zucchini'), ('баклажан', 'eggplant'),
    ('картофель', 'potato'), ('морковь', 'carrot'), ('грибы', 'champignons'), ('шампиньоны', 'champignons'),
    ('говядина', 'beef'), ('свинина', 'pork'), ('лимон', 'lemon'), ('сок лимона', 'lemon'),
]

EMOJI = [('сырн', '🧀'), ('томатн', '🍅'), ('харчо', '🍲'), ('рассольник', '🍲'), ('щи', '🍲'), ('суп', '🍲'),
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
    n = name.strip().lower().replace('ё', 'ё')
    if n in EXACT:
        return EXACT[n]
    for pre, key in PREFIX:
        if n.startswith(pre):
            return key
    sys.exit(f'Нет сопоставления для ингредиента: {name}')


def products():
    js = "global.window={};" + open('recipes.js', encoding='utf8').read() + ";console.log(JSON.stringify(PRODUCTS))"
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)


def main():
    P = products()
    data = json.load(open(SRC, encoding='utf8'))
    out = []
    for r in data:
        if r['name'] in SKIP:
            continue
        rid = re.search(r'rid=(\d+)', r['url']).group(1)
        ing = {}
        notes = {}
        for i in r['ingredients']:
            k = key_for(i['name'])
            if not k:
                continue
            g = float(i.get('grams_estimate') or 0)
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
            'id': 'rf-' + rid, 'name': r['name'], 'emoji': emoji, 'cat': r['category'],
            'time': int(r.get('time_min') or 45), 'servings': servings, 'tags': tags, 'healthy': healthy,
            'ing': [[k, round(g)] + ([notes[k]] if k in notes else []) for k, g in ing.items()],
            'steps': r['steps'], 'src': r['url'],
        })
    body = json.dumps(out, ensure_ascii=False, indent=1)
    with open(OUT, 'w', encoding='utf8') as f:
        f.write('// Рецепты с russianfood.com (шаги пересказаны), сгенерировано scripts/import_russianfood.py.\n')
        f.write('// Не правь вручную: меняй data/recipes.json или скрипт и запускай его заново.\n')
        f.write('RECIPES.push(...' + body + ');\n')
    print(f'{len(out)} рецептов записано в {OUT}')


if __name__ == '__main__':
    main()
