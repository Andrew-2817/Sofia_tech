// Header.jsx - оптимизированная версия
import { useState, useRef, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetFilters, setSearchQuery } from '../store/slices/filtersSlice';
import AuthModal from './AuthModal';
import CartModal from './CartModal';
import FavoritesModal from './FavoritesModal';
import SearchDropdown from './SearchDropdown';
import CatalogMenu from './CatalogMenu';
import styles from './Header.module.css';
import searchIcon from '../assets/search.svg';
import heartIcon from '../assets/heart.svg';
import basketIcon from '../assets/basket.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import profileIcon from '../assets/profile.svg';

import {
  IconFlame, IconMail, IconPhone, IconMapPin, IconTag,
  IconUser, IconEdit, IconBasket, IconHeart
} from '@tabler/icons-react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ========== СОСТОЯНИЯ ==========
  const [search, setSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCatalogMenu, setShowCatalogMenu] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // ========== REDUX ==========
  const { tree: categories, loading } = useSelector(state => state.categories);
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const favoritesCount = useSelector(state => state.favorites.items.length);
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const allProducts = useSelector(state => state.products.items);

  // 1. КЕШИРОВАНИЕ КАТЕГОРИЙ
  const level1Categories = useMemo(() => {
    return categories.filter(cat => cat.level === 1);
  }, [categories]);

  const topCategories = useMemo(() => {
    return level1Categories.slice(0, 5);
  }, [level1Categories]);

  // 2. ДЕБАУНС ДЛЯ ПОИСКА (задержка 300мс)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (search.trim().length > 0) {
        const lowerSearch = search.toLowerCase().trim();
        
        const results = allProducts.filter(product => {
          const matchesName = product.name?.toLowerCase().includes(lowerSearch);
          const matchesDescription = product.description?.toLowerCase().includes(lowerSearch);
          const matchesSku = product.sku?.toLowerCase().includes(lowerSearch);
          const matchesModel = product.model?.toLowerCase().includes(lowerSearch);
          const matchesGroupLevel = product.group_level_1?.toLowerCase().includes(lowerSearch);
          const matchesComment = product.comment?.toLowerCase().includes(lowerSearch);
          
          return matchesName || matchesDescription || matchesSku || matchesModel || 
                 matchesGroupLevel || matchesComment;
        });
        
        setSearchResults(results.slice(0, 10));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, allProducts]);

  // 3. СБРОС ФИЛЬТРОВ ПРИ СМЕНЕ КАТЕГОРИИ
  useEffect(() => {
    dispatch(resetFilters());
  }, [location.search, dispatch]);

  // 4. КЕШИРОВАНИЕ ФУНКЦИЙ
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim().length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    await dispatch(logout());
    navigate('/');
    setIsLoggingOut(false);
  }, [dispatch, navigate]);

  const handleFocus = useCallback(() => {
    setShowSearchResults(true);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(setSearchQuery(search));
      navigate('/catalog');
      setShowSearchResults(false);
    }
  }, [search, dispatch, navigate]);

  const handleProductClick = useCallback((product) => {
    navigate(`/product/${product.brand}/${product.sku?.toLowerCase() || product.model?.toLowerCase()}`);
    setShowSearchResults(false);
    setSearch('');
  }, [navigate]);

  const handleClearSearch = useCallback(() => {
    setSearch('');
    setShowSearchResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCategoryClick = useCallback((slug) => {
    navigate(`/catalog/${slug}`);
  }, [navigate]);

  if (isLoggingOut) {
    return <LoadingSpinner text="Выход из аккаунта..." />;
  }

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
                  onChange={handleSearchChange}
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
              <button 
                className={styles.actionBtn} 
                onClick={() => setShowFavoritesModal(true)}
              >
                <IconHeart size={25}/> 
                {favoritesCount > 0 && <span>{favoritesCount}</span>}
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={() => setShowCartModal(true)}
              >
                <IconBasket size={25} /> 
                {cartItemsCount > 0 && <span>{cartItemsCount}</span>}
              </button>
              {isLoggedIn ? (
                <div className={styles.userMenu}>
                  <Link to="/profile" className={styles.profileLink}>
                    <IconUser size={25}/>
                  </Link>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Выйти
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className={styles.loginBtn}>
                  Войти
                </button>
              )}
            </div>
          </div>
          
          <nav className={styles.categoriesNav}>
            {!loading && topCategories.map(cat => (
              <button
                key={cat.id}
                className={styles.categoryLink}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </nav>
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