import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const categories = ['Холодильники', 'Микроволновки', 'Телевизоры', 'Стиральные машины', 'Пылесосы'];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.columns}>
          <div>
            <h3>TechStore</h3>
            <p>Лучшая бытовая техника</p>
          </div>
          <div>
            <h4>Категории</h4>
            <ul>
              {categories.map(cat => <li key={cat}><Link to={`/catalog?category=${cat}`}>{cat}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Контакты</h4>
            <p>📞 +7 (999) 123-45-67</p>
            <p>✉️ info@techstore.ru</p>
            <p>📍 Москва, ул. Техническая, 1</p>
          </div>
        </div>
        <div className={styles.bottom}>
          &copy; 2025 TechStore. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;