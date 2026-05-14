// FilterSidebar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { 
  toggleManufacturer, 
  setPriceRange, 
  setColor, 
  resetFilters,
  setBrand,
  setInStock
} from '../store/slices/filtersSlice';
import styles from './FilterSidebar.module.css';

import trashIcon from "../assets/trash.svg";
import colorIcon from "../assets/colors.svg";
import moneyIcon from "../assets/money.svg";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { 
    manufacturer, 
    priceRange, 
    color, 
    brand,
    inStock 
  } = useSelector(state => state.filters);
  
  const { items: products } = useSelector(state => state.products);

  // Динамическое получение производителей из товаров
  const [manufacturers, setManufacturers] = useState([]);
  
  // Общие цвета (из реальных товаров)
  const [colors, setColors] = useState([]);

  // Получаем уникальных производителей и цвета из товаров
  useEffect(() => {
    if (products && products.length > 0) {
      // Уникальные производители
      const uniqueManufacturers = [...new Set(
        products
          .map(p => p.brandName)
          .filter(Boolean)
      )];
      setManufacturers(uniqueManufacturers);
      
      // Уникальные цвета (только у Homeier есть цвет, у Brandt может не быть)
      const uniqueColors = [...new Set(
        products
          .map(p => p.color)
          .filter(c => c && c !== 'null' && c !== 'undefined')
      )];
      setColors(uniqueColors);
    }
  }, [products]);

  // Максимальная цена из товаров
  const maxProductPrice = products.length > 0 
    ? Math.max(...products.map(p => p.price || 0))
    : 500000;
  
  const minProductPrice = products.length > 0 
    ? Math.min(...products.map(p => p.price || 0))
    : 0;

  // Обработчик изменения цены
  const handlePriceChange = (index, value) => {
    let newValue = parseInt(value) || 0;
    if (index === 0) {
      // Минимальная цена не может быть больше максимальной
      if (newValue > priceRange[1]) {
        newValue = priceRange[1];
      }
      dispatch(setPriceRange([newValue, priceRange[1]]));
    } else {
      // Максимальная цена не может быть меньше минимальной
      if (newValue < priceRange[0]) {
        newValue = priceRange[0];
      }
      dispatch(setPriceRange([priceRange[0], newValue]));
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Фильтры</h3>
        <button onClick={() => dispatch(resetFilters())} className={styles.resetBtn}>
          <img src={trashIcon} alt="" /> <p>Сбросить все</p>
        </button>
      </div>

      {/* Бренд / Производитель */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>🏭</span> Бренд
        </h4>
        <div className={styles.checkboxGroup}>
          {manufacturers.map(m => (
            <label key={m} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={manufacturer.includes(m.toLowerCase())} 
                onChange={() => dispatch(toggleManufacturer(m))}
              />
              <span className={styles.checkmark}></span>
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Цена (общая для всех) */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <img src={moneyIcon} alt="" /> <p>Цена, ₽</p>
        </h4>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <span>от</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min={minProductPrice}
              max={priceRange[1]}
              step={1000}
            />
          </div>
          <span className={styles.priceSeparator}>—</span>
          <div className={styles.priceField}>
            <span>до</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min={priceRange[0]}
              max={maxProductPrice}
              step={1000}
            />
          </div>
        </div>
        <div className={styles.priceRangeSlider}>
          <input 
            type="range" 
            min={minProductPrice} 
            max={maxProductPrice} 
            step={1000}
            value={priceRange[0]} 
            onChange={(e) => handlePriceChange(0, e.target.value)}
          />
          <input 
            type="range" 
            min={minProductPrice} 
            max={maxProductPrice} 
            step={1000}
            value={priceRange[1]} 
            onChange={(e) => handlePriceChange(1, e.target.value)}
          />
        </div>
        <div className={styles.priceHint}>
          <span>от {priceRange[0].toLocaleString()} ₽</span>
          <span>до {priceRange[1].toLocaleString()} ₽</span>
        </div>
      </div>

      {/* Цвет (есть не у всех, показываем если есть) */}
      {colors.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.groupTitle}>
            <img src={colorIcon} alt="" /> <p>Цвет</p>
          </h4>
          <div className={styles.colorOptions}>
            <button
              className={`${styles.colorBtn} ${color === '' ? styles.active : ''}`}
              onClick={() => dispatch(setColor(''))}
            >
              Все
            </button>
            {colors.map(c => (
              <button
                key={c}
                className={`${styles.colorBtn} ${color === c ? styles.active : ''}`}
                onClick={() => dispatch(setColor(color === c ? '' : c))}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Наличие (общий фильтр) */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>📦</span> Наличие
        </h4>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="inStock"
              checked={inStock === null}
              onChange={() => dispatch(setInStock(null))}
            />
            <span className={styles.radioCustom}></span>
            <span>Все товары</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="inStock"
              checked={inStock === true}
              onChange={() => dispatch(setInStock(true))}
            />
            <span className={styles.radioCustom}></span>
            <span>✅ В наличии</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="inStock"
              checked={inStock === false}
              onChange={() => dispatch(setInStock(false))}
            />
            <span className={styles.radioCustom}></span>
            <span>📅 Под заказ</span>
          </label>
        </div>
      </div>

      {/* Активные фильтры */}
      {(manufacturer.length > 0 || color || brand || inStock !== null || 
        priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
        <div className={styles.activeFilters}>
          <h4>Активные фильтры:</h4>
          <div className={styles.activeFilterTags}>
            {manufacturer.map(m => (
              <span key={m} className={styles.filterTag} onClick={() => dispatch(toggleManufacturer(m))}>
                {m} ✕
              </span>
            ))}
            {color && (
              <span className={styles.filterTag} onClick={() => dispatch(setColor(''))}>
                Цвет: {color} ✕
              </span>
            )}
            {brand && (
              <span className={styles.filterTag} onClick={() => dispatch(setBrand(null))}>
                Бренд: {brand} ✕
              </span>
            )}
            {inStock !== null && (
              <span className={styles.filterTag} onClick={() => dispatch(setInStock(null))}>
                {inStock ? 'В наличии' : 'Под заказ'} ✕
              </span>
            )}
            {(priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
              <span className={styles.filterTag} onClick={() => dispatch(setPriceRange([minProductPrice, maxProductPrice]))}>
                {priceRange[0].toLocaleString()}₽ — {priceRange[1].toLocaleString()}₽ ✕
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;