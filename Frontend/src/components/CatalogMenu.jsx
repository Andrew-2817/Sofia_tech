// CatalogMenu.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatalogMenu.module.css';
import crossIcon from '../assets/cross.svg';
import { useSelector } from 'react-redux';
import {
  IconHome, IconTool, IconBolt, IconPlant,
  IconDeviceTv, IconCar, IconCooker, IconSofa, IconLayoutGrid,
  IconApple, IconSportBillard, IconPackage, IconFireHydrant
} from '@tabler/icons-react';

// 1. КЕШИРОВАНИЕ ИКОНОК (вынесено из компонента)
const CATEGORY_ICONS = {
  1: IconHome,
  2: IconTool,
  3: IconBolt,
  4: IconPlant,
  5: IconCooker,
};
const DEFAULT_ICON = IconPackage;

const CatalogMenu = ({ isOpen, onClose }) => {
  const [activeLevel1, setActiveLevel1] = useState(1);
  const { tree: categories, loading } = useSelector(state => state.categories);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 2. КЕШИРОВАНИЕ КАТЕГОРИЙ 1 УРОВНЯ
  const level1Categories = useMemo(() => {
    return categories.filter(cat => cat.level === 1);
  }, [categories]);

  // 3. КЕШИРОВАНИЕ АКТИВНОЙ КАТЕГОРИИ
  const activeCategory = useMemo(() => {
    return level1Categories.find(c => c.id === activeLevel1) || level1Categories[0];
  }, [level1Categories, activeLevel1]);

  // 4. КЕШИРОВАНИЕ КАТЕГОРИЙ 2 УРОВНЯ
  const level2Categories = useMemo(() => {
    return activeCategory?.children || [];
  }, [activeCategory]);

  // 5. КЕШИРОВАНИЕ ПОЛУЧЕНИЯ ИКОНКИ
  const getCategoryIcon = useCallback((category) => {
    return CATEGORY_ICONS[category.id] || CATEGORY_ICONS[category.slug] || DEFAULT_ICON;
  }, []);

  // 6. КЕШИРОВАНИЕ ФУНКЦИЙ НАВИГАЦИИ
  const handleNavigateToLevel1 = useCallback((level1Category) => {
    navigate(`/catalog/${level1Category.slug}`);
    onClose();
  }, [navigate, onClose]);

  const handleNavigateToLevel2 = useCallback((level2Category, level1Category) => {
    navigate(`/catalog/${level1Category.slug}/${level2Category.slug}`);
    onClose();
  }, [navigate, onClose]);

  const handleNavigateToLevel3 = useCallback((level3Category, level2Category, level1Category) => {
    navigate(`/catalog/${level1Category.slug}/${level2Category.slug}/${level3Category.slug}`);
    onClose();
  }, [navigate, onClose]);

  // 7. КЕШИРОВАНИЕ ОБРАБОТЧИКА КЛИКА
  const handleLevel1Click = useCallback((category) => {
    setActiveLevel1(category.id);
  }, []);

  // Закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
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

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.menuContainer}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Загрузка категорий...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.menuContainer} ref={menuRef}>
        <div className={styles.header}>
          <h2>
            <IconLayoutGrid size={22}/>
            <p>Каталог товаров</p>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src={crossIcon} alt="" />
          </button>
        </div>

        <div className={styles.content}>
          {/* Левая колонка - категории 1 уровня */}
          <div className={styles.level1Column}>
            <div className={styles.level1List}>
              {level1Categories.map(category => {
                const Icon = getCategoryIcon(category);
                return (
                  <div
                    key={category.id}
                    className={`${styles.level1Item} ${activeLevel1 === category.id ? styles.active : ''}`}
                    onClick={() => handleLevel1Click(category)}
                  >
                    <div className={styles.level1Icon}>
                      <Icon size={22} stroke={1.5} />
                    </div>
                    <div className={styles.level1Info}>
                      <div className={styles.level1Name}>{category.name}</div>
                      <div className={styles.level1Count}>
                        {category.children?.length || 0} подкатегорий
                      </div>
                    </div>
                    <div className={styles.level1Arrow}>→</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Правая колонка - категории 2 и 3 уровня */}
          <div className={styles.rightColumn}>
            <div className={styles.rightHeader}>
              <h3>
                <IconHome size={22}/>
                <p>{activeCategory?.name}</p>
              </h3>
              <button 
                className={styles.showAllBtn}
                onClick={() => handleNavigateToLevel1(activeCategory)}
              >
                Показать всё →
              </button>
            </div>

            <div className={styles.level2Grid}>
              {level2Categories.map(level2 => {
                const Icon = getCategoryIcon(level2);
                return (
                  <div key={level2.id} className={styles.level2Card}>
                    <div 
                      className={styles.level2Title}
                      onClick={() => handleNavigateToLevel2(level2, activeCategory)}
                    >
                      <Icon size={20} className={styles.level2TitleIcon} />
                      <span className={styles.level2TitleName}>{level2.name}</span>
                      <span className={styles.level2TitleArrow}>→</span>
                    </div>
                    
                    {level2.children && level2.children.length > 0 && (
                      <div className={styles.level3List}>
                        {level2.children.map(level3 => (
                          <div
                            key={level3.id}
                            className={styles.level3Item}
                            onClick={() => handleNavigateToLevel3(level3, level2, activeCategory)}
                          >
                            <span className={styles.level3Bullet}>•</span>
                            <span className={styles.level3Name}>{level3.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {level2Categories.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}></div>
                <p>Нет подкатегорий</p>
                <small>Выберите другую категорию слева</small>
              </div>
            )}
          </div>
        </div>

        {/* Баннер внизу */}
        <div className={styles.bottomBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <IconFireHydrant size={22}/>
              <span>Акционные товары и новинки</span>
            </div>
            <button 
              className={styles.bannerBtn}
              onClick={() => {
                navigate('/catalog?filter=promo');
                onClose();
              }}
            >
              Смотреть →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogMenu;