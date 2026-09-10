// pages/ProductPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { fetchAllProducts } from '../store/slices/productsSlice';
import { API_BASE_URL_photo } from '../services/api';
import Slider from '../components/Slider';
import styles from './ProductPage.module.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDefaultProductImage } from '../data/mockData';

import {
  IconBuildingFactory, IconTag, IconCircleDot, IconArrowsHorizontal,
  IconArrowsVertical, IconArrowsMaximize, IconBottle, IconWeight,
  IconPackage, IconTool, IconShieldCheck, IconList, IconSettings,
  IconPalette, IconSparkles, IconCalendar, IconCategory, IconNotes,
  IconClipboardList, IconMessageCircle, IconWind, IconVolume,
  IconTruck, IconBarcode, IconDoor, IconLayoutList, IconChartBar,
  IconCircleCheck, IconBasket, IconHeart, IconHeartFilled
} from '@tabler/icons-react';

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (вынесены из компонента) ==========
const addSpec = (specs, key, value, Icon) => {
  if (value !== undefined && value !== null && value !== '' 
      && value !== 'null' && value !== 'undefined') {
    specs.push({ key, value, Icon });
  }
};

const formatWarranty = (years) => {
  if (!years) return null;
  const yr = parseInt(years);
  if (isNaN(yr)) return null;
  return `${yr} ${yr === 1 ? 'год' : yr < 5 ? 'года' : 'лет'}`;
};

const formatWeight = (weight) => {
  if (!weight) return null;
  const w = parseFloat(weight);
  if (isNaN(w)) return null;
  return `${w} кг`;
};

const ProductPage = () => {
  const { brand, sku } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { items: allProducts, loading } = useSelector(state => state.products);
  const favorites = useSelector(state => state.favorites.items);

  // Загрузка страницы с анимацией
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Загрузка товаров
  useEffect(() => {
    if (allProducts.length === 0 && !loading) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProducts.length, loading]);

  // 1. ПОИСК ТОВАРА (кешируется)
  const product = useMemo(() => {
    return allProducts.find(p =>
      p.brand === brand && String(p.id) === String(sku)
    );
  }, [allProducts, brand, sku]);

  // 2. ПРОВЕРКА ИЗБРАННОГО (кешируется)
  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.some(fav => fav.id === product.id && fav.brandId === product.brandId);
  }, [favorites, product]);

  // 3. URL ИЗОБРАЖЕНИЯ (кешируется)
  const imageUrl = useMemo(() => {
    if (!product) return '';
    return product.main_image !== null && product.main_image !== undefined
      ? `${API_BASE_URL_photo}${product.main_image}`
      : getDefaultProductImage(product.categoryId);
  }, [product]);

  // 4. СПЕЦИФИКАЦИИ (кешируются)
  const specs = useMemo(() => {
    if (!product) return [];
    const specsList = [];

    // Основные
    addSpec(specsList, 'Бренд', product.brandName, IconBuildingFactory);
    addSpec(specsList, 'Артикул', product.sku || product.model || product.ean, IconTag);
    addSpec(specsList, 'Модель', product.model, IconCircleDot);
    addSpec(specsList, 'EAN', product.ean, IconBarcode);
    addSpec(specsList, 'Статус', product.status, IconCircleCheck);

    // Габариты
    const width = product.width_cm || product.width;
    addSpec(specsList, 'Ширина', width ? `${width} см` : null, IconArrowsHorizontal);
    addSpec(specsList, 'Высота', product.height ? `${product.height} см` : null, IconArrowsVertical);
    addSpec(specsList, 'Глубина', product.depth ? `${product.depth} см` : null, IconArrowsMaximize);
    addSpec(specsList, 'Объём', product.volume ? `${product.volume} л` : null, IconBottle);

    // Вес
    const netWeight = formatWeight(product.weight || product.net_weight);
    addSpec(specsList, 'Вес нетто', netWeight, IconWeight);
    addSpec(specsList, 'Вес брутто', product.gross_weight ? `${product.gross_weight} кг` : null, IconPackage);

    // Техника
    addSpec(specsList, 'Тип установки', product.factory || product.mounting_type, IconTool);
    const warrantyLabel = formatWarranty(product.warranty);
    addSpec(specsList, 'Гарантия', warrantyLabel, IconShieldCheck);
    addSpec(specsList, 'Серия', product.series, IconList);
    addSpec(specsList, 'Тип управления', product.control_type, IconSettings);

    // Дизайн
    addSpec(specsList, 'Цвет', product.color, IconPalette);
    addSpec(specsList, 'Дизайн', product.design, IconSparkles);

    // Производство
    addSpec(specsList, 'Производство', product.production_start, IconCalendar);
    addSpec(specsList, 'Категория', product.category_name, IconCategory);

    // Описание
    if (product.specifications && product.specifications !== product.description) {
      addSpec(specsList, 'Технические характеристики', product.specifications, IconClipboardList);
    }
    addSpec(specsList, 'Функционал', product.functionality, IconClipboardList);
    addSpec(specsList, 'Программы', product.programs, IconClipboardList);
    addSpec(specsList, 'Комментарий', product.comment, IconMessageCircle);
    
    if (product.description && product.brand_id !== 1) {
      addSpec(specsList, 'Описание', product.description, IconNotes);
    }

    // Falmec
    addSpec(specsList, 'Производительность', product.performance_m3h ? `${product.performance_m3h} м³/ч` : null, IconWind);
    addSpec(specsList, 'Минимальный шум', product.min_noise_db ? `${product.min_noise_db} дБ` : null, IconVolume);
    addSpec(specsList, 'Программа поставки', product.supply_program, IconTruck);
    addSpec(specsList, 'Код производителя', product.manufacturer_code, IconBarcode);

    // Другие бренды
    addSpec(specsList, 'Навеска дверцы', product.door_hinge, IconDoor);
    addSpec(specsList, 'Группа товара', product.product_group, IconLayoutList);
    addSpec(specsList, 'Линейка', product.line, IconChartBar);

    return specsList;
  }, [product]);

  // 5. ПОХОЖИЕ ТОВАРЫ (кешируются)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => {
      return (p.brandId === product.brandId || p.categoryId === product.categoryId) 
        && p.id !== product.id;
    }).slice(0, 8);
  }, [allProducts, product]);

  // 6. КЕШИРОВАНИЕ ФУНКЦИЙ
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ 
        id: product.id,
        brandId: product.brandId,
        name: product.name,
        price: product.price,
        image: product.main_image || product.image,
        sku: product.sku || product.model,
        brandName: product.brandName,
        color: product.color || null,
        model: product.model || null,
      }));
    }
  }, [dispatch, product, quantity]);

  const handleToggleFavorite = useCallback(() => {
    if (!product) return;
    dispatch(toggleFavorite({ 
      id: product.id,
      brandId: product.brandId
    }));
  }, [dispatch, product]);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  if (isPageLoading || (loading && allProducts.length === 0)) {
    return <LoadingSpinner text="Загрузка товара..." />;
  }

  if (!product) {
    return <div className="container">Товар не найден</div>;
  }

  // Первые 3 характеристики для краткого отображения
  const shortSpecs = specs.slice(0, 3);

  return (
    <div className="container">
      <div className={styles.productPage}>
        {/* Хлебные крошки */}
        <div className={styles.breadcrumbs}>
          <button onClick={() => navigate('/')} className={styles.breadcrumbLink}>
            Главная
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <button onClick={() => navigate('/catalog')} className={styles.breadcrumbLink}>
            Каталог
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.brandName}</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>

        <div className={styles.main}>
          {/* Левая колонка - изображение */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={imageUrl} 
                alt={product.name} 
                className={styles.mainImage}
                width={500}
                height={500}
                loading="eager"
              />
            </div>
          </div>

          {/* Правая колонка - информация */}
          <div className={styles.infoSection}>
            <div className={styles.category}>
              <span>{product.brandName}</span>
            </div>
            
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceBlock}>
              <div className={styles.priceWrapper}>
                <span className={styles.price}>
                  {product.price.toLocaleString()} ₽
                </span>
              </div>
            </div>

            {/* Краткие характеристики */}
            {shortSpecs.map((spec, idx) => (
              <div key={idx} className={styles.shortSpec}>
                <span className={styles.shortSpecIcon}>
                  <spec.Icon size={18} stroke={1.5} />
                </span>
                <div className={styles.shortSpecContent}>
                  <div className={styles.shortSpecKey}>{spec.key}</div>
                  <div className={styles.shortSpecValue}>
                    {typeof spec.value === 'string' && spec.value.length > 50
                      ? spec.value.slice(0, 50) + '...'
                      : spec.value}
                  </div>
                </div>
              </div>
            ))}

            {/* Выбор количества */}
            <div className={styles.quantitySection}>
              <div className={styles.quantityLabel}>Количество:</div>
              <div className={styles.quantityControl}>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className={styles.buttons}>
              <button className={styles.cartBtn} onClick={handleAddToCart}>
                <IconBasket size={25} /> 
                <p>Добавить в корзину</p>
              </button>
              <button 
                className={`${styles.favBtn} ${isFavorite ? styles.active : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <IconHeartFilled size={25} /> : <IconHeart size={25}/>}
                <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Полные характеристики */}
        {specs.length > 0 && (
          <>
            <h2 className={styles.specsTitle}>
              <IconClipboardList size={22} stroke={1.5} />
              Характеристики
              <span className={styles.specsCount}>{specs.length}</span>
            </h2>

            {specs.map((spec, idx) => (
              <div key={idx} className={styles.specRow}>
                <div className={styles.specKey}>
                  <span className={styles.specIcon}>
                    <spec.Icon size={16} stroke={1.5} />
                  </span>
                  <span className={styles.specKeyText}>{spec.key}</span>
                </div>
                <div className={styles.specValue}>{spec.value}</div>
              </div>
            ))}
          </>
        )}

        {/* Описание для Homeier */}
        {product.brand_id === 1 && product.description && (
          <div className={styles.descriptionSection}>
            <div className={styles.descriptionHeader}>
              <h2 className={styles.descriptionTitle}>📖 Описание товара</h2>
            </div>
            <div className={styles.descriptionContent}>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          </div>
        )}

        {/* Похожие товары */}
        {similarProducts.length > 0 && (
          <Slider title="Похожие товары" products={similarProducts} />
        )}
      </div>
    </div>
  );
};

export default ProductPage;