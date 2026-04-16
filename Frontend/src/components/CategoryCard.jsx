import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    // Передаём slug категории 1 уровня в URL
    navigate(`/catalog?level1=${category.slug}`);
  };

  // Иконка для категории
  const getCategoryIcon = () => {
    switch(category.id) {
      case 1: return '🏠';
      case 2: return '🔧';
      case 3: return '⚡';
      case 4: return '🔌';
      case 5: return '🍳';
      default: return '📦';
    }
  };

  // Цветовая схема для каждой категории
  const getCategoryColor = () => {
    switch(category.id) {
      case 1: return '#7bc6cf';
      case 2: return '#ff9f43';
      case 3: return '#a55eea';
      case 4: return '#eb4d4b';
      case 5: return '#20bf6b';
      default: return '#7bc6cf';
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div 
        className={styles.iconWrapper}
        style={{ background: `linear-gradient(135deg, ${getCategoryColor()}20, ${getCategoryColor()}10)` }}
      >
        <div className={styles.icon}>{getCategoryIcon()}</div>
      </div>
      <h3 className={styles.title}>{category.name}</h3>
      <div className={styles.count}>
        {category.children?.length || 0} подкатегорий
      </div>
      <div className={styles.arrow}>→</div>
    </div>
  );
};

export default CategoryCard;