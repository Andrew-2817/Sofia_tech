import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { setCategory, setSearchQuery } from '../store/slices/filtersSlice';
import { categories } from '../data/mockData';
import styles from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items: allProducts } = useSelector(state => state.products);
  const { searchQuery, category, manufacturer, priceRange, weight, color } = useSelector(state => state.filters);
  const [isLoading, setIsLoading] = useState(false);

  // Синхронизация URL с фильтрами при загрузке
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) dispatch(setCategory(catParam));
  }, [searchParams, dispatch]);

  // Эффект загрузки при изменении фильтров
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, category, manufacturer, priceRange, weight, color]);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    const matchesManufacturer = manufacturer.length === 0 || manufacturer.includes(product.manufacturer);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesWeight = weight === '' || (weight === 'до 10 кг' && parseInt(product.weight) <= 10) ||
      (weight === '10-20 кг' && parseInt(product.weight) > 10 && parseInt(product.weight) <= 20) ||
      (weight === 'более 20 кг' && parseInt(product.weight) > 20);
    const matchesColor = color === '' || product.color === color;
    return matchesSearch && matchesCategory && matchesManufacturer && matchesPrice && matchesWeight && matchesColor;
  });

  return (
    <div className="container">
      <div className={styles.catalogLayout}>
        <div className={styles.filterWrapper}>
          <FilterSidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Поиск в каталоге..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
          <div className={styles.tabs}>
            <button className={category === 'all' ? styles.active : ''} onClick={() => dispatch(setCategory('all'))}>
              Все
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={category === cat.name ? styles.active : ''} 
                onClick={() => dispatch(setCategory(cat.name))}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className={`${styles.productsGrid} ${isLoading ? styles.loading : ''}`}>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={styles.productItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && !isLoading && (
            <p className={styles.noResults}>Товары не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;