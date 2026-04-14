import { useDispatch, useSelector } from 'react-redux';
import { toggleManufacturer, setPriceRange, setWeight, setColor, resetFilters } from '../store/slices/filtersSlice';
import { manufacturers, colors } from '../data/mockData';
import styles from './FilterSidebar.module.css';
import { useState, useRef, useEffect } from 'react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { manufacturer, priceRange, weight, color } = useSelector(state => state.filters);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
const weightRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (weightRef.current && !weightRef.current.contains(event.target)) {
      setIsWeightOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const weightOptions = [
  { value: '', label: 'Любой вес', icon: '🔄' },
  { value: 'до 10 кг', label: 'до 10 кг', icon: '📦' },
  { value: '10-20 кг', label: '10-20 кг', icon: '📦' },
  { value: 'более 20 кг', label: 'более 20 кг', icon: '🏋️' },
];ы

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Фильтры</h3>
        <button onClick={() => dispatch(resetFilters())} className={styles.resetBtn}>
          🗑️ Сбросить все
        </button>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>🏭</span> Производитель
        </h4>
        <div className={styles.checkboxGroup}>
          {manufacturers.map(m => (
            <label key={m} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={manufacturer.includes(m)} 
                onChange={() => dispatch(toggleManufacturer(m))}
              />
              <span className={styles.checkmark}></span>
              {m}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>💰</span> Цена
        </h4>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <span>от</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => dispatch(setPriceRange([+e.target.value, priceRange[1]]))}
              placeholder="0"
            />
          </div>
          {/* <span className={styles.priceSeparator}>—</span> */}
          <div className={styles.priceField}>
            <span>до</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => dispatch(setPriceRange([priceRange[0], +e.target.value]))}
              placeholder="150000"
            />
          </div>
        </div>
        <div className={styles.priceRange}>
          <input 
            type="range" 
            min="0" 
            max="150000" 
            value={priceRange[0]} 
            onChange={(e) => dispatch(setPriceRange([+e.target.value, priceRange[1]]))}
          />
          <input 
            type="range" 
            min="0" 
            max="150000" 
            value={priceRange[1]} 
            onChange={(e) => dispatch(setPriceRange([priceRange[0], +e.target.value]))}
          />
        </div>
      </div>

        <div className={styles.filterGroup} ref={weightRef}>
          <h4 className={styles.groupTitle}>
            <span>⚖️</span> Вес
          </h4>
          <div className={styles.customSelect}>
            <div 
              className={`${styles.selectTrigger} ${isWeightOpen ? styles.open : ''}`}
              onClick={() => setIsWeightOpen(!isWeightOpen)}
            >
              <div className={styles.selectedValue}>
                <span className={styles.selectedIcon}>
                  {weightOptions.find(opt => opt.value === weight)?.icon || '⚖️'}
                </span>
                <span>{weightOptions.find(opt => opt.value === weight)?.label || 'Выберите вес'}</span>
              </div>
              <span className={`${styles.selectArrow} ${isWeightOpen ? styles.rotated : ''}`}>▼</span>
            </div>
            {isWeightOpen && (
              <div className={styles.selectDropdown}>
                {weightOptions.map(option => (
                  <div
                    key={option.value}
                    className={`${styles.selectOption} ${weight === option.value ? styles.selected : ''}`}
                    onClick={() => {
                      dispatch(setWeight(option.value));
                      setIsWeightOpen(false);
                    }}
                  >
                    <span className={styles.optionIcon}>{option.icon}</span>
                    <span>{option.label}</span>
                    {weight === option.value && <span className={styles.checkMark}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>🎨</span> Цвет
        </h4>
        <div className={styles.colorOptions}>
          {colors.map(c => (
            <button
              key={c}
              className={`${styles.colorBtn} ${color === c ? styles.active : ''}`}
              onClick={() => dispatch(setColor(color === c ? '' : c))}
              style={{ backgroundColor: c === 'черный' ? '#1a1a1a' : c === 'белый' ? '#f0f0f0' : c === 'серебристый' ? '#c0c0c0' : c === 'нержавейка' ? '#b8b8b8' : '#ffd700' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.activeFilters}>
        {(manufacturer.length > 0 || weight || color || priceRange[0] > 0 || priceRange[1] < 150000) && (
          <>
            <h4>Активные фильтры:</h4>
            <div className={styles.activeFilterTags}>
              {manufacturer.map(m => (
                <span key={m} className={styles.filterTag} onClick={() => dispatch(toggleManufacturer(m))}>
                  {m} ✕
                </span>
              ))}
              {weight && (
                <span className={styles.filterTag} onClick={() => dispatch(setWeight(''))}>
                  {weight} ✕
                </span>
              )}
              {color && (
                <span className={styles.filterTag} onClick={() => dispatch(setColor(''))}>
                  {color} ✕
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 150000) && (
                <span className={styles.filterTag} onClick={() => dispatch(setPriceRange([0, 150000]))}>
                  {priceRange[0]}₽ - {priceRange[1]}₽ ✕
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;