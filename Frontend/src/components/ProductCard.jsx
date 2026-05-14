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

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // ИСПРАВЛЕНО: проверка избранного по составному ключу
  const isFavorite = useSelector(state => 
    state.favorites.items.some(fav => fav.id === product.id && fav.brandId === product.brand_id)
  );

  const imageUrl = product.main_image || product.image || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite({ 
      id: product.id, 
      brandId: product.brand_id 
    }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
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
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.brand_id}/${product.id}`}>
        <img src={`${API_BASE_URL_photo}${product.main_image}`} alt={product.name} className={styles.image}/>
        <div className={styles.category}>
          {product.brandName} • {product.groupLevel1 || product.model || 'Товар'}
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
      </Link>
      <div className={styles.actions}>
        <button onClick={handleToggleFavorite} className={styles.favBtn}>
          <img src={isFavorite ? fullfilledHeartIcon : heartIcon} alt="" /> 
        </button>
        <button onClick={handleAddToCart} className={styles.cartBtn}>
          <img src={basketIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;