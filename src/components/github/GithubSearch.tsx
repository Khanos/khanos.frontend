import { useState, useEffect } from 'react';
import type { GithubSearchProps } from '../../types';
import { searchGithubCommits } from '../../services';
import { useTranslations } from '../../i18n/utils';

type tLang = (str: any) => any;

const t: tLang = useTranslations(document.documentElement.lang as any);

const  GithubSearch: React.FC<GithubSearchProps>  = (props) => {
  const { setLoading, searchQuery, setSearchQuery, setCommits } = props;
  const [search, setSearch] = useState(searchQuery);

  const [warning, setWarning] = useState('');
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setWarning('');
    setEmpty(false);
    setCommits([]);
    if (!searchQuery.trim()) { setLoading(false); return; }
    setLoading(true);
    searchGithubCommits(searchQuery, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setCommits(data.items);
      setEmpty(data.items.length === 0);
    }).catch(() => {
      if (!controller.signal.aborted) setWarning(t('github').fetchError);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [searchQuery, setLoading, setCommits]);

  return (
    <div className="flex flex-col justify-center items-center mb-6"> 
      <img className="w-40 h-40 mb-3 rounded-full shadow-lg" src="/img/github.png" alt="Bonnie image"/>
      <div className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
        <h2><span className="text-[#F800AE]">G</span>itHub API</h2>
        <h2><span className="text-[#F800AE]">D</span>emo</h2>
      </div>
      {warning && <p role="alert" className="text-red-500 mb-4">{warning}</p>}
      {empty && <p role="status">{t('github').noResults}</p>}
      <input 
        className="w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        type="text" 
        id="search" 
        aria-describedby="helper-text-explanation" 
        placeholder={t('github').placeholder}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setSearchQuery(search)
          }}
      >
      </input>
      <div className="text-xs text-center mb-6 text-gray-500 dark:text-gray-400">
        <p>{t('github').descriptionpt1}</p>
        <p>{t('github').descriptionpt2}</p>
      </div>
      <button onClick={() => setSearchQuery(search)} aria-label={t('github').placeholder} type="button" className="max-w-60 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">{t('github').button}</button>
    </div>
  )
}

export default GithubSearch;
