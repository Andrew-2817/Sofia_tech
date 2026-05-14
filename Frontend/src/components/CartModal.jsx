// CartModal.jsx - обновленная версия
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../store/slices/cartSlice';
import { createOrder, clearOrderState } from '../store/slices/ordersSlice';
import { fetchUserProfile } from '../store/slices/authSlice';
import styles from './CartModal.module.css';
import basketIcon from '../assets/basket.svg';
import crossIcon from '../assets/cross.svg';
import trashIcon from "../assets/trash.svg";

const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { user, isLoggedIn, loading: authLoading } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.orders);
  
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_comment: '',
  });

  // Загружаем данные пользователя если не загружены
  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isLoggedIn, user]);

  // Подтягиваем данные пользователя в форму когда они загружены
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || '',
        customer_email: user.email || '',
        customer_phone: user.phone || '',
        customer_address: user.address || '',
      }));
    }
  }, [user]);

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmitOrder = async () => {
    // Валидация
    if (!formData.customer_name.trim()) {
      alert('Введите ваше имя');
      return;
    }
    if (!formData.customer_phone.trim()) {
      alert('Введите номер телефона');
      return;
    }
    if (!formData.customer_address.trim()) {
      alert('Введите адрес доставки');
      return;
    }
    
    // Формируем данные для отправки
    const orderItems = items.map(item => ({
      id: item.id,
      brand_id: item.brandId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      sku: item.sku || null,
      brand: item.brandName || null,
      color: item.color || null,
      model: item.model || null,
      width: item.width || null,
      height: item.height || null,
      depth: item.depth || null,
    }));
    
    const orderData = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email || null,
      customer_phone: formData.customer_phone,
      customer_address: formData.customer_address,
      items: orderItems,
      total_amount: totalPrice,
      customer_comment: formData.customer_comment || null,
    };
    
    const result = await dispatch(createOrder(orderData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      setShowCheckoutForm(false);
      setFormData({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        customer_address: user?.address || '',
        customer_comment: '',
      });
      // Через 3 секунды закроем модалку
      setTimeout(() => {
        dispatch(clearOrderState());
        onClose();
      }, 3000);
    }
  };
  
  // Сброс формы при открытии
  const handleOpenCheckout = () => {
    if (user) {
      setFormData({
        customer_name: user.name || '',
        customer_email: user.email || '',
        customer_phone: user.phone || '',
        customer_address: user.address || '',
        customer_comment: '',
      });
    }
    setShowCheckoutForm(true);
  };
  
  if (!isOpen) return null;

  console.log(formData);
  
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            <span className={styles.headerIcon}><img src={basketIcon} alt="" /></span>
            <p>Корзина</p>
            <span className={styles.itemCount}>{totalItems}</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}><img src={crossIcon} alt="" /></button>
        </div>
        
        {success && (
          <div className={styles.successMessage}>
            <span>✅</span>
            <div>
              <h4>Заказ успешно оформлен!</h4>
              <p>Номер заказа: {success?.id || 'сформирован'}</p>
              <p>Мы свяжемся с вами в ближайшее время.</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <span>❌</span>
            <div>
              <h4>Ошибка оформления заказа</h4>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {items.length === 0 && !success ? (
          <div className={styles.emptyState}>
            <h3>Корзина пуста</h3>
            <p>Добавьте товары в корзину, чтобы продолжить</p>
            <button className={styles.continueBtn} onClick={onClose}>
              Продолжить покупки
            </button>
          </div>
        ) : !showCheckoutForm && !success ? (
          <>
            <div className={styles.cartItems}>
              {items.map(item => (
                <div key={`${item.id}-${item.brandId}`} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>{item.price.toLocaleString()} ₽</div>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => dispatch(decrementQuantity({ id: item.id, brandId: item.brandId }))}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => dispatch(incrementQuantity({ id: item.id, brandId: item.brandId }))}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => dispatch(removeFromCart({ id: item.id, brandId: item.brandId }))}
                    >
                      <img src={trashIcon} alt="" />
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
                <button 
                  className={styles.checkoutBtn}
                  onClick={handleOpenCheckout}
                >
                  Оформить заказ →
                </button>
              </div>
              <button className={styles.continueBtn} onClick={onClose}>
                Продолжить покупки
              </button>
            </div>
          </>
        ) : !success ? (
          <div className={styles.checkoutForm}>
            <h3>Данные для доставки</h3>
            {authLoading ? (
              <div className={styles.loadingUser}>Загрузка данных пользователя...</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }}>
                <div className={styles.formGroup}>
                  <label>Имя *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Телефон *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Адрес доставки *</label>
                  <input
                    type="text"
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleInputChange}
                    placeholder="Город, улица, дом, квартира"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Комментарий к заказу</label>
                  <textarea
                    name="customer_comment"
                    value={formData.customer_comment}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Пожелания по доставке, удобное время и т.д."
                  />
                </div>
                
                <div className={styles.orderSummary}>
                  <div className={styles.summaryItem}>
                    <span>Товаров:</span>
                    <span>{totalItems} шт.</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Итого:</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.backBtn}
                    onClick={() => setShowCheckoutForm(false)}
                  >
                    Назад
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Оформление...' : 'Подтвердить заказ'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CartModal;