import { useSelector } from 'react-redux';
import Slider from '../components/Slider';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/mockData';
import styles from './HomePage.module.css';

const HomePage = () => {
  const products = useSelector(state => state.products.items);
  const popular = products.filter(p => p.isPopular);
  const news = products.filter(p => p.isNew);

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
        <h2>Категории</h2>
        <div className={styles.categoriesGrid}>
            {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
        </div>
        <Slider title="Популярные товары" products={popular} />
        <Slider title="Новинки" products={news} />
      </div>
    </>
  );
};

export default HomePage;