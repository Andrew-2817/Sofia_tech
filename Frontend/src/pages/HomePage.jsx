import { useSelector } from 'react-redux';
import Slider from '../components/Slider';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/mockData';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './HomePage.module.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
const HomePage = () => {
  const products = useSelector(state => state.products.items);
  const navigate = useNavigate();
  const popular = products.slice(56, 70);
  const news = products.slice(48,60);
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <LoadingSpinner text="Загрузка ..." />;
  }

  return (
    <>
      <div className={styles.banner}>
        <div className="container">
          <h1>Скидки на бытовую технику до 50%</h1>
          <button>Узнать больше</button>
        </div>
      </div>
      <div className="container">
        <div className={styles.categoriesBlock}>
          <div className={styles.sectionHeader}>
            <h2>Категории</h2>
            <button 
              className={styles.viewAllBtn}
              onClick={() => navigate('/catalog')}
            >
              Все категории →
            </button>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
        <Slider title="Популярные товары" products={popular} />
        <Slider title="Новинки" products={news} />
      </div>
    </>
  );
};

export default HomePage;