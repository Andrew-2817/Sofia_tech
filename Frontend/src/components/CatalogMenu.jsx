import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import styles from './CatalogMenu.module.css';
import crossIcon from '../assets/cross.svg'
import fireIcon from "../assets/fire.svg"
import { useSelector } from 'react-redux';
import {
  IconHome, IconTool, IconBolt, IconPlant,
  IconDeviceTv, IconCar, IconCooker, IconSofa, IconLayoutGrid,
  IconApple, IconSportBillard, IconPackage, IconFireHydrant
} from '@tabler/icons-react';

const CatalogMenu = ({ isOpen, onClose }) => {
  const [activeLevel1, setActiveLevel1] = useState(1);
  const { tree: categories, loading } = useSelector(state => state.categories);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const level1Categories = categories.filter(cat => cat.level === 1);
  console.log(level1Categories);
  

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

// Маппинг — дополни под свои slug/id
const CATEGORY_ICONS = {
  1: IconHome,
  2: IconTool,
  3: IconBolt,
  4: IconPlant,
  5: IconCooker,
};

const IconCatalog = IconLayoutGrid
const Iconlevel1 = activeLevel1 && CATEGORY_ICONS[activeLevel1];

const getCategoryIcon = (category) => {
  return CATEGORY_ICONS[category.slug]
      || CATEGORY_ICONS[category.id]
      || IconPackage; // fallback
};

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

  // Обработка клика по категории 1 уровня
  const handleLevel1Click = (category) => {
    setActiveLevel1(category.id);
  };

  // Переход на страницу каталога с категорией 1 уровня
  const handleNavigateToLevel1 = (level1Category) => {
    navigate(`/catalog?level1=${level1Category.slug}`);
    onClose();
  };

  // Переход на страницу каталога с категорией 2 уровня
  const handleNavigateToLevel2 = (level2Category, level1Category) => {
    navigate(`/catalog?level1=${level1Category.slug}&category=${level2Category.slug}`);
    onClose();
  };

  // Переход на страницу каталога с категорией 3 уровня
  const handleNavigateToLevel3 = (level3Category, level2Category, level1Category) => {
    navigate(`/catalog?level1=${level1Category.slug}&category=${level2Category.slug}&subcategory=${level3Category.id}`);
    onClose();
  };

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

  const activeCategory = level1Categories.find(c => c.id === activeLevel1) || level1Categories[0];
  const level2Categories = activeCategory?.children || [];
  return (
    <div className={styles.overlay}>
      <div className={styles.menuContainer} ref={menuRef}>
        <div className={styles.header}>
          <h2>
            <IconCatalog size={22}/>
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
              {categories.map(category => {
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

          {/* Правая колонка - категории 2 и 3 уровня в сетке */}
          <div className={styles.rightColumn}>
            <div className={styles.rightHeader}>
              <h3>
                <Iconlevel1 size={22}/>
                <p>{activeCategory.name}</p>
              </h3>
              <button 
                className={styles.showAllBtn}
                onClick={() => handleNavigateToLevel1(activeCategory)}
              >
                Показать всё →
              </button>
            </div>

            <div className={styles.level2Grid}>
              {level2Categories.map(level2 => (
                <div key={level2.id} className={styles.level2Card}>
                  <div 
                    className={styles.level2Title}
                    onClick={() => handleNavigateToLevel2(level2, activeCategory)}
                  >
                    <span className={styles.level2TitleIcon}></span>
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
              ))}
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