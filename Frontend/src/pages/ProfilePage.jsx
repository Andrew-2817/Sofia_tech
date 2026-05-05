import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import profileIcon from "../assets/profile.svg"
import orderIcon from "../assets/order.svg"
import heartIcon from "../assets/heart.svg"
import signOutIcon from "../assets/sign-out.svg"

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, favorites, settings

  // Временные данные для демонстрации
  const orders = [
    { id: 12345, date: '15.04.2026', status: 'Доставлен', total: 45990, items: 2 },
    { id: 12346, date: '10.04.2026', status: 'В пути', total: 128990, items: 1 },
    { id: 12347, date: '05.04.2026', status: 'Обработка', total: 7990, items: 3 },
    { id: 12348, date: '28.03.2026', status: 'Доставлен', total: 189990, items: 1 },
  ];

  const favorites = useSelector(state => state.favorites.items);
  const products = useSelector(state => state.products.items);
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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

  return (
    <div className="container">
      <div className={styles.profilePage}>
        {/* Шапка профиля */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatar}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className={styles.profileInfo}>
              <h1>{user?.name || 'Пользователь'}</h1>
              <p className={styles.profileEmail}>{user?.email || 'user@example.com'}</p>
              <span className={styles.profileSince}>На сайте с апреля 2026</span>
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
                <h3>Личная информация</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Полное имя</label>
                    <p>{user?.name || '—'}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Email</label>
                    <p>{user?.email || '—'}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Телефон</label>
                    <p>+7 (999) 123-45-67</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Дата регистрации</label>
                    <p>1 апреля 2026</p>
                  </div>
                </div>
                <button className={styles.editBtn}>Редактировать</button>
              </div>

              <div className={styles.sectionCard}>
                <h3>Адрес доставки</h3>
                <div className={styles.addressCard}>
                  <p>г. Москва, ул. Примерная, д. 123, кв. 45</p>
                  <button className={styles.changeBtn}>Изменить</button>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>₽ 0</div>
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

          {/* Заказы */}
          {activeTab === 'orders' && (
            <div className={styles.ordersSection}>
              {orders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderNumber}>Заказ №{order.id}</span>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <div className={`${styles.orderStatus} ${styles[getStatusClass(order.status)]}`}>
                      {order.status}
                    </div>
                  </div>
                  <div className={styles.orderDetails}>
                    <div className={styles.orderItems}>
                      {order.items} товара
                    </div>
                    <div className={styles.orderTotal}>
                      {order.total.toLocaleString()} ₽
                    </div>
                  </div>
                  <button className={styles.orderBtn}>Подробнее →</button>
                </div>
              ))}
            </div>
          )}

          {/* Избранное */}
          {activeTab === 'favorites' && (
            <div className={styles.favoritesSection}>
              {favoriteProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  {/* <div className={styles.emptyIcon}>❤️</div> */}
                  <h3>Избранное пусто</h3>
                  <p>Добавляйте товары в избранное, чтобы не потерять их</p>
                  <button className={styles.continueBtn} onClick={() => navigate('/catalog')}>
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className={styles.favoritesGrid}>
                  {favoriteProducts.map(product => (
                    <div key={product.id} className={styles.favoriteProduct}>
                      <img src={product.image} alt={product.name} />
                      <div className={styles.productInfo}>
                        <h4>{product.name}</h4>
                        <p className={styles.productPrice}>{product.price.toLocaleString()} ₽</p>
                        <button className={styles.removeFavoriteBtn}>
                          Удалить
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

// Вспомогательная функция
const getStatusClass = (status) => {
  switch(status) {
    case 'Доставлен': return 'delivered';
    case 'В пути': return 'shipping';
    case 'Обработка': return 'processing';
    default: return '';
  }
};

export default ProfilePage;