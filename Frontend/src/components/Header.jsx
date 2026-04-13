import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setSearchQuery, setCategory } from '../store/slices/filtersSlice';
import AuthModal from './AuthModal';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const favoritesCount = useSelector(state => state.favorites.items.length);
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const [search, setSearch] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(search));
    navigate('/catalog');
  };

//   const categories = ['Холодильники', 'Микроволновки', 'Телевизоры', 'Стиральные машины', 'Пылесосы'];

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.topRow}>
            <Link to="/" className={styles.logo}>TechStore</Link>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <button type="button" className={styles.catalogBtn} onClick={() => navigate('/catalog')}>Каталог</button>
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchSubmit}>🔍</button>
            </form>
            <div className={styles.actions}>
              <Link to="/favorites" className={styles.actionBtn}>❤️ {favoritesCount > 0 && <span>{favoritesCount}</span>}</Link>
              <Link to="/cart" className={styles.actionBtn}>🛒 {cartItemsCount > 0 && <span>{cartItemsCount}</span>}</Link>
              {isLoggedIn ? (
                <div className={styles.userMenu}>
                  <span>{user?.name || 'Профиль'}</span>
                  <button onClick={() => dispatch(logout())}>Выйти</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className={styles.actionBtn}>Войти</button>
              )}
            </div>
          </div>
          {/* <nav className={styles.categoriesNav}>
            {categories.map(cat => (
              <button
                key={cat}
                className={styles.categoryLink}
                onClick={() => {
                  dispatch(setCategory(cat));
                  navigate('/catalog');
                }}
              >
                {cat}
              </button>
            ))}
          </nav> */}
        </div>
      </header>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;