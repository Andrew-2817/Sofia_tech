import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import Slider from '../components/Slider';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = useSelector(state => state.products.items.find(p => p.id === parseInt(id)));
  const allProducts = useSelector(state => state.products.items);
  const isFavorite = useSelector(state => state.favorites.items.includes(parseInt(id)));

  if (!product) return <div className="container">Товар не найден</div>;

  // Похожие товары по категории 2 уровня (первые 2 цифры ID)
  const similarProducts = allProducts.filter(p => {
    const pCategoryId = String(p.categoryId).slice(0, 2);
    const productCategoryId = String(product.categoryId).slice(0, 2);
    return pCategoryId === productCategoryId && p.id !== product.id;
  }).slice(0, 8);

  // Форматирование цены со скидкой
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Получение иконки для категории
  const getCategoryIcon = () => {
    const categoryId = product.categoryId;
    if (categoryId >= 100 && categoryId < 110) return '🧺';
    if (categoryId >= 110 && categoryId < 120) return '🌀';
    if (categoryId >= 120 && categoryId < 130) return '⚡';
    if (categoryId >= 130 && categoryId < 140) return '🧼';
    if (categoryId >= 140 && categoryId < 150) return '❄️';
    if (categoryId >= 200 && categoryId < 210) return '🔥';
    if (categoryId >= 210 && categoryId < 220) return '🍳';
    if (categoryId >= 220 && categoryId < 230) return '💨';
    if (categoryId >= 230 && categoryId < 240) return '☕';
    if (categoryId >= 240 && categoryId < 250) return '📡';
    if (categoryId >= 300 && categoryId < 310) return '☕';
    if (categoryId >= 310 && categoryId < 320) return '🔧';
    if (categoryId >= 320 && categoryId < 330) return '🥩';
    if (categoryId >= 330 && categoryId < 340) return '🧹';
    if (categoryId >= 340 && categoryId < 350) return '🥤';
    return '📦';
  };

  // Сбор всех характеристик
  const getAllSpecs = () => {
    const specs = [];
    
    // Основные характеристики
    if (product.manufacturer) specs.push({ key: 'Производитель', value: product.manufacturer, icon: '🏭' });
    if (product.color) specs.push({ key: 'Цвет', value: product.color, icon: '🎨' });
    if (product.energyClass) specs.push({ key: 'Класс энергоэффективности', value: product.energyClass, icon: '⚡' });
    
    // Габариты
    if (product.width) specs.push({ key: 'Ширина', value: `${product.width} см`, icon: '📏' });
    if (product.height) specs.push({ key: 'Высота', value: `${product.height} см`, icon: '📐' });
    if (product.depth) specs.push({ key: 'Глубина', value: `${product.depth} см`, icon: '📏' });
    
    // Для стиральных и сушильных машин
    if (product.loadCapacity) specs.push({ key: 'Загрузка', value: `${product.loadCapacity} кг`, icon: '⚖️' });
    if (product.spinSpeed) specs.push({ key: 'Скорость отжима', value: `${product.spinSpeed} об/мин`, icon: '🌀' });
    
    // Для посудомоечных машин
    if (product.placeSettings) specs.push({ key: 'Вместимость', value: `${product.placeSettings} комплектов`, icon: '🍽️' });
    
    // Для духовых шкафов
    if (product.volume) specs.push({ key: 'Объём', value: `${product.volume} л`, icon: '📦' });
    if (product.maxTemperature) specs.push({ key: 'Макс. температура', value: `${product.maxTemperature}°C`, icon: '🌡️' });
    
    // Для вытяжек
    if (product.maxPerformance) specs.push({ key: 'Производительность', value: `${product.maxPerformance} м³/ч`, icon: '💨' });
    if (product.noiseLevel) specs.push({ key: 'Уровень шума', value: `${product.noiseLevel} дБ`, icon: '🔊' });
    
    // Для варочных панелей
    if (product.zones) specs.push({ key: 'Конфорки', value: `${product.zones} шт`, icon: '🔥' });
    
    // Для кофемашин
    if (product.beanCapacity) specs.push({ key: 'Ёмкость для зёрен', value: `${product.beanCapacity} г`, icon: '🫘' });
    if (product.pressure) specs.push({ key: 'Давление помпы', value: `${product.pressure} бар`, icon: '💪' });
    
    // Для холодильников
    if (product.totalVolume) specs.push({ key: 'Общий объём', value: `${product.totalVolume} л`, icon: '❄️' });
    if (product.bottleCapacity) specs.push({ key: 'Вместимость', value: `${product.bottleCapacity} бутылок`, icon: '🍾' });
    if (product.temperatureZones) specs.push({ key: 'Температурные зоны', value: `${product.temperatureZones}`, icon: '🌡️' });
    
    return specs;
  };

  const specs = getAllSpecs();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ id: product.id }));
    }
  };

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
            onClick={() => navigate(`/catalog?level1=${product.categoryId >= 200 ? 2 : 1}`)} 
            className={styles.breadcrumbLink}
          >
            {product.categoryId >= 200 ? 'Встраиваемая техника' : 'Крупная бытовая техника'}
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.categoryName || product.category}</span>
        </div>

        <div className={styles.main}>
          {/* Левая колонка - изображение */}
          <div className={styles.imageSection}>
            <div className={styles.badges}>
              {product.isNew && <span className={styles.newBadge}>NEW</span>}
              {/* {product.isPopular && <span className={styles.popularBadge}>🔥 ХИТ</span>} */}
              {hasDiscount && <span className={styles.discountBadge}>-{discountPercent}%</span>}
              {product.isOutlet && <span className={styles.outletBadge}>OUTLET</span>}
            </div>
            <img src={product.image} alt={product.name} className={styles.mainImage} />
          </div>

          {/* Правая колонка - информация */}
          <div className={styles.infoSection}>
            <div className={styles.category}>
              <span className={styles.categoryIcon}>{getCategoryIcon()}</span>
              <span>{product.categoryName || product.category}</span>
            </div>
            
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceBlock}>
              {hasDiscount && (
                <span className={styles.oldPrice}>
                  {product.oldPrice.toLocaleString()} ₽
                </span>
              )}
              <div className={styles.priceWrapper}>
                <span className={hasDiscount ? styles.discountPrice : styles.price}>
                  {product.price.toLocaleString()} ₽
                </span>
                {hasDiscount && (
                  <span className={styles.saving}>
                    Экономия {(product.oldPrice - product.price).toLocaleString()} ₽
                  </span>
                )}
              </div>
            </div>

            {/* Краткие характеристики */}
            <div className={styles.shortSpecs}>
              {specs.slice(0, 4).map((spec, idx) => (
                <div key={idx} className={styles.shortSpec}>
                  <span className={styles.shortSpecIcon}>{spec.icon}</span>
                  <div>
                    <div className={styles.shortSpecKey}>{spec.key}</div>
                    <div className={styles.shortSpecValue}>{spec.value}</div>
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
              <button 
                className={styles.cartBtn} 
                onClick={handleAddToCart}
              >
                🛒 Добавить в корзину
              </button>
              <button 
                className={`${styles.favBtn} ${isFavorite ? styles.active : ''}`}
                onClick={() => dispatch(toggleFavorite(product.id))}
              >
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
            </div>

            {/* Доставка и гарантия */}
            {/* <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryIcon}>🚚</span>
                <div>
                  <div className={styles.deliveryTitle}>Доставка</div>
                  <div className={styles.deliveryText}>Бесплатно по Москве</div>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryIcon}>🔧</span>
                <div>
                  <div className={styles.deliveryTitle}>Гарантия</div>
                  <div className={styles.deliveryText}>12 месяцев</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Полные характеристики */}
        <div className={styles.fullSpecs}>
          <h2 className={styles.specsTitle}>📋 Полные характеристики</h2>
          <div className={styles.specsGrid}>
            {specs.map((spec, idx) => (
              <div key={idx} className={styles.specRow}>
                <div className={styles.specKey}>
                  <span className={styles.specIcon}>{spec.icon}</span>
                  {spec.key}
                </div>
                <div className={styles.specValue}>{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <div className={styles.description}>
            <h2 className={styles.descriptionTitle}>📖 Описание</h2>
            <p className={styles.descriptionText}>{product.description}</p>
          </div>
        )}

        {/* Похожие товары */}
        <Slider title="Похожие товары" products={similarProducts} />
      </div>
    </div>
  );
};

export default ProductPage;