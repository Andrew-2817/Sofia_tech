// components/SearchDropdown.jsx
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/filtersSlice';
import { API_BASE_URL_photo } from '../services/api';
import { getDefaultProductImage } from '../data/mockData';
import styles from './SearchDropdown.module.css';
import searchIcon from '../assets/search.svg';
import crossIcon from '../assets/cross.svg';

// 1. ВЫНЕСЕНО ИЗ КОМПОНЕНТА (константы)
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60x60?text=No+Image';

// 2. КЕШИРОВАНИЕ ПОЛУЧЕНИЯ URL
const getImageUrl = (product) => {
  if (product.main_image) {
    return `${API_BASE_URL_photo}${product.main_image}`;
  }
  if (product.image) {
    return product.image;
  }
  return getDefaultProductImage(product.categoryId) || PLACEHOLDER_IMAGE;
};

// 3. КЕШИРОВАНИЕ ПОЛУЧЕНИЯ НАЗВАНИЯ БРЕНДА
const getBrandName = (product) => {
  if (product.brandName) return product.brandName;
  if (product.brandId === 1) return 'Homeier';
  if (product.brandId === 2) return 'Brandt';
  if (product.brand_id === 1) return 'Homeier';
  if (product.brand_id === 2) return 'Brandt';
  return 'Товар';
};

// 4. КЕШИРОВАНИЕ ОБРЕЗКИ НАЗВАНИЯ
const truncateName = (name, maxLength = 100) => {
  return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
};

const SearchDropdown = ({ searchTerm, results, isOpen, onClose, onProductClick }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 5. КЕШИРОВАНИЕ ФУНКЦИЙ
  const handleShowAllResults = useCallback(() => {
    dispatch(setSearchQuery(searchTerm));
    navigate('/catalog');
    onClose();
  }, [dispatch, searchTerm, navigate, onClose]);

  const handleProductClick = useCallback((product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.brandId}/${product.id}`);
      onClose();
    }
  }, [onProductClick, navigate, onClose]);

  if (!isOpen) return null;

  // 6. ПОДГОТОВКА ДАННЫХ ДЛЯ РЕНДЕРА (если нужно)
  const hasResults = results.length > 0;

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.searchIcon}><img src={searchIcon} alt="" /></span>
          <span className={styles.resultsCount}>
            Найдено товаров: <strong>{results.length}</strong>
          </span>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <img src={crossIcon} alt="" />
        </button>
      </div>

      {hasResults ? (
        <>
          <div className={styles.resultsList}>
            {results.map((product, index) => (
              <div
                key={`${product.id}-${product.brandId}`}
                className={styles.resultItem}
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={getImageUrl(product)} 
                    alt={product.name} 
                    className={styles.productImage} 
                    loading="lazy"
                    width={60}
                    height={60}
                  />
                  {product.isNew && <span className={styles.newBadge}>NEW</span>}
                </div>
                
                <div className={styles.productInfo}>
                  <div className={styles.productHeader}>
                    <span className={styles.category}>{getBrandName(product)}</span>
                    <span className={styles.manufacturer}>
                      {product.groupLevel1 || product.model || 'Бытовая техника'}
                    </span>
                  </div>
                  <h4 className={styles.name}>
                    {truncateName(product.name)}
                  </h4>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
                    <button 
                      className={styles.quickViewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      Перейти
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.footer}>
            <button className={styles.showAllBtn} onClick={handleShowAllResults}>
              Показать все результаты ({results.length})
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <h3>Ничего не найдено</h3>
          <p>По запросу <strong>"{searchTerm}"</strong> ничего не найдено</p>
          <small>Попробуйте изменить или сократить поисковый запрос</small>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;