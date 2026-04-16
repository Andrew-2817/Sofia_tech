import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';
import styles from './FavoritesModal.module.css';

const FavoritesModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const favoritesIds = useSelector(state => state.favorites.items);
  const products = useSelector(state => state.products.items);
  
  const favoriteProducts = products.filter(product => favoritesIds.includes(product.id));
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            <span className={styles.headerIcon}>❤️</span>
            Избранное
            <span className={styles.itemCount}>{favoriteProducts.length}</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
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
                <div key={product.id} className={styles.favoriteItem}>
                  <img src={product.image} alt={product.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemCategory}>{product.categoryName}</div>
                    <Link 
                      to={`/product/${product.id}`} 
                      className={styles.itemName}
                      onClick={onClose}
                    >
                      {product.name}
                    </Link>
                    <div className={styles.itemPrice}>{product.price.toLocaleString()} ₽</div>
                    <div className={styles.itemSpecs}>
                      {product.manufacturer && (
                        <span className={styles.spec}>🏭 {product.manufacturer}</span>
                      )}
                      {product.color && (
                        <span className={styles.spec}>🎨 {product.color}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      className={styles.cartBtn}
                      onClick={() => {
                        dispatch(addToCart({ id: product.id }));
                        onClose();
                      }}
                    >
                      🛒 В корзину
                    </button>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => dispatch(toggleFavorite(product.id))}
                    >
                      🗑️ Удалить
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