import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import Slider from '../components/Slider';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(state => state.products.items.find(p => p.id === parseInt(id)));
  const allProducts = useSelector(state => state.products.items);
  const isFavorite = useSelector(state => state.favorites.items.includes(parseInt(id)));

  if (!product) return <div className="container">Товар не найден</div>;

  const similarProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);

  return (
    <div className="container">
      <div className={styles.productPage}>
        <div className={styles.main}>
          <div className={styles.image}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={styles.info}>
            <h1>{product.name}</h1>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
            <div className={styles.specs}>
              <p><strong>Производитель:</strong> {product.manufacturer}</p>
              <p><strong>Вес:</strong> {product.weight}</p>
              <p><strong>Цвет:</strong> {product.color}</p>
              <p><strong>Описание:</strong> {product.description}</p>
              <p><strong>Характеристики:</strong> {product.specs}</p>
            </div>
            <div className={styles.buttons}>
              <button className={styles.fav} onClick={() => dispatch(toggleFavorite(product.id))}>
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
              <button className={styles.cart} onClick={() => dispatch(addToCart({ id: product.id }))}>
                🛒 В корзину
              </button>
            </div>
          </div>
        </div>
        <Slider title="Похожие товары" products={similarProducts} />
      </div>
    </div>
  );
};

export default ProductPage;