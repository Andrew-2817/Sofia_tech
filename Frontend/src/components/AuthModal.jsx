// components/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, loginUser, clearError } from '../store/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';
import styles from './AuthModal.module.css';
import crossIcon from '../assets/cross.svg';


import {
  IconLogin, IconUserPlus
} from '@tabler/icons-react';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [serverError, setServerError] = useState(null);
  
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      dispatch(clearError());
      setServerError(null);
      setErrors({});
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (authError) {
      setServerError(authError);
    }
  }, [authError]);

  if (!isOpen && !isVisible) return null;

  // Показываем спиннер во время загрузки
  if (loading) {
    return <LoadingSpinner text={activeTab === 'login' ? 'Вход...' : 'Регистрация...'} />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    if (serverError) {
      setServerError(null);
      dispatch(clearError());
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно быть не менее 2 символов';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Имя не должно превышать 50 символов';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Пароль не должен превышать 100 символов';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    
    const validationErrors = activeTab === 'login' ? validateLogin() : validateRegister();
    
    if (Object.keys(validationErrors).length === 0) {
      let result;
      if (activeTab === 'login') {
        result = await dispatch(loginUser({
          email: formData.email.trim(),
          password: formData.password
        }));
      } else {
        result = await dispatch(register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }));
      }
      
      if (result.meta.requestStatus === 'fulfilled') {
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
    setServerError(null);
    setActiveTab('login');
    dispatch(clearError());
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

  const getServerErrorMessage = (errorText) => {
    if (errorText?.includes('email уже существует')) {
      return 'Пользователь с таким email уже зарегистрирован';
    }
    if (errorText?.includes('Неверный email или пароль')) {
      return 'Неверный email или пароль';
    }
    if (errorText?.includes('Аккаунт деактивирован')) {
      return 'Аккаунт деактивирован. Обратитесь в поддержку';
    }
    return errorText || 'Произошла ошибка. Попробуйте позже';
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${isVisible ? styles.modalEnter : styles.modalExit}`}>
        <button className={styles.closeBtn} onClick={handleClose}><img src={crossIcon} alt="" /></button>
        
        <div className={styles.header}>
          <h2>Добро пожаловать</h2>
          <p>Войдите или создайте аккаунт</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('login');
              dispatch(clearError());
              setServerError(null);
            }}
          >
            <IconLogin size={25} />
            Вход
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('register');
              dispatch(clearError());
              setServerError(null);
            }}
          >
            <IconUserPlus size={25} />
            Регистрация
          </button>
        </div>

        {serverError && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{getServerErrorMessage(serverError)}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className={styles.inputGroup}>
              <label>Имя</label>
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
            <label>Email</label>
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
            <label>Пароль</label>
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
              <label>Подтвердите пароль</label>
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
              onClick={() => {
                setActiveTab(activeTab === 'login' ? 'register' : 'login');
                dispatch(clearError());
                setServerError(null);
                setErrors({});
              }}
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