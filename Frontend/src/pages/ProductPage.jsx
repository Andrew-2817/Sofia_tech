// pages/ProductPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { fetchAllProducts } from '../store/slices/productsSlice';
import { API_BASE_URL_photo } from '../services/api';
import Slider from '../components/Slider';
import styles from './ProductPage.module.css';
import heartIcon from '../assets/heart.svg';
import basketIcon from '../assets/basket.svg';
import fullfilledHeartIcon from "../assets/solid-heart.svg";
import LoadingSpinner from '../components/LoadingSpinner';
import { getDefaultProductImage } from '../data/mockData';

import skuIcon from "../assets/sku.svg"
import brandIcon from "../assets/brand.svg"


import {
  IconBuildingFactory,
  IconTag,
  IconCircleDot,
  IconArrowsHorizontal,
  IconArrowsVertical,
  IconArrowsMaximize,
  IconBottle,
  IconWeight,
  IconPackage,
  IconTool,
  IconShieldCheck,
  IconList,
  IconSettings,
  IconPalette,
  IconSparkles,
  IconCalendar,
  IconCategory,
  IconFileDescription,
  IconZoomQuestion,
  IconClipboardList,
  IconMessageCircle,
  IconNotes,
  IconWind,
  IconVolume,
  IconTruck,
  IconBarcode,
  IconDoor,
  IconLayoutList,
  IconChartBar,
  IconCurrencyRubel,
  IconCircleCheck, IconFireHydrant,
  IconBasket,
IconHeart, IconHeartFilled
} from '@tabler/icons-react';


const ProductPage = () => {
  const { brand, sku } = useParams();; // получаем brandId и id из URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { items: allProducts, loading } = useSelector(state => state.products);
  const favorites = useSelector(state => state.favorites.items);
  // Поиск товара по комбинации id + brandId
  console.log(allProducts.filter(el => el.main_image === null));
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  
  // Загружаем товары, если их нет
  useEffect(() => {
    if (allProducts.length === 0 && !loading) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProducts.length, loading]);


  const product = allProducts.find(p =>
  p.brand === brand &&
  (p.sku?.toLowerCase() === sku || p.model?.toLowerCase() === sku)
);
  
if (isPageLoading || loading && allProducts.length === 0) {
  return <div className="container">Загрузка...</div>;
}

if (!product) {
  return <div className="container">Товар не найден</div>;
}
const isFavorite = favorites.some(fav => fav.id === product.id && fav.brandId === product.brandId);
  
  
  // Похожие товары (по бренду или категории)
  const similarProducts = allProducts.filter(p => {
    return (p.brandId === product.brandId || p.categoryId === product.categoryId) 
      && !(p.brand === brand && (p.sku?.toLowerCase() === sku || p.model?.toLowerCase() === sku));
  }).slice(0, 8);
  
  // Формируем характеристики в зависимости от бренда
// ProductPage.jsx - обновите функцию getProductSpecs

const getProductSpecs = () => {
  const specs = [];

  const add = (key, value, Icon) => {
    if (value !== undefined && value !== null && value !== '' 
        && value !== 'null' && value !== 'undefined') {
      specs.push({ key, value, Icon });
    }
  };

  // Основные
  add('Бренд', product.brandName, IconBuildingFactory);
  add('Артикул', product.sku || product.model || product.ean, IconTag);
  if (product.model) add('Модель', product.model, IconCircleDot);
  if (product.ean)   add('EAN', product.ean, IconBarcode);
  if (product.status) add('Статус', product.status, IconCircleCheck);

  // Габариты
  const width = product.width_cm || product.width;
  if (width) add('Ширина', `${width} см`, IconArrowsHorizontal);
  if (product.height) add('Высота', `${product.height} см`, IconArrowsVertical);
  if (product.depth)  add('Глубина', `${product.depth} см`, IconArrowsMaximize);
  if (product.volume) add('Объём', `${product.volume} л`, IconBottle);

  // Вес
  if (product.net_weight) {
    const w = parseFloat(product.net_weight);
    if (!isNaN(w)) add('Вес нетто', `${w} кг`, IconWeight);
  }
  if (product.gross_weight) {
    const w = parseFloat(product.gross_weight);
    if (!isNaN(w)) add('Вес брутто', `${w} кг`, IconPackage);
  }

  // Техника
  if (product.factory)      add('Тип установки', product.factory, IconTool);
  if (product.warranty) {
    const yr = product.warranty;
    const label = `${yr} ${yr === 1 ? 'год' : yr < 5 ? 'года' : 'лет'}`;
    add('Гарантия', label, IconShieldCheck);
  }
  if (product.series)        add('Серия', product.series, IconList);
  if (product.control_type)  add('Тип управления', product.control_type, IconSettings);

  // Дизайн
  if (product.color)  add('Цвет', product.color, IconPalette);
  if (product.design) add('Дизайн', product.design, IconSparkles);

  // Производство
  if (product.production_start) add('Производство', product.production_start, IconCalendar);
  if (product.category_name)    add('Категория', product.category_name, IconCategory);

  // Описание
  if (product.specifications && product.specifications !== product.description)
    add('Технические характеристики', product.specifications, IconClipboardList);
  if (product.functionality) add('Функционал', product.functionality, IconZoomQuestion);
  if (product.programs)      add('Программы', product.programs, IconClipboardList);
  if (product.comment)       add('Комментарий', product.comment, IconMessageCircle);
  if (product.description && product.brand_id !== 1)
    add('Описание', product.description, IconNotes);

  // Falmec
  if (product.mounting_type)    add('Тип монтажа', product.mounting_type, IconTool);
  if (product.performance_m3h)  add('Производительность', `${product.performance_m3h} м³/ч`, IconWind);
  if (product.min_noise_db)     add('Минимальный шум', `${product.min_noise_db} дБ`, IconVolume);
  if (product.supply_program)   add('Программа поставки', product.supply_program, IconTruck);
  if (product.manufacturer_code) add('Код производителя', product.manufacturer_code, IconBarcode);

  // Teka
  if (product.dmd_quantity)      add('DMD количество', product.dmd_quantity, IconChartBar);
  if (product.dmd_perup_quantity) add('DMD PERUP количество', product.dmd_perup_quantity, IconChartBar);

  // Kuppersbusch
  if (product.door_hinge)    add('Навеска дверцы', product.door_hinge, IconDoor);
  if (product.product_group) add('Группа товара', product.product_group, IconLayoutList);
  if (product.line)          add('Линейка', product.line, IconChartBar);

  return specs;
};
  
  const specs = getProductSpecs();
  // const imageUrl = `${API_BASE_URL_photo}${product.main_image}`
  
// ProductPage.jsx - обновленный handleAddToCart
const handleAddToCart = () => {
  console.log(product);
  
  for (let i = 0; i < quantity; i++) {
    dispatch(addToCart({ 
      id: product.id,
      brandId: product.brandId,
      name: product.name,
      price: product.price,
      image:  product.main_image || product.image,
      sku: product.sku || product.model,
      brandName: product.brandName || (product.brand_id === 1 ? 'Homeier' : 'Brandt'),
      color: product.color || null,
      model: product.model || null,
    }));
  }
};


const imageUrl = product.main_image !== null
  ? `${API_BASE_URL_photo}${product.main_image}`
  : getDefaultProductImage(product.categoryId);
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ 
      id: product.id,
      brandId: product.brandId
    }));
  };


  // if (isPageLoading) {
  //   return <LoadingSpinner text="Загрузка товара..." />;
  // }
  
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
              <img src={imageUrl} alt={product.name} className={styles.mainImage} />
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
          {specs.slice(0, 3).map((spec, idx) => (
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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => setQuantity(quantity + 1)}
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