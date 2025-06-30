import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // 번역 파일을 서버에서 로드합니다.
  .use(LanguageDetector) // 사용자의 브라우저 언어를 감지합니다.
  .use(initReactI18next) // i18n 인스턴스를 react-i18next에 전달합니다.
  .init({
    lng: 'ko', // 기본 언어를 한국어로 명시적 설정
    supportedLngs: ['ko', 'en'],
    fallbackLng: 'ko', // 설정된 언어의 번역이 없을 경우 사용할 언어
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 번역 파일 경로
    },
    ns: ['auth', 'common', 'main'], // 네임스페이스
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n; 