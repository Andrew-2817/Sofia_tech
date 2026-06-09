import { useNavigate } from 'react-router-dom';
import styles from './CooperationPage.module.css';
import copperImg from "../assets/photo-1497366216548-37526070297c.jpg"
import {
  IconFlame ,     // Огонь
IconMail   ,    // Почта
IconPhone  ,    // Телефон
IconMapPin ,    // Адрес
IconTag  ,
IconUser    ,    // Получатель
IconEdit   ,     // Редактировать
IconMessage,
IconBuildingFactory,IconCurrencyRubel, IconArrowsHorizontal, IconHome
} from '@tabler/icons-react';

const CooperationPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className="container">
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <h1 className={styles.pageTitle}>Сотрудничество</h1>

        <div className={styles.card}>
          {/* Левая часть — текст */}
          <div className={styles.cardLeft}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}><IconHome size={22}/></span>
              <span className={styles.logoText}>profit</span>
            </div>

            <p className={styles.intro}>
              <strong>profit</strong> приглашает дизайнеров и архитекторов
              к взаимовыгодному сотрудничеству.
            </p>
            <p className={styles.sub}>
              В случае заинтересованности, свяжитесь с нами по телефону и email:
            </p>

            <div className={styles.contacts}>
              <a href="tel:+74951524027" className={styles.contactItem}>
                <IconPhone size={22}/>
                <span>+7 (906) 760-00-88</span>
              </a>
              <a href="mailto:shop@euroflett.ru" className={styles.contactItem}>
                <IconMail size={22}/>
                <span>profit.teh@yandex.ru</span>
              </a>
            </div>
          </div>

          {/* Правая часть — фото */}
          <div className={styles.cardRight}>
            <div className={styles.photoOverlay} />
            <img
              className={styles.photo}
              src={copperImg}
              alt="Дизайнеры за работой"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CooperationPage;
