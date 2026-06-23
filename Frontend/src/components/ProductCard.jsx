// components/ProductCard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import styles from './ProductCard.module.css';
import heartIcon from '../assets/heart.svg';
import basketIcon from '../assets/basket.svg';
import fullfilledHeartIcon from "../assets/solid-heart.svg";
import { API_BASE_URL_photo } from '../services/api';
import { getDefaultProductImage } from '../data/mockData';

import {
  IconBasket,
IconHeart, IconHeartFilled
} from '@tabler/icons-react';



const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // ИСПРАВЛЕНО: проверка избранного по составному ключу
  const isFavorite = useSelector(state => 
    state.favorites.items.some(fav => fav.id === product.id && fav.brandId === product.brandId)
  );

  // const imageUrl = product.main_image || product.image || 'https://via.placeholder.com/300x300?text=No+Image';
  // console.log(product);
  
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite({ 
      id: product.id, 
      brandId: product.brandId 
    }));
  };

  const imageUrl = product.main_image!= null 
    ? `${API_BASE_URL_photo}${product.main_image}`
    : getDefaultProductImage(product.categoryId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    // console.log('product перед добавлением:', product); //
    dispatch(addToCart({ 
      id: product.id,
      brandId: product.brandId,
      name: product.name,
      price: product.price,
      image: product.main_image || product.image,
      sku: product.sku || product.model,
      brandName: product.brandName || (product.brand_id === 1 ? 'Homeier' : 'Brandt'),
      color: product.color || null,
      model: product.model || null,
    }));
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.brand}/${product.id}`}>
        <img src={imageUrl} alt={product.name} className={styles.image}/>
        <div className={styles.category}>
          {product.brandName}
        </div>
        <h3 className={styles.name}>
          {product.name.length > 100 ? product.name.slice(0, 100) + '...' : product.name}
        </h3>
        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
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
};

export default ProductCard; 