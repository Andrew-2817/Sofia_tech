import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' или 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку для этого поля
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email невалидный';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    else if (formData.name.length < 2) newErrors.name = 'Имя должно быть не менее 2 символов';
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email невалидный';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = activeTab === 'login' ? validateLogin() : validateRegister();
    
    if (Object.keys(validationErrors).length === 0) {
      if (activeTab === 'login') {
        dispatch(login({ name: formData.name || formData.email.split('@')[0], email: formData.email }));
        onClose();
        resetForm();
      } else {
        // Здесь можно добавить регистрацию
        dispatch(login({ name: formData.name, email: formData.email }));
        onClose();
        resetForm();
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setActiveTab('login');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${isVisible ? styles.modalEnter : styles.modalExit}`}>
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
        
        <div className={styles.header}>
          <h2>Добро пожаловать</h2>
          <p>Войдите или создайте аккаунт</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <span>🔐</span>
            Вход
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <span>📝</span>
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className={styles.inputGroup}>
              <label>
                <span>👤</span>
                Имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.error : ''}
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>
              <span>📧</span>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>
              <span>🔒</span>
              Пароль
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.error : ''}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          {activeTab === 'register' && (
            <div className={styles.inputGroup}>
              <label>
                <span>✓</span>
                Подтвердите пароль
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? styles.error : ''}
              />
              {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {activeTab === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            >
              {activeTab === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;