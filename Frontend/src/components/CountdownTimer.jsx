// components/CountdownTimer.jsx
import { useState, useEffect } from 'react';
import styles from '../pages/HomePage.module.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={styles.discountTimer}>
      <div className={styles.timerItem}>
        <span className={styles.timerValue}>{timeLeft.days}</span>
        <span className={styles.timerLabel}>дней</span>
      </div>
      <div className={styles.timerItem}>
        <span className={styles.timerValue}>{timeLeft.hours}</span>
        <span className={styles.timerLabel}>часов</span>
      </div>
      <div className={styles.timerItem}>
        <span className={styles.timerValue}>{timeLeft.minutes}</span>
        <span className={styles.timerLabel}>минут</span>
      </div>
      <div className={styles.timerItem}>
        <span className={styles.timerValue}>{timeLeft.seconds}</span>
        <span className={styles.timerLabel}>секунд</span>
      </div>
    </div>
  );
};

export default CountdownTimer;