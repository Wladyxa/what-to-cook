// Цены из Пятёрочки, Перекрёстка и Ашана (обычные, без акций), сгенерировано scripts/import_prices.py.
const PRICES_DATE = '2026-10-20';
const STORE_PRICES = {
 "potato": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 60,
   "ppg": 0.05999,
   "perKg": true,
   "title": "Картофель отечественный",
   "url": "https://5ka.ru/product/kartofel-otechestvennyy--3953590/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 46,
   "ppg": 0.04599,
   "perKg": true,
   "title": "Картофель",
   "url": "https://www.perekrestok.ru/cat/1589/p/kartofel-769"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 70,
   "ppg": 0.06999,
   "perKg": true,
   "title": "Картофель белый мытый, вес",
   "url": "https://www.auchan.ru/product/kartofel_belyy_mytyy_ves/"
  }
 },
 "onion": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 53,
   "ppg": 0.05299,
   "perKg": true,
   "title": "Лук репчатый",
   "url": "https://5ka.ru/product/luk-repchatyy--197/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 57,
   "ppg": 0.05699,
   "perKg": true,
   "title": "Лук репчатый",
   "url": "https://www.perekrestok.ru/cat/150/p/luk-repcatyj-45463"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 36,
   "ppg": 0.03599,
   "perKg": true,
   "title": "Лук репчатый (социальный товар), ~1,3 кг",
   "url": "https://www.auchan.ru/product/luk_repchatyy_ves_fas/"
  }
 },
 "red_onion": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 97,
   "ppg": 0.09698999999999999,
   "perKg": true,
   "title": "Лук красный",
   "url": "https://5ka.ru/product/luk-krasnyy--18387/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 г",
   "price": 105,
   "ppg": 0.20998,
   "perKg": false,
   "title": "Лук репчатый красный, 500г",
   "url": "https://www.perekrestok.ru/cat/150/p/luk-repcatyj-krasnyj-500g-3016771"
  },
  "auchan": {
   "g": 500,
   "label": "500 г",
   "price": 100,
   "ppg": 0.19998,
   "perKg": false,
   "title": "Лук репчатый красный чулок, 500 г",
   "url": "https://www.auchan.ru/product/luk-krasnyy-chulok-500-gr/"
  }
 },
 "carrot": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 28,
   "ppg": 0.027989999999999998,
   "perKg": true,
   "title": "Морковь",
   "url": "https://5ka.ru/product/morkov--2138999/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 29,
   "ppg": 0.02899,
   "perKg": true,
   "title": "Морковь отечественная",
   "url": "https://www.perekrestok.ru/cat/150/p/morkov-otecestvennaa-60529"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 27,
   "ppg": 0.02699,
   "perKg": true,
   "title": "Морковь (социальный товар), вес",
   "url": "https://www.auchan.ru/product/morkov_ves/"
  }
 },
 "cabbage": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 27,
   "ppg": 0.02699,
   "perKg": true,
   "title": "Капуста белокочанная",
   "url": "https://5ka.ru/product/kapusta-belokochannaya--198/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 29,
   "ppg": 0.02899,
   "perKg": true,
   "title": "Капуста",
   "url": "https://www.perekrestok.ru/cat/150/p/kapusta-45661"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 27,
   "ppg": 0.02699,
   "perKg": true,
   "title": "Капуста белокочанная (социальный товар), вес",
   "url": "https://www.auchan.ru/product/kapusta_bk_ves/"
  }
 },
 "beet": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 39,
   "ppg": 0.038990000000000004,
   "perKg": true,
   "title": "Свекла",
   "url": "https://5ka.ru/product/svekla--88570/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 39,
   "ppg": 0.038990000000000004,
   "perKg": true,
   "title": "Свекла",
   "url": "https://www.perekrestok.ru/cat/150/p/svekla-45532"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 33,
   "ppg": 0.032990000000000005,
   "perKg": true,
   "title": "Свекла, вес",
   "url": "https://www.auchan.ru/product/svekla_ves/"
  }
 },
 "tomato": {
  "5ka": {
   "g": 600,
   "label": "600 г",
   "price": 185,
   "ppg": 0.3083166666666667,
   "perKg": false,
   "title": "Томат тепличный красный 600г",
   "url": "https://5ka.ru/product/tomat-teplichnyy-krasnyy-600g--4106273/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 220,
   "ppg": 0.21999000000000002,
   "perKg": true,
   "title": "Томаты красные круглые",
   "url": "https://www.perekrestok.ru/cat/150/p/tomaty-krasnye-kruglye-2166"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 98,
   "ppg": 0.09799,
   "perKg": true,
   "title": "Томаты сливовидные грунтовые, вес",
   "url": "https://www.auchan.ru/product/tomaty_slivovidnye_grunt/"
  }
 },
 "cucumber": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 160,
   "ppg": 0.15999000000000002,
   "perKg": true,
   "title": "Огурцы короткоплодные",
   "url": "https://5ka.ru/product/ogurtsy-korotkoplodnye--3219701/"
  },
  "perekrestok": {
   "g": 600,
   "label": "600 г",
   "price": 115,
   "ppg": 0.19165,
   "perKg": false,
   "title": "Огурцы Среднеплодные, 600г",
   "url": "https://www.perekrestok.ru/cat/1589/p/ogurcy-sredneplodnye-600g-2131726"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 170,
   "ppg": 0.16999,
   "perKg": true,
   "title": "Огурцы грунтовые, вес",
   "url": "https://www.auchan.ru/product/ogurcy_otkrytyy_grunt_ves/"
  }
 },
 "bell_pepper": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 150,
   "ppg": 0.14999,
   "perKg": true,
   "title": "Перец сладкий",
   "url": "https://5ka.ru/product/perets-sladkiy--28396/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 324,
   "ppg": 0.32399,
   "perKg": true,
   "title": "Перец красный сладкий",
   "url": "https://www.perekrestok.ru/cat/1704/p/perec-krasnyj-sladkij-6177"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 150,
   "ppg": 0.14999,
   "perKg": true,
   "title": "Перец Ласточка, вес",
   "url": "https://www.auchan.ru/product/perec_lastochka_kg/"
  }
 },
 "zucchini": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 150,
   "ppg": 0.14999,
   "perKg": true,
   "title": "Кабачки",
   "url": "https://5ka.ru/product/kabachki--3965/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 199,
   "ppg": 0.19899,
   "perKg": true,
   "title": "Кабачки",
   "url": "https://www.perekrestok.ru/cat/1704/p/kabacki-44110"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 260,
   "ppg": 0.25999,
   "perKg": true,
   "title": "Кабачки Цукини, вес",
   "url": "https://www.auchan.ru/product/kabachki_cukkini_ves/"
  }
 },
 "pumpkin": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 90,
   "ppg": 0.08999,
   "perKg": true,
   "title": "Тыква в ассортименте",
   "url": "https://5ka.ru/product/tykva-v-assortimente--79022/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 110,
   "ppg": 0.10998999999999999,
   "perKg": true,
   "title": "Тыква Оранжевое солнце",
   "url": "https://www.perekrestok.ru/cat/150/p/tykva-oranzevoe-solnce-4088824"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 130,
   "ppg": 0.12999000000000002,
   "perKg": true,
   "title": "Тыква Оранжевая круглая, вес",
   "url": "https://www.auchan.ru/product/tykva_oranzhevaya_kruglaya_ves/"
  }
 },
 "garlic": {
  "5ka": {
   "g": 100,
   "label": "100 г",
   "price": 67,
   "ppg": 0.6698999999999999,
   "perKg": false,
   "title": "Чеснок свежий 100г",
   "url": "https://5ka.ru/product/chesnok-svezhiy-100g--3044397/"
  },
  "perekrestok": {
   "g": 50,
   "label": "3 шт (50 г)",
   "price": 75,
   "ppg": 1.4997999999999998,
   "perKg": false,
   "title": "Чеснок, 3шт",
   "url": "https://www.perekrestok.ru/cat/1704/p/cesnok-3st-17662"
  },
  "auchan": {
   "g": 100,
   "label": "3 шт (100 г)",
   "price": 80,
   "ppg": 0.7998999999999999,
   "perKg": false,
   "title": "Чеснок, 3 шт",
   "url": "https://www.auchan.ru/product/chesnok-v-upakovke-3-sht/"
  }
 },
 "greens": {
  "5ka": {
   "g": 30,
   "label": "30 г",
   "price": 47,
   "ppg": 1.5663333333333334,
   "perKg": false,
   "title": "Зелень Global Village Укроп и петрушка 30г",
   "url": "https://5ka.ru/product/zelen-global-village-ukrop-i-petrushka-30g--4265903/"
  },
  "perekrestok": {
   "g": 30,
   "label": "30 г",
   "price": 63,
   "ppg": 2.099666666666667,
   "perKg": false,
   "title": "Петрушка Укроп свежие Маркет Fresh, 30г",
   "url": "https://www.perekrestok.ru/cat/1589/p/petruska-ukrop-svezie-market-fresh-30g-4294974"
  },
  "auchan": {
   "g": 100,
   "label": "100 г",
   "price": 100,
   "ppg": 0.9998999999999999,
   "perKg": false,
   "title": "Укроп АШАН Красная птица пучок, 100 г",
   "url": "https://www.auchan.ru/product/k-p-ukrop-puchok-100g/"
  }
 },
 "lettuce": {
  "5ka": {
   "g": 400,
   "label": "1 шт",
   "price": 155,
   "ppg": 0.387475,
   "perKg": false,
   "title": "Салат Айсберг 1шт.",
   "url": "https://5ka.ru/product/salat-aysberg-1sht--9210/"
  },
  "perekrestok": {
   "g": 200,
   "label": "200 г",
   "price": 149,
   "ppg": 0.74495,
   "perKg": false,
   "title": "Салат Айсберг свежий мытый, 200г",
   "url": "https://www.perekrestok.ru/cat/1704/p/salat-vygodno-ajsberg-svezij-mytyj-200g-4312456"
  },
  "auchan": {
   "g": 300,
   "label": "300 г",
   "price": 120,
   "ppg": 0.39996666666666664,
   "perKg": false,
   "title": "Салат Айсберг, 300 г",
   "url": "https://www.auchan.ru/product/salat-aysberg-1-sht/"
  }
 },
 "lemon": {
  "5ka": {
   "g": 240,
   "label": "2 шт",
   "price": 130,
   "ppg": 0.541625,
   "perKg": false,
   "title": "Лимон Global Village 2шт.",
   "url": "https://5ka.ru/product/limon-global-village-2sht--4294883/"
  },
  "perekrestok": {
   "g": 240,
   "label": "2 шт",
   "price": 136,
   "ppg": 0.566625,
   "perKg": false,
   "title": "Лимон Маркет Fresh, 2шт",
   "url": "https://www.perekrestok.ru/cat/153/p/limon-market-fresh-2st-3677353"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 200,
   "ppg": 0.19999,
   "perKg": true,
   "title": "Лимоны, вес",
   "url": "https://www.auchan.ru/product/limony_korobka_ves/"
  }
 },
 "champignons": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 180,
   "ppg": 0.449975,
   "perKg": false,
   "title": "Шампиньоны Global Village 400г",
   "url": "https://5ka.ru/product/shampinony-global-village-400g--3655737/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 190,
   "ppg": 0.47497500000000004,
   "perKg": false,
   "title": "Шампиньоны Маркет Fresh, 400г",
   "url": "https://www.perekrestok.ru/cat/1764/p/sampinony-market-fresh-400g-3210027"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 180,
   "ppg": 0.449975,
   "perKg": false,
   "title": "Грибы АШАН Красная птица шампиньоны, 400 г",
   "url": "https://www.auchan.ru/product/kp-griby-shampinony-400g/"
  }
 },
 "apple": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 97,
   "ppg": 0.09698999999999999,
   "perKg": true,
   "title": "Яблоко сезонное",
   "url": "https://5ka.ru/product/yabloko-sezonnoe--807/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 180,
   "ppg": 0.17999,
   "perKg": true,
   "title": "Яблоки Кубанские",
   "url": "https://www.perekrestok.ru/cat/153/p/abloki-kubanskie-4374590"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 110,
   "ppg": 0.10998999999999999,
   "perKg": true,
   "title": "Яблоки летних сортов, вес",
   "url": "https://www.auchan.ru/product/yabloki_letnih_sortovkg/"
  }
 },
 "avocado": {
  "5ka": {
   "g": 300,
   "label": "1 шт (~300 г)",
   "price": 200,
   "ppg": 0.6666333333333334,
   "perKg": false,
   "title": "Авокадо Хаас крупное, 1шт",
   "url": "https://5ka.ru/product/avokado-khaas-krupnoe-1sht--4254512/"
  },
  "perekrestok": {
   "g": 230,
   "label": "1 шт (~230 г)",
   "price": 220,
   "ppg": 0.9564782608695652,
   "perKg": false,
   "title": "Авокадо Хаас крупное, 1шт",
   "url": "https://www.perekrestok.ru/cat/150/p/avokado-haas-krupnoe-1st-4254512"
  },
  "auchan": {
   "g": 150,
   "label": "1 шт",
   "price": 120,
   "ppg": 0.7999333333333333,
   "perKg": false,
   "title": "Авокадо Хасс Кения, 1 шт",
   "url": "https://www.auchan.ru/product/avokado_hass_1sht/"
  }
 },
 "chicken_fillet": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 550,
   "ppg": 0.54999,
   "perKg": true,
   "title": "Филе грудки цыплёнка Петелинка охлаждённое",
   "url": "https://5ka.ru/product/file-grudki-tsyplyonka-petelinka-okhlazhdyonnoe--2173555/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 590,
   "ppg": 0.58999,
   "perKg": true,
   "title": "Филе грудки цыплёнка Петелинка охлаждённое",
   "url": "https://www.perekrestok.ru/cat/1320/p/file-grudki-cyplenka-petelinka-ohlazdennoe-2173555"
  },
  "auchan": {
   "g": 850,
   "label": "850 г",
   "price": 510,
   "ppg": 0.5999882352941177,
   "perKg": false,
   "title": "Филе цыпленка-бройлера АШАН Красная птица большое охлажденное, 850 г",
   "url": "https://www.auchan.ru/product/kp-file-bolshoe-850g/"
  }
 },
 "chicken_thigh": {
  "5ka": {
   "g": 750,
   "label": "750 г",
   "price": 490,
   "ppg": 0.65332,
   "perKg": false,
   "title": "Филе бедра цыпленка Первая свежесть 750г",
   "url": "https://5ka.ru/product/file-bedra-tsyplenka-pervaya-svezhest-750g--4250498/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 600,
   "ppg": 0.59999,
   "perKg": true,
   "title": "Филе бедра цыплёнка Петелинка без кожи охлаждённое",
   "url": "https://www.perekrestok.ru/cat/1320/p/file-bedra-cyplenka-petelinka-bez-kozi-ohlazdennoe-4007208"
  },
  "auchan": {
   "g": 750,
   "label": "750 г",
   "price": 390,
   "ppg": 0.5199866666666667,
   "perKg": false,
   "title": "Филе бедра цыпленка-бройлера «Троекурово» охлажденное, 750 г",
   "url": "https://www.auchan.ru/product/troekurovo-file-bedra-750g-ohl/"
  }
 },
 "chicken_drumstick": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 270,
   "ppg": 0.26999,
   "perKg": true,
   "title": "Голень куриная охлаждённая",
   "url": "https://5ka.ru/product/golen-kurinaya-okhlazhdyonnaya--3191297/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 410,
   "ppg": 0.40999,
   "perKg": true,
   "title": "Голень цыплёнка Петелинка охлаждённая",
   "url": "https://www.perekrestok.ru/cat/1320/p/golen-cyplenka-petelinka-ohlazdennaa-2073281"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 350,
   "ppg": 0.34999,
   "perKg": true,
   "title": "Голень цыпленка-бройлера охлажденная Беларусь, вес",
   "url": "https://www.auchan.ru/product/golen-cb-bolshoy-lotok-kg/"
  }
 },
 "chicken_mince": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 130,
   "ppg": 0.324975,
   "perKg": false,
   "title": "Фарш цыпленка Наша птичка Домашний охлажденный 400г",
   "url": "https://5ka.ru/product/farsh-tsyplenka-nasha-ptichka-domashniy-okhlazhden--4261929/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 170,
   "ppg": 0.42497500000000005,
   "perKg": false,
   "title": "Фарш Первая Свежесть Традиционный из мяса цыплёнка охлаждённый, 400г",
   "url": "https://www.perekrestok.ru/cat/385/p/fars-pervaa-svezest-tradicionnyj-iz-masa-cyplenka-ohlazdennyj-400g-4425662"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 190,
   "ppg": 0.47497500000000004,
   "perKg": false,
   "title": "Фарш «Наша птичка» домашний охлажденный, 400 г",
   "url": "https://www.auchan.ru/product/farsh-domashniy-400g-nasha-ptich/"
  }
 },
 "turkey_fillet": {
  "5ka": {
   "g": 500,
   "label": "500 г",
   "price": 330,
   "ppg": 0.65998,
   "perKg": false,
   "title": "Филе индейки Рестория малое 500г",
   "url": "https://5ka.ru/product/file-indeyki-restoriya-maloe-500g--4243048/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 г",
   "price": 410,
   "ppg": 0.81998,
   "perKg": false,
   "title": "Филе индейки ИндиЛайт малое охлажденное, 500г",
   "url": "https://www.perekrestok.ru/cat/1320/p/file-indejki-indilajt-maloe-ohlazdennoe-500g-3966112"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 740,
   "ppg": 0.73999,
   "perKg": true,
   "title": "Филе грудки индейки АШАН Красная птица охлажденное, ~1,2 кг",
   "url": "https://www.auchan.ru/product/kp-file-grudki-ind-ohl-kg/"
  }
 },
 "beef": {
  "5ka": {
   "g": 600,
   "label": "600 г",
   "price": 810,
   "ppg": 1.3499833333333333,
   "perKg": false,
   "title": "Мясо говядины Delimeat мякоть лопатки охлажденная 600г",
   "url": "https://5ka.ru/product/myaso-govyadiny-delimeat-myakot-lopatki-okhlazhden--4429749/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 552,
   "ppg": 1.379975,
   "perKg": false,
   "title": "Говядина Веско для тушения, 400г",
   "url": "https://www.perekrestok.ru/cat/951/p/govadina-vesko-dla-tusenia-400g-4433551"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 1100,
   "ppg": 1.09999,
   "perKg": true,
   "title": "Мякоть лопатки говядины «Каждый день» охлажденная, ~1 кг",
   "url": "https://www.auchan.ru/product/myakot_lopatki_govyadiny_vu_1kg/"
  }
 },
 "pork": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 499,
   "ppg": 0.49899,
   "perKg": true,
   "title": "Корейка свиная",
   "url": "https://5ka.ru/product/koreyka-svinaya--4429484/"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 330,
   "ppg": 0.32999,
   "perKg": true,
   "title": "Мякоть корейки свинины «Каждый день» охлажденная",
   "url": "https://www.auchan.ru/product/myakot_koreyki_svininy_vu_2kg/"
  }
 },
 "minced_mix": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 177,
   "ppg": 0.442475,
   "perKg": false,
   "title": "Фарш домашний Рестория 400г",
   "url": "https://5ka.ru/product/farsh-domashniy-restoriya-400g--3387627/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 180,
   "ppg": 0.449975,
   "perKg": false,
   "title": "Фарш из свинины и говядины Хороший Кусок Домашний, 400г",
   "url": "https://www.perekrestok.ru/cat/145/p/fars-iz-svininy-i-govadiny-horosij-kusok-domasnij-400g-4429429"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 240,
   "ppg": 0.599975,
   "perKg": false,
   "title": "Фарш свино-говяжий АШАН Красная птица по-домашнему охлажденный, 400 г",
   "url": "https://www.auchan.ru/product/farsh-file-po-domashnemu-400g/"
  }
 },
 "minced_beef": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 270,
   "ppg": 0.674975,
   "perKg": false,
   "title": "Фарш говяжий Рестория 400г",
   "url": "https://5ka.ru/product/farsh-govyazhiy-restoriya-400g--3398465/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 300,
   "ppg": 0.7499750000000001,
   "perKg": false,
   "title": "Фарш Мираторг говяжий охлаждённый, 400г",
   "url": "https://www.perekrestok.ru/cat/1320/p/fars-miratorg-govazij-ohlazdennyj-400g-4288090"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 370,
   "ppg": 0.924975,
   "perKg": false,
   "title": "Фарш из говядины АШАН Красная птица Экстра охлажденный, 400 г",
   "url": "https://www.auchan.ru/product/farsh-ekstra-iz-govyad-ferm-400g/"
  }
 },
 "pollock": {
  "5ka": {
   "g": 600,
   "label": "600 г",
   "price": 416,
   "ppg": 0.6933166666666667,
   "perKg": false,
   "title": "Минтай Fish House филе без кожи замороженное 600г",
   "url": "https://5ka.ru/product/mintay-fish-house-file-bez-kozhi-zamorozhennoe-600--3628683/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 400,
   "ppg": 0.9999750000000001,
   "perKg": false,
   "title": "Филе Люди любят минтая без кожи порционное мороженое, 400г",
   "url": "https://www.perekrestok.ru/cat/1729/p/file-ludi-lubat-mintaa-bez-kozi-porcionnoe-morozenoe-400g-4350402"
  },
  "auchan": {
   "g": 600,
   "label": "600 г",
   "price": 350,
   "ppg": 0.5833166666666667,
   "perKg": false,
   "title": "Минтай замороженный «Каждый день» филе без кожи, 600 г",
   "url": "https://www.auchan.ru/product/kd-mintay-file-bez-kozhi-600-g/"
  }
 },
 "hake": {
  "5ka": {
   "g": 800,
   "label": "800 г",
   "price": 440,
   "ppg": 0.5499875,
   "perKg": false,
   "title": "Хек Fish House тушка замороженная 800г",
   "url": "https://5ka.ru/product/khek-fish-house-tushka-zamorozhennaya-800g--3638883/"
  },
  "perekrestok": {
   "g": 800,
   "label": "800 г",
   "price": 400,
   "ppg": 0.49998750000000003,
   "perKg": false,
   "title": "Хек тихоокеанский тушка замороженный, 800г",
   "url": "https://www.perekrestok.ru/cat/1705/p/hek-tihookeanskij-tuska-zamorozennyj-800g-4400954"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 450,
   "ppg": 0.44999,
   "perKg": true,
   "title": "Хек замороженный «Каждый день», вес",
   "url": "https://www.auchan.ru/product/kdhek_tushka1kg/"
  }
 },
 "salmon": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 957,
   "ppg": 2.392475,
   "perKg": false,
   "title": "Форель горная стейк охлажденная, 400г",
   "url": "https://5ka.ru/product/forel-forel-gornaya-steyk-okhlazhdennaya-400g--4437498/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 1000,
   "ppg": 2.499975,
   "perKg": false,
   "title": "Форель радужная Вкус Арт стейк с кожей замороженная, 400г",
   "url": "https://www.perekrestok.ru/cat/812/p/forel-raduznaa-vkus-art-stejk-s-kozej-zamorozennaa-400g-4422626"
  },
  "auchan": {
   "g": 500,
   "label": "500 г",
   "price": 900,
   "ppg": 1.79998,
   "perKg": false,
   "title": "Форель радужная замороженная АШАН Золотая птица стейки, 500 г",
   "url": "https://www.auchan.ru/product/zp-forel-steyk-500g/"
  }
 },
 "shrimp": {
  "5ka": {
   "g": 300,
   "label": "300 г",
   "price": 530,
   "ppg": 1.7666333333333333,
   "perKg": false,
   "title": "Креветки королевские Бухта Изобилия варено-мороженые очищенные без хвоста, 300г",
   "url": "https://5ka.ru/product/krevetki-korolevskie-bukhta-izobiliya-vareno-moroz--3641931/"
  },
  "perekrestok": {
   "g": 300,
   "label": "300 г",
   "price": 680,
   "ppg": 2.2666333333333335,
   "perKg": false,
   "title": "Креветки королевские Бухта Изобилия варено-мороженые очищенные без хвоста, 300г",
   "url": "https://www.perekrestok.ru/cat/1764/p/krevetki-korolevskie-buhta-izobilia-vareno-morozenye-ocisennye-bez-hvosta-300g-3641931"
  },
  "auchan": {
   "g": 300,
   "label": "300 г",
   "price": 550,
   "ppg": 1.8333,
   "perKg": false,
   "title": "Креветки POLAR белоногие очищенные замороженные 41/50, 300 г",
   "url": "https://www.auchan.ru/product/krevetki-ochishch-41-50-s-m-300-g/"
  }
 },
 "tuna": {
  "5ka": {
   "g": 185,
   "label": "185 г",
   "price": 344,
   "ppg": 1.8594054054054054,
   "perKg": false,
   "title": "Тунец Fortuna кусочки натуральные 185г",
   "url": "https://5ka.ru/product/tunets-fortuna-kusochki-naturalnye-185g--72320/"
  },
  "perekrestok": {
   "g": 185,
   "label": "185 г",
   "price": 255,
   "ppg": 1.3783243243243244,
   "perKg": false,
   "title": "Тунец Fortuna кусочки натуральные, 185г",
   "url": "https://www.perekrestok.ru/cat/812/p/tunec-fortuna-kusocki-naturalnye-185g-72320"
  },
  "auchan": {
   "g": 185,
   "label": "185 г",
   "price": 175,
   "ppg": 0.9458918918918919,
   "perKg": false,
   "title": "Тунец «Пеликан» в собственном соку для салатов, 185 г",
   "url": "https://www.auchan.ru/product/tun-pelikan-salatn-v-sc-185g/"
  }
 },
 "crab_sticks": {
  "5ka": {
   "g": 200,
   "label": "200 г",
   "price": 104,
   "ppg": 0.51995,
   "perKg": false,
   "title": "Крабовые палочки Русское море охлажденные 200г",
   "url": "https://5ka.ru/product/krabovye-palochki-russkoe-more-okhlazhdennye-200g--3337825/"
  },
  "perekrestok": {
   "g": 200,
   "label": "200 г",
   "price": 110,
   "ppg": 0.5499499999999999,
   "perKg": false,
   "title": "Крабовые палочки имитация охлаждённые Пр!ст, 200г",
   "url": "https://www.perekrestok.ru/cat/182/p/krabovye-palocki-imitacia-ohlazdennye-pr-st-200g-3659730"
  },
  "auchan": {
   "g": 200,
   "label": "200 г",
   "price": 89,
   "ppg": 0.44494999999999996,
   "perKg": false,
   "title": "Крабовые палочки «Русское море», 200 г",
   "url": "https://www.auchan.ru/product/krabovye-palochki-russkoe-more-200-g/"
  }
 },
 "egg": {
  "5ka": {
   "g": 550,
   "label": "10 шт",
   "price": 120,
   "ppg": 0.21816363636363637,
   "perKg": false,
   "title": "Яйцо куриное Окское столовое С1 10шт.",
   "url": "https://5ka.ru/product/yaytso-kurinoe-okskoe-stolovoe-s1-10sht--3062836/"
  },
  "perekrestok": {
   "g": 550,
   "label": "10 шт",
   "price": 115,
   "ppg": 0.20907272727272727,
   "perKg": false,
   "title": "Яйцо куриное Окское столовое С1, 10шт",
   "url": "https://www.perekrestok.ru/cat/1704/p/ajco-kurinoe-okskoe-stolovoe-s1-10st-3062836"
  },
  "auchan": {
   "g": 550,
   "label": "10 шт",
   "price": 120,
   "ppg": 0.21816363636363637,
   "perKg": false,
   "title": "Яйцо куриное «Окское» С1 белое столовое, 10 шт",
   "url": "https://www.auchan.ru/product/yayco-okskoe-stolovoe-s1-10-sht/"
  }
 },
 "milk": {
  "5ka": {
   "g": 930,
   "label": "930 мл",
   "price": 96,
   "ppg": 0.10321505376344085,
   "perKg": false,
   "title": "Молоко Простоквашино пастеризованное 2.5% БЗМЖ 930мл",
   "url": "https://5ka.ru/product/moloko-prostokvashino-pasterizovannoe-2-5-bzmzh-93--2093081/"
  },
  "perekrestok": {
   "g": 930,
   "label": "930 мл",
   "price": 120,
   "ppg": 0.12902150537634408,
   "perKg": false,
   "title": "Молоко Простоквашино пастеризованное 2,5% БЗМЖ, 930мл",
   "url": "https://www.perekrestok.ru/cat/114/p/moloko-prostokvasino-pasterizovannoe-2-5-bzmz-930ml-2093081"
  },
  "auchan": {
   "g": 900,
   "label": "900 мл",
   "price": 85,
   "ppg": 0.09443333333333333,
   "perKg": false,
   "title": "Молоко пастеризованное «Экомилк» 2,5%, 900 мл",
   "url": "https://www.auchan.ru/product/moloko-2-5-900ml-pet-ekomilk/"
  }
 },
 "kefir": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 90,
   "ppg": 0.08999,
   "perKg": false,
   "title": "Кефир Домик в Деревне 1%, 1кг",
   "url": "https://5ka.ru/product/kefir-domik-v-derevne-1-1kg--4455630/"
  },
  "perekrestok": {
   "g": 900,
   "label": "900 г",
   "price": 90,
   "ppg": 0.09998888888888888,
   "perKg": false,
   "title": "Кефир 1% Молочный Знак, 900г",
   "url": "https://www.perekrestok.ru/cat/1589/p/kefir-1-molocnyj-znak-900g-4328084"
  },
  "auchan": {
   "g": 900,
   "label": "900 мл",
   "price": 90,
   "ppg": 0.09998888888888888,
   "perKg": false,
   "title": "Кефир «Экомилк» 1%, 900 мл",
   "url": "https://www.auchan.ru/product/kefir-1-900ml-pet-ekomilk/"
  }
 },
 "cottage": {
  "5ka": {
   "g": 200,
   "label": "200 г",
   "price": 125,
   "ppg": 0.62495,
   "perKg": false,
   "title": "Творог Простоквашино 5% БЗМЖ 200г",
   "url": "https://5ka.ru/product/tvorog-prostokvashino-5-bzmzh-200g--4121613/"
  },
  "perekrestok": {
   "g": 180,
   "label": "180 г",
   "price": 86,
   "ppg": 0.4777222222222222,
   "perKg": false,
   "title": "Творог 5% Молочный знак, 180г",
   "url": "https://www.perekrestok.ru/cat/117/p/tvorog-5-molocnyj-znak-180g-4216657"
  },
  "auchan": {
   "g": 180,
   "label": "180 г",
   "price": 80,
   "ppg": 0.44438888888888883,
   "perKg": false,
   "title": "Творог классический АШАН Красная птица брикет 5%, 180 г",
   "url": "https://www.auchan.ru/product/kp-tvorog-5-180g-bzmzh-3/"
  }
 },
 "sour_cream": {
  "5ka": {
   "g": 300,
   "label": "300 г",
   "price": 95,
   "ppg": 0.3166333333333333,
   "perKg": false,
   "title": "Сметана Домик в деревне 15% БЗМЖ 300г",
   "url": "https://5ka.ru/product/smetana-domik-v-derevne-15-bzmzh-300g--3665624/"
  },
  "perekrestok": {
   "g": 300,
   "label": "300 г",
   "price": 90,
   "ppg": 0.29996666666666666,
   "perKg": false,
   "title": "Сметана Простоквашино 15% БЗМЖ 300г",
   "url": "https://www.perekrestok.ru/cat/1704/p/smetana-prostokvasino-15-bzmz-300g-4121592"
  },
  "auchan": {
   "g": 300,
   "label": "300 г",
   "price": 85,
   "ppg": 0.2833,
   "perKg": false,
   "title": "Сметана «Домик в деревне» 15%, 300 г",
   "url": "https://www.auchan.ru/product/smetana-domik-v-derevne-15-300g/"
  }
 },
 "yogurt": {
  "5ka": {
   "g": 250,
   "label": "250 г",
   "price": 95,
   "ppg": 0.37995999999999996,
   "perKg": false,
   "title": "Йогурт Teos греческий 2% 250г",
   "url": "https://5ka.ru/product/yogurt-teos-grecheskiy-2-250g--3697856/"
  },
  "perekrestok": {
   "g": 250,
   "label": "250 г",
   "price": 99,
   "ppg": 0.39596,
   "perKg": false,
   "title": "Йогурт Teos Греческий 2%, 250г",
   "url": "https://www.perekrestok.ru/cat/1704/p/jogurt-teos-greceskij-2-250g-3697856"
  },
  "auchan": {
   "g": 125,
   "label": "125 г",
   "price": 63,
   "ppg": 0.50392,
   "perKg": false,
   "title": "Йогурт греческий Neo Натуральный 2%, 125 г",
   "url": "https://www.auchan.ru/product/yog-natur-grech-2-125g-neo-bzmzh/"
  }
 },
 "cheese": {
  "5ka": {
   "g": 200,
   "label": "200 г",
   "price": 180,
   "ppg": 0.89995,
   "perKg": false,
   "title": "Сыр Брест-Литовск Российский полутвердый 50% БЗМЖ 200г",
   "url": "https://5ka.ru/product/syr-brest-litovsk-rossiyskiy-polutverdyy-50-bzmzh--4046889/"
  },
  "perekrestok": {
   "g": 200,
   "label": "200 г",
   "price": 240,
   "ppg": 1.19995,
   "perKg": false,
   "title": "Сыр полутвёрдый Брест-Литовск Российский 50%, 200г",
   "url": "https://www.perekrestok.ru/cat/122/p/syr-polutverdyj-brest-litovsk-rossijskij-50-200g-4046889"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 700,
   "ppg": 0.7,
   "perKg": true,
   "title": "Сыр полутвердый Российский АШАН Красная птица 50%, вес",
   "url": "https://www.auchan.ru/product/kd-syr-rossiyskiy-50-ves/"
  }
 },
 "mozzarella": {
  "5ka": {
   "g": 125,
   "label": "125 г",
   "price": 160,
   "ppg": 1.2799200000000002,
   "perKg": false,
   "title": "Сыр Galbani Моцарелла мягкий 45% БЗМЖ 125г",
   "url": "https://5ka.ru/product/syr-galbani-motsarella-myagkiy-45-bzmzh-125g--15105/"
  },
  "perekrestok": {
   "g": 130,
   "label": "130 г",
   "price": 180,
   "ppg": 1.3845384615384617,
   "perKg": false,
   "title": "Сыр мягкий Моцарелла 45% Маркет Перекрёсток, 130г",
   "url": "https://www.perekrestok.ru/cat/1704/p/syr-magkij-mocarella-45-market-perekrestok-130g-3480834"
  },
  "auchan": {
   "g": 100,
   "label": "100 г",
   "price": 120,
   "ppg": 1.1999,
   "perKg": false,
   "title": "Сыр рассольный Моцарелла Pretto 45%, 100 г",
   "url": "https://www.auchan.ru/product/syr-rassolnyy-pretto-mocarella-chiledzhina-v-vode-45-100-g/"
  }
 },
 "feta": {
  "5ka": {
   "g": 250,
   "label": "250 г",
   "price": 200,
   "ppg": 0.79996,
   "perKg": false,
   "title": "Сыр Hochland Брынза мягкий в рассоле 45% БЗМЖ 250г",
   "url": "https://5ka.ru/product/syr-hochland-brynza-myagkiy-v-rassole-45-bzmzh-250--4383148/"
  },
  "perekrestok": {
   "g": 250,
   "label": "250 г",
   "price": 230,
   "ppg": 0.91996,
   "perKg": false,
   "title": "Сыр мягкий Hochland Брынза в рассоле 45%, 250г",
   "url": "https://www.perekrestok.ru/cat/371/p/syr-magkij-hochland-brynza-v-rassole-45-250g-4383148"
  },
  "auchan": {
   "g": 250,
   "label": "250 г",
   "price": 140,
   "ppg": 0.55996,
   "perKg": false,
   "title": "Сыр рассольный Denmax Брынза Болгарская 40%, 250 г",
   "url": "https://www.auchan.ru/product/syr-brynza-denmax-40-250g/"
  }
 },
 "butter": {
  "5ka": {
   "g": 180,
   "label": "180 г",
   "price": 177,
   "ppg": 0.9832777777777778,
   "perKg": false,
   "title": "Масло сливочное ЭкоНива Традиционное 82.5% БЗМЖ 180г",
   "url": "https://5ka.ru/product/maslo-slivochnoe-ekoniva-traditsionnoe-82-5-bzmzh--4135603/"
  },
  "perekrestok": {
   "g": 180,
   "label": "180 г",
   "price": 190,
   "ppg": 1.0555,
   "perKg": false,
   "title": "Масло сладкосливочное Тысяча Озер 82.5%, 180г",
   "url": "https://www.perekrestok.ru/cat/121/p/maslo-sladkoslivocnoe-tysaca-ozer-82-5-180g-3026226"
  },
  "auchan": {
   "g": 180,
   "label": "180 г",
   "price": 200,
   "ppg": 1.1110555555555557,
   "perKg": false,
   "title": "Масло сливочное «Вкуснотеево» Традиционное 82,5%, 180 г",
   "url": "https://www.auchan.ru/product/maslo-sl-82-5-180g-vk-bzmzh/"
  }
 },
 "cream": {
  "5ka": {
   "g": 205,
   "label": "205 мл",
   "price": 78,
   "ppg": 0.38043902439024385,
   "perKg": false,
   "title": "Сливки Простоквашино ультрапастеризованные 10% БЗМЖ 205г",
   "url": "https://5ka.ru/product/slivki-prostokvashino-ultrapasterizovanye-10-bzmzh--4264334/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 мл",
   "price": 125,
   "ppg": 0.24997999999999998,
   "perKg": false,
   "title": "Сливки питьевые стерилизованные 10% Молочный знак, 500мл",
   "url": "https://www.perekrestok.ru/cat/115/p/slivki-pitevye-sterilizovannye-10-molocnyj-znak-500ml-4178852"
  },
  "auchan": {
   "g": 200,
   "label": "200 мл",
   "price": 115,
   "ppg": 0.57495,
   "perKg": false,
   "title": "Сливки «Домик в деревне» 10%, 200 г",
   "url": "https://www.auchan.ru/product/slivki-ultrapasterizovannye-domik-v-derevne-pitevye-10-200-ml/"
  }
 },
 "buckwheat": {
  "5ka": {
   "g": 500,
   "label": "500 г",
   "price": 83,
   "ppg": 0.16598,
   "perKg": false,
   "title": "Крупа Увелка гречневая 500г",
   "url": "https://5ka.ru/product/krupa-uvelka-grechnevaya-500g--4361230/"
  },
  "perekrestok": {
   "g": 900,
   "label": "900 г",
   "price": 132,
   "ppg": 0.14665555555555557,
   "perKg": false,
   "title": "Гречка Мистраль, 900г",
   "url": "https://www.perekrestok.ru/cat/107/p/grecka-mistral-900g-53673"
  },
  "auchan": {
   "g": 800,
   "label": "800 г",
   "price": 85,
   "ppg": 0.1062375,
   "perKg": false,
   "title": "Крупа гречневая АШАН Красная птица ядрица, 800 г",
   "url": "https://www.auchan.ru/product/krupa-grechnevaya-krasnaya-ptica-ashan-yadrica-800-g/"
  }
 },
 "rice": {
  "5ka": {
   "g": 900,
   "label": "900 г",
   "price": 120,
   "ppg": 0.1333222222222222,
   "perKg": false,
   "title": "Рис Селяночка круглозерный шлифованный 900г",
   "url": "https://5ka.ru/product/ris-selyanochka-kruglozernyy-shlifovannyy-900g--3282573/"
  },
  "perekrestok": {
   "g": 900,
   "label": "900 г",
   "price": 138,
   "ppg": 0.15332222222222222,
   "perKg": false,
   "title": "Рис круглозёрный Маркет Перекрёсток, 900г",
   "url": "https://www.perekrestok.ru/cat/107/p/ris-kruglozernyj-market-perekrestok-900g-3469127"
  },
  "auchan": {
   "g": 900,
   "label": "900 г",
   "price": 130,
   "ppg": 0.14443333333333333,
   "perKg": false,
   "title": "Рис круглозерный «Мистраль» Краснодар, 900 г",
   "url": "https://www.auchan.ru/product/ris-kruglozernyy-mistral-krasnodar-900-g/"
  }
 },
 "pasta": {
  "5ka": {
   "g": 450,
   "label": "450 г",
   "price": 70,
   "ppg": 0.15553333333333333,
   "perKg": false,
   "title": "Макароны Шебекинские рожок полубублик №202 450г",
   "url": "https://5ka.ru/product/makarony-shebekinskie-rozhok-polubublik-202-450g--82772/"
  },
  "perekrestok": {
   "g": 450,
   "label": "450 г",
   "price": 88,
   "ppg": 0.1955333333333333,
   "perKg": false,
   "title": "Макароны Makfa спирали, 450г",
   "url": "https://www.perekrestok.ru/cat/105/p/makarony-makfa-spirali-450g-62190"
  },
  "auchan": {
   "g": 450,
   "label": "450 г",
   "price": 90,
   "ppg": 0.19997777777777775,
   "perKg": false,
   "title": "Макаронные изделия Makfa спирали, 450 г",
   "url": "https://www.auchan.ru/product/makaronnye-izdeliya-makfa-spirali-450-g/"
  }
 },
 "oats": {
  "5ka": {
   "g": 500,
   "label": "500 г",
   "price": 70,
   "ppg": 0.13998,
   "perKg": false,
   "title": "Хлопья овсяные Селяночка Геркулес 500г",
   "url": "https://5ka.ru/product/khlopya-ovsyanye-selyanochka-gerkules-500g--3239385/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 г",
   "price": 110,
   "ppg": 0.21997999999999998,
   "perKg": false,
   "title": "Хлопья овсяные геркулес Маркет Перекрёсток, 500г",
   "url": "https://www.perekrestok.ru/cat/756/p/hlopa-ovsanye-gerkules-market-perekrestok-500g-3469028"
  },
  "auchan": {
   "g": 450,
   "label": "450 г",
   "price": 115,
   "ppg": 0.25553333333333333,
   "perKg": false,
   "title": "Хлопья овсяные «Ясно солнышко» Геркулес, 450 г",
   "url": "https://www.auchan.ru/product/hlovsgerkules_yas_soln045kg/"
  }
 },
 "millet": {
  "5ka": {
   "g": 800,
   "label": "800 г",
   "price": 60,
   "ppg": 0.0749875,
   "perKg": false,
   "title": "Пшено Селяночка шлифованное 800г",
   "url": "https://5ka.ru/product/psheno-selyanochka-shlifovannoe-800g--4169052/"
  },
  "perekrestok": {
   "g": 900,
   "label": "900 г",
   "price": 124,
   "ppg": 0.13776666666666665,
   "perKg": false,
   "title": "Пшено Мистраль Золотое шлифованное, 900г",
   "url": "https://www.perekrestok.ru/cat/107/p/pseno-mistral-zolotoe-slifovannoe-900g-3019675"
  },
  "auchan": {
   "g": 800,
   "label": "800 г",
   "price": 74,
   "ppg": 0.0924875,
   "perKg": false,
   "title": "Пшено АШАН Красная птица, 800 г",
   "url": "https://www.auchan.ru/product/psheno-auchan-krasnaya-ptica-800-g/"
  }
 },
 "bulgur": {
  "5ka": {
   "g": 450,
   "label": "450 г",
   "price": 88,
   "ppg": 0.1955333333333333,
   "perKg": false,
   "title": "Булгур Global Village 450г",
   "url": "https://5ka.ru/product/bulgur-global-village-450g--4003803/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 г",
   "price": 142,
   "ppg": 0.28398,
   "perKg": false,
   "title": "Булгур Мистраль, 500г",
   "url": "https://www.perekrestok.ru/cat/107/p/bulgur-mistral-500g-3408218"
  },
  "auchan": {
   "g": 450,
   "label": "450 г",
   "price": 125,
   "ppg": 0.27775555555555553,
   "perKg": false,
   "title": "Булгур «Агро-Альянс» из твердых сортов пшеницы, 450 г",
   "url": "https://www.auchan.ru/product/bulgur-450g-agro-alyans/"
  }
 },
 "lentils": {
  "5ka": {
   "g": 450,
   "label": "450 г",
   "price": 156,
   "ppg": 0.3466444444444445,
   "perKg": false,
   "title": "Чечевица Агро-Альянс красная 450г",
   "url": "https://5ka.ru/product/chechevitsa-agro-alyans-krasnaya-450g--3628270/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 140,
   "ppg": 0.34997500000000004,
   "perKg": false,
   "title": "Чечевица красная колотая Зелёная Линия, 400г",
   "url": "https://www.perekrestok.ru/cat/745/p/cecevica-krasnaa-kolotaa-zelenaa-linia-400g-4151862"
  },
  "auchan": {
   "g": 500,
   "label": "500 г",
   "price": 95,
   "ppg": 0.18997999999999998,
   "perKg": false,
   "title": "Чечевица красная АШАН Красная птица, 500 г",
   "url": "https://www.auchan.ru/product/chechevica-krasnaya-ptica-ashan-krasnaya-500-g/"
  }
 },
 "flour": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 75,
   "ppg": 0.07499,
   "perKg": false,
   "title": "Мука Makfa Пшеничная высший сорт 1кг",
   "url": "https://5ka.ru/product/muka-makfa-pshenichnaya-vysshiy-sort-1kg--2003107/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 73,
   "ppg": 0.07299,
   "perKg": false,
   "title": "Мука Makfa Пшеничная высший сорт 1кг",
   "url": "https://www.perekrestok.ru/cat/106/p/muka-makfa-psenicnaa-vyssij-sort-1kg-2003107"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 80,
   "ppg": 0.07998999999999999,
   "perKg": false,
   "title": "Мука пшеничная MAKFA, 1 кг",
   "url": "https://www.auchan.ru/product/muka-makfa-pshenichnaya-1-kg/"
  }
 },
 "sugar": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 85,
   "ppg": 0.08499,
   "perKg": false,
   "title": "Сахар белый песок 1кг",
   "url": "https://5ka.ru/product/sakhar-belyy-pesok-1kg--3230933/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 70,
   "ppg": 0.06993,
   "perKg": false,
   "title": "Сахар белый песок 1кг",
   "url": "https://www.perekrestok.ru/cat/83/p/sahar-belyj-pesok-1kg-3230933"
  },
  "auchan": {
   "g": 5000,
   "label": "5 кг",
   "price": 270,
   "ppg": 0.053998000000000004,
   "perKg": false,
   "title": "Сахарный песок, 5 кг",
   "url": "https://www.auchan.ru/product/saharnyy-pesok-russkiy-sahar-5-kg/"
  }
 },
 "honey": {
  "5ka": {
   "g": 320,
   "label": "320 г",
   "price": 470,
   "ppg": 1.46871875,
   "perKg": false,
   "title": "Мёд Берестов А.С. Алтайцвет майский цветочный, 320г",
   "url": "https://5ka.ru/product/myod-berestov-a-s-altaytsvet-mayskiy-tsvetochnyy-p--4440793/"
  },
  "perekrestok": {
   "g": 350,
   "label": "350 г",
   "price": 300,
   "ppg": 0.8571142857142857,
   "perKg": false,
   "title": "Мёд цветочный луговой натуральный Маркет, 350г",
   "url": "https://www.perekrestok.ru/cat/112/p/med-cvetocnyj-lugovoj-naturalnyj-market-350g-4331449"
  },
  "auchan": {
   "g": 250,
   "label": "250 г",
   "price": 150,
   "ppg": 0.59996,
   "perKg": false,
   "title": "Мед АШАН Красная птица таежный, 250 г",
   "url": "https://www.auchan.ru/product/kp-med-taezhnyy-250g/"
  }
 },
 "raisins": {
  "5ka": {
   "g": 100,
   "label": "100 г",
   "price": 43,
   "ppg": 0.4299,
   "perKg": false,
   "title": "Изюм Красная цена 100г",
   "url": "https://5ka.ru/product/izyum-krasnaya-tsena-100g--3455550/"
  },
  "perekrestok": {
   "g": 130,
   "label": "130 г",
   "price": 200,
   "ppg": 1.5383846153846155,
   "perKg": false,
   "title": "Изюм Голден Кашмари сушеный Маркет, 130г",
   "url": "https://www.perekrestok.ru/cat/160/p/izum-golden-kasmari-susenyj-market-130g-4389926"
  },
  "auchan": {
   "g": 200,
   "label": "200 г",
   "price": 155,
   "ppg": 0.77495,
   "perKg": false,
   "title": "Изюм, 200 г",
   "url": "https://www.auchan.ru/product/izyum-p-p-200g/"
  }
 },
 "walnuts": {
  "5ka": {
   "g": 1000,
   "label": "1 кг",
   "price": 1399,
   "ppg": 1.399,
   "perKg": true,
   "title": "Орех грецкий очищенный (цена за 100 г)",
   "url": "https://5ka.ru/product/orekh-gretskiy-ochishchennyy--3902928/"
  },
  "perekrestok": {
   "g": 100,
   "label": "100 г",
   "price": 181,
   "ppg": 1.8099,
   "perKg": false,
   "title": "Ядра грецкого ореха сушёные Пр!ст, 100г",
   "url": "https://www.perekrestok.ru/cat/159/p/adra-greckogo-oreha-susenye-pr-st-100g-4268794"
  },
  "auchan": {
   "g": 1000,
   "label": "1 кг",
   "price": 950,
   "ppg": 0.95,
   "perKg": true,
   "title": "Орех грецкий без скорлупы Food Art Эконом (цена за 100 г)",
   "url": "https://www.auchan.ru/product/oreh_greckiy_bk_ekonom_1kg_aukc/"
  }
 },
 "oil": {
  "5ka": {
   "g": 1000,
   "label": "1 л",
   "price": 150,
   "ppg": 0.14999,
   "perKg": false,
   "title": "Масло Золотая семечка подсолнечное рафинированное 1л",
   "url": "https://5ka.ru/product/maslo-zolotaya-semechka-podsolnechnoe-rafinirovann--64128/"
  },
  "perekrestok": {
   "g": 1000,
   "label": "1 л",
   "price": 166,
   "ppg": 0.16599,
   "perKg": false,
   "title": "Масло Золотая семечка подсолнечное рафинированное 1л",
   "url": "https://www.perekrestok.ru/cat/104/p/maslo-zolotaa-semecka-podsolnecnoe-rafinirovannoe-1l-64128"
  },
  "auchan": {
   "g": 1000,
   "label": "1 л",
   "price": 140,
   "ppg": 0.13999,
   "perKg": false,
   "title": "Масло подсолнечное «Я люблю готовить» рафинированное, 1 л",
   "url": "https://www.auchan.ru/product/maslo-podsoln-raf-dez-1l-yalg/"
  }
 },
 "olive_oil": {
  "5ka": {
   "g": 500,
   "label": "500 мл",
   "price": 676,
   "ppg": 1.35198,
   "perKg": false,
   "title": "Масло оливковое Filippo Berio Extra Virgin нерафинированное 500мл",
   "url": "https://5ka.ru/product/maslo-olivkovoe-filippo-berio-extra-virgin-nerafin--2153521/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 мл",
   "price": 520,
   "ppg": 1.0399800000000001,
   "perKg": false,
   "title": "Масло оливковое Filippo Berio Extra Virgin, 500мл",
   "url": "https://www.perekrestok.ru/cat/104/p/maslo-olivkovoe-filippo-berio-extra-virgin-500ml-2153521"
  },
  "auchan": {
   "g": 500,
   "label": "500 мл",
   "price": 550,
   "ppg": 1.09998,
   "perKg": false,
   "title": "Масло оливковое АШАН Красная птица Extra Virgin, 500 мл",
   "url": "https://www.auchan.ru/product/kp-maslo-olivkovoe-e-v-0-5l/"
  }
 },
 "soy_sauce": {
  "5ka": {
   "g": 250,
   "label": "250 мл",
   "price": 81,
   "ppg": 0.32395999999999997,
   "perKg": false,
   "title": "Соус Домшим соевый 250мл",
   "url": "https://5ka.ru/product/sous-domshim-soevyy-250ml--4305783/"
  },
  "perekrestok": {
   "g": 205,
   "label": "205 мл",
   "price": 110,
   "ppg": 0.5365365853658536,
   "perKg": false,
   "title": "Соус соевый классический Пр!ст, 205мл",
   "url": "https://www.perekrestok.ru/cat/218/p/sous-soevyj-klassiceskij-pr-st-205ml-3616787"
  },
  "auchan": {
   "g": 150,
   "label": "150 мл",
   "price": 140,
   "ppg": 0.9332666666666667,
   "perKg": false,
   "title": "Соус соевый АШАН Красная птица, 150 мл",
   "url": "https://www.auchan.ru/product/sous-soevyy-auchan-krasnaya-ptica-150-ml/"
  }
 },
 "mustard": {
  "5ka": {
   "g": 100,
   "label": "100 г",
   "price": 36,
   "ppg": 0.3599,
   "perKg": false,
   "title": "Горчица Столичная Русская 100г",
   "url": "https://5ka.ru/product/gorchitsa-stolichnaya-russkaya-100g--2153858/"
  },
  "perekrestok": {
   "g": 100,
   "label": "100 г",
   "price": 37,
   "ppg": 0.3699,
   "perKg": false,
   "title": "Горчица Столичная Русская, 100г",
   "url": "https://www.perekrestok.ru/cat/223/p/gorcica-stolicnaa-russkaa-100g-2153858"
  },
  "auchan": {
   "g": 100,
   "label": "100 г",
   "price": 37,
   "ppg": 0.3699,
   "perKg": false,
   "title": "Горчица «Столичная» русская, 100 г",
   "url": "https://www.auchan.ru/product/gorchica-stolichnaya-russkaya-100-g/"
  }
 },
 "canned_tomatoes": {
  "5ka": {
   "g": 680,
   "label": "680 г",
   "price": 110,
   "ppg": 0.16175,
   "perKg": false,
   "title": "Консервы Красная цена томаты неочищенные в томатном соке 680г",
   "url": "https://5ka.ru/product/konservy-krasnaya-tsena-tomaty-neochishchennye-v-t--3279004/"
  },
  "perekrestok": {
   "g": 670,
   "label": "670 г",
   "price": 203,
   "ppg": 0.30297014925373134,
   "perKg": false,
   "title": "Томаты неочищенные в томатном соке Маркет Перекрёсток, 670г",
   "url": "https://www.perekrestok.ru/cat/76/p/tomaty-neocisennye-v-tomatnom-soke-market-perekrestok-670g-4181618"
  },
  "auchan": {
   "g": 680,
   "label": "680 г",
   "price": 175,
   "ppg": 0.25733823529411765,
   "perKg": false,
   "title": "Томаты АШАН Красная птица в собственном соку, 680 г",
   "url": "https://www.auchan.ru/product/kp-tomaty-v-s-s-680g/"
  }
 },
 "tomato_paste": {
  "5ka": {
   "g": 70,
   "label": "70 г",
   "price": 40,
   "ppg": 0.5712857142857143,
   "perKg": false,
   "title": "Паста Global Village томатная 70г",
   "url": "https://5ka.ru/product/pasta-global-village-tomatnaya-70g--4275042/"
  },
  "perekrestok": {
   "g": 70,
   "label": "70 г",
   "price": 48,
   "ppg": 0.6855714285714286,
   "perKg": false,
   "title": "Томатная паста 25% Пр!ст, 70г",
   "url": "https://www.perekrestok.ru/cat/220/p/tomatnaa-pasta-25-pr-st-70g-3690262"
  },
  "auchan": {
   "g": 70,
   "label": "70 г",
   "price": 70,
   "ppg": 0.9998571428571428,
   "perKg": false,
   "title": "Паста томатная «Дядя Ваня» 25% ГОСТ, 70 г",
   "url": "https://www.auchan.ru/product/pasta-tomatnaya-dyadya-vanya-25-gost-70-g/"
  }
 },
 "corn": {
  "5ka": {
   "g": 340,
   "label": "340 г",
   "price": 120,
   "ppg": 0.3529117647058823,
   "perKg": false,
   "title": "Кукуруза Global Village сахарная 340г",
   "url": "https://5ka.ru/product/kukuruza-global-village-sakharnaya-340g--3234987/"
  },
  "perekrestok": {
   "g": 340,
   "label": "340 г",
   "price": 131,
   "ppg": 0.38526470588235295,
   "perKg": false,
   "title": "Кукуруза Globus консервированная, 340г",
   "url": "https://www.perekrestok.ru/cat/76/p/kukuruza-globus-konservirovannaa-340g-2050066"
  },
  "auchan": {
   "g": 340,
   "label": "340 г",
   "price": 110,
   "ppg": 0.3235,
   "perKg": false,
   "title": "Кукуруза сахарная АШАН Красная птица, 340 г",
   "url": "https://www.auchan.ru/product/kp-kukuruza-sah-340gr-2/"
  }
 },
 "beans": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 105,
   "ppg": 0.262475,
   "perKg": false,
   "title": "Фасоль Global Village красная в собственном соку 400г",
   "url": "https://5ka.ru/product/fasol-global-village-krasnaya-v-sobstvennom-soku-4--3235374/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 143,
   "ppg": 0.35747500000000004,
   "perKg": false,
   "title": "Фасоль красная натуральная Маркет Перекрёсток, 400г",
   "url": "https://www.perekrestok.ru/cat/76/p/fasol-krasnaa-naturalnaa-market-perekrestok-400g-3635743"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 105,
   "ppg": 0.262475,
   "perKg": false,
   "title": "Фасоль красная АШАН Красная птица, 400 г",
   "url": "https://www.auchan.ru/product/fasol-krasnaya-ptica-krasnaya-400-g/"
  }
 },
 "pickles": {
  "5ka": {
   "g": 720,
   "label": "720 мл",
   "price": 170,
   "ppg": 0.23609722222222224,
   "perKg": false,
   "title": "Огурцы соленые Global Village по-домашнему, 720мл",
   "url": "https://5ka.ru/product/ogurtsy-solenye-global-village-po-domashnemu-720ml--3424501/"
  },
  "perekrestok": {
   "g": 680,
   "label": "680 г",
   "price": 210,
   "ppg": 0.3088088235294118,
   "perKg": false,
   "title": "Огурцы солёные По-домашнему бочковые Маркет, 680г",
   "url": "https://www.perekrestok.ru/cat/1288/p/ogurcy-solenye-po-domasnemu-bockovye-market-680g-4428875"
  },
  "auchan": {
   "g": 680,
   "label": "680 г",
   "price": 200,
   "ppg": 0.2941029411764706,
   "perKg": false,
   "title": "Огурцы соленые АШАН Красная птица По-домашнему, 680 г",
   "url": "https://www.auchan.ru/product/kp-ogurcy-bochk-680g/"
  }
 },
 "sauerkraut": {
  "5ka": {
   "g": 500,
   "label": "500 г",
   "price": 130,
   "ppg": 0.25998000000000004,
   "perKg": false,
   "title": "Капуста квашеная с морковью Global Village 500г",
   "url": "https://5ka.ru/product/kapusta-kvashenaya-s-morkovyu-global-village-500g--4346966/"
  },
  "perekrestok": {
   "g": 500,
   "label": "500 г",
   "price": 270,
   "ppg": 0.53998,
   "perKg": false,
   "title": "Капуста квашеная кисло-сладкая, 500г",
   "url": "https://www.perekrestok.ru/cat/1704/p/kapusta-kvasenaa-kislo-sladkaa-500g-4325075"
  },
  "auchan": {
   "g": 500,
   "label": "500 г",
   "price": 140,
   "ppg": 0.27998,
   "perKg": false,
   "title": "Капуста квашеная «ФЭГ» По-деревенски, 500 г",
   "url": "https://www.auchan.ru/product/kapusta-kvashennaya-feg-po-derevenski-500-g/"
  }
 },
 "broccoli": {
  "5ka": {
   "g": 400,
   "label": "400 г",
   "price": 180,
   "ppg": 0.449975,
   "perKg": false,
   "title": "Капуста брокколи Global Village замороженная 400 г",
   "url": "https://5ka.ru/product/kapusta-brokkoli-global-village-zamorozhennaya-400--3228647/"
  },
  "perekrestok": {
   "g": 400,
   "label": "400 г",
   "price": 240,
   "ppg": 0.599975,
   "perKg": false,
   "title": "Капуста Брокколи и Цветная Agama замороженная, 400г",
   "url": "https://www.perekrestok.ru/cat/59/p/kapusta-brokkoli-i-cvetnaa-agama-zamorozennaa-400g-4379638"
  },
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 150,
   "ppg": 0.374975,
   "perKg": false,
   "title": "Капуста брокколи АШАН Красная птица замороженная, 400 г",
   "url": "https://www.auchan.ru/product/kpbrokkoli_400g/"
  }
 },
 "berries": {
  "5ka": {
   "g": 300,
   "label": "300 г",
   "price": 260,
   "ppg": 0.8666333333333334,
   "perKg": false,
   "title": "Смесь ягодная Vитамин Ягодный коктейль витаминный замороженная, 300г",
   "url": "https://5ka.ru/product/smes-yagodnaya-vitamin-yagodnyy-kokteyl-vitaminnyy--2125833/"
  },
  "perekrestok": {
   "g": 300,
   "label": "300 г",
   "price": 860,
   "ppg": 2.866633333333333,
   "perKg": false,
   "title": "Ягодный микс голубика-малина-ежевика, 300г",
   "url": "https://www.perekrestok.ru/cat/1729/p/agodnyj-miks-golubika-malina-ezevika-300g-3626558"
  },
  "auchan": {
   "g": 300,
   "label": "300 г",
   "price": 210,
   "ppg": 0.6999666666666667,
   "perKg": false,
   "title": "Ягодная смесь «Мираторг» Ягодный коктейль микс замороженная, 300 г",
   "url": "https://www.auchan.ru/product/kokteyl-vitamin-yagodnyy-300-g/"
  }
 },
 "bread": {
  "5ka": {
   "g": 300,
   "label": "300 г",
   "price": 115,
   "ppg": 0.3833,
   "perKg": false,
   "title": "Хлеб Рижский хлеб Цельнозерновой ржано-пшеничный 300г",
   "url": "https://5ka.ru/product/khleb-rizhskiy-khleb-tselnozernovoy-rzhano-pshenic--3633467/"
  },
  "perekrestok": {
   "g": 300,
   "label": "300 г",
   "price": 130,
   "ppg": 0.4333,
   "perKg": false,
   "title": "Хлеб Рижский Хлеб Цельнозерновой ржано-пшеничный, 300г",
   "url": "https://www.perekrestok.ru/cat/1764/p/hleb-rizskij-hleb-celnozernovoj-rzano-psenicnyj-300g-3633467"
  },
  "auchan": {
   "g": 300,
   "label": "300 г",
   "price": 74,
   "ppg": 0.24663333333333332,
   "perKg": false,
   "title": "Хлеб ржаной «Хлебное местечко» Цельнозерновой на закваске, 300 г",
   "url": "https://www.auchan.ru/product/hleb-celnozernovoy-300g/"
  }
 },
 "lavash": {
  "5ka": {
   "g": 360,
   "label": "360 г",
   "price": 95,
   "ppg": 0.2638611111111111,
   "perKg": false,
   "title": "Лаваш тонкий Коломенское армянский 360г",
   "url": "https://5ka.ru/product/lavash-tonkiy-kolomenskoe-armyanskiy-360g--3497959/"
  },
  "perekrestok": {
   "g": 360,
   "label": "360 г",
   "price": 80,
   "ppg": 0.22219444444444442,
   "perKg": false,
   "title": "Лаваш тонкий Коломенское армянский, 360г",
   "url": "https://www.perekrestok.ru/cat/1764/p/lavas-tonkij-kolomenskoe-armanskij-360g-3497959"
  },
  "auchan": {
   "g": 360,
   "label": "360 г",
   "price": 77,
   "ppg": 0.21386111111111109,
   "perKg": false,
   "title": "Лаваш Армянский «Коломенский» тонкий, 360 г",
   "url": "https://www.auchan.ru/product/hleb-lavash-kolomenskoe-armyanskiy-360-g/"
  }
 },
 "banana": {
  "perekrestok": {
   "g": 1000,
   "label": "1 кг",
   "price": 160,
   "ppg": 0.15999000000000002,
   "perKg": true,
   "title": "Бананы",
   "url": "https://www.perekrestok.ru/cat/1729/p/banany-3757"
  }
 },
 "chicken_liver": {
  "auchan": {
   "g": 450,
   "label": "450 г",
   "price": 215,
   "ppg": 0.4777555555555556,
   "perKg": false,
   "title": "Печень цыплят-бройлеров «Первая свежесть» охлажденная, 450 г",
   "url": "https://www.auchan.ru/product/pechen-cyplyat-broylerov-pervaya-svezhest-ohlazhdennaya-600-g/"
  }
 },
 "peas": {
  "auchan": {
   "g": 400,
   "label": "400 г",
   "price": 260,
   "ppg": 0.649975,
   "perKg": false,
   "title": "Зеленый горошек Bonduelle замороженный, 400 г",
   "url": "https://www.auchan.ru/product/goroshek-bondyuel-400-g/"
  }
 }
};
