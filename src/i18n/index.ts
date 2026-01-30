import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import es from './locales/es.json';
import en from './locales/en.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
};

const getDeviceLanguage = () => {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
        return locales[0].languageCode;
    }
    return 'es';
};

const initOptions = {
    resources,
    lng: getDeviceLanguage() || 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4' as const,
};

i18n
  .use(initReactI18next)
  .init(initOptions);

export default i18n;
