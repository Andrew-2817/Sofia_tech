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


const ProductPage = () => {
  const { brandId, id } = useParams(); // получаем brandId и id из URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { items: allProducts, loading } = useSelector(state => state.products);
  const favorites = useSelector(state => state.favorites.items);
  // Поиск товара по комбинации id + brandId
  const product = allProducts.find(p => {
    return String(p.id) === String(id) && String(p.brandId) === String(brandId);
  });
  
  const isFavorite = (productId, brandId) => {
    return favorites.some(fav => fav.id === productId && fav.brandId === brandId);
  };

  
  // Загружаем товары, если их нет
  useEffect(() => {
    if (allProducts.length === 0 && !loading) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProducts.length, loading]);
  
  if (loading && allProducts.length === 0) {
    return <div className="container">Загрузка...</div>;
  }
  
  if (!product) {
    return <div className="container">Товар не найден</div>;
  }
  
  // Похожие товары (по бренду или категории)
  const similarProducts = allProducts.filter(p => {
    return (p.brand_id === product.brand_id || p.category_id === product.category_id) 
      && !(String(p.id) === String(id) && String(p.brand_id) === String(brandId));
  }).slice(0, 8);
  
  // Формируем характеристики в зависимости от бренда
  const getProductSpecs = () => {
    const specs = [];
    
    // Общие для всех
    specs.push({ key: 'Бренд', value: product.brand_id === 1 ? 'Homeier' : 'Brandt', icon: '🏭' });
    specs.push({ key: 'Артикул', value: product.sku || product.model || '—', icon: '🔖' });
    
    // if (product.description) {
    //   specs.push({ key: 'Описание', value: product.description, icon: '📝' });
    // }
    
    // Характеристики для Homeier (brand_id = 1)
    if (product.brand_id === 1) {
      if (product.color) specs.push({ key: 'Цвет', value: product.color, icon: '🎨' });
      if (product.width) specs.push({ key: 'Ширина', value: `${product.width} см`, icon: '📏' });
      if (product.height) specs.push({ key: 'Высота', value: `${product.height} см`, icon: '📐' });
      if (product.depth) specs.push({ key: 'Глубина', value: `${product.depth} см`, icon: '📏' });
      if (product.volume) specs.push({ key: 'Объём', value: `${product.volume} л`, icon: '📦' });
      if (product.net_weight) specs.push({ key: 'Вес нетто', value: `${product.net_weight} кг`, icon: '⚖️' });
      if (product.gross_weight) specs.push({ key: 'Вес брутто', value: `${product.gross_weight} кг`, icon: '📦' });
      if (product.comment) specs.push({ key: 'Комментарий', value: product.comment, icon: '💬' });
    }
    
    // Характеристики для Brandt (brand_id = 2)
    if (product.brand_id === 2) {
      if (product.model) specs.push({ key: 'Модель', value: product.model, icon: '🔢' });
      if (product.design) specs.push({ key: 'Дизайн', value: product.design, icon: '🎨' });
      if (product.specifications && product.specifications !== product.description) {
        specs.push({ key: 'Технические характеристики', value: product.specifications, icon: '⚙️' });
      }
      if (product.comment) specs.push({ key: 'Примечание', value: product.comment, icon: '💬' });
    }
    
    return specs;
  };
  
  const specs = getProductSpecs();
  const imageUrl = `${API_BASE_URL_photo}${product.main_image}`
  
// ProductPage.jsx - обновленный handleAddToCart
const handleAddToCart = () => {
  for (let i = 0; i < quantity; i++) {
    dispatch(addToCart({ 
      id: product.id,
      brandId: product.brand_id,
      name: product.name,
      price: product.price,
      image: product.main_image || product.image,
      sku: product.sku || product.model,
      brandName: product.brandName || (product.brand_id === 1 ? 'Homeier' : 'Brandt'),
      color: product.color || null,
      model: product.model || null,
    }));
  }
};
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ 
      id: product.id,
      brandId: product.brand_id
    }));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <LoadingSpinner text="Загрузка товара..." />;
  }
  
  return (
    <div className="container">
      <div className={styles.productPage}>
        {/* Хлебные крошки */}
        <div className={styles.breadcrumbs}>
          <button onClick={() => navigate('/')} className={styles.breadcrumbLink}>
            Главная
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <button 
            onClick={() => navigate('/catalog')} 
            className={styles.breadcrumbLink}
          >
            Каталог
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {product.brand_id === 1 ? 'Homeier' : 'Brandt'}
          </span>
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
              <span>{product.brand_id === 1 ? 'Homeier' : 'Brandt'}</span>
            </div>
            
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceBlock}>
              <div className={styles.priceWrapper}>
                <span className={styles.price}>
                  {product.price.toLocaleString()} ₽
                </span>
              </div>
            </div>

            {/* Краткие характеристики (первые 3) */}
            <div className={styles.shortSpecs}>
              {specs.slice(0, 3).map((spec, idx) => (
                <div key={idx} className={styles.shortSpec}>
                  <span className={styles.shortSpecIcon}>{spec.icon}</span>
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
            </div>

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
                <img src={basketIcon} alt="" /> 
                <p>Добавить в корзину</p>
              </button>
              <button 
                className={`${styles.favBtn} ${isFavorite ? styles.active : ''}`}
                onClick={handleToggleFavorite}
              >
                <img src={isFavorite ? fullfilledHeartIcon : heartIcon} alt="" />
                <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Полные характеристики */}
        {specs.length > 0 && (
          <div className={styles.fullSpecs}>
            <div className={styles.specsHeader}>
              <h2 className={styles.specsTitle}>
                📋 Характеристики
                <span className={styles.specsCount}>{specs.length}</span>
              </h2>
            </div>
            <div className={styles.specsGrid}>
              {specs.map((spec, idx) => (
                <div key={idx} className={styles.specRow}>
                  <div className={styles.specKey}>
                    <span className={styles.specIcon}>{spec.icon}</span>
                    <span className={styles.specKeyText}>{spec.key}</span>
                  </div>
                  <div className={styles.specValue}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
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