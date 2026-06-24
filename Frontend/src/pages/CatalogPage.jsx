import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState, useCallback, startTransition} from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { setSearchQuery, setFilters } from '../store/slices/filtersSlice';
import { fetchAllProducts } from '../store/slices/productsSlice'; // Импортируем thunk
import styles from './CatalogPage.module.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { resetFilters } from '../store/slices/filtersSlice';

import ImgCat1 from "../assets/cat-1.jpg"
import ImgCat2 from "../assets/cat-2.jpg"
import ImgCat3 from "../assets/cat-3.jpg"
import ImgCat4 from "../assets/cat-4.jpg"
import ImgCat5 from "../assets/cat-5.jpg"
import { useDeferredValue } from 'react';


const CHUNK_SIZE = 10;
const normalizeStatus = (status) => {
  if (!status) return null;
  const s = status.trim().toLowerCase();

  if (s === 'new 2026')   return 'New 2026';
  if (s === 'новинка')    return 'Новинка';
  if (s === 'акция')      return 'Акция';
  if (s === 'stock')      return 'Stock';
  if (s === 'outlet')     return 'Outlet';

  // Длинные статусы о наличии → одно значение
  if (s.includes('в наличии'))   return 'В наличии';
  if (s.includes('доступен') || s.includes('доступно')) return 'Под заказ';

  return null; // остальное игнорируем
};

const normalizeColorForFilter = (color) => {
  if (!color || color === 'null' || color === 'undefined') return null;
  
  const colorLower = color.toLowerCase().trim();
  
  // Карта соответствий
  const colorMap = {
    'черный': 'Черный',
    'чёрный': 'Черный',
    'black': 'Черный',
    'master black': 'Черный',
    'infinite black': 'Черный',
    'black velvet': 'Черный',
    'black steel': 'Черный',
    'black chrome': 'Черный',
    'чёрная': 'Черный',
    'чёрная эмаль': 'Черный',
    'чёрное стекло': 'Черный',
    'чёрный матовый': 'Черный',
    'чёрный (сталь + стекло)': 'Черный',
    'чёрный (сталь)': 'Черный',
    'чёрный сатин': 'Черный',
    'черная+ дымчатый стеклянный поворотный козырек': 'Черный',
    
    'белый': 'Белый',
    'white': 'Белый',
    'eternal white': 'Белый',
    'snow': 'Белый',
    'белая': 'Белый',
    'белая эмаль': 'Белый',
    'белое стекло': 'Белый',
    'белый сатин': 'Белый',
    'белая эмаль + белое стекло': 'Белый',
    
    'серебро': 'Серебро',
    'серый': 'Серый',
    'grey': 'Серый',
    'graphite': 'Графит',
    'матовый "графит"': 'Графит',
    'тёмно серый': 'Темно-серый',
    'anthracite': 'Антрацит',
    'anthrazit': 'Антрацит',
    'stainless steel': 'Нержавеющая сталь',
    'нержавеющая сталь': 'Нержавеющая сталь',
    'нерж.сталь': 'Нержавеющая сталь',
    'нерж. сталь': 'Нержавеющая сталь',
    'inox': 'Нержавеющая сталь',
    'сталь': 'Нержавеющая сталь',
    'нерж.+ белое стекло': 'Нержавеющая сталь',
    'нерж.+ чёрное стекло': 'Нержавеющая сталь',
    'silver chrome': 'Серебро',
    
    'gold': 'Золотой',
    'solid gold': 'Золотой',
    'iconic gold': 'Золотой',
    'copper': 'Медный',
    'медь': 'Медный',
    'ever rose': 'Розовый',
    
    'heritage': 'Бежевый',
    'titan rock': 'Титан',
    'flaw less': 'Прозрачный',
    'vanity fair': 'Бежевый',
  };
  
  if (colorMap[colorLower]) return colorMap[colorLower];
  
  if (colorLower.includes('черн') || colorLower.includes('black')) return 'Черный';
  if (colorLower.includes('бел') || colorLower.includes('white')) return 'Белый';
  if (colorLower.includes('сер') || colorLower.includes('grey')) return 'Серый';
  if (colorLower.includes('серебр') || colorLower.includes('silver')) return 'Серебро';
  if (colorLower.includes('стал') || colorLower.includes('inox') || colorLower.includes('stainless')) return 'Нержавеющая сталь';
  if (colorLower.includes('графит') || colorLower.includes('graphite')) return 'Графит';
  if (colorLower.includes('антрац') || colorLower.includes('anthra')) return 'Антрацит';
  if (colorLower.includes('золот') || colorLower.includes('gold')) return 'Золотой';
  if (colorLower.includes('мед') || colorLower.includes('copper')) return 'Медный';
  
  if (color.includes(',')) {
    const firstColor = color.split(',')[0].trim();
    return normalizeColorForFilter(firstColor);
  }
  
  if (color.includes('/')) {
    const firstColor = color.split('/')[0].trim();
    return normalizeColorForFilter(firstColor);
  }
  
  return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
};

// Добавьте эту функцию в CatalogPage (рядом с normalizeColorForFilter)
const normalizeControlType = (type) => {
  if (!type || type === 'null' || type === 'undefined') return null;
  
  const typeLower = type.toLowerCase().trim();
  
  const controlTypeMap = {
    'сенсорное': 'Сенсорное',
    'сенсорный': 'Сенсорное',
    'сенсорная': 'Сенсорное',
    'сенсорное touch control': 'Сенсорное',
    'сенсорное touch control + сенсор leaf sensor': 'Сенсорное',
    'сенсорное (9 режимов вытяжки+9 режимов панели)': 'Сенсорное',
    'сенсорное /dialogue system/ пульт ду-опция': 'Сенсорное',
    'сенсорное + функция "24 ч"': 'Сенсорное',
    'электронное сенсорное': 'Сенсорное',
    'электронное (сенсор)': 'Сенсорное',
    'электронное': 'Электронное',
    'электронное (управление с варочной поверхности)': 'Электронное',
    'электронное+управление с индукции': 'Электронное',
    'электронное+ пульт ду (опция)': 'Электронное',
    'электронное сенсорное+функция "24 ч"': 'Электронное',
    'пульт ду - опция': 'С пультом ДУ',
    'дистанционное управление кнопки': 'С пультом ДУ',
    'слайдер': 'Слайдер',
  };
  
  if (controlTypeMap[typeLower]) return controlTypeMap[typeLower];
  
  if (typeLower.includes('сенсор')) return 'Сенсорное';
  if (typeLower.includes('электрон')) return 'Электронное';
  if (typeLower.includes('пульт') || typeLower.includes('дистанцион')) return 'С пультом ДУ';
  if (typeLower.includes('слайдер')) return 'Слайдер';
  
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

const isProductInCategory = (productCategoryId, targetCategoryId, categoriesTree) => {
  // Находим категорию товара в дереве
  const productCategory = findCategoryById(categoriesTree, productCategoryId);
  if (!productCategory) return false;
  
  // Если целевая категория - это сама категория товара
  if (productCategoryId === targetCategoryId) return true;
  
  // Проверяем, является ли целевая категория родительской для категории товара
  let currentCategory = productCategory;
  while (currentCategory) {
    if (currentCategory.parent_id === targetCategoryId) return true;
    // Поднимаемся вверх по иерархии
    currentCategory = findCategoryById(categoriesTree, currentCategory.parent_id);
  }
  
  return false;
};

const findCategoryById = (categories, id) => {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

const extractSeriesList = (value) => {
  if (!value || value === 'null' || value === 'undefined' || value === '') {
    return [];
  }
  
  const validSeries = [
    'Professional Plus',
    'Pro Line', 
    'K-series.1',
    'K-series.2',
    'K-series.3',
    'K-series.5',
    'K-series.8',
    'Majestic',
    'Nostalgie',
    'Panoramagic'
  ];
  
  // Длинные описания игнорируем
  if (value.length > 50 || value.includes('Для') || value.includes('Чугунный')) {
    return [];
  }
  
  const result = [];
  
  // Разбиваем по запятой
  if (value.includes(',')) {
    const parts = value.split(',').map(p => p.trim());
    for (const part of parts) {
      if (validSeries.includes(part)) {
        result.push(part);
      }
    }
  } else {
    // Одиночное значение
    if (validSeries.includes(value)) {
      result.push(value);
    } else {
      // Поиск частичного совпадения
      for (const series of validSeries) {
        if (value.includes(series)) {
          result.push(series);
          break;
        }
      }
    }
  }
  
  return result;
};

const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { level1: level1Slug, level2: level2Slug, level3: level3Slug } = useParams();
  const { items: allProducts, loading: productsLoading } = useSelector(state => state.products);
  const { searchQuery, manufacturer, priceRange, color, loadCapacity, energyClass } = useSelector(state => state.filters);
  const { tree: categories, loading: categoriesLoading } = useSelector(state => state.categories);
const { 
  widthRange,
  heightRange,
  depthRange,
  volumeRange,
  performanceRange,
  noiseLevelRange,
  mountingType,
  controlType,
  material,
  compatibility,
  powerRange,
  inStock,
    factory,    // добавить
  warranty,
      series,
  netWeightRange,
  widthCmRange,
  status
} = useSelector(state => state.filters);



  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeLevel1, setActiveLevel1] = useState(null);
  const [activeLevel2, setActiveLevel2] = useState(null);
  const [activeLevel3, setActiveLevel3] = useState(null);
  const [level1Category, setLevel1Category] = useState(null);
  const [level2Category, setLevel2Category] = useState(null);
  const [level2CategoriesForTabs, setLevel2CategoriesForTabs] = useState([]);
  const [level3Categories, setLevel3Categories] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const [currentCategoryDescription, setCurrentCategoryDescription] = useState('');
  const [currentCategoryImage, setCurrentCategoryImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 50;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  // В начале компонента
  const [searchInput, setSearchInput] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [chunkSize, setChunkSize] = useState(50);
const [currentChunk, setCurrentChunk] = useState(0);


  // Вычисляем минимальную и максимальную цену из всех товаров
const minProductPrice = allProducts.length > 0 
  ? Math.min(...allProducts.map(p => p.price || 0))
  : 0;

const maxProductPrice = allProducts.length > 0 
  ? Math.max(...allProducts.map(p => p.price || 0))
  : 5000000;

  const filteredProducts = useMemo(() => {
  return allProducts.filter(product => {
  // ========== РАСШИРЕННЫЙ ПОИСК ==========
  let matchesSearch = true;
  if (searchQuery.trim().length > 0) {
    const lowerSearch = searchQuery.toLowerCase().trim();
    const searchTerms = lowerSearch.split(/\s+/);
    
    const checkField = (field) => {
      if (!field) return false;
      const fieldLower = field.toLowerCase();
      
      if (fieldLower.includes(lowerSearch)) return true;
      
      for (const term of searchTerms) {
        if (fieldLower.includes(term)) return true;
      }
      return false;
    };
    
    matchesSearch = 
      checkField(product.name) ||
      checkField(product.description) ||
      checkField(product.sku) ||
      checkField(product.model) ||
      checkField(product.group_level_1) ||
      checkField(product.groupLevel1) ||
      checkField(product.comment) ||
      checkField(product.brandName) ||
      (product.brand_id === 1 && checkField('Homeier')) ||
      (product.brand_id === 2 && checkField('Brandt'));
  }
  
  // ========== ФИЛЬТРАЦИЯ ПО КАТЕГОРИИ ==========
  let matchesCategory = true;
  
  if (activeLevel3) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel3, categories);
  } else if (activeLevel2) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel2, categories);
  } else if (activeLevel1) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel1, categories);
  }
  
  // ========== ФИЛЬТР ПРОИЗВОДИТЕЛЯ ==========
  const matchesManufacturer = manufacturer.length === 0 || manufacturer.includes(product.brandName);
  // console.log(product.brand, manufacturer);
  

  
  // ========== ФИЛЬТР ЦЕНЫ (только если изменен) ==========
  const isPriceFilterActive = priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice;
  const matchesPrice = !isPriceFilterActive || (product.price >= priceRange[0] && product.price <= priceRange[1]);
  
  // ========== ФИЛЬТР ЦВЕТА (только если выбран) ==========
  const isColorFilterActive = color && color !== '';
  const matchesColor = !isColorFilterActive || normalizeColorForFilter(product.color) === color;
  
  // ========== ДИНАМИЧЕСКИЕ ФИЛЬТРЫ (только если активны) ==========
const defaultWidthRange = { min: 0, max: 200 };
const isWidthFilterActive = widthCmRange && 
  (widthCmRange[0] > defaultWidthRange.min || widthCmRange[1] < defaultWidthRange.max);
const matchesWidth = !isWidthFilterActive || 
  (product.width && product.width >= widthCmRange[0] && product.width <= widthCmRange[1]);
  // console.log(widthCmRange, product.width);
  
  // console.log(product.width);
  
  
  const isHeightFilterActive = heightRange && heightRange[1] !== 0 && heightRange[1] !== 200;
  const matchesHeight = !isHeightFilterActive || (product.height && product.height <= heightRange[1]);
  
  const isVolumeFilterActive = volumeRange && volumeRange[1] !== 0 && volumeRange[1] !== 1000;
  const matchesVolume = !isVolumeFilterActive || (product.volume && product.volume <= volumeRange[1]);
  // console.log(product.volume);
  
  
  const isPowerFilterActive = powerRange && powerRange[1] !== 0 && powerRange[1] !== 5000;
  const matchesPower = !isPowerFilterActive || (product.power && product.power <= powerRange[1]);
  
  
  const isControlTypeFilterActive = controlType && controlType !== '';
  const matchesControlType = !isControlTypeFilterActive || 
  (normalizeControlType(product.control_type) === controlType);
  
  const isMaterialFilterActive = material && material !== '';
  const matchesMaterial = !isMaterialFilterActive || (product.material === material);
  // console.log(product.material);
  
  
  const isCompatibilityFilterActive = compatibility && compatibility.length > 0;
  const matchesCompatibility = !isCompatibilityFilterActive || compatibility.includes(product.brandName);
  
  // ========== ФИЛЬТР НАЛИЧИЯ ==========
  const matchesInStock = inStock === null || 
    (inStock === true && product.in_stock === true) || 
    (inStock === false && product.in_stock === false);

    // ========== ФИЛЬТР ТИПА УСТАНОВКИ (factory) ==========
  const isFactoryFilterActive = factory && factory.length > 0;
  const matchesFactory = !isFactoryFilterActive || factory.includes(product.factory);
  
  // ========== ФИЛЬТР ГАРАНТИИ (warranty) ==========
  const isWarrantyFilterActive = warranty && warranty.length > 0;
  const matchesWarranty = !isWarrantyFilterActive || warranty.includes(product.warranty);
  

const isSeriesFilterActive = series && series.length > 0;
const matchesSeries =  !isSeriesFilterActive || (() => {
  const productSeriesList = extractSeriesList(product.series);
  return productSeriesList.some(s => series.includes(s));
})();

// ========== ФИЛЬТР ВЕСА НЕТТО (net_weight) ==========
const isNetWeightFilterActive = netWeightRange && (netWeightRange[0] > 0 || netWeightRange[1] < 100);
const matchesNetWeight = !isNetWeightFilterActive || 
  (product.weight >= netWeightRange[0] && product.weight <= netWeightRange[1]);

// ========== ФИЛЬТР ШИРИНЫ В СМ (width_cm) ==========
const isWidthCmFilterActive = widthCmRange && (widthCmRange[0] > 0 || widthCmRange[1] < 200);
const matchesWidthCm = !isWidthCmFilterActive || 
  (product.width_cm >= widthCmRange[0] && product.width_cm <= widthCmRange[1]);
// В filteredProducts
const isStatusFilterActive = status && status.length > 0;
const matchesStatus = !isStatusFilterActive || 
  status.includes(normalizeStatus(product.status));
  
  // ========== ВРЕМЕННО ОТКЛЮЧЕННЫЕ ФИЛЬТРЫ ==========
  const matchesLoadCapacity = true;  // loadCapacity === '' || product.load_capacity === loadCapacity
  const matchesEnergyClass = true;   // energyClass === '' || product.energy_class === energyClass
  
  // ========== ИТОГОВОЕ УСЛОВИЕ ==========
  return matchesCategory && 
         matchesSearch && 
         matchesManufacturer && 
         matchesPrice && 
         matchesColor &&
         matchesWidth &&
      //   matchesFactory &&
      //    matchesWarranty &&
      //    matchesHeight &&
      //    matchesVolume &&
      //     matchesSeries &&      // добавить
       matchesNetWeight   // добавить
      //  matchesWidthCm && 
        //  matchesPower &&
        //  matchesControlType &&
        //  matchesMaterial &&
        //  matchesStatus &&
        //  matchesCompatibility;
});
}, [allProducts, searchQuery, manufacturer, priceRange, color, 
    activeLevel1, activeLevel2, activeLevel3, 
    netWeightRange, widthRange, widthCmRange]) 

    const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    
    // Добавляем частями
    let added = 0;
    const totalToAdd = Math.min(ITEMS_PER_PAGE, filteredProducts.length - visibleCount);
    
    const addChunk = () => {
      const chunk = Math.min(CHUNK_SIZE, totalToAdd - added);
      if (chunk <= 0) {
        setIsLoadingMore(false);
        return;
      }
      
      setVisibleCount(prev => prev + chunk);
      added += chunk;
      
      // Следующий чанк через 50ms
      if (added < totalToAdd) {
        setTimeout(addChunk, 50);
      } else {
        setIsLoadingMore(false);
      }
    };
    
    startTransition(() => {
      addChunk();
    });
  }, [visibleCount, filteredProducts.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300); // ждём 300мс после последнего символа
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, manufacturer, priceRange, color, 
      activeLevel1, activeLevel2, activeLevel3]);

const visibleProducts = useMemo(() => {
  return filteredProducts.slice(0, visibleCount);
}, [filteredProducts, visibleCount]);

  const deferredVisibleProducts = useDeferredValue(visibleProducts);

  // Данные для баннеров категорий (можно вынести в отдельный файл)
  const categoryBanners = {
    // Категории 1 уровня
    'large-appliances': {
      title: 'Крупная бытовая техника',
      description: 'Широкий выбор стиральных машин, холодильников, посудомоечных машин и другой крупной бытовой техники от ведущих производителей. Высокое качество, надежность и доступные цены.',
      image: ImgCat1,
      bgColor: '#7bc6cf'
    },
    'built-in-appliances': {
      title: 'Встраиваемая техника',
      description: 'Идеальное решение для современной кухни. Духовые шкафы, варочные поверхности, вытяжки и кофемашины, которые идеально впишутся в ваш интерьер.',
      image: ImgCat2,
      bgColor: '#ff9f43'
    },
    'small-appliances': {
      title: 'Мелкая бытовая техника',
      description: 'Кофемашины, блендеры, пылесосы и другая техника для комфортной жизни. Компактные размеры и высокая функциональность.',
      image: ImgCat3,
      bgColor: '#a55eea'
    },
    'accessories': {
      title: 'Аксессуары',
      description: 'Оригинальные аксессуары и комплектующие для вашей техники. Фильтры, направляющие, чистящие средства и многое другое.',
      image: ImgCat4,
      bgColor: '#eb4d4b'
    },
    'kitchen-blocks': {
      title: 'Кухонные блоки ILVE',
      description: 'Премиальные кухонные блоки итальянского бренда ILVE. Сочетание стиля, мощности и функциональности для вашей кухни.',
      image: ImgCat5,
      bgColor: '#20bf6b'
    },
  };

// Функция для проверки принадлежности товара к категории


// Расширенная нормализация с сохранением всех серий для товара


// Вспомогательная функция для поиска категории по id

  // Обновление баннера при смене категории
  const updateBanner = (category) => {
    if (!category) return;
    
    const banner = categoryBanners[category.slug];
    if (banner) {
      setCurrentCategoryName(banner.title);
      setCurrentCategoryDescription(banner.description);
      setCurrentCategoryImage(banner.image);
    } else {
      setCurrentCategoryName(category.name);
      setCurrentCategoryDescription(`Широкий ассортимент ${category.name.toLowerCase()} от ведущих производителей. Высокое качество и доступные цены.`);
      setCurrentCategoryImage('');
    }
  };

    useEffect(() => {
    if (allProducts.length === 0 && !productsLoading) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProducts.length, productsLoading]);

  // Парсим URL при загрузке
useEffect(() => {
  if (categories.length === 0) return;

  // Нет ни одного сегмента — сбрасываем всё
  if (!level1Slug) {
    setLevel1Category(null);
    setActiveLevel1(null);
    setLevel2Category(null);
    setActiveLevel2(null);
    setLevel3Categories([]);
    setActiveLevel3(null);
    setLevel2CategoriesForTabs([]);
    setCurrentCategoryName('');
    setCurrentCategoryDescription('');
    setCurrentCategoryImage('');
    return;
  }

  // level1
  const foundLevel1 = categories.find(c => c.slug === level1Slug);
  if (!foundLevel1) return;

  setLevel1Category(foundLevel1);
  setActiveLevel1(foundLevel1.id);
  updateBanner(foundLevel1);
  setLevel2CategoriesForTabs(foundLevel1.children || []);

  // level2
  if (!level2Slug) {
    setLevel2Category(null);
    setActiveLevel2(null);
    setLevel3Categories([]);
    setActiveLevel3(null);
    return;
  }

  const foundLevel2 = foundLevel1.children?.find(c => c.slug === level2Slug);
  if (!foundLevel2) return;

  setLevel2Category(foundLevel2);
  setActiveLevel2(foundLevel2.id);
  setLevel3Categories(foundLevel2.children || []);

  // level3
  if (!level3Slug) {
    setActiveLevel3(null);
    return;
  }

  const foundLevel3 = foundLevel2.children?.find(c => c.slug === level3Slug);
  if (foundLevel3) {
    setActiveLevel3(foundLevel3.id);
  }

}, [level1Slug, level2Slug, level3Slug, categories]);

useEffect(() => {
  dispatch(resetFilters());
}, [level1Slug, level2Slug, level3Slug]); 

  // Фильтрация товаров
  // console.log(allProducts.filter(el => el.categoryId ===293));




  
// console.log(allProducts.filter(el => el.width!==0 && el.width>widthCmRange[0] && el.width<widthCmRange[1]).map(el => el.width));


  // Вставьте это в ваш компонент, где есть filteredProducts

const analyzeFields = (products) => {
  if (!products || products.length === 0) {
    console.log('Нет товаров');
    return;
  }

  const fieldCount = {};

  products.forEach(product => {
    Object.keys(product).forEach(field => {
      const value = product[field];
      const isFilled = value !== null && value !== undefined && value !== '';
      
      if (!fieldCount[field]) {
        fieldCount[field] = {
          total: products.length,
          filled: 0,
          empty: 0
        };
      }
      
      if (isFilled) {
        fieldCount[field].filled++;
      } else {
        fieldCount[field].empty++;
      }
    });
  });

  
  Object.entries(fieldCount)
    .sort((a, b) => b[1].filled - a[1].filled)
    .forEach(([field, stats]) => {
      const percent = ((stats.filled / stats.total) * 100).toFixed(1);
      console.log(`${field}: ${stats.filled}/${stats.total} (${percent}%)`);
    });
};

// Использование:
// analyzeFields(filteredProducts);
  


  

  // Эффект загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchQuery, manufacturer, priceRange, color, loadCapacity, energyClass, activeLevel3, activeLevel2, activeLevel1]);

  // Обработка клика по категории 1 уровня
const handleLevel1Click = (level1) => {
  setActiveLevel1(level1.id);
  setActiveLevel2(null);
  setActiveLevel3(null);
  setLevel1Category(level1);
  updateBanner(level1);
  setLevel2CategoriesForTabs(level1.children || []);
  setLevel2Category(null);
  setLevel3Categories([]);
  navigate(`/catalog/${level1.slug}`);
};

const handleLevel2Click = (level2) => {
  setActiveLevel2(level2.id);
  setActiveLevel3(null);
  setLevel2Category(level2);
  setLevel3Categories(level2.children || []);
  navigate(`/catalog/${level1Category?.slug}/${level2.slug}`);
};

const handleLevel3Click = (level3) => {
  setActiveLevel3(level3.id);
  navigate(`/catalog/${level1Category?.slug}/${level2Category?.slug}/${level3.slug}`);
};

const handleBackToLevel2 = () => {
  setActiveLevel3(null);
  navigate(`/catalog/${level1Category?.slug}/${level2Category?.slug}`);
};

const handleBackToLevel1 = () => {
  setActiveLevel2(null);
  setActiveLevel3(null);
  setLevel2Category(null);
  setLevel3Categories([]);
  updateBanner(level1Category);
  navigate(`/catalog/${level1Category?.slug}`);
};

  if (isPageLoading) {
    return <LoadingSpinner text="Загрузка каталога..." />;
  }


  return (
    <div className="container">
      {/* Баннер категории */}
      {(level1Category) && (
        <div className={styles.categoryBanner}>
          <div 
            className={styles.bannerBg}
            style={{ backgroundImage: currentCategoryImage ? `url(${currentCategoryImage})` : 'none' }}
          >
            <div className={styles.bannerOverlay}></div>
          </div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <h1 className={styles.bannerTitle}>{currentCategoryName}</h1>
              <p className={styles.bannerDescription}>{currentCategoryDescription}</p>
              <div className={styles.bannerStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{level2CategoriesForTabs.length || level3Categories.length || 0}</span>
                  <span className={styles.statLabel}>подкатегорий</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{level1Category?.children?.length || 0}</span>
                  <span className={styles.statLabel}>категорий</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>24/7</span>
                  <span className={styles.statLabel}>поддержка</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.catalogLayout}>
        <FilterSidebar />
        
        <div className={styles.content}>
          {/* Поиск */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Поиск в каталоге..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Хлебные крошки */}
          {(level1Category || level2Category) && (
            <div className={styles.breadcrumbs}>
              {level1Category && (
                <button 
                  className={styles.breadcrumbLink}
                  onClick={() => handleLevel1Click(level1Category)}
                >
                  {level1Category.name}
                </button>
              )}
              {level2Category && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <button 
                    className={styles.breadcrumbLink}
                    onClick={handleBackToLevel1}
                  >
                    {level2Category.name}
                  </button>
                </>
              )}
              {activeLevel3 && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <button 
                    className={styles.breadcrumbLink}
                    onClick={handleBackToLevel2}
                  >
                    {level3Categories.find(c => c.id === activeLevel3)?.name}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Табы категорий 2 уровня */}
          {level2CategoriesForTabs.length > 0 && !level2Category && (
            <div className={styles.tabs}>
              {level2CategoriesForTabs.map(level2 => (
                <button
                  key={level2.id}
                  className={styles.tab}
                  onClick={() => handleLevel2Click(level2)}
                >
                  {/* <span className={styles.tabIcon}>
                    {level2.id === 10 && '🧺'}
                    {level2.id === 11 && '🌀'}
                    {level2.id === 12 && '⚡'}
                    {level2.id === 13 && '🧼'}
                    {level2.id === 14 && '❄️'}
                    {level2.id === 20 && '🔥'}
                    {level2.id === 21 && '🍳'}
                    {level2.id === 22 && '💨'}
                    {level2.id === 23 && '☕'}
                    {level2.id === 24 && '📡'}
                    {level2.id === 25 && '💨'}
                    {level2.id === 26 && '🍽️'}
                    {level2.id === 27 && '🍷'}
                    {level2.id === 30 && '☕'}
                    {level2.id === 31 && '🔧'}
                    {level2.id === 32 && '🥩'}
                    {level2.id === 33 && '🧹'}
                    {level2.id === 34 && '🥤'}
                  </span> */}
                  {level2.name}
                </button>
              ))}
            </div>
          )}

          {/* Табы категорий 3 уровня */}
          {level3Categories.length > 0 && (
            <div className={styles.subTabs}>
              <button
                className={`${styles.subTab} ${!activeLevel3 ? styles.active : ''}`}
                onClick={handleBackToLevel2}
              >
                Все {level2Category?.name}
              </button>
              {level3Categories.map(level3 => (
                <button
                  key={level3.id}
                  className={`${styles.subTab} ${activeLevel3 === level3.id ? styles.active : ''}`}
                  onClick={() => handleLevel3Click(level3)}
                >
                  {level3.name}
                </button>
              ))}
            </div>
          )}
          {/* Если нет активных категорий - показываем все категории первого уровня */}
          {!level1Category && !level2Category && !activeLevel3 && categories.length > 0 && (
            <div className={styles.allCategoriesSection}>
              <h2 className={styles.allCategoriesTitle}>Категории товаров</h2>
              <div className={styles.allCategoriesGrid}>
                {categories.map(category => (
                  <div 
                    key={category.id} 
                    className={styles.categoryCard}
                    onClick={() => handleLevel1Click(category)}
                  >
                    {/* <div className={styles.categoryCardIcon}>
                      {getCategoryIcon(category.name)}
                    </div> */}
                    <h3 className={styles.categoryCardName}>{category.name}</h3>
                    <p className={styles.categoryCardCount}>
                      {category.children?.reduce((total, child) => total + (child.children?.length || 0), 0) || 0} товаров
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Результаты */}
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {activeLevel3 
                ? level3Categories.find(c => c.id === activeLevel3)?.name 
                : currentCategoryName || 'Все товары'}
            </h2>
            <span className={styles.resultsCount}>
              Найдено: {filteredProducts.length} товаров
            </span>
          </div>

          <div className={`${styles.productsGrid} ${isLoading ? styles.loading : ''}`}>
            {deferredVisibleProducts.map((product, index) => (
              <div 
                key={`${product.id}_${product.brandId}`} 
                className={styles.productItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
            {visibleCount < filteredProducts.length && (
              <div className={styles.loadMoreWrap}>
                {isLoadingMore ? (
                  <div className={styles.loadMoreSpinner}>
                    <div className={styles.spinnerRing}></div>
                    <span>Загружаем товары...</span>
                  </div>
                ) : (
                  <button
                    className={styles.loadMoreBtn}
                    onClick={handleLoadMore}
                  >
                    Показать ещё {Math.min(ITEMS_PER_PAGE, filteredProducts.length - visibleCount)} товаров
                    <span className={styles.loadMoreCount}>
                      показано {visibleCount} из {filteredProducts.length}
                    </span>
                  </button>
                )}
              </div>
            )}

          {filteredProducts.length === 0 && !isLoading && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3>Товары не найдены</h3>
              <p>В этой категории пока нет товаров или попробуйте изменить фильтры</p>
              <button 
                className={styles.resetFiltersBtn}
                onClick={() => {
                  dispatch(setFilters({
                    manufacturer: [],
                    priceRange: [0, 500000],
                    color: '',
                    loadCapacity: '',
                    energyClass: ''
                  }));
                  dispatch(setSearchQuery(''));
                }}
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;