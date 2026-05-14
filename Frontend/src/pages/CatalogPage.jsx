import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { setSearchQuery, setFilters } from '../store/slices/filtersSlice';
import { fetchAllProducts } from '../store/slices/productsSlice'; // Импортируем thunk
import styles from './CatalogPage.module.css';
import LoadingSpinner from '../components/LoadingSpinner';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: allProducts, loading: productsLoading } = useSelector(state => state.products);
  const { searchQuery, manufacturer, priceRange, color, loadCapacity, energyClass } = useSelector(state => state.filters);
  const { tree: categories, loading: categoriesLoading } = useSelector(state => state.categories);
  // console.log(allProducts.filter(e => e.id === 137));
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

  // Данные для баннеров категорий (можно вынести в отдельный файл)
  const categoryBanners = {
    // Категории 1 уровня
    'large-appliances': {
      title: 'Крупная бытовая техника',
      description: 'Широкий выбор стиральных машин, холодильников, посудомоечных машин и другой крупной бытовой техники от ведущих производителей. Высокое качество, надежность и доступные цены.',
      image: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=1200',
      bgColor: '#7bc6cf'
    },
    'built-in-appliances': {
      title: 'Встраиваемая техника',
      description: 'Идеальное решение для современной кухни. Духовые шкафы, варочные поверхности, вытяжки и кофемашины, которые идеально впишутся в ваш интерьер.',
      image: 'https://images.unsplash.com/photo-1556909172-5457c8c4f165?w=1200',
      bgColor: '#ff9f43'
    },
    'small-appliances': {
      title: 'Мелкая бытовая техника',
      description: 'Кофемашины, блендеры, пылесосы и другая техника для комфортной жизни. Компактные размеры и высокая функциональность.',
      image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=1200',
      bgColor: '#a55eea'
    },
    'accessories': {
      title: 'Аксессуары',
      description: 'Оригинальные аксессуары и комплектующие для вашей техники. Фильтры, направляющие, чистящие средства и многое другое.',
      image: 'https://images.unsplash.com/photo-1585672284549-7b2cb6aedfc5?w=1200',
      bgColor: '#eb4d4b'
    },
    'kitchen-blocks': {
      title: 'Кухонные блоки ILVE',
      description: 'Премиальные кухонные блоки итальянского бренда ILVE. Сочетание стиля, мощности и функциональности для вашей кухни.',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406efc0c2?w=1200',
      bgColor: '#20bf6b'
    },
  };

// Функция для проверки принадлежности товара к категории
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

// Вспомогательная функция для поиска категории по id
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
    const params = new URLSearchParams(location.search);
    const level1Slug = params.get('level1');
    const level2Slug = params.get('category');
    const level3Id = params.get('subcategory');
    
    // Если есть level1 в URL
    if (level1Slug) {
      const foundLevel1 = categories.find(c => c.slug === level1Slug);
      if (foundLevel1) {
        setLevel1Category(foundLevel1);
        setActiveLevel1(foundLevel1.id);
        updateBanner(foundLevel1);
        setLevel2CategoriesForTabs(foundLevel1.children || []);
        setLevel2Category(null);
        setActiveLevel2(null);
        setLevel3Categories([]);
        setActiveLevel3(null);
      }
    }
    
    // Если есть level2 в URL
    if (level2Slug) {
      let foundLevel2 = null;
      let foundLevel1ForLevel2 = null;
      
      for (const cat1 of categories) {
        for (const cat2 of cat1.children || []) {
          if (cat2.slug === level2Slug) {
            foundLevel2 = cat2;
            foundLevel1ForLevel2 = cat1;
            break;
          }
        }
        if (foundLevel2) break;
      }
      
      if (foundLevel2) {
        setLevel1Category(foundLevel1ForLevel2);
        setActiveLevel1(foundLevel1ForLevel2?.id);
        setLevel2Category(foundLevel2);
        setActiveLevel2(foundLevel2.id);
        // updateBanner(foundLevel2);
        setLevel3Categories(foundLevel2.children || []);
        
        if (level3Id) {
          const foundLevel3 = foundLevel2.children?.find(c => c.id === parseInt(level3Id));
          if (foundLevel3) {
            setActiveLevel3(foundLevel3.id);
            // setCurrentCategoryName(foundLevel3.name);
          }
        }
      }
    }
  }, [location.search, categories]);

  // Фильтрация товаров
const filteredProducts = allProducts.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  
  let matchesCategory = true;
  console.log(activeLevel3);
  
  if (activeLevel3) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel3, categories);
    console.log(matchesCategory);
    
  } else if (activeLevel2) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel2, categories);
  } else if (activeLevel1) {
    matchesCategory = isProductInCategory(product.categoryId, activeLevel1, categories);
  }
  
  const matchesManufacturer = manufacturer.length === 0 || manufacturer.includes(product.brand);
  const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
  const matchesColor = color === '' || product.color === color;
  
  // ВРЕМЕННО ОТКЛЮЧАЮ
  const matchesLoadCapacity = true;
  const matchesEnergyClass = true;
  
  return matchesSearch && matchesCategory && matchesManufacturer && matchesPrice && matchesColor;
});
console.log(filteredProducts);


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
    navigate(`/catalog?level1=${level1.slug}`);
  };

  // Обработка клика по категории 2 уровня
  const handleLevel2Click = (level2) => {
    setActiveLevel2(level2.id);
    setActiveLevel3(null);
    setLevel2Category(level2);
    // updateBanner(level2);
    setLevel3Categories(level2.children || []);
    navigate(`/catalog?level1=${level1Category?.slug}&category=${level2.slug}`);
  };

  // Обработка клика по категории 3 уровня
  const handleLevel3Click = (level3) => {
    setActiveLevel3(level3.id);
    // setCurrentCategoryName(level3.name);
    navigate(`/catalog?level1=${level1Category?.slug}&category=${level2Category?.slug}&subcategory=${level3.id}`);
  };

  // Возврат к категории 2 уровня
  const handleBackToLevel2 = () => {
    setActiveLevel3(null);
    // if (level2Category) {
    //   updateBanner(level2Category);
    // }
    navigate(`/catalog?level1=${level1Category?.slug}&category=${level2Category?.slug}`);
  };

  // Возврат к категории 1 уровня
  const handleBackToLevel1 = () => {
    setActiveLevel2(null);
    setActiveLevel3(null);
    setLevel2Category(null);
    setLevel3Categories([]);
    if (level1Category) {
      updateBanner(level1Category);
    }
    navigate(`/catalog?level1=${level1Category?.slug}`);
  };
  console.log('=== DEBUG INFO ===');
console.log('categories loading:', categoriesLoading);
console.log('categories length:', categories.length);
console.log('allProducts loading:', productsLoading);
console.log('allProducts length:', allProducts.length);
console.log('location.search:', location.search);
console.log('=================');
console.log('level2CategoriesForTabs:', level2CategoriesForTabs);
console.log('activeLevel1:', activeLevel1);
console.log('activeLevel2:', activeLevel2);
console.log("level3", level3Categories);

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
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
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
                  <span className={styles.tabIcon}>
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
                  </span>
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
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={styles.productItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

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