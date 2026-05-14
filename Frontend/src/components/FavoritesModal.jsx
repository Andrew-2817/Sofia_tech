// components/FavoritesModal.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';
import styles from './FavoritesModal.module.css';
import heartIcon from '../assets/heart.svg';
import basketIcon from '../assets/basket.svg';
import crossIcon from '../assets/cross.svg';
import trashIcon from "../assets/trash.svg";
import { API_BASE_URL_photo } from '../services/api';

const FavoritesModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items); // массив объектов { id, brandId }
  const products = useSelector(state => state.products.items);
  
  // ИСПРАВЛЕНО: фильтрация по составному ключу
  const favoriteProducts = products.filter(product => {
    return favorites.some(fav => fav.id === product.id && fav.brandId === product.brand_id);
  });
  
  const handleToggleFavorite = (e, productId, brandId) => {
    e.preventDefault();
    dispatch(toggleFavorite({ id: productId, brandId }));
  };
  
  const handleAddToCart = (e, product) => {
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
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            <span className={styles.headerIcon}><img src={heartIcon} alt="" /></span>
            Избранное
            <span className={styles.itemCount}>{favoriteProducts.length}</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}><img src={crossIcon} alt="" /></button>
        </div>
        
        {favoriteProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❤️</div>
            <h3>Избранное пусто</h3>
            <p>Добавляйте товары в избранное, чтобы не потерять их</p>
            <button className={styles.continueBtn} onClick={onClose}>
              Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <div className={styles.favoritesItems}>
              {favoriteProducts.map(product => (
                <div key={`${product.id}-${product.brand_id}`} className={styles.favoriteItem}>
                  <img 
                    src={`${API_BASE_URL_photo}${product.main_image}` || `${API_BASE_URL_photo}${product.image}`} 
                    alt={product.name} 
                    className={styles.itemImage} 
                  />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemCategory}>
                      {product.brandName || (product.brand_id === 1 ? 'Homeier' : 'Brandt')}
                    </div>
                    <Link 
                      to={`/product/${product.brand_id}/${product.id}`} 
                      className={styles.itemName}
                      onClick={onClose}
                    >
                      {product.name}
                    </Link>
                    <div className={styles.itemPrice}>{product.price.toLocaleString()} ₽</div>
                    <div className={styles.itemSpecs}>
                      {product.color && (
                        <span className={styles.spec}>🎨 {product.color}</span>
                      )}
                      {product.model && (
                        <span className={styles.spec}>🔢 {product.model}</span>
                      )}
                      {product.sku && (
                        <span className={styles.spec}>🔖 {product.sku}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      className={styles.cartBtn}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <img src={basketIcon} alt="" /> <p>В корзину</p>
                    </button>
                    <button 
                      className={styles.removeBtn}
                      onClick={(e) => handleToggleFavorite(e, product.id, product.brand_id)}
                    >
                      <img src={trashIcon} alt="" /> <p>Удалить</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.footer}>
              <button className={styles.continueBtn} onClick={onClose}>
                Продолжить покупки
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesModal;