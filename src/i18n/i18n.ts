import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../../public/locales/en.json';
import kr from '../../public/locales/kr.json';

i18n
  .use(initReactI18next) // React uchun integratsiya
  .use(LanguageDetector) // Brauzer tilini avtomatik aniqlash
  .init({
    resources: {
      en: { translation: en },
      kr: { translation: kr },
    },
    lng: localStorage.getItem('lang') || 'en', // Saqlangan tilni olish yoki default en
    fallbackLng: 'en', // Agar tarjima topilmasa, ingliz tiliga qaytadi
    interpolation: { escapeValue: false } // JSX ni ishlatish uchun
  });

export default i18n;
