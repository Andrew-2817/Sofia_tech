// components/LoadingSpinner.jsx
import { useEffect, useState } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ 
  minDelay = 2000,  // минимальное время отображения (мс)
  text = 'Загрузка...' 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 200); // Показываем спиннер через 200мс (чтобы не моргало при быстрой загрузке)

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}>
          <div className={styles.bounce1}></div>
          <div className={styles.bounce2}></div>
          <div className={styles.bounce3}></div>
        </div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;