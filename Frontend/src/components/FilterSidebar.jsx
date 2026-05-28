import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  toggleManufacturer, 
  setPriceRange, 
  setColor, 
  resetFilters,
  setBrand,
  setInStock,
  setWidthRange,
  setHeightRange,
  setVolumeRange,
  setPowerRange,
  setControlType,
  setMaterial,
  toggleCompatibility,
    setFactory,      // добавить
  setWarranty,
    setSeries,
  setNetWeightRange,
  setWidthCmRange,
  setStatus
} from '../store/slices/filtersSlice';
import styles from './FilterSidebar.module.css';
import {
IconTool   ,       
IconShieldCheck,
IconArrowsHorizontal ,
IconArrowsVertical   ,
IconTag          , 
IconWeight        ,
IconBuildingFactory  ,
IconCircleCheck, IconCurrencyRubel,
IconPalette, IconTrash
} from '@tabler/icons-react';
import trashIcon from "../assets/trash.svg";
import colorIcon from "../assets/colors.svg";
import moneyIcon from "../assets/money.svg";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { 
    manufacturer, 
    priceRange, 
    color, 
    brand,
    inStock,
    widthRange,
    heightRange,
    volumeRange,
    powerRange,
    controlType,
    material,
    compatibility,
      factory,     // добавить
  warranty,
    series,
  netWeightRange,
  widthCmRange,
  status
  } = useSelector(state => state.filters);
  
  const { items: products } = useSelector(state => state.products);
  const { tree: categories } = useSelector(state => state.categories);
  
  // Состояния для UI
  const [manufacturers, setManufacturers] = useState([]);
  const [colors, setColors] = useState([]);
  const [level1Category, setLevel1Category] = useState(null);
  const [level1CategoryObject, setLevel1CategoryObject] = useState(null);

  // Парсим URL для получения текущей категории
  useEffect(() => {
    if (categories.length === 0) return;
    
    const params = new URLSearchParams(location.search);
    const level1Slug = params.get('level1');
    
    setLevel1Category(level1Slug);
    
    // Находим объект категории по slug
    if (level1Slug) {
      const foundCategory = categories.find(c => c.slug === level1Slug);
      setLevel1CategoryObject(foundCategory || null);
    } else {
      setLevel1CategoryObject(null);
    }
  }, [location.search, categories]);

  // Функция нормализации цветов
  const normalizeColor = (color) => {
    if (!color || color === 'null' || color === 'undefined') return null;
    
    const colorLower = color.toLowerCase().trim();
    
    const stopWords = [
      'рамка', 'панель', 'установка', 'козырек', 'возможность',
      'индивидуальных', 'без рамки', 'для индивидуальных', 'поворотный',
      'aisi', '304', '305', 'стеклянный', 'сатинированный', 'алюминий',
      'монтаж', 'управление', 'программа', 'статус', 'комментарий'
    ];


    // Добавьте функцию для получения уникальных значений factory из товаров текущей категории
    
    for (const stopWord of stopWords) {
      if (colorLower.includes(stopWord)) {
        return null;
      }
    }
    
    if (color.length > 30) {
      return null;
    }
    
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
      'белый': 'Белый',
      'white': 'Белый',
      'eternal white': 'Белый',
      'snow': 'Белый',
      'белая': 'Белый',
      'серебро': 'Серебро',
      'серый': 'Серый',
      'grey': 'Серый',
      'graphite': 'Графит',
      'stainless steel': 'Нержавеющая сталь',
      'нержавеющая сталь': 'Нержавеющая сталь',
      'нерж.сталь': 'Нержавеющая сталь',
      'inox': 'Нержавеющая сталь',
      'gold': 'Золотой',
      'copper': 'Медный',
      'медь': 'Медный',
    };
    
    if (colorMap[colorLower]) return colorMap[colorLower];
    
    if (colorLower.includes('черн') || colorLower.includes('black')) return 'Черный';
    if (colorLower.includes('бел') || colorLower.includes('white')) return 'Белый';
    if (colorLower.includes('сер') || colorLower.includes('grey')) return 'Серый';
    if (colorLower.includes('серебр') || colorLower.includes('silver')) return 'Серебро';
    if (colorLower.includes('стал') || colorLower.includes('inox') || colorLower.includes('stainless')) return 'Нержавеющая сталь';
    if (colorLower.includes('графит') || colorLower.includes('graphite')) return 'Графит';
    
    return null;
  };

  const getFactoryOptions = () => {
  let categoryProducts = products;
  
  // Фильтруем товары только для текущей категории
  if (level1CategoryObject && level1CategoryObject.id) {
    // Здесь нужна логика фильтрации товаров по категории
    // Например, если у товаров есть groupLevel1 или categoryId
    categoryProducts = products.filter(p => {
      // Пример: для large-appliances
      if (level1Category === 'large-appliances') {
        return p.groupLevel1 === 'Крупная бытовая техника' || 
               p.category_name?.includes('Крупная') ||
               p.factory; // товары с factory относятся к крупной технике
      }
      return true;
    });
  }
  
  const factories = new Set();
  categoryProducts.forEach(product => {
    if (product.factory && product.factory !== 'null' && product.factory !== 'undefined' && product.factory !== '') {
      factories.add(product.factory);
    }
  });
  
  return Array.from(factories).sort();
};

// Добавьте функцию для получения уникальных значений warranty
const getWarrantyOptions = () => {
  let categoryProducts = products;
  
  if (level1CategoryObject && level1CategoryObject.id) {
    if (level1Category === 'large-appliances') {
      categoryProducts = products.filter(p => {
        return p.groupLevel1 === 'Крупная бытовая техника' || 
               p.category_name?.includes('Крупная') ||
               p.warranty;
      });
    }
  }
  
  const warranties = new Set();
  categoryProducts.forEach(product => {
    if (product.warranty && product.warranty !== null && product.warranty !== undefined && product.warranty !== '') {
      warranties.add(product.warranty);
    }
  });
  
  return Array.from(warranties).sort((a, b) => a - b);
};
  const getStatusOptions = () => {
    const statusSet = new Set();
    
    products.forEach(product => {
      if (product.status && product.status !== 'null' && product.status !== 'undefined' && product.status !== '') {
        // Очищаем статус от лишних пробелов и приводим к нормальному виду
        let cleanStatus = product.status.trim();
        
        // Приводим к единому формату
        if (cleanStatus.toLowerCase() === 'new 2026') cleanStatus = 'New 2026';
        if (cleanStatus.toLowerCase() === 'stock') cleanStatus = 'Stock';
        if (cleanStatus.toLowerCase() === 'outlet') cleanStatus = 'Outlet';
        if (cleanStatus.toLowerCase() === 'новинка') cleanStatus = 'Новинка';
        if (cleanStatus.toLowerCase() === 'акция') cleanStatus = 'Акция';
        
        statusSet.add(cleanStatus);
      }
    });
    
    // Сортируем статусы в нужном порядке
    const order = ['New 2026', 'Новинка', 'Акция', 'Stock', 'Outlet', 'outlet'];
    return Array.from(statusSet).sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };
  
  const statusOptions = getStatusOptions();
  
  // Функция для получения иконки статуса
  const getStatusIcon = (status) => {
    switch(status) {
      case 'New 2026': return '🆕';
      case 'Новинка': return '✨';
      case 'Акция': return '🎯';
      case 'Stock': return '📦';
      case 'Outlet': return '🏷️';
      default: return '🏷️';
    }
  };
  
  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'New 2026': return '#4CAF50';
      case 'Новинка': return '#2196F3';
      case 'Акция': return '#FF5722';
      case 'Stock': return '#607D8B';
      case 'Outlet': return '#9C27B0';
      default: return '#666';
    }
  };
const getSeriesOptions = () => {
  let categoryProducts = products;
  
  if (level1Category === 'built-in-appliances') {
    categoryProducts = products.filter(p => {
      return p.groupLevel1 === 'Встраиваемая техника' || 
             p.category_name?.includes('Встраиваемая') ||
             p.series;
    });
  }
  
  const seriesSet = new Set();
  categoryProducts.forEach(product => {
    if (product.series && product.series !== 'null' && product.series !== 'undefined' && product.series !== '') {
      // Фильтруем null и undefined
      if (product.series !== null && product.series !== 'null') {
        seriesSet.add(product.series);
      }
    }
  });
  
  // Сортируем серии (K-series.1, K-series.2, K-series.3 и т.д.)
  return Array.from(seriesSet).sort();
};

const getNetWeightRange = () => {
  let categoryProducts = products;
  
  if (level1Category === 'built-in-appliances') {
    categoryProducts = products.filter(p => {
      return p.groupLevel1 === 'Встраиваемая техника' || 
             p.category_name?.includes('Встраиваемая');
    });
  }
  
  const weights = categoryProducts
    .map(p => p.net_weight)
    .filter(w => w && w > 0 && !isNaN(w));
  
  if (weights.length === 0) return { min: 0, max: 100 };
  
  return {
    min: Math.min(...weights),
    max: Math.max(...weights)
  };
};

const getWidthCmRange = () => {
  let categoryProducts = products;
  
  if (level1Category === 'built-in-appliances') {
    categoryProducts = products.filter(p => {
      return p.groupLevel1 === 'Встраиваемая техника' || 
             p.category_name?.includes('Встраиваемая');
    });
  }
  
  const widths = categoryProducts
    .map(p => p.width_cm)
    .filter(w => w && w > 0 && !isNaN(w));
  
  if (widths.length === 0) return { min: 0, max: 200 };
  
  return {
    min: Math.min(...widths),
    max: Math.max(...widths)
  };
};
  // Функция нормализации типов управления
const normalizeControlType = (type) => {
  if (!type || type === 'null' || type === 'undefined') return null;
  
  const typeLower = type.toLowerCase().trim();
  
  // Карта соответствий для объединения похожих типов
  const controlTypeMap = {
    // Сенсорное
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
    
    // Электронное
    'электронное': 'Электронное',
    'электронное (управление с варочной поверхности)': 'Электронное',
    'электронное+управление с индукции': 'Электронное',
    'электронное+ пульт ду (опция)': 'Электронное',
    'электронное сенсорное+функция "24 ч"': 'Электронное',
    
    // С пультом ДУ
    'пульт ду - опция': 'С пультом ДУ',
    'дистанционное управление кнопки': 'С пультом ДУ',
    
    // Слайдер
    'слайдер': 'Слайдер',
  };
  
  // Проверяем точное совпадение
  if (controlTypeMap[typeLower]) {
    return controlTypeMap[typeLower];
  }
  
  // Проверяем частичное совпадение
  if (typeLower.includes('сенсор')) return 'Сенсорное';
  if (typeLower.includes('электрон')) return 'Электронное';
  if (typeLower.includes('пульт') || typeLower.includes('дистанцион')) return 'С пультом ДУ';
  if (typeLower.includes('слайдер')) return 'Слайдер';
  
  // Если ничего не подошло, возвращаем оригинал с большой буквы
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

  // Загрузка производителей и цветов
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueManufacturers = [...new Set(
        products.map(p => p.brandName).filter(Boolean)
      )];
      setManufacturers(uniqueManufacturers);
      
      const uniqueColors = [...new Set(
        products
          .map(p => p.color)
          .filter(c => c && c !== 'null' && c !== 'undefined' && c !== '')
          .map(c => normalizeColor(c))
          .filter(Boolean)
      )];
      
      const colorOrder = ['Черный', 'Белый', 'Серый', 'Серебро', 'Нержавеющая сталь', 'Графит'];
      const sortedColors = [...uniqueColors].sort((a, b) => {
        const indexA = colorOrder.indexOf(a);
        const indexB = colorOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      
      setColors(sortedColors);
    }
  }, [products]);

  // Максимальная и минимальная цена
  const maxProductPrice = products.length > 0 
    ? Math.max(...products.map(p => p.price || 0))
    : 500000;
  
  const minProductPrice = products.length > 0 
    ? Math.min(...products.map(p => p.price || 0))
    : 0;

  // Обработчик изменения цены
  const handlePriceChange = (index, value) => {
    let newValue = parseInt(value) || 0;
    if (index === 0) {
      if (newValue > priceRange[1]) {
        newValue = priceRange[1];
      }
      dispatch(setPriceRange([newValue, priceRange[1]]));
    } else {
      if (newValue < priceRange[0]) {
        newValue = priceRange[0];
      }
      dispatch(setPriceRange([priceRange[0], newValue]));
    }
  };

  // Получение доступных значений для фильтров из товаров текущей категории
const getFilterOptions = () => {
  let categoryProducts = products;
  
  if (level1CategoryObject && level1CategoryObject.id) {
    // Фильтрация по категории если нужно
  }
  
  return {
    widths: [...new Set(categoryProducts.map(p => p.width).filter(w => w && w > 0))].sort((a,b) => a-b),
    heights: [...new Set(categoryProducts.map(p => p.height).filter(h => h && h > 0))].sort((a,b) => a-b),
    volumes: [...new Set(categoryProducts.map(p => p.volume).filter(v => v && v > 0))].sort((a,b) => a-b),
    // Нормализуем типы управления и убираем дубликаты
    controlTypes: [...new Set(
      categoryProducts
        .map(p => p.control_type)
        .filter(c => c && c !== 'null' && c !== 'undefined')
        .map(c => normalizeControlType(c))
        .filter(Boolean)
    )].sort(),
  };
};
  const filterOptions = getFilterOptions();

  // Функция для рендера дополнительных фильтров в зависимости от категории
  const renderDynamicFilters = () => {
    switch(level1Category) {
case 'large-appliances':
  const factoryOptions = getFactoryOptions();
  const warrantyOptions = getWarrantyOptions();
  return (
    <>
              {/* Фильтр типа установки (factory) */}
          {factoryOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <h4 className={styles.groupTitle}><IconTool size={22}/> <p>Тип установки</p></h4>
              <div className={styles.checkboxGroup}>
                {factoryOptions.map(option => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={factory.includes(option)}
                      onChange={() => dispatch(setFactory(option))}
                    />
                    <span className={styles.checkmark}></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Фильтр гарантии (warranty) */}
          {warrantyOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <h4 className={styles.groupTitle}><IconShieldCheck size={22}/> <p>Гарантия (лет)</p></h4>
              <div className={styles.checkboxGroup}>
                {warrantyOptions.map(option => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={warranty.includes(option)}
                      onChange={() => dispatch(setWarranty(option))}
                    />
                    <span className={styles.checkmark}></span>
                    {option} {option === 1 ? 'год' : option > 1 && option < 5 ? 'года' : 'лет'}
                  </label>
                ))}
              </div>
            </div>
          )}
      {/* Фильтр ширины */}
      {filterOptions.widths.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}><IconArrowsHorizontal size={22}/> <p>Ширина (см)</p> </h4>
          <div className={styles.dimensionInputs}>
            <div className={styles.dimensionField}>
              <span>от</span>
              <input 
                type="number" 
                value={widthRange[0]} 
                onChange={(e) => dispatch(setWidthRange([parseInt(e.target.value) || 0, widthRange[1]]))}
                min={0}
                max={widthRange[1]}
                step={5}
              />
            </div>
            <span className={styles.dimensionSeparator}>—</span>
            <div className={styles.dimensionField}>
              <span>до</span>
              <input 
                type="number" 
                value={widthRange[1]} 
                onChange={(e) => dispatch(setWidthRange([widthRange[0], parseInt(e.target.value) || 0]))}
                min={widthRange[0]}
                max={Math.max(...filterOptions.widths, 200)}
                step={5}
              />
            </div>
          </div>
          <div className={styles.dimensionRangeSlider}>
            <input 
              type="range" 
              min={0} 
              max={Math.max(...filterOptions.widths, 200)} 
              step={5}
              value={widthRange[0]} 
              onChange={(e) => dispatch(setWidthRange([parseInt(e.target.value), widthRange[1]]))}
            />
            <input 
              type="range" 
              min={0} 
              max={Math.max(...filterOptions.widths, 200)} 
              step={5}
              value={widthRange[1]} 
              onChange={(e) => dispatch(setWidthRange([widthRange[0], parseInt(e.target.value)]))}
            />
          </div>
          <div className={styles.dimensionHint}>
            <span>от {widthRange[0]} см</span>
            <span>до {widthRange[1]} см</span>
          </div>
        </div>
      )}
      
      {/* Фильтр высоты */}
      {filterOptions.heights.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}><IconArrowsVertical/> <p>Высота (см)</p></h4>
          <div className={styles.dimensionInputs}>
            <div className={styles.dimensionField}>
              <span>от</span>
              <input 
                type="number" 
                value={heightRange[0]} 
                onChange={(e) => dispatch(setHeightRange([parseInt(e.target.value) || 0, heightRange[1]]))}
                min={0}
                max={heightRange[1]}
                step={5}
              />
            </div>
            <span className={styles.dimensionSeparator}>—</span>
            <div className={styles.dimensionField}>
              <span>до</span>
              <input 
                type="number" 
                value={heightRange[1]} 
                onChange={(e) => dispatch(setHeightRange([heightRange[0], parseInt(e.target.value) || 0]))}
                min={heightRange[0]}
                max={Math.max(...filterOptions.heights, 200)}
                step={5}
              />
            </div>
          </div>
          <div className={styles.dimensionRangeSlider}>
            <input 
              type="range" 
              min={0} 
              max={Math.max(...filterOptions.heights, 200)} 
              step={5}
              value={heightRange[0]} 
              onChange={(e) => dispatch(setHeightRange([parseInt(e.target.value), heightRange[1]]))}
            />
            <input 
              type="range" 
              min={0} 
              max={Math.max(...filterOptions.heights, 200)} 
              step={5}
              value={heightRange[1]} 
              onChange={(e) => dispatch(setHeightRange([heightRange[0], parseInt(e.target.value)]))}
            />
          </div>
          <div className={styles.dimensionHint}>
            <span>от {heightRange[0]} см</span>
            <span>до {heightRange[1]} см</span>
          </div>
        </div>
      )}
    </>
  );
      case 'built-in-appliances':

      const seriesOptions = getSeriesOptions();
      const netWeightBounds = getNetWeightRange();
      const widthCmBounds = getWidthCmRange();
        return (
          <>

                   {/* Фильтр серии (series) */}
          {seriesOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <h4 className={styles.groupTitle}> <IconTag size={22}/>Серия</h4>
              <div className={styles.checkboxGroup}>
                {seriesOptions.map(option => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={series.includes(option)}
                      onChange={() => dispatch(setSeries(option))}
                    />
                    <span className={styles.checkmark}></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Фильтр веса нетто (net_weight) */}
          <div className={styles.filterGroup}>
            <h4 className={styles.groupTitle}><IconWeight size={22}/> Вес нетто (кг)</h4>
            <div className={styles.dimensionInputs}>
              <div className={styles.dimensionField}>
                <span>от</span>
                <input 
                  type="number" 
                  value={netWeightRange[0]} 
                  onChange={(e) => dispatch(setNetWeightRange([parseFloat(e.target.value) || 0, netWeightRange[1]]))}
                  min={netWeightBounds.min}
                  max={netWeightRange[1]}
                  step={1}
                />
              </div>
              <span className={styles.dimensionSeparator}>—</span>
              <div className={styles.dimensionField}>
                <span>до</span>
                <input 
                  type="number" 
                  value={netWeightRange[1]} 
                  onChange={(e) => dispatch(setNetWeightRange([netWeightRange[0], parseFloat(e.target.value) || 0]))}
                  min={netWeightRange[0]}
                  max={netWeightBounds.max}
                  step={1}
                />
              </div>
            </div>
            <div className={styles.dimensionRangeSlider}>
              <input 
                type="range" 
                min={netWeightBounds.min} 
                max={netWeightBounds.max} 
                step={1}
                value={netWeightRange[0]} 
                onChange={(e) => dispatch(setNetWeightRange([parseFloat(e.target.value), netWeightRange[1]]))}
              />
              <input 
                type="range" 
                min={netWeightBounds.min} 
                max={netWeightBounds.max} 
                step={1}
                value={netWeightRange[1]} 
                onChange={(e) => dispatch(setNetWeightRange([netWeightRange[0], parseFloat(e.target.value)]))}
              />
            </div>
            <div className={styles.dimensionHint}>
              <span>от {netWeightRange[0]} кг</span>
              <span>до {netWeightRange[1]} кг</span>
            </div>
          </div>
          
          {/* Фильтр ширины в см (width_cm) */}
          <div className={styles.filterGroup}>
            <h4 className={styles.groupTitle}><IconArrowsHorizontal size={22}/> Ширина (см)</h4>
            <div className={styles.dimensionInputs}>
              <div className={styles.dimensionField}>
                <span>от</span>
                <input 
                  type="number" 
                  value={widthCmRange[0]} 
                  onChange={(e) => dispatch(setWidthCmRange([parseFloat(e.target.value) || 0, widthCmRange[1]]))}
                  min={widthCmBounds.min}
                  max={widthCmRange[1]}
                  step={1}
                />
              </div>
              <span className={styles.dimensionSeparator}>—</span>
              <div className={styles.dimensionField}>
                <span>до</span>
                <input 
                  type="number" 
                  value={widthCmRange[1]} 
                  onChange={(e) => dispatch(setWidthCmRange([widthCmRange[0], parseFloat(e.target.value) || 0]))}
                  min={widthCmRange[0]}
                  max={widthCmBounds.max}
                  step={1}
                />
              </div>
            </div>
            <div className={styles.dimensionRangeSlider}>
              <input 
                type="range" 
                min={widthCmBounds.min} 
                max={widthCmBounds.max} 
                step={1}
                value={widthCmRange[0]} 
                onChange={(e) => dispatch(setWidthCmRange([parseFloat(e.target.value), widthCmRange[1]]))}
              />
              <input 
                type="range" 
                min={widthCmBounds.min} 
                max={widthCmBounds.max} 
                step={1}
                value={widthCmRange[1]} 
                onChange={(e) => dispatch(setWidthCmRange([widthCmRange[0], parseFloat(e.target.value)]))}
              />
            </div>
            <div className={styles.dimensionHint}>
              <span>от {widthCmRange[0]} см</span>
              <span>до {widthCmRange[1]} см</span>
            </div>
          </div>
           
            {filterOptions.controlTypes.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}>🎮 Управление</h4>
          <div className={styles.checkboxGroup}>
            {filterOptions.controlTypes.map(type => (
              <label key={type} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={controlType === type}
                  onChange={() => dispatch(setControlType(controlType === type ? '' : type))}
                />
                <span className={styles.checkmark}></span>
                {type}
              </label>
            ))}
          </div>
        </div>

            )}
          </>
        );
        
      case 'small-appliances':
        return (
          <>
            
            {filterOptions.volumes.length > 0 && (
              // <div className={styles.filterGroup}>
              //   <h4 className={styles.groupTitle}>📦 Объем (л)</h4>
              //   <div className={styles.rangeFilter}>
              //     <input
              //       type="range"
              //       min={0}
              //       max={Math.max(...filterOptions.volumes, 100)}
              //       step={1}
              //       value={volumeRange[1]}
              //       onChange={(e) => dispatch(setVolumeRange([0, parseInt(e.target.value)]))}
              //     />
              //     <div className={styles.rangeValues}>
              //       <span>до {volumeRange[1]} л</span>
              //     </div>
              //   </div>
              // </div>
              <>
              </>
            )}
          </>
        );
        
      case 'accessories':
        return (
          <div className={styles.filterGroup}>
            {/* <h4 className={styles.groupTitle}>🔧 Совместимость</h4>
            <div className={styles.checkboxGroup}>
              {['Homeier', 'Brandt', 'Liebherr', 'Nivona', 'De Dietrich', 'Kuppersbusch'].map(brandName => (
                <label key={brandName} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={compatibility.includes(brandName)}
                    onChange={() => dispatch(toggleCompatibility(brandName))}
                  />
                  <span className={styles.checkmark}></span>
                  {brandName}
                </label>
              ))}
            </div> */}
          </div>
        );
        
      case 'kitchen-blocks':
        return (
          <>
            {filterOptions.widths.length > 0 && (
              <div className={styles.filterGroup}>
                {/* <h4 className={styles.groupTitle}>📏 Ширина (см)</h4>
                <div className={styles.rangeFilter}>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(...filterOptions.widths, 200)}
                    step={5}
                    value={widthRange[1]}
                    onChange={(e) => dispatch(setWidthRange([0, parseInt(e.target.value)]))}
                  />
                  <div className={styles.rangeValues}>
                    <span>до {widthRange[1]} см</span>
                  </div>
                </div> */}
              </div>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Фильтры</h3>
        <button onClick={() => dispatch(resetFilters())} className={styles.resetBtn}>
          <IconTrash size={18}/> <p>Сбросить все</p>
        </button>
      </div>

      {/* Динамические фильтры для конкретной категории */}
      {renderDynamicFilters()}

      {/* Бренд / Производитель */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <IconBuildingFactory  size={22}/> Бренд
        </h4>
        <div className={styles.checkboxGroup}>
          {manufacturers.map(m => (
            <label key={m} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={manufacturer.includes(m.toLowerCase())} 
                onChange={() => dispatch(toggleManufacturer(m))}
              />
              <span className={styles.checkmark}></span>
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <IconCurrencyRubel  size={22}/> <p>Цена, ₽</p>
        </h4>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <span>от</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min={minProductPrice}
              max={priceRange[1]}
              step={1000}
            />
          </div>
          <span className={styles.priceSeparator}>—</span>
          <div className={styles.priceField}>
            <span>до</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min={priceRange[0]}
              max={maxProductPrice}
              step={1000}
            />
          </div>
        </div>
        <div className={styles.priceRangeSlider}>
          <input 
            type="range" 
            min={minProductPrice} 
            max={maxProductPrice} 
            step={1000}
            value={priceRange[0]} 
            onChange={(e) => handlePriceChange(0, e.target.value)}
          />
          <input 
            type="range" 
            min={minProductPrice} 
            max={maxProductPrice} 
            step={1000}
            value={priceRange[1]} 
            onChange={(e) => handlePriceChange(1, e.target.value)}
          />
        </div>
      </div>

            {/* ========== НОВЫЙ ФИЛЬТР СТАТУСА (всегда вверху) ========== */}
      {statusOptions.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}>
            <IconCircleCheck   size={22}/> Статус
          </h4>
        <div className={styles.checkboxGroup}>
          {statusOptions.map(m => (
            <label key={m} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={status.includes(m)} 
                onChange={() => dispatch(setStatus(m))}
              />
              <span className={styles.checkmark}></span>
              {m}
            </label>
          ))}
        </div>
        </div>
      )}

      {/* Цвет */}
      {colors.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}>
            <IconPalette size={22}/> <p>Цвет</p>
          </h4>
          <div className={styles.colorOptions}>
            <button
              className={`${styles.colorBtn} ${color === '' ? styles.active : ''}`}
              onClick={() => dispatch(setColor(''))}
            >
              Все
            </button>
            {colors.map(c => (
              <button
                key={c}
                className={`${styles.colorBtn} ${color === c ? styles.active : ''}`}
                onClick={() => dispatch(setColor(color === c ? '' : c))}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Активные фильтры */}
      {(manufacturer.length > 0 || color || brand || inStock !== null || 
        priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
        <div className={styles.activeFilters}>
          <h4>Активные фильтры:</h4>
          <div className={styles.activeFilterTags}>
            {manufacturer.map(m => (
              <span key={m} className={styles.filterTag} onClick={() => dispatch(toggleManufacturer(m))}>
                {m} ✕
              </span>
            ))}
            {color && (
              <span className={styles.filterTag} onClick={() => dispatch(setColor(''))}>
                Цвет: {color} ✕
              </span>
            )}
            {(priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
              <span className={styles.filterTag} onClick={() => dispatch(setPriceRange([minProductPrice, maxProductPrice]))}>
                {priceRange[0].toLocaleString()}₽ — {priceRange[1].toLocaleString()}₽ ✕
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;