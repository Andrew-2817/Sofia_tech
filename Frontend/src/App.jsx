import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import './App.module.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/favorites" element={<CatalogPage />} /> {/* можно реализовать отдельно */}
          <Route path="/cart" element={<CatalogPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;