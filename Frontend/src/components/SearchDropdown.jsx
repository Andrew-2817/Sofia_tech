// components/SearchDropdown.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/filtersSlice';
import { API_BASE_URL_photo } from '../services/api';
import styles from './SearchDropdown.module.css';
import searchIcon from '../assets/search.svg';
import crossIcon from '../assets/cross.svg';
import { getDefaultProductImage } from '../data/mockData';

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

  if (!isOpen) return null;

  const handleShowAllResults = () => {
    dispatch(setSearchQuery(searchTerm));
    navigate('/catalog');
    onClose();
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      console.log(product);
      onProductClick(product);
    } else {
      
      // Используем brand_id и id для перехода
      navigate(`/product/${product.brandId}/${product.id}`);
      onClose();
    }
  };

  // Получение URL изображения
  const getImageUrl = (product) => {
    if (product.main_image) {
      return `${API_BASE_URL_photo}${product.main_image}`;
    }
    if (product.image) {
      return product.image;
    }
    return 'https://via.placeholder.com/60x60?text=No+Image';
  };

  // Получение названия бренда
  const getBrandName = (product) => {
    if (product.brandName) return product.brandName;
    if (product.brand_id === 1) return 'Homeier';
    if (product.brand_id === 2) return 'Brandt';
    return 'Товар';
  };

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

      {results.length > 0 ? (
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
                    src={product.main_image!= null 
                          ? `${API_BASE_URL_photo}${product.main_image}`
                          : getDefaultProductImage(product.categoryId)} 
                    alt={product.name} 
                    className={styles.productImage} 
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
                      {product.name.length > 100 ? product.name.slice(0, 100) + '...' : product.name}
                    </h4>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
                    <button 
                      className={styles.quickViewBtn}
                      onClick={(e) => {
                        // e.stopPropagation();
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
          <div className={styles.emptyIcon}>🔍</div>
          <h3>Ничего не найдено</h3>
          <p>По запросу <strong>"{searchTerm}"</strong> ничего не найдено</p>
          <small>Попробуйте изменить или сократить поисковый запрос</small>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;