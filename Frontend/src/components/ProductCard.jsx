import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import styles from './ProductCard.module.css';
import heartIcon from '../assets/heart.svg'
import basketIcon from '../assets/basket.svg'
import fullfilledHeartIcon from "../assets/solid-heart.svg"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => state.favorites.items.includes(product.id));

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.category}>{product.category}</div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
      </Link>
      <div className={styles.actions}>
        <button onClick={() => dispatch(toggleFavorite(product.id))} className={styles.favBtn}>
         <img src={isFavorite ? fullfilledHeartIcon : heartIcon} alt="" /> 
        </button>
        <button onClick={() => dispatch(addToCart({ id: product.id }))} className={styles.cartBtn}>
          <img src={basketIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;