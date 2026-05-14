// App.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { fetchCategoriesTree } from './store/slices/categoriesSlice';
import { fetchAllProducts } from './store/slices/productsSlice'; // Добавляем
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import './App.module.css';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { tree: categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { items: products, loading: productsLoading } = useSelector(state => state.products);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Загружаем категории
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategoriesTree());
    }
    // Загружаем товары
    if (products.length === 0 && !productsLoading) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, categories.length, categoriesLoading, products.length, productsLoading]);


  if (loading) {
    // return <LoadingSpinner text="Загрузка..." />;
  }

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:brandId/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;