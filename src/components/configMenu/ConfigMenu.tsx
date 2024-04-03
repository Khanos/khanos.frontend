import { useState, useEffect } from 'react';
import { useTranslations } from '../../i18n/utils';
import CogIcon from '../icons/Cog';
import EnFlag from '../icons/EnFlag';
import EsFlag from '../icons/EsFlag';

type tLang = (str: any) => any;
type ConfigMenuProps = {
  lang: string;
};
const ConfigMenu = (props: ConfigMenuProps) => {
  const { lang } = props;
  const t: tLang = useTranslations(lang as 'en' | 'es');
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('');

  const toggleMenu = () => {
    console.log(document.querySelector('.dropdown-menu'))
    document.querySelector('.dropdown-menu')?.classList.toggle('block');
    console.log('toggleMenu clicked!')
  }

  const toggleTheme = (e: any) => {
    const theme = e.target.value === 'light' ? 'dark' : 'light';
    setTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark');
  }

  const toggleLanguage = (e: any) => {
    const lang = language === 'en' ? 'es' : 'en';
    let currentUrl = window.location.href;
    let nextUrl = new URL(currentUrl);
    if(currentUrl.match(/\/en\/|\/es\//)) {
      if(currentUrl.includes('/en/')) {
        currentUrl = currentUrl.replace(/\/en\//, `/${lang}/`);
      } else {
        currentUrl = currentUrl.replace(/\/es\//, `/${lang}/`);
      }
      nextUrl = new URL(currentUrl);
    }
    if(nextUrl.searchParams.get('lang')) {
      nextUrl.searchParams.set('lang', lang);
    } else {
      nextUrl.searchParams.append('lang', lang);
    }
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    window.location.href = nextUrl.toString();
  }

  useEffect(() => {
    if(!theme) {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
      document.documentElement.classList[storedTheme === 'dark' ? "add" : "remove"]("dark")
    }
    if(!language) {
      setLanguage(localStorage.getItem('lang') || lang);
    }
  }, [theme, language]);

  return (
    <div className="dropdown inline-block relative">
      <button onClick={toggleMenu} className="py-2 px-2 rounded appearance-none border-none flex transition hover:scale-125">
        <CogIcon 
          id="light" 
          className="theme-toggle-icon size-5 transition-all fill:text-gray-600 dark:fill-gray-200" 
        />
      </button>
      <ul className="dropdown-menu absolute hidden right-0 md:left-0 text-gray-700 pt-1
        text-sm p-1 min-w-[10rem] rounded-md border border-gray-100 bg-white/90 dark:bg-gray-900/90 dark:border-gray-500/20 shadow-[0_3px_10px_rgb(0,0,0,0.2)] backdrop-blur-md
      ">
        <li className="px-2 py-1.5 mb-2 cursor-default hover:bg-neutral-400/40 dark:hover:bg-gray-500/50 rounded-sm">
          <label className="flex justify-between cursor-pointer">
            <input type="checkbox" value={theme} onChange={toggleTheme} checked={theme === 'dark' ? true : false} className="sr-only peer"></input>
            <span className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            { t('configs')[theme] }
            </span>
            <div className="
            bg-gray-200 dark:bg-gray-700 dark:border-[#F800AE]
            peer-checked:bg-gray-200 dark:peer-checked:bg-gray-700 peer-checked:after:border-[#F800AE]
            after:bg-[#F800AE] after:border-[#F800AE]
            after:top-[-.5px] after:start-[-.5px]
            relative w-10 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
            </div>
          </label>
        </li>
        <li className="px-2 py-1.5 cursor-default hover:bg-neutral-400/40 dark:hover:bg-gray-500/50 rounded-sm">
          <label className="flex justify-between cursor-pointer">
            <input type="checkbox" value={language} onChange={toggleLanguage} checked={language === 'en' ? true : false} className="sr-only peer"></input>
            <span className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
              {language === 'en' ? (
                <EnFlag className="h-4 w-4 mr-2" />
              ) : (
                <EsFlag className="h-4 w-4 mr-2" />
              )}
              { t('configs')[language] }
            </span>
            <div className="
            bg-gray-200 dark:bg-gray-700 dark:border-[#F800AE]
            peer-checked:bg-gray-200 dark:peer-checked:bg-gray-700 peer-checked:after:border-[#F800AE]
            after:bg-[#F800AE] after:border-[#F800AE]
            after:top-[-.5px] after:start-[-.5px]
            relative w-10 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
            </div>
          </label>
        </li>
      </ul>
    </div>
  );
}

export default ConfigMenu;