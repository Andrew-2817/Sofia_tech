import { useDispatch, useSelector } from 'react-redux';
import { toggleManufacturer, setPriceRange, setColor, setLoadCapacity, setEnergyClass, resetFilters } from '../store/slices/filtersSlice';
import styles from './FilterSidebar.module.css';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { manufacturer, priceRange, color, loadCapacity, energyClass } = useSelector(state => state.filters);

  // Производители из товаров
  const manufacturers = ['Schulthess', 'Kuppersbusch', 'Elica', 'Nivona'];
  
  // Цвета
  const colors = ['Черный', 'Белый', 'Нержавеющая сталь', 'Серебристый', 'Титан', 'Антрацит'];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Фильтры</h3>
        <button onClick={() => dispatch(resetFilters())} className={styles.resetBtn}>
          🗑️ Сбросить все
        </button>
      </div>

      {/* Производитель */}
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

      {/* Цена */}
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
          <span className={styles.priceSeparator}>—</span>
          <div className={styles.priceField}>
            <span>до</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => dispatch(setPriceRange([priceRange[0], +e.target.value]))}
              placeholder="500000"
            />
          </div>
        </div>
        <div className={styles.priceRange}>
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="5000"
            value={priceRange[0]} 
            onChange={(e) => dispatch(setPriceRange([+e.target.value, priceRange[1]]))}
          />
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="5000"
            value={priceRange[1]} 
            onChange={(e) => dispatch(setPriceRange([priceRange[0], +e.target.value]))}
          />
        </div>
      </div>

      {/* Цвет */}
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
              style={{ 
                backgroundColor: c === 'Черный' ? '#2a2a2a' : 
                               c === 'Белый' ? '#f5f5f5' : 
                               c === 'Нержавеющая сталь' ? '#c0c0c0' :
                               c === 'Серебристый' ? '#e0e0e0' :
                               c === 'Титан' ? '#b8b8b8' : '#4a4a4a',
                color: c === 'Белый' ? '#333' : '#f0f0f0'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Загрузка (для стиральных машин) */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>⚖️</span> Загрузка
        </h4>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="loadCapacity"
              value=""
              checked={loadCapacity === ''}
              onChange={() => dispatch(setLoadCapacity(''))}
            />
            <span className={styles.radioCustom}></span>
            <span>Любая</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="loadCapacity"
              value="до 6 кг"
              checked={loadCapacity === 'до 6 кг'}
              onChange={() => dispatch(setLoadCapacity('до 6 кг'))}
            />
            <span className={styles.radioCustom}></span>
            <span>📦 до 6 кг</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="loadCapacity"
              value="6-8 кг"
              checked={loadCapacity === '6-8 кг'}
              onChange={() => dispatch(setLoadCapacity('6-8 кг'))}
            />
            <span className={styles.radioCustom}></span>
            <span>📦 6-8 кг</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="loadCapacity"
              value="более 8 кг"
              checked={loadCapacity === 'более 8 кг'}
              onChange={() => dispatch(setLoadCapacity('более 8 кг'))}
            />
            <span className={styles.radioCustom}></span>
            <span>📦 более 8 кг</span>
          </label>
        </div>
      </div>

      {/* Класс энергоэффективности */}
      <div className={styles.filterGroup}>
        <h4 className={styles.groupTitle}>
          <span>⚡</span> Энергоэффективность
        </h4>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="energyClass"
              value=""
              checked={energyClass === ''}
              onChange={() => dispatch(setEnergyClass(''))}
            />
            <span className={styles.radioCustom}></span>
            <span>Любой</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="energyClass"
              value="A+++"
              checked={energyClass === 'A+++'}
              onChange={() => dispatch(setEnergyClass('A+++'))}
            />
            <span className={styles.radioCustom}></span>
            <span>A+++</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="energyClass"
              value="A++"
              checked={energyClass === 'A++'}
              onChange={() => dispatch(setEnergyClass('A++'))}
            />
            <span className={styles.radioCustom}></span>
            <span>A++</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="energyClass"
              value="A+"
              checked={energyClass === 'A+'}
              onChange={() => dispatch(setEnergyClass('A+'))}
            />
            <span className={styles.radioCustom}></span>
            <span>A+</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="energyClass"
              value="A"
              checked={energyClass === 'A'}
              onChange={() => dispatch(setEnergyClass('A'))}
            />
            <span className={styles.radioCustom}></span>
            <span>A</span>
          </label>
        </div>
      </div>

      {/* Активные фильтры */}
      {(manufacturer.length > 0 || color || loadCapacity || energyClass || priceRange[0] > 0 || priceRange[1] < 500000) && (
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
                {color} ✕
              </span>
            )}
            {loadCapacity && (
              <span className={styles.filterTag} onClick={() => dispatch(setLoadCapacity(''))}>
                {loadCapacity} ✕
              </span>
            )}
            {energyClass && (
              <span className={styles.filterTag} onClick={() => dispatch(setEnergyClass(''))}>
                Класс {energyClass} ✕
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500000) && (
              <span className={styles.filterTag} onClick={() => dispatch(setPriceRange([0, 500000]))}>
                {priceRange[0].toLocaleString()}₽ - {priceRange[1].toLocaleString()}₽ ✕
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;