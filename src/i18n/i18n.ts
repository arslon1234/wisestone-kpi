import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../../public/locales/en.json';
import ko from '../../public/locales/ko.json';
import uz from '../../public/locales/uz.json';

i18n
  .use(initReactI18next) // React uchun integratsiya
  .use(LanguageDetector) // Brauzer tilini avtomatik aniqlash
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      uz: { translation: uz }
    },
    lng: localStorage.getItem('lang') || 'en', // Saqlangan tilni olish yoki default en
    fallbackLng: 'en', // Agar tarjima topilmasa, ingliz tiliga qaytadi
    interpolation: { escapeValue: false } // JSX ni ishlatish uchun
  });

export default i18n;
