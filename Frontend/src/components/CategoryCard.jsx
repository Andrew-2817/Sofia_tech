import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryCard.module.css';
import categoryImg1 from "../assets/category.png"
import categoryImg2 from "../assets/Рисунок2.png"
import categoryImg3 from "../assets/Рисунок3.png"
import categoryImg4 from "../assets/Рисунок4.png"
import categoryImg5 from "../assets/Рисунок5.png"

const CategoryCard = ({ category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
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

  // Фоновые изображения для категорий (можно вынести в отдельный файл)
  const getBackgroundImage = () => {
    switch(category.id) {
      case 1:
        return categoryImg1;
      case 2:
        return categoryImg2;
      case 3:
        return categoryImg3;
      case 4:
        return categoryImg4;
      case 5:
        return categoryImg5;
      default:
        return categoryImg1;
    }
  };

  // Цвет акцента для категории
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
    <div 
      className={styles.card} 
      onClick={handleClick}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3)), url(${getBackgroundImage()})`
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        {/* <div 
          className={styles.iconWrapper}
          style={{ background: `linear-gradient(135deg, ${getCategoryColor()}40, ${getCategoryColor()}20)` }}
        >
          <div className={styles.icon}>{getCategoryIcon()}</div>
        </div> */}
        <h3 className={styles.title}>{category.name}</h3>
        <div className={styles.count}>
          {category.children?.length || 0} подкатегорий
        </div>
        <div className={styles.arrow}>→</div>
      </div>
    </div>
  );
};

export default CategoryCard;