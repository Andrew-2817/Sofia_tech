import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../store/slices/cartSlice';
import styles from './CartModal.module.css';

const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const products = useSelector(state => state.products.items);
  
  // Получаем полные данные о товарах в корзине
  const cartItems = items.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return { ...cartItem, ...product };
  });
  
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            <span className={styles.headerIcon}>🛒</span>
            Корзина
            <span className={styles.itemCount}>{totalItems}</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛒</div>
            <h3>Корзина пуста</h3>
            <p>Добавьте товары в корзину, чтобы продолжить</p>
            <button className={styles.continueBtn} onClick={onClose}>
              Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemCategory}>{item.categoryName}</div>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>{item.price.toLocaleString()} ₽</div>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => dispatch(decrementQuantity(item.id))}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => dispatch(incrementQuantity(item.id))}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.footer}>
              <div className={styles.totalInfo}>
                <div className={styles.totalItems}>
                  Товаров: <strong>{totalItems}</strong> шт.
                </div>
                <div className={styles.totalPrice}>
                  Итого: <strong>{totalPrice.toLocaleString()} ₽</strong>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
                  Очистить корзину
                </button>
                <button className={styles.checkoutBtn}>
                  Оформить заказ →
                </button>
              </div>
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

export default CartModal;