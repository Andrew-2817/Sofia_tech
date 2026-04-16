import categImg from "../assets/category.png"

export const products = [
  // ========== КРУПНАЯ БЫТОВАЯ ТЕХНИКА ==========
  
  // Стиральные машины - Отдельностоящие (id: 100)
  {
    id: 1,
    name: "Стиральная машина Schulthess Spirit 540 White",
    slug: "schulthess-spirit-540-white",
    categoryId: 100,
    categoryName: "Отдельностоящие стиральные машины",
    brand: "Schulthess",
    price: 292990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Washing+Machine",
    manufacturer: "Schulthess",
    color: "Белый",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Стиральная машина с 3D-Powerclean и технологией CleanJet"
  },
  // Стиральные машины - Встраиваемые (id: 101)
  {
    id: 2,
    name: "Встраиваемая стиральная машина Kuppersbusch W 40.0 AT",
    slug: "kuppersbusch-w-40-0-at",
    categoryId: 101,
    categoryName: "Встраиваемые стиральные машины",
    brand: "Kuppersbusch",
    price: 189990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Washer",
    manufacturer: "Kuppersbusch",
    color: "Антрацит",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Встраиваемая стиральная машина с цветным дисплеем 4.3″"
  },
  // Стиральные машины - с сушкой 2в1 (id: 102)
  {
    id: 3,
    name: "Стирально-сушильная машина Schulthess Spirit 660",
    slug: "schulthess-spirit-660",
    categoryId: 102,
    categoryName: "Стиральные машины с сушкой (2в1)",
    brand: "Schulthess",
    price: 303990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Washer+Dryer",
    manufacturer: "Schulthess",
    color: "Titan Rock",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Стирально-сушильная машина с технологией Heat Pump"
  },
  // Стиральные машины - с паром (id: 103)
  {
    id: 4,
    name: "Стиральная машина Schulthess ADA1.101BE1H3J3L",
    slug: "schulthess-ada1-101be1h3j3l",
    categoryId: 103,
    categoryName: "Стиральные машины с паром",
    brand: "Schulthess",
    price: 361990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Steam+Washer",
    manufacturer: "Schulthess",
    color: "Snow",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: false,
    isNew: false,
    description: "Стиральная машина с обработкой паром и 3D-Powerclean"
  },
  // Стиральные машины - высокая скорость отжима (id: 104)
  {
    id: 5,
    name: "Стиральная машина Schulthess ADA1.102BE1H3J3L",
    slug: "schulthess-ada1-102be1h3j3l",
    categoryId: 104,
    categoryName: "Стиральные машины с высокой скоростью отжима (1400+)",
    brand: "Schulthess",
    price: 396990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=High+Spin+Washer",
    manufacturer: "Schulthess",
    color: "Solid Gold",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Премиум стиральная машина с отжимом 1600 об/мин"
  },

  // Сушильные машины - Отдельностоящие (id: 110)
  {
    id: 6,
    name: "Сушильная машина Schulthess MDA1.100FH3L",
    slug: "schulthess-mda1-100fh3l",
    categoryId: 110,
    categoryName: "Отдельностоящие сушильные машины",
    brand: "Schulthess",
    price: 411990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Dryer",
    manufacturer: "Schulthess",
    color: "Snow",
    loadCapacity: 8,
    energyClass: "A+++",
    isPopular: true,
    isNew: false,
    description: "Сушильная машина с тепловым насосом и фильтром для удаления пыльцы"
  },
  // Сушильные машины - Встраиваемые (id: 111)
  {
    id: 7,
    name: "Встраиваемая сушильная машина Kuppersbusch T 40.0 AT",
    slug: "kuppersbusch-t-40-0-at",
    categoryId: 111,
    categoryName: "Встраиваемые / интегрируемые сушилки",
    brand: "Kuppersbusch",
    price: 399990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Dryer",
    manufacturer: "Kuppersbusch",
    color: "Антрацит",
    loadCapacity: 8,
    energyClass: "A+++",
    isPopular: false,
    isNew: true,
    description: "Встраиваемая сушильная машина с тепловым насосом"
  },
  // Сушильные машины - Конденсационные (id: 112)
  {
    id: 8,
    name: "Сушильная машина Schulthess Spirit 660 Ever Rose",
    slug: "schulthess-spirit-660-ever-rose",
    categoryId: 112,
    categoryName: "Конденсационные сушильные машины",
    brand: "Schulthess",
    price: 303990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Condenser+Dryer",
    manufacturer: "Schulthess",
    color: "Ever Rose",
    loadCapacity: 8,
    energyClass: "A+++",
    isPopular: false,
    isNew: false,
    description: "Конденсационная сушильная машина с системой самоочистки Autoclean"
  },
  // Сушильные машины - Тепловые насосные (id: 113)
  {
    id: 9,
    name: "Сушильная машина Schulthess Spirit 660 Titan Rock",
    slug: "schulthess-spirit-660-titan-rock",
    categoryId: 113,
    categoryName: "Тепловые насосные сушильные машины",
    brand: "Schulthess",
    price: 303990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Heat+Pump+Dryer",
    manufacturer: "Schulthess",
    color: "Titan Rock",
    loadCapacity: 8,
    energyClass: "A+++",
    isPopular: true,
    isNew: false,
    description: "Сушильная машина с тепловым насосом и программой антибактериальной обработки"
  },

  // Стирально-сушильные машины - 2 в 1 (id: 120)
  {
    id: 10,
    name: "Стирально-сушильная машина Kuppersbusch WTI 40.0 AT",
    slug: "kuppersbusch-wti-40-0-at",
    categoryId: 120,
    categoryName: "Стирально-сушильные машины 2 в 1",
    brand: "Kuppersbusch",
    price: 259990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Washer+Dryer+Combo",
    manufacturer: "Kuppersbusch",
    color: "Антрацит",
    loadCapacity: 8,
    spinSpeed: 1600,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Стирально-сушильная машина 2 в 1 с технологией 3D-Washing"
  },
  // Стирально-сушильные машины - Вертикальные (id: 121)
  {
    id: 11,
    name: "Вертикальная стирально-сушильная машина Schulthess Spirit",
    slug: "schulthess-spirit-vertical",
    categoryId: 121,
    categoryName: "Вертикальные стирально-сушильные",
    brand: "Schulthess",
    price: 349990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Vertical+Washer+Dryer",
    manufacturer: "Schulthess",
    color: "White",
    loadCapacity: 7,
    spinSpeed: 1400,
    energyClass: "B",
    isPopular: false,
    isNew: true,
    description: "Вертикальная стирально-сушильная машина для небольших помещений"
  },

  // Посудомоечные машины - Полностью встраиваемые (id: 130)
  {
    id: 12,
    name: "Полностью встраиваемая посудомоечная машина Kuppersbusch G 6594.0 v",
    slug: "kuppersbusch-g-6594-0-v",
    categoryId: 130,
    categoryName: "Полностью встраиваемые посудомойки",
    brand: "Kuppersbusch",
    price: 193990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Fully+Built-in+Dishwasher",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    placeSettings: 16,
    energyClass: "A",
    isPopular: true,
    isNew: true,
    description: "Полностью встраиваемая посудомоечная машина на 16 комплектов"
  },
  // Посудомоечные машины - Частично встраиваемые (id: 131)
  {
    id: 13,
    name: "Частично встраиваемая посудомоечная машина Kuppersbusch G 6570.0 v",
    slug: "kuppersbusch-g-6570-0-v",
    categoryId: 131,
    categoryName: "Частично встраиваемые (с панелью)",
    brand: "Kuppersbusch",
    price: 181990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Semi+Built-in+Dishwasher",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    placeSettings: 14,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Частично встраиваемая посудомоечная машина с функцией Knock to open"
  },
  // Посудомоечные машины - Отдельностоящие (id: 132)
  {
    id: 14,
    name: "Отдельностоящая посудомоечная машина Kuppersbusch G 6564.0 v",
    slug: "kuppersbusch-g-6564-0-v",
    categoryId: 132,
    categoryName: "Отдельностоящие посудомоечные машины",
    brand: "Kuppersbusch",
    price: 162990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Freestanding+Dishwasher",
    manufacturer: "Kuppersbusch",
    color: "Белый",
    placeSettings: 14,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Отдельностоящая посудомоечная машина с сенсорным управлением"
  },
  // Посудомоечные машины - Узкие 45 см (id: 133)
  {
    id: 15,
    name: "Узкая посудомоечная машина Kuppersbusch G 4320.0 v",
    slug: "kuppersbusch-g-4320-0-v",
    categoryId: 133,
    categoryName: "Узкие посудомоечные машины (45 см)",
    brand: "Kuppersbusch",
    price: 129990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Slim+Dishwasher+45cm",
    manufacturer: "Kuppersbusch",
    color: "Белый",
    placeSettings: 10,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Узкая посудомоечная машина шириной 45 см на 10 комплектов"
  },
  // Посудомоечные машины - Широкие 60 см (id: 134)
  {
    id: 16,
    name: "Широкая посудомоечная машина Kuppersbusch G 6340.0 v",
    slug: "kuppersbusch-g-6340-0-v",
    categoryId: 134,
    categoryName: "Широкие посудомоечные машины (60 см)",
    brand: "Kuppersbusch",
    price: 142990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Standard+Dishwasher+60cm",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    placeSettings: 14,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Широкая посудомоечная машина на 14 комплектов с 7 программами"
  },

  // Холодильники - С морозильной камерой (id: 140)
  {
    id: 17,
    name: "Холодильник Kuppersbusch FKGF 9850.0i",
    slug: "kuppersbusch-fkgf-9850-0i",
    categoryId: 140,
    categoryName: "Холодильники с морозильной камерой",
    brand: "Kuppersbusch",
    price: 254990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Fridge+Freezer",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    totalVolume: 267,
    energyClass: "E",
    isPopular: true,
    isNew: false,
    description: "Встраиваемый холодильник с морозильной камерой NoFrost"
  },
  // Холодильники - Отдельностоящие двухдверные (id: 141)
  {
    id: 18,
    name: "Холодильник Kuppersbusch FKG 9801.0 E Side-by-Side",
    slug: "kuppersbusch-fkg-9801-0-e",
    categoryId: 141,
    categoryName: "Отдельностоящие двухдверные холодильники",
    brand: "Kuppersbusch",
    price: 288990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Side-by-Side",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    totalVolume: 513,
    energyClass: "E",
    isPopular: true,
    isNew: false,
    description: "Холодильник Side-by-Side с диспенсером воды и льда"
  },
  // Холодильники - Встраиваемые холодильники (id: 142)
  {
    id: 19,
    name: "Встраиваемый холодильник Kuppersbusch FK 8550.0I",
    slug: "kuppersbusch-fk-8550-0i",
    categoryId: 142,
    categoryName: "Встраиваемые холодильники",
    brand: "Kuppersbusch",
    price: 246990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Fridge",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    totalVolume: 280,
    energyClass: "E",
    isPopular: false,
    isNew: true,
    description: "Встраиваемый холодильник с электронным управлением"
  },
  // Холодильники - Встраиваемые морозильники (id: 143)
  {
    id: 20,
    name: "Встраиваемый морозильник Kuppersbusch FGX 9800.0i",
    slug: "kuppersbusch-fgx-9800-0i",
    categoryId: 143,
    categoryName: "Встраиваемые морозильники",
    brand: "Kuppersbusch",
    price: 548990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Freezer",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    totalVolume: 245,
    energyClass: "E",
    isPopular: false,
    isNew: false,
    description: "Встраиваемый морозильник с NoFrost и ледогенератором"
  },
  // Холодильники - Side-by-Side и French Door (id: 144)
  {
    id: 21,
    name: "Холодильник Kuppersbusch FKG 9850.0 E Multi-door",
    slug: "kuppersbusch-fkg-9850-0-e",
    categoryId: 144,
    categoryName: "Side-by-Side и French Door",
    brand: "Kuppersbusch",
    price: 278990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=French+Door",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    totalVolume: 522,
    energyClass: "E",
    isPopular: true,
    isNew: false,
    description: "Multi-door холодильник с переключаемой камерой"
  },
  // Винные шкафы (id: 145)
  {
    id: 22,
    name: "Винный шкаф Kuppersbusch FWK 2800.0 S",
    slug: "kuppersbusch-fwk-2800-0-s",
    categoryId: 145,
    categoryName: "Винные шкафы",
    brand: "Kuppersbusch",
    price: 328990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Wine+Cabinet",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    bottleCapacity: 52,
    temperatureZones: 2,
    energyClass: "E",
    isPopular: true,
    isNew: false,
    description: "Винный шкаф на 52 бутылки с двумя температурными зонами"
  },
  // Холодильники под столешницу (id: 146)
  {
    id: 23,
    name: "Холодильник под столешницу Kuppersbusch FK 2540.0i",
    slug: "kuppersbusch-fk-2540-0i",
    categoryId: 146,
    categoryName: "Холодильники под столешницу / мини-бары",
    brand: "Kuppersbusch",
    price: 103990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Undercounter+Fridge",
    manufacturer: "Kuppersbusch",
    color: "Белый",
    totalVolume: 126,
    energyClass: "E",
    isPopular: false,
    isNew: true,
    description: "Компактный холодильник под столешницу"
  },
  // Морозильные лари (id: 147)
  {
    id: 24,
    name: "Морозильный ларь Kuppersbusch FG 8840.0i",
    slug: "kuppersbusch-fg-8840-0i",
    categoryId: 147,
    categoryName: "Морозильные лари и шкафы",
    brand: "Kuppersbusch",
    price: 129990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Chest+Freezer",
    manufacturer: "Kuppersbusch",
    color: "Белый",
    totalVolume: 204,
    energyClass: "E",
    isPopular: false,
    isNew: false,
    description: "Встраиваемый морозильник с NoFrost"
  },

  // ========== ВСТРАИВАЕМАЯ ТЕХНИКА ==========

  // Духовые шкафы - Электрические (id: 200)
  {
    id: 25,
    name: "Электрический духовой шкаф Kuppersbusch B 6330.0 S",
    slug: "kuppersbusch-b-6330-0-s",
    categoryId: 200,
    categoryName: "Электрические духовые шкафы",
    brand: "Kuppersbusch",
    price: 128990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Electric+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 70,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Электрический духовой шкаф с 8 функциями и объемом 70 л"
  },
  // Духовые шкафы - С паром (id: 201)
  {
    id: 26,
    name: "Духовой шкаф с паром Kuppersbusch BD 6340.0 S",
    slug: "kuppersbusch-bd-6340-0-s",
    categoryId: 201,
    categoryName: "Духовые шкафы с паром (Combi Steam)",
    brand: "Kuppersbusch",
    price: 336990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Steam+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 70,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Духовой шкаф с паром и внешним парогенератором"
  },
  // Духовые шкафы - С пиролизом (id: 202)
  {
    id: 27,
    name: "Духовой шкаф с пиролизом Kuppersbusch BP 6332.0 S",
    slug: "kuppersbusch-bp-6332-0-s",
    categoryId: 202,
    categoryName: "Духовые шкафы с пиролизом",
    brand: "Kuppersbusch",
    price: 198990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Pyrolytic+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 70,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Духовой шкаф с пиролитической очисткой и функцией Pizza 340°C"
  },
  // Духовые шкафы - С микроволнами (id: 203)
  {
    id: 28,
    name: "Духовой шкаф с микроволнами Kuppersbusch CBM 6330.0 S",
    slug: "kuppersbusch-cbm-6330-0-s",
    categoryId: 203,
    categoryName: "Духовые шкафы с микроволнами (3-в-1)",
    brand: "Kuppersbusch",
    price: 234990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Microwave+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 43,
    energyClass: "A",
    isPopular: false,
    isNew: true,
    description: "Компактный духовой шкаф с микроволнами и грилем"
  },
  // Духовые шкафы - Pizza Party (id: 204)
  {
    id: 29,
    name: "Духовой шкаф Pizza Party Kuppersbusch 645SZTCT4/BK",
    slug: "kuppersbusch-pizza-party-645sztct4-bk",
    categoryId: 204,
    categoryName: "Духовые шкафы Pizza Party / Высокотемпературные",
    brand: "Kuppersbusch",
    price: 354990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Pizza+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    maxTemperature: 400,
    energyClass: "A",
    isPopular: true,
    isNew: false,
    description: "Духовой шкаф Pizza Party с температурой до 400°C"
  },
  // Духовые шкафы - Компактные 45 см (id: 205)
  {
    id: 30,
    name: "Компактный духовой шкаф Kuppersbusch CB 6350.0 S",
    slug: "kuppersbusch-cb-6350-0-s",
    categoryId: 205,
    categoryName: "Компактные духовые шкафы (45 см)",
    brand: "Kuppersbusch",
    price: 223990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Compact+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 44,
    energyClass: "A",
    isPopular: false,
    isNew: false,
    description: "Компактный духовой шкаф с TFT-дисплеем и 10 функциями"
  },

  // Варочные поверхности - Индукционные (id: 210)
  {
    id: 31,
    name: "Индукционная варочная поверхность Kuppersbusch KI 6130.0 SE",
    slug: "kuppersbusch-ki-6130-0-se",
    categoryId: 210,
    categoryName: "Индукционные варочные панели",
    brand: "Kuppersbusch",
    price: 103990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Induction+Hob",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    width: 60,
    zones: 4,
    isPopular: true,
    isNew: false,
    description: "Индукционная варочная панель с управлением glideControl+"
  },
  // Варочные поверхности - Газовые (id: 211)
  {
    id: 32,
    name: "Газовая варочная поверхность Kuppersbusch VKG 3850.0 SE-E5",
    slug: "kuppersbusch-vkg-3850-0-se-e5",
    categoryId: 211,
    categoryName: "Газовые варочные панели",
    brand: "Kuppersbusch",
    price: 130990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Gas+Hob",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    width: 38,
    zones: 4,
    isPopular: false,
    isNew: true,
    description: "Газовая варочная панель с медными горелками и чугунными решетками"
  },
  // Варочные поверхности - Комбинированные (id: 212)
  {
    id: 33,
    name: "Комбинированная варочная панель Kuppersbusch KIG 6850.0 SR-E5",
    slug: "kuppersbusch-kig-6850-0-sr-e5",
    categoryId: 212,
    categoryName: "Комбинированные (газ + индукция)",
    brand: "Kuppersbusch",
    price: 197990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Combo+Hob",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    width: 60,
    zones: 4,
    isPopular: true,
    isNew: true,
    description: "Комбинированная варочная панель: 2 индукции + 2 газа"
  },
  // Варочные поверхности - Электрические (id: 213)
  {
    id: 34,
    name: "Стеклокерамическая варочная поверхность Kuppersbusch KE 6130.1 SE",
    slug: "kuppersbusch-ke-6130-1-se",
    categoryId: 213,
    categoryName: "Электрические варочные панели",
    brand: "Kuppersbusch",
    price: 84990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Ceramic+Hob",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    width: 60,
    zones: 4,
    isPopular: false,
    isNew: false,
    description: "Стеклокерамическая варочная поверхность с HiLight зонами"
  },
  // Варочные поверхности - С вытяжкой (id: 214)
  {
    id: 35,
    name: "Индукционная варочная поверхность с вытяжкой Kuppersbusch KMI 6350.0 SR",
    slug: "kuppersbusch-kmi-6350-0-sr",
    categoryId: 214,
    categoryName: "Варочные панели с вытяжкой (Downdraft)",
    brand: "Kuppersbusch",
    price: 471990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Downdraft+Hob",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    width: 60,
    zones: 4,
    isPopular: true,
    isNew: true,
    description: "Индукционная варочная панель со встроенной вытяжкой"
  },

  // Вытяжки - Настенные (id: 220)
  {
    id: 36,
    name: "Настенная вытяжка Elica IKONA BL MAT/A/60",
    slug: "elica-ikona-bl-mat-a-60",
    categoryId: 220,
    categoryName: "Настенные вытяжки (пристенные)",
    brand: "Elica",
    price: 104290,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Wall+Hood",
    manufacturer: "Elica",
    color: "Черный матовый",
    width: 60,
    maxPerformance: 1200,
    energyClass: "A",
    noiseLevel: 56,
    isPopular: true,
    isNew: false,
    description: "Настенная вытяжка с производительностью 1200 м³/ч"
  },
  // Вытяжки - Островные (id: 221)
  {
    id: 37,
    name: "Островная вытяжка Elica GALAXY ISLAND BLIX/A/90x45",
    slug: "elica-galaxy-island-blix-a-90x45",
    categoryId: 221,
    categoryName: "Островные вытяжки",
    brand: "Elica",
    price: 141390,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Island+Hood",
    manufacturer: "Elica",
    color: "Черное стекло",
    width: 90,
    maxPerformance: 1200,
    energyClass: "C",
    noiseLevel: 52,
    isPopular: true,
    isNew: false,
    description: "Островная вытяжка в Т-образном дизайне"
  },
  // Вытяжки - Встраиваемые (id: 222)
  {
    id: 38,
    name: "Встраиваемая вытяжка Elica ELICA ERA C IX/A/52",
    slug: "elica-era-c-ix-a-52",
    categoryId: 222,
    categoryName: "Встраиваемые вытяжки (в шкаф)",
    brand: "Elica",
    price: 13490,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Hood",
    manufacturer: "Elica",
    color: "Нержавеющая сталь",
    width: 52,
    maxPerformance: 700,
    energyClass: "D",
    noiseLevel: 58,
    isPopular: false,
    isNew: false,
    description: "Встраиваемая вытяжка для кухонного гарнитура"
  },
  // Вытяжки - В столешницу (id: 223)
  {
    id: 39,
    name: "Вытяжка в столешницу Elica VKM 1820.0 SR",
    slug: "elica-vkm-1820-0-sr",
    categoryId: 223,
    categoryName: "Вытяжки в столешницу (Downdraft)",
    brand: "Elica",
    price: 297990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Downdraft+Hood",
    manufacturer: "Elica",
    color: "Черный",
    width: 60,
    maxPerformance: 551,
    energyClass: "A",
    noiseLevel: 31,
    isPopular: true,
    isNew: true,
    description: "Встраиваемая в столешницу вытяжка VarioLine"
  },
  // Вытяжки - Потолочные (id: 224)
  {
    id: 40,
    name: "Потолочная вытяжка Elica DDL 9830.0 W",
    slug: "elica-ddl-9830-0-w",
    categoryId: 224,
    categoryName: "Потолочные вытяжки",
    brand: "Elica",
    price: 317990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Ceiling+Hood",
    manufacturer: "Elica",
    color: "Белый",
    width: 90,
    maxPerformance: 808,
    energyClass: "A",
    noiseLevel: 45,
    isPopular: false,
    isNew: false,
    description: "Встраиваемая в потолок вытяжка с LED подсветкой"
  },
  // Вытяжки - Телескопические (id: 225)
  {
    id: 41,
    name: "Телескопическая вытяжка Elica DEF 6300.0 E",
    slug: "elica-def-6300-0-e",
    categoryId: 225,
    categoryName: "Телескопические (выдвижные) вытяжки",
    brand: "Elica",
    price: 52990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Telescopic+Hood",
    manufacturer: "Elica",
    color: "Нержавеющая сталь",
    width: 60,
    maxPerformance: 385,
    energyClass: "C",
    noiseLevel: 55,
    isPopular: false,
    isNew: false,
    description: "Выдвижная телескопическая вытяжка с металлическим фильтром"
  },
  // Вытяжки - С рециркуляцией (id: 226)
  {
    id: 42,
    name: "Вытяжка с рециркуляцией Elica ELITE 14 LUX BL/A/60",
    slug: "elica-elite-14-lux-bl-a-60",
    categoryId: 226,
    categoryName: "Вытяжки с рециркуляцией",
    brand: "Elica",
    price: 16090,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Recirculating+Hood",
    manufacturer: "Elica",
    color: "Черный",
    width: 60,
    maxPerformance: 650,
    energyClass: "D",
    noiseLevel: 46,
    isPopular: true,
    isNew: false,
    description: "Вытяжка с возможностью работы в режиме рециркуляции"
  },

  // Кофемашины встраиваемые - Автомат (id: 230)
  {
    id: 43,
    name: "Встраиваемая кофемашина Kuppersbusch CKV 6800.0 S",
    slug: "kuppersbusch-ckv-6800-0-s",
    categoryId: 230,
    categoryName: "Встраиваемые кофемашины (автомат)",
    brand: "Kuppersbusch",
    price: 378990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Coffee",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    beanCapacity: 200,
    pressure: 15,
    isPopular: true,
    isNew: false,
    description: "Встраиваемая кофемашина с сенсорным TFT-дисплеем"
  },
  // Кофемашины встраиваемые - С паром (id: 231)
  {
    id: 44,
    name: "Встраиваемая кофемашина Kuppersbusch CKV 6550.0 W",
    slug: "kuppersbusch-ckv-6550-0-w",
    categoryId: 231,
    categoryName: "Встраиваемые кофемашины с паром",
    brand: "Kuppersbusch",
    price: 367990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Coffee+Steam",
    manufacturer: "Kuppersbusch",
    color: "Белый",
    beanCapacity: 200,
    pressure: 15,
    isPopular: false,
    isNew: true,
    description: "Встраиваемая кофемашина с функцией подачи пара"
  },

  // Микроволновые печи - Встраиваемые (id: 240)
  {
    id: 45,
    name: "Встраиваемая микроволновая печь Kuppersbusch CM 6330.0 S",
    slug: "kuppersbusch-cm-6330-0-s",
    categoryId: 240,
    categoryName: "Встраиваемые микроволновые печи",
    brand: "Kuppersbusch",
    price: 206990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Microwave",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 44,
    power: 1000,
    isPopular: true,
    isNew: false,
    description: "Компактная микроволновая печь с грилем"
  },
  // Микроволновые печи - Комбинированные (id: 241)
  {
    id: 46,
    name: "Микроволновая печь с грилем Kuppersbusch ML 6330.0 S",
    slug: "kuppersbusch-ml-6330-0-s",
    categoryId: 241,
    categoryName: "Комбинированные микроволновые (с грилем/паром)",
    brand: "Kuppersbusch",
    price: 129990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Combi+Microwave",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 22,
    power: 850,
    isPopular: false,
    isNew: false,
    description: "Микроволновая печь с грилем и автоматическими программами"
  },

  // Комбинированные духовые - С паром (id: 250)
  {
    id: 47,
    name: "Духовой шкаф с паром Kuppersbusch BD 6550.0 S",
    slug: "kuppersbusch-bd-6550-0-s",
    categoryId: 250,
    categoryName: "Духовые шкафы с паром (Combi Steam)",
    brand: "Kuppersbusch",
    price: 352990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Combi+Steam+Oven",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 43,
    energyClass: "A",
    isPopular: true,
    isNew: true,
    description: "Компактный духовой шкаф с паром и 14 функциями"
  },
  // Комбинированные духовые - С паром + микроволны (id: 251)
  {
    id: 48,
    name: "Духовой шкаф с паром и микроволнами Kuppersbusch CBM 6550.0 S",
    slug: "kuppersbusch-cbm-6550-0-s",
    categoryId: 251,
    categoryName: "Духовые шкафы с паром + микроволнами",
    brand: "Kuppersbusch",
    price: 320990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Steam+Microwave",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    volume: 43,
    energyClass: "A",
    isPopular: false,
    isNew: false,
    description: "Компактный духовой шкаф с микроволнами и паром"
  },

  // Подогреватели посуды (id: 260)
  {
    id: 49,
    name: "Подогреватель посуды Kuppersbusch CSW 6800.0",
    slug: "kuppersbusch-csw-6800-0",
    categoryId: 260,
    categoryName: "Подогреватели посуды (ящики)",
    brand: "Kuppersbusch",
    price: 73990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Warming+Drawer",
    manufacturer: "Kuppersbusch",
    color: "Нержавеющая сталь",
    width: 59,
    temperatureRange: "30-80°C",
    isPopular: true,
    isNew: false,
    description: "Подогреватель посуды с электронной регулировкой температуры"
  },

  // Винные шкафы встраиваемые (id: 270)
  {
    id: 50,
    name: "Встраиваемый винный шкаф Kuppersbusch FWKU 1851.0 S",
    slug: "kuppersbusch-fwku-1851-0-s",
    categoryId: 270,
    categoryName: "Встраиваемые винные шкафы",
    brand: "Kuppersbusch",
    price: 306990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Built-in+Wine",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    bottleCapacity: 46,
    temperatureZones: 2,
    isPopular: true,
    isNew: false,
    description: "Встраиваемый винный шкаф с LED подсветкой и защитой от УФ"
  },
  // Винные шкафы под столешницу (id: 271)
  {
    id: 51,
    name: "Винный шкаф под столешницу Kuppersbusch FWK 2852.0 S",
    slug: "kuppersbusch-fwk-2852-0-s",
    categoryId: 271,
    categoryName: "Винные шкафы под столешницу",
    brand: "Kuppersbusch",
    price: 363990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Undercounter+Wine",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    bottleCapacity: 38,
    temperatureZones: 2,
    isPopular: false,
    isNew: true,
    description: "Винный шкаф для установки под столешницу"
  },
  // Винные шкафы - с 2+ зонами (id: 272)
  {
    id: 52,
    name: "Винный шкаф с 2 зонами Kuppersbusch FWK 4800.0 S",
    slug: "kuppersbusch-fwk-4800-0-s",
    categoryId: 272,
    categoryName: "Винные шкафы с 2 и более температурными зонами",
    brand: "Kuppersbusch",
    price: 423990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Multi+Zone+Wine",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    bottleCapacity: 79,
    temperatureZones: 2,
    isPopular: true,
    isNew: false,
    description: "Винный шкаф на 79 бутылок с двумя температурными зонами"
  },

  // ========== МЕЛКАЯ БЫТОВАЯ ТЕХНИКА ==========

  // Кофемашины - Автоматические зерновые (id: 300)
  {
    id: 53,
    name: "Кофемашина Nivona CafeRomatica NICR 970",
    slug: "nivona-caferomatica-nicr-970",
    categoryId: 300,
    categoryName: "Автоматические кофемашины (зерновые)",
    brand: "Nivona",
    price: 114990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Coffee+Machine",
    manufacturer: "Nivona",
    color: "Титан",
    beanCapacity: 270,
    pressure: 15,
    isPopular: true,
    isNew: false,
    description: "Автоматическая кофемашина с сенсорным дисплеем и Bluetooth"
  },
  // Кофемашины - OneTouch (id: 301)
  {
    id: 54,
    name: "Кофемашина Nivona CafeRomatica NICR 930",
    slug: "nivona-caferomatica-nicr-930",
    categoryId: 301,
    categoryName: "Кофемашины с капучинатором OneTouch",
    brand: "Nivona",
    price: 94990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=OneTouch+Coffee",
    manufacturer: "Nivona",
    color: "Черный",
    beanCapacity: 270,
    pressure: 15,
    isPopular: true,
    isNew: false,
    description: "Кофемашина с системой OneTouch DUO для капучино"
  },
  // Кофемашины - Премиум Bluetooth (id: 302)
  {
    id: 55,
    name: "Кофемашина Nivona NIVO 8107",
    slug: "nivona-nivo-8107",
    categoryId: 302,
    categoryName: "Премиум кофемашины (с Bluetooth / App)",
    brand: "Nivona",
    price: 115990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Premium+Coffee",
    manufacturer: "Nivona",
    color: "Жемчужно-синий",
    beanCapacity: 250,
    pressure: 15,
    isPopular: false,
    isNew: true,
    description: "Премиум кофемашина с управлением через приложение"
  },

  // Кофемолки (id: 310)
  {
    id: 56,
    name: "Кофемолка Nivona CafeGrano NICG 130",
    slug: "nivona-cafegrano-nicg-130",
    categoryId: 310,
    categoryName: "Кофемолки с коническими жерновами",
    brand: "Nivona",
    price: 13600,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Coffee+Grinder",
    manufacturer: "Nivona",
    color: "Черный",
    beanCapacity: 200,
    isPopular: true,
    isNew: false,
    description: "Кофемолка с коническими жерновами из закалённой стали"
  },

  // Электрические мясорубки (id: 320)
  {
    id: 57,
    name: "Электрическая мясорубка Nivona NICG 200",
    slug: "nivona-nicg-200",
    categoryId: 320,
    categoryName: "Электрические мясорубки",
    brand: "Nivona",
    price: 18900,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Meat+Grinder",
    manufacturer: "Nivona",
    color: "Серебристый",
    power: 300,
    isPopular: false,
    isNew: true,
    description: "Электрическая мясорубка с металлическими насадками"
  },

  // Пылесосы - Беспроводные (id: 330)
  {
    id: 58,
    name: "Беспроводной пылесос Kuppersbusch SA 118 G",
    slug: "kuppersbusch-sa-118-g",
    categoryId: 330,
    categoryName: "Пылесосы беспроводные / вертикальные",
    brand: "Kuppersbusch",
    price: 59990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Cordless+Vacuum",
    manufacturer: "Kuppersbusch",
    color: "Серебро",
    suctionPower: 26,
    batteryLife: 65,
    isPopular: true,
    isNew: false,
    description: "Беспроводной пылесос со станцией самоочистки"
  },
  // Пылесосы - Роботы (id: 331)
  {
    id: 59,
    name: "Робот-пылесос Kuppersbusch SA 113 G",
    slug: "kuppersbusch-sa-113-g",
    categoryId: 331,
    categoryName: "Роботы-пылесосы",
    brand: "Kuppersbusch",
    price: 31990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Robot+Vacuum",
    manufacturer: "Kuppersbusch",
    color: "Серебро",
    suctionPower: 25,
    batteryLife: 65,
    isPopular: false,
    isNew: false,
    description: "Робот-пылесос с HEPA фильтром и 5 насадками"
  },

  // Блендеры (id: 340)
  {
    id: 60,
    name: "Блендер Kuppersbusch B 353",
    slug: "kuppersbusch-b-353",
    categoryId: 340,
    categoryName: "Блендеры и стационарные блендеры",
    brand: "Kuppersbusch",
    price: 16990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Blender",
    manufacturer: "Kuppersbusch",
    color: "Черный",
    power: 1000,
    isPopular: true,
    isNew: false,
    description: "Стационарный блендер мощностью 1000 Вт"
  },
  // Измельчители (id: 341)
  {
    id: 61,
    name: "Измельчитель Nivona NIC 300",
    slug: "nivona-nic-300",
    categoryId: 341,
    categoryName: "Измельчители и чопперы",
    brand: "Nivona",
    price: 8900,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Chopper",
    manufacturer: "Nivona",
    color: "Белый",
    bowlCapacity: 0.5,
    isPopular: false,
    isNew: true,
    description: "Компактный измельчитель для зелени и орехов"
  }
];

export const categories = [
    {
      "id": 1,
      "name": "Крупная бытовая техника",
      "slug": "large-appliances",
      "image": categImg,
      "level": 1,
      "children": [
        {
          "id": 10,
          "name": "Стиральные машины",
          "slug": "washing-machines",
          "level": 2,
          "children": [
            { "id": 100, "name": "Отдельностоящие стиральные машины", "slug": "freestanding-washing", "level": 3 },
            { "id": 101, "name": "Встраиваемые стиральные машины", "slug": "built-in-washing", "level": 3 },
            { "id": 102, "name": "Стиральные машины с сушкой (2в1)", "slug": "washer-dryer-combo", "level": 3 },
            { "id": 103, "name": "Стиральные машины с паром", "slug": "steam-washing", "level": 3 },
            { "id": 104, "name": "Стиральные машины с высокой скоростью отжима (1400+)", "slug": "high-spin-washing", "level": 3 }
          ]
        },
        {
          "id": 11,
          "name": "Сушильные машины",
          "slug": "dryers",
          "level": 2,
          "children": [
            { "id": 110, "name": "Отдельностоящие сушильные машины", "slug": "freestanding-dryers", "level": 3 },
            { "id": 111, "name": "Встраиваемые / интегрируемые сушилки", "slug": "built-in-dryers", "level": 3 },
            { "id": 112, "name": "Конденсационные сушильные машины", "slug": "condenser-dryers", "level": 3 },
            { "id": 113, "name": "Тепловые насосные сушильные машины", "slug": "heat-pump-dryers", "level": 3 }
          ]
        },
        {
          "id": 12,
          "name": "Стирально-сушильные машины",
          "slug": "washer-dryers",
          "level": 2,
          "children": [
            { "id": 120, "name": "Стирально-сушильные машины 2 в 1", "slug": "washer-dryer-all-in-one", "level": 3 },
            { "id": 121, "name": "Вертикальные стирально-сушильные", "slug": "vertical-washer-dryer", "level": 3 }
          ]
        },
        {
          "id": 13,
          "name": "Посудомоечные машины",
          "slug": "dishwashers",
          "level": 2,
          "children": [
            { "id": 130, "name": "Полностью встраиваемые посудомойки", "slug": "fully-built-in-dishwasher", "level": 3 },
            { "id": 131, "name": "Частично встраиваемые (с панелью)", "slug": "semi-built-in-dishwasher", "level": 3 },
            { "id": 132, "name": "Отдельностоящие посудомоечные машины", "slug": "freestanding-dishwasher", "level": 3 },
            { "id": 133, "name": "Узкие посудомоечные машины (45 см)", "slug": "slim-dishwasher-45cm", "level": 3 },
            { "id": 134, "name": "Широкие посудомоечные машины (60 см)", "slug": "standard-dishwasher-60cm", "level": 3 }
          ]
        },
        {
          "id": 14,
          "name": "Холодильники и морозильники",
          "slug": "refrigeration",
          "level": 2,
          "children": [
            { "id": 140, "name": "Холодильники с морозильной камерой", "slug": "fridge-freezers", "level": 3 },
            { "id": 141, "name": "Отдельностоящие двухдверные холодильники", "slug": "freestanding-fridge-freezers", "level": 3 },
            { "id": 142, "name": "Встраиваемые холодильники", "slug": "built-in-refrigerators", "level": 3 },
            { "id": 143, "name": "Встраиваемые морозильники", "slug": "built-in-freezers", "level": 3 },
            { "id": 144, "name": "Side-by-Side и French Door", "slug": "side-by-side-french-door", "level": 3 },
            { "id": 145, "name": "Винные шкафы", "slug": "wine-cabinets", "level": 3 },
            { "id": 146, "name": "Холодильники под столешницу / мини-бары", "slug": "undercounter-refrigerators", "level": 3 },
            { "id": 147, "name": "Морозильные лари и шкафы", "slug": "chest-and-upright-freezers", "level": 3 }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "Встраиваемая техника",
      "slug": "built-in-appliances",
      "image": categImg,
      "level": 1,
      "children": [
        {
          "id": 20,
          "name": "Духовые шкафы",
          "slug": "ovens",
          "level": 2,
          "children": [
            { "id": 200, "name": "Электрические духовые шкафы", "slug": "electric-ovens", "level": 3 },
            { "id": 201, "name": "Духовые шкафы с паром (Combi Steam)", "slug": "steam-ovens", "level": 3 },
            { "id": 202, "name": "Духовые шкафы с пиролизом", "slug": "pyrolytic-ovens", "level": 3 },
            { "id": 203, "name": "Духовые шкафы с микроволнами (3-в-1)", "slug": "microwave-ovens", "level": 3 },
            { "id": 204, "name": "Духовые шкафы Pizza Party / Высокотемпературные", "slug": "pizza-ovens", "level": 3 },
            { "id": 205, "name": "Компактные духовые шкафы (45 см)", "slug": "compact-ovens-45cm", "level": 3 }
          ]
        },
        {
          "id": 21,
          "name": "Варочные поверхности",
          "slug": "hobs",
          "level": 2,
          "children": [
            { "id": 210, "name": "Индукционные варочные панели", "slug": "induction-hobs", "level": 3 },
            { "id": 211, "name": "Газовые варочные панели", "slug": "gas-hobs", "level": 3 },
            { "id": 212, "name": "Комбинированные (газ + индукция)", "slug": "combo-hobs", "level": 3 },
            { "id": 213, "name": "Электрические варочные панели", "slug": "electric-hobs", "level": 3 },
            { "id": 214, "name": "Варочные панели с вытяжкой (Downdraft)", "slug": "downdraft-hobs", "level": 3 }
          ]
        },
        {
          "id": 22,
          "name": "Вытяжки",
          "slug": "hoods",
          "level": 2,
          "children": [
            { "id": 220, "name": "Настенные вытяжки (пристенные)", "slug": "wall-hoods", "level": 3 },
            { "id": 221, "name": "Островные вытяжки", "slug": "island-hoods", "level": 3 },
            { "id": 222, "name": "Встраиваемые вытяжки (в шкаф)", "slug": "built-in-hoods", "level": 3 },
            { "id": 223, "name": "Вытяжки в столешницу (Downdraft)", "slug": "downdraft-hoods", "level": 3 },
            { "id": 224, "name": "Потолочные вытяжки", "slug": "ceiling-hoods", "level": 3 },
            { "id": 225, "name": "Телескопические (выдвижные) вытяжки", "slug": "telescopic-hoods", "level": 3 },
            { "id": 226, "name": "Вытяжки с рециркуляцией", "slug": "recirculating-hoods", "level": 3 }
          ]
        },
        {
          "id": 23,
          "name": "Кофемашины встраиваемые",
          "slug": "built-in-coffee-machines",
          "level": 2,
          "children": [
            { "id": 230, "name": "Встраиваемые кофемашины (автомат)", "slug": "built-in-espresso-machines", "level": 3 },
            { "id": 231, "name": "Встраиваемые кофемашины с паром", "slug": "built-in-coffee-steam", "level": 3 }
          ]
        },
        {
          "id": 24,
          "name": "Микроволновые печи",
          "slug": "microwaves",
          "level": 2,
          "children": [
            { "id": 240, "name": "Встраиваемые микроволновые печи", "slug": "built-in-microwaves", "level": 3 },
            { "id": 241, "name": "Комбинированные микроволновые (с грилем/паром)", "slug": "combi-microwaves", "level": 3 }
          ]
        },
        {
          "id": 25,
          "name": "Комбинированные духовые (с паром)",
          "slug": "combi-steam-ovens",
          "level": 2,
          "children": [
            { "id": 250, "name": "Духовые шкафы с паром (Combi Steam)", "slug": "combi-steam-ovens", "level": 3 },
            { "id": 251, "name": "Духовые шкафы с паром + микроволнами", "slug": "steam-microwave-ovens", "level": 3 }
          ]
        },
        {
          "id": 26,
          "name": "Подогреватели посуды",
          "slug": "warming-drawers",
          "level": 2,
          "children": [
            { "id": 260, "name": "Подогреватели посуды (ящики)", "slug": "warming-drawers", "level": 3 }
          ]
        },
        {
          "id": 27,
          "name": "Винные шкафы",
          "slug": "wine-cabinets",
          "level": 2,
          "children": [
            { "id": 270, "name": "Встраиваемые винные шкафы", "slug": "built-in-wine-cabinets", "level": 3 },
            { "id": 271, "name": "Винные шкафы под столешницу", "slug": "undercounter-wine-cabinets", "level": 3 },
            { "id": 272, "name": "Винные шкафы с 2 и более температурными зонами", "slug": "multi-zone-wine-cabinets", "level": 3 }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "Мелкая бытовая техника",
      "slug": "small-appliances",
      "image": categImg,
      "level": 1,
      "children": [
        {
          "id": 30,
          "name": "Кофемашины отдельностоящие",
          "slug": "coffee-machines",
          "level": 2,
          "children": [
            { "id": 300, "name": "Автоматические кофемашины (зерновые)", "slug": "automatic-espresso-machines", "level": 3 },
            { "id": 301, "name": "Кофемашины с капучинатором OneTouch", "slug": "one-touch-coffee-machines", "level": 3 },
            { "id": 302, "name": "Премиум кофемашины (с Bluetooth / App)", "slug": "premium-coffee-machines", "level": 3 }
          ]
        },
        {
          "id": 31,
          "name": "Кофемолки",
          "slug": "coffee-grinders",
          "level": 2,
          "children": [
            { "id": 310, "name": "Кофемолки с коническими жерновами", "slug": "conical-burr-grinders", "level": 3 }
          ]
        },
        {
          "id": 32,
          "name": "Мясорубки",
          "slug": "meat-grinders",
          "level": 2,
          "children": [
            { "id": 320, "name": "Электрические мясорубки", "slug": "electric-meat-grinders", "level": 3 }
          ]
        },
        {
          "id": 33,
          "name": "Пылесосы",
          "slug": "vacuums",
          "level": 2,
          "children": [
            { "id": 330, "name": "Пылесосы беспроводные / вертикальные", "slug": "cordless-vacuums", "level": 3 },
            { "id": 331, "name": "Роботы-пылесосы", "slug": "robot-vacuums", "level": 3 }
          ]
        },
        {
          "id": 34,
          "name": "Другая мелкая кухонная техника",
          "slug": "other-small-kitchen",
          "level": 2,
          "children": [
            { "id": 340, "name": "Блендеры и стационарные блендеры", "slug": "blenders", "level": 3 },
            { "id": 341, "name": "Измельчители и чопперы", "slug": "food-choppers", "level": 3 }
          ]
        }
      ]
    },
    {
      "id": 4,
      "name": "Аксессуары и комплектующие",
      "slug": "accessories",
      "image": categImg,
      "level": 1,
      "children": [
        {
          "id": 40,
          "name": "Фильтры и аксессуары для вытяжек",
          "slug": "hood-filters",
          "level": 2,
          "children": [
            { "id": 400, "name": "Угольные фильтры", "slug": "carbon-filters", "level": 3 },
            { "id": 401, "name": "Керамические / Long Life фильтры", "slug": "ceramic-longlife-filters", "level": 3 },
            { "id": 402, "name": "Металлические жироулавливающие фильтры", "slug": "grease-filters", "level": 3 },
            { "id": 403, "name": "Аксессуары для монтажа вытяжек (трубы, короба)", "slug": "hood-installation-kits", "level": 3 }
          ]
        },
        {
          "id": 41,
          "name": "Аксессуары для кофемашин",
          "slug": "coffee-accessories",
          "level": 2,
          "children": [
            { "id": 410, "name": "Контейнеры для молока", "slug": "milk-containers", "level": 3 },
            { "id": 411, "name": "Фильтры для воды (Claris и аналоги)", "slug": "water-filters", "level": 3 },
            { "id": 412, "name": "Чистящие средства и таблетки", "slug": "coffee-cleaning-products", "level": 3 },
            { "id": 413, "name": "Молочные ланцеты и шланги", "slug": "milk-lances-hoses", "level": 3 }
          ]
        },
        {
          "id": 42,
          "name": "Аксессуары для духовых шкафов",
          "slug": "oven-accessories",
          "level": 2,
          "children": [
            { "id": 420, "name": "Телескопические направляющие", "slug": "telescopic-rails", "level": 3 },
            { "id": 421, "name": "Противни и решётки", "slug": "baking-trays-grids", "level": 3 },
            { "id": 422, "name": "Камни для пиццы", "slug": "pizza-stones", "level": 3 },
            { "id": 423, "name": "Термощупы и зонды", "slug": "temperature-probes", "level": 3 },
            { "id": 424, "name": "Наборы для запекания (AirFry, гриль и т.д.)", "slug": "baking-sets", "level": 3 }
          ]
        },
        {
          "id": 43,
          "name": "Аксессуары для варочных панелей",
          "slug": "hob-accessories",
          "level": 2,
          "children": [
            { "id": 430, "name": "Адаптеры и профили для встраивания", "slug": "hob-installation-profiles", "level": 3 },
            { "id": 431, "name": "Противни и решётки для газовых панелей", "slug": "gas-hob-grids", "level": 3 }
          ]
        },
        {
          "id": 44,
          "name": "Монтажные комплекты и крепления",
          "slug": "installation-kits",
          "level": 2,
          "children": [
            { "id": 440, "name": "Комплекты для установки в колонну", "slug": "stacking-kits", "level": 3 },
            { "id": 441, "name": "Крепления для фасадов и панелей", "slug": "facade-mounting-kits", "level": 3 }
          ]
        },
        {
          "id": 45,
          "name": "Фильтры и расходники (угольные, керамика)",
          "slug": "replacement-filters",
          "level": 2,
          "children": [
            { "id": 450, "name": "Угольные и цеолитные фильтры", "slug": "carbon-zeolite-filters", "level": 3 },
            { "id": 451, "name": "HEPA-фильтры и пылесборники", "slug": "hepa-filters", "level": 3 }
          ]
        },
        {
          "id": 46,
          "name": "Дизайнерские ручки, рамки, фасады",
          "slug": "design-kits",
          "level": 2,
          "children": [
            { "id": 460, "name": "Ручки и декоративные элементы", "slug": "handles-knobs", "level": 3 },
            { "id": 461, "name": "Фасады и панели для посудомоек / холодильников", "slug": "front-panels", "level": 3 }
          ]
        },
        {
          "id": 47,
          "name": "Средства по уходу",
          "slug": "care-products",
          "level": 2,
          "children": [
            { "id": 470, "name": "Средства для чистки кофемашин", "slug": "coffee-machine-cleaners", "level": 3 },
            { "id": 471, "name": "Средства для чистки духовых шкафов", "slug": "oven-cleaners", "level": 3 },
            { "id": 472, "name": "Средства для стиральных и посудомоечных машин", "slug": "laundry-dishwasher-cleaners", "level": 3 }
          ]
        }
      ]
    },
    {
      "id": 5,
      "name": "Кухонные блоки",
      "slug": "kitchen-blocks",
      "image": categImg,
      "level": 1,
      "children": [
        {
          "id": 50,
          "name": "Кухонные блоки ILVE",
          "slug": "ilve-kitchen-blocks",
          "level": 2,
          "children": [
            { "id": 500, "name": "Серия Nostalgie", "slug": "nostalgie", "level": 3 },
            { "id": 501, "name": "Серия Majestic", "slug": "majestic", "level": 3 },
            { "id": 502, "name": "Серия Professional Plus", "slug": "professional-plus", "level": 3 },
            { "id": 503, "name": "Серия Panoramagic", "slug": "panoramagic", "level": 3 },
            { "id": 504, "name": "Серия Pro Line", "slug": "pro-line", "level": 3 }
          ]
        }
      ]
    }
  ]

export const manufacturers = ['Samsung', 'LG', 'Sony', 'Bosch', 'Dyson'];
export const colors = ['черный', 'белый', 'серебристый', 'нержавейка', 'желтый'];