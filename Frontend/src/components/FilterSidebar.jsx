import { useDispatch, useSelector } from 'react-redux';
import { toggleManufacturer, setPriceRange, setWeight, setColor, resetFilters } from '../store/slices/filtersSlice';
import { manufacturers, colors } from '../data/mockData';
import styles from './FilterSidebar.module.css';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { manufacturer, priceRange, weight, color } = useSelector(state => state.filters);

  return (
    <aside className={styles.sidebar}>
      <h3>Фильтры</h3>
      <button onClick={() => dispatch(resetFilters())} className={styles.resetBtn}>Сбросить все</button>

      <div className={styles.filterGroup}>
        <h4>Производитель</h4>
        {manufacturers.map(m => (
          <label key={m}>
            <input type="checkbox" checked={manufacturer.includes(m)} onChange={() => dispatch(toggleManufacturer(m))} />
            {m}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Цена</h4>
        <div className={styles.priceInputs}>
          <input type="number" value={priceRange[0]} onChange={(e) => dispatch(setPriceRange([+e.target.value, priceRange[1]]))} />
          <span>-</span>
          <input type="number" value={priceRange[1]} onChange={(e) => dispatch(setPriceRange([priceRange[0], +e.target.value]))} />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4>Вес</h4>
        <select value={weight} onChange={(e) => dispatch(setWeight(e.target.value))}>
          <option value="">Любой</option>
          <option value="до 10 кг">до 10 кг</option>
          <option value="10-20 кг">10-20 кг</option>
          <option value="более 20 кг">более 20 кг</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4>Цвет</h4>
        <select value={color} onChange={(e) => dispatch(setColor(e.target.value))}>
          <option value="">Любой</option>
          {colors.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </aside>
  );
};

export default FilterSidebar;