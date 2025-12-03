import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en_login from './locales/en/login.json';
import es_login from './locales/es/login.json';
import en_register from './locales/en/register.json';
import es_register from './locales/es/register.json';
import en_home from './locales/en/home.json';
import es_home from './locales/es/home.json';
import en_game from './locales/en/game.json';
import es_game from './locales/es/game.json';
import en_common from './locales/en/common.json';
import es_common from './locales/es/common.json';
import en_settings from './locales/en/settings.json';
import es_settings from './locales/es/settings.json';
import en_teams from './locales/en/teams.json';
import es_teams from './locales/es/teams.json';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init
const resources = {
  en: {
    login: en_login,
    register: en_register,
    home: en_home,
    game: en_game,
    common: en_common,
    settings: en_settings,
    teams: en_teams
  },
  es: {
    login: es_login,
    register: es_register,
    home: es_home,
    game: es_game,
    common: es_common,
    settings: es_settings,
    teams: es_teams
  },
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  //.use(Backend)
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