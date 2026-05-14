// ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUserProfile, fetchUserProfile } from '../store/slices/authSlice';
import { fetchUserOrders } from '../store/slices/ordersSlice';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './ProfilePage.module.css';
import profileIcon from "../assets/profile.svg";
import orderIcon from "../assets/order.svg";
import heartIcon from "../assets/heart.svg";
import signOutIcon from "../assets/sign-out.svg";
import { API_BASE_URL_photo } from '../services/api';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user, loading: authLoading } = useSelector(state => state.auth);
  const { items: orders, loading: ordersLoading } = useSelector(state => state.orders);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const favorites = useSelector(state => state.favorites.items);
  const products = useSelector(state => state.products.items);
  const favoriteProducts = products.filter(product => {
    return favorites.some(fav => fav.id === product.id && fav.brandId === product.brand_id);
  });

  const handleRemoveFavorite = (productId, brandId) => {
    dispatch(toggleFavorite({ id: productId, brandId }));
  };

  // Загрузка страницы с анимацией
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Загрузка данных пользователя при монтировании
  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUserProfile());
    }
    if (isLoggedIn) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isLoggedIn, user]);

  // Редирект при выходе
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Заполняем форму редактирования данными пользователя
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    const result = await dispatch(updateUserProfile(editForm));
    if (result.meta.requestStatus === 'fulfilled') {
      setIsEditing(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Форматирование статуса заказа
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Ожидает оплаты',
      'paid': 'Оплачен',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменён'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'pending': 'pending',
      'paid': 'paid',
      'processing': 'processing',
      'shipped': 'shipping',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return classMap[status] || '';
  };

  // Показываем загрузку страницы
  if (isPageLoading) {
    return <LoadingSpinner text="Загрузка профиля..." />;
  }

  console.log(favoriteProducts);
  

  // Если не авторизован
  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className={styles.notAuth}>
          <h2>Вы не авторизованы</h2>
          <p>Войдите в аккаунт, чтобы просматривать личный кабинет</p>
          <button className={styles.loginBtn} onClick={() => navigate('/')}>
            Перейти на главную
          </button>
        </div>
      </div>
    );
  }

  // Показываем загрузку данных
  if (authLoading && !user) {
    return <LoadingSpinner text="Загрузка данных..." />;
  }

  if (!user) {
    return null;
  }
  console.log(orders);
  

  return (
    <div className="container">
      <div className={styles.profilePage}>
        {/* Шапка профиля */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatar}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className={styles.profileInfo}>
              <h1>{user.name || 'Пользователь'}</h1>
              <p className={styles.profileEmail}>{user.email || 'user@example.com'}</p>
              <span className={styles.profileSince}>
                На сайте с {formatDate(user.created_at)}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <img src={signOutIcon} alt="" /> <p>Выйти</p>
          </button>
        </div>

        {/* Табы */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span><img src={profileIcon} alt="" /></span>
            Профиль
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span><img src={orderIcon} alt="" /></span>
            Заказы
            <span className={styles.tabCount}>{orders.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span><img src={heartIcon} alt="" /></span>
            Избранное
            <span className={styles.tabCount}>{favoriteProducts.length}</span>
          </button>
        </div>

        {/* Контент табов */}
        <div className={styles.tabContent}>
          {/* Профиль */}
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              <div className={styles.sectionCard}>
                <div className={styles.cardHeader}>
                  <h3>Личная информация</h3>
                  {!isEditing && (
                    <button className={styles.editBtn} onClick={handleEditClick}>
                      ✎ Редактировать
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Полное имя</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        placeholder="Введите ваше имя"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        placeholder="Введите email"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (XXX) XXX-XX-XX"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Адрес доставки</label>
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                        placeholder="Город, улица, дом, квартира"
                        rows="3"
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={handleCancelEdit}
                      >
                        Отмена
                      </button>
                      <button 
                        type="button" 
                        className={styles.saveBtn}
                        onClick={handleSaveProfile}
                        disabled={authLoading}
                      >
                        {authLoading ? 'Сохранение...' : 'Сохранить изменения'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <label>Полное имя</label>
                        <p>{user.name || '—'}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Email</label>
                        <p>{user.email || '—'}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Телефон</label>
                        <p>{user.phone || '—'}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Дата регистрации</label>
                        <p>{formatDate(user.created_at)}</p>
                      </div>
                    </div>

                    <div className={styles.addressSection}>
                      <h4>Адрес доставки</h4>
                      <p>{user.address || 'Не указан'}</p>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()} ₽
                  </div>
                  <div className={styles.statLabel}>Потрачено всего</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{orders.length}</div>
                  <div className={styles.statLabel}>Заказов</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{favoriteProducts.length}</div>
                  <div className={styles.statLabel}>В избранном</div>
                </div>
              </div>
            </div>
          )}
        
        {/* Заказы - Детализированное отображение */}
        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            {ordersLoading ? (
              <div className={styles.loadingOrders}>
                <LoadingSpinner text="Загрузка заказов..." />
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>У вас пока нет заказов</h3>
                <p>Перейдите в каталог, чтобы сделать первый заказ</p>
                <button className={styles.continueBtn} onClick={() => navigate('/catalog')}>
                  Перейти в каталог
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  {/* Шапка заказа */}
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderNumber}>Заказ №{order.id}</span>
                      <span className={styles.orderDate}>
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className={`${styles.orderStatus} ${styles[getStatusClass(order.status)]}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Детали доставки */}
                  <div className={styles.orderDeliveryInfo}>
                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>📦 Получатель:</span>
                      <span className={styles.deliveryValue}>{order.customer_name}</span>
                    </div>
                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>📞 Телефон:</span>
                      <span className={styles.deliveryValue}>{order.customer_phone}</span>
                    </div>
                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>📍 Адрес доставки:</span>
                      <span className={styles.deliveryValue}>{order.customer_address}</span>
                    </div>
                    {order.customer_comment && (
                      <div className={styles.deliveryRow}>
                        <span className={styles.deliveryLabel}>💬 Комментарий:</span>
                        <span className={styles.deliveryValue}>{order.customer_comment}</span>
                      </div>
                    )}
                  </div>

                  {/* Список товаров с характеристиками */}
                  <div className={styles.orderItemsList}>
                    <div className={styles.orderItemsHeader}>
                      <span>Товар</span>
                      <span>Характеристики</span>
                      <span>Кол-во</span>
                      <span>Сумма</span>
                    </div>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className={styles.orderItem}>
                        <div className={styles.orderItemImage}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className={styles.noImage}>🖼️</div>
                          )}
                        </div>
                        <div className={styles.orderItemDetails}>
                          <div className={styles.orderItemName}>{item.name}</div>
                          <div className={styles.orderItemSpecs}>
                            {item.brand && (
                              <span className={styles.specBadge}>
                                <span className={styles.specIcon}>🏭</span>
                                {item.brand}
                              </span>
                            )}
                            {item.color && (
                              <span className={styles.specBadge}>
                                <span className={styles.specIcon}>🎨</span>
                                {item.color}
                              </span>
                            )}
                            {item.model && (
                              <span className={styles.specBadge}>
                                <span className={styles.specIcon}>🔢</span>
                                {item.model}
                              </span>
                            )}
                            {item.sku && (
                              <span className={styles.specBadge}>
                                <span className={styles.specIcon}>🔖</span>
                                Артикул: {item.sku}
                              </span>
                            )}
                            {item.width && (
                              <span className={styles.specBadge}>
                                <span className={styles.specIcon}>📏</span>
                                {item.width}x{item.height}x{item.depth} см
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.orderItemQuantity}>
                          {item.quantity} шт.
                        </div>
                        <div className={styles.orderItemPrice}>
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Итого и действия */}
                  <div className={styles.orderFooter}>
                    <div className={styles.orderSummary}>
                      <div className={styles.summaryRow}>
                        <span>Товаров ({order.items?.length || 0} позиций):</span>
                        <span>{order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} шт.</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Сумма заказа:</span>
                        <span>{order.total_amount?.toLocaleString()} ₽</span>
                      </div>
                      <div className={styles.orderTotal}>
                        <span>Итого к оплате:</span>
                        <strong>{order.total_amount?.toLocaleString()} ₽</strong>
                      </div>
                    </div>
                    
                    <div className={styles.orderActions}>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button 
                          className={styles.cancelOrderBtn}
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Отменить заказ
                        </button>
                      )}
                      <button 
                        className={styles.reorderBtn}
                        onClick={() => handleReorder(order.id)}
                      >
                        Повторить заказ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

          {/* Избранное */}
          {activeTab === 'favorites' && (
      <div className={styles.favoritesSection}>
        {favoriteProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❤️</div>
            <h3>Избранное пусто</h3>
            <p>Добавляйте товары в избранное, чтобы не потерять их</p>
            <button className={styles.continueBtn} onClick={() => navigate('/catalog')}>
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className={styles.favoritesGrid}>
            {favoriteProducts.map(product => (
              <div key={`${product.id}-${product.brand_id}`} className={styles.favoriteProduct}>
                <img 
                  src={`${API_BASE_URL_photo}${product.main_image}` || `${API_BASE_URL_photo}${product.image}`} 
                  alt={product.name} 
                  onClick={() => navigate(`/product/${product.brand_id}/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productPrice}>{product.price.toLocaleString()} ₽</p>
                  <button 
                    className={styles.removeFavoriteBtn}
                    onClick={() => handleRemoveFavorite(product.id, product.brand_id)}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;