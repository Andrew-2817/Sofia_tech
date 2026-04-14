import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/filtersSlice';
import styles from './SearchDropdown.module.css';

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
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
      onClose();
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.searchIcon}>🔍</span>
          <span className={styles.resultsCount}>
            Найдено товаров: <strong>{results.length}</strong>
          </span>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      {results.length > 0 ? (
        <>
          <div className={styles.resultsList}>
            {results.map((product, index) => (
              <div
                key={product.id}
                className={styles.resultItem}
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  {product.isNew && <span className={styles.newBadge}>NEW</span>}
                  {product.isPopular && <span className={styles.popularBadge}>🔥</span>}
                </div>
                
                <div className={styles.productInfo}>
                  <div className={styles.productHeader}>
                    <span className={styles.category}>{product.category}</span>
                    <span className={styles.manufacturer}>{product.manufacturer}</span>
                  </div>
                  <h4 className={styles.productName}>{product.name}</h4>
                  <div className={styles.productSpecs}>
                    {product.weight && (
                      <span className={styles.spec}>
                        <span className={styles.specIcon}>⚖️</span> {product.weight}
                      </span>
                    )}
                    {product.color && (
                      <span className={styles.spec}>
                        <span className={styles.specIcon}>🎨</span> {product.color}
                      </span>
                    )}
                  </div>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
                    <button className={styles.quickViewBtn}>Быстрый просмотр</button>
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