import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setSearchQuery, setCategory } from '../store/slices/filtersSlice';
import AuthModal from './AuthModal';
import CartModal from './CartModal';
import FavoritesModal from './FavoritesModal';
import SearchDropdown from './SearchDropdown';
import { logout } from '../store/slices/authSlice';
import CatalogMenu from './CatalogMenu';
import styles from './Header.module.css';
import searchIcon from '../assets/search.svg'
import heartIcon from '../assets/heart.svg'
import basketIcon from '../assets/basket.svg'

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCatalogMenu, setShowCatalogMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const favoritesCount = useSelector(state => state.favorites.items.length);
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const allProducts = useSelector(state => state.products.items);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Поиск товаров
  useEffect(() => {
    if (search.trim().length > 0) {
      // console.log(allProducts);
      
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults(allProducts);
    }
  }, [search, allProducts]);

  const handleFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(setSearchQuery(search));
      navigate('/catalog');
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowSearchResults(false);
    setSearch('');
  };

  const handleClearSearch = () => {
    setSearch('');
    setShowSearchResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const categories = ['Холодильники', 'Микроволновки', 'Телевизоры', 'Стиральные машины', 'Пылесосы'];

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.topRow}>
            <Link to="/" className={styles.logo}>profit</Link>
            
            <div className={styles.searchContainer} ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <button 
                  type="button" 
                  className={styles.catalogBtn} 
                  onClick={() => setShowCatalogMenu(true)}
                >
                  ☰ Каталог
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск товаров..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                  onFocus={handleFocus}
                />
                {search && (
                  <button type="button" className={styles.clearBtn} onClick={handleClearSearch}>
                    ✕
                  </button>
                )}
                <button type="submit" className={styles.searchSubmit}>
                  <img src={searchIcon} alt="" />
                </button>
              </form>
              
              <SearchDropdown
                searchTerm={search}
                results={searchResults}
                isOpen={showSearchResults}
                onClose={() => setShowSearchResults(false)}
                onProductClick={handleProductClick}
              />
            </div>
            
            <div className={styles.actions}>
              <Link to="#" className={styles.actionBtn} onClick={() => setShowFavoritesModal(true)}>
                <img src={heartIcon} alt="" /> {favoritesCount > 0 && <span>{favoritesCount}</span>}
              </Link>
              <Link to="#" className={styles.actionBtn} onClick={() => setShowCartModal(true)}>
                <img src={basketIcon} alt="" /> {cartItemsCount > 0 && <span>{cartItemsCount}</span>}
              </Link>
              {isLoggedIn ? (
                <div className={styles.userMenu}>
                  <Link to="/profile" className={styles.profileLink}>
                    <span>👤 {user?.name || 'Профиль'}</span>
                  </Link>
                  <button onClick={() => dispatch(logout())}>Выйти</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className={styles.loginBtn}>
                  Войти
                </button>
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
      
      <CatalogMenu 
        isOpen={showCatalogMenu} 
        onClose={() => setShowCatalogMenu(false)} 
      />
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
      <FavoritesModal isOpen={showFavoritesModal} onClose={() => setShowFavoritesModal(false)} /> 
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;