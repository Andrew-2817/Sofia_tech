// components/ProductCard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import styles from './ProductCard.module.css';
import { API_BASE_URL_photo } from '../services/api';
import { getDefaultProductImage } from '../data/mockData';
import { memo, useCallback, useMemo } from 'react';

import {
  IconBasket,
  IconHeart, 
  IconHeartFilled
} from '@tabler/icons-react';

// Вынесено из компонента для кеширования
const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

const ProductCard = memo(({ product }) => {
  const dispatch = useDispatch();

  // 1. ОПТИМИЗАЦИЯ useSelector — выбираем только нужное
  const isFavorite = useSelector(
    state => state.favorites.items.some(
      fav => fav.id === product.id && fav.brandId === product.brandId
    ),
    // Кастомное сравнение для предотвращения лишних рендеров
    (prev, next) => prev === next
  );

  // 2. КЕШИРОВАНИЕ URL ИЗОБРАЖЕНИЯ
  const imageUrl = useMemo(() => {
    if (product.main_image) {
      return `${API_BASE_URL_photo}${product.main_image}`;
    }
    if (product.image) {
      return product.image;
    }
    return getDefaultProductImage(product.categoryId) || FALLBACK_IMAGE;
  }, [product.main_image, product.image, product.categoryId]);

  // 3. КЕШИРОВАНИЕ ОБРЕЗАННОГО НАЗВАНИЯ
  const displayName = useMemo(() => {
    return product.name.length > 100 
      ? product.name.slice(0, 100) + '...' 
      : product.name;
  }, [product.name]);

  // 4. КЕШИРОВАНИЕ ЦЕНЫ (форматирование)
  const formattedPrice = useMemo(() => {
    return product.price.toLocaleString();
  }, [product.price]);

  // 5. КЕШИРОВАНИЕ ФУНКЦИЙ
  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    dispatch(toggleFavorite({ 
      id: product.id, 
      brandId: product.brandId 
    }));
  }, [dispatch, product.id, product.brandId]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    dispatch(addToCart({ 
      id: product.id,
      brandId: product.brandId,
      name: product.name,
      price: product.price,
      image: product.main_image || product.image,
      sku: product.sku || product.model,
      brandName: product.brandName || (product.brandId === 1 ? 'Homeier' : 'Brandt'),
      color: product.color || null,
      model: product.model || null,
    }));
  }, [dispatch, product]);

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.brand}/${product.id}`}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          className={styles.image} 
          loading="lazy"
          width={300}
          height={300}
        />
        <div className={styles.category}>
          {product.brandName}
        </div>
        <h3 className={styles.name}>{displayName}</h3>
        <p className={styles.price}>{formattedPrice} ₽</p>
      </Link>
      <div className={styles.actions}>
        <button onClick={handleToggleFavorite} className={styles.favBtn}>
          {isFavorite ? <IconHeartFilled size={25} /> : <IconHeart size={25}/>}
        </button>
        <button onClick={handleAddToCart} className={styles.cartBtn}>
          <IconBasket size={25} />
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;