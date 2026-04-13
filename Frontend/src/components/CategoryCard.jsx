import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCategory } from '../store/slices/filtersSlice';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(setCategory(category.name));
    navigate('/catalog');
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.icon}>{category.icon}</div>
      <h3>{category.name}</h3>
    </div>
  );
};

export default CategoryCard;