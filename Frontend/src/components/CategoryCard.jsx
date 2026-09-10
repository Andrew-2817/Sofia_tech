// components/CategoryCard.jsx
import { useNavigate } from 'react-router-dom';
import styles from './CategoryCard.module.css';
import { memo, useCallback, useMemo } from 'react';
import categoryImg1 from "../assets/category.png";
import categoryImg2 from "../assets/Рисунок2.png";
import categoryImg3 from "../assets/Рисунок3.png";
import categoryImg4 from "../assets/Рисунок4.png";
import categoryImg5 from "../assets/Рисунок5.png";

// Константы вынесены из компонента
const CATEGORY_IMAGES = {
  1: categoryImg1,
  2: categoryImg2,
  3: categoryImg3,
  4: categoryImg4,
  5: categoryImg5,
};
const DEFAULT_IMAGE = categoryImg1;

const CategoryCard = memo(({ category }) => {
  const navigate = useNavigate();

  // 1. НАВИГАЦИЯ В КАТАЛОГ С УРОВНЕМ 1 (исправлено)
  const handleClick = useCallback(() => {
    navigate(`/catalog/${category.slug}`);
  }, [navigate, category.slug]);

  // 2. КЕШИРОВАНИЕ ФОНА
  const backgroundImage = useMemo(() => {
    return CATEGORY_IMAGES[category.id] || DEFAULT_IMAGE;
  }, [category.id]);

  const cardStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3)), url(${backgroundImage})`
  }), [backgroundImage]);

  const childrenCount = category.children?.length || 0;

  return (
    <div 
      className={styles.card} 
      onClick={handleClick}
      style={cardStyle}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h3 className={styles.title}>{category.name}</h3>
        <div className={styles.count}>
          {childrenCount} подкатегорий
        </div>
        <div className={styles.arrow}>→</div>
      </div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;