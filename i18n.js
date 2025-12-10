import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import en_errors from './locales/en/errors.json';
import es_errors from './locales/es/errors.json';
import en_login from './locales/en/login.json';
import es_login from './locales/es/login.json';
import en_register from './locales/en/register.json';
import es_register from './locales/es/register.json';
import en_home from './locales/en/home.json';
import es_home from './locales/es/home.json';
import en_common from './locales/en/common.json';
import es_common from './locales/es/common.json';
import en_settings from './locales/en/settings.json';
import es_settings from './locales/es/settings.json';
import en_teams from './locales/en/teams.json';
import es_teams from './locales/es/teams.json';

const resources = {
  en: {
    errors: en_errors,
    login: en_login,
    register: en_register,
    home: en_home,
    common: en_common,
    settings: en_settings,
    teams: en_teams
  },
  es: {
    errors: es_errors,
    login: es_login,
    register: es_register,
    home: es_home,
    common: es_common,
    settings: es_settings,
    teams: es_teams
  },
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;