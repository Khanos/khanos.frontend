import { useState, useCallback, useEffect } from 'react';
import type { GithubSearchProps, githubCommitType } from '../../types';
import { searchGithubCommits } from '../../services';
import { useTranslations } from '../../i18n/utils';

type tLang = (str: any) => any;

const t: tLang = useTranslations(document.documentElement.lang as any);

const  GithubSearch: React.FC<GithubSearchProps>  = (props) => {
  const { setLoading, searchQuery, setSearchQuery, setCommits } = props;
  const [search, setSearch] = useState(searchQuery);

  const getCommitsData = useCallback( async (search: string) => {
    if(search.length <= 3) return;
    setLoading(true);
    const data = await searchGithubCommits(search) as { items: githubCommitType[]; total_count: number; };
    if (data.total_count > 0) {
      setCommits(data.items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getCommitsData(searchQuery);
  }, [getCommitsData, searchQuery]);

  return (
    <div className="flex flex-col justify-center items-center mb-6"> 
      <img className="w-40 h-40 mb-3 rounded-full shadow-lg" src="/img/github.png" alt="Bonnie image"/>
      <div className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
        <h2><span className="text-[#F800AE]">G</span>itHub API</h2>
        <h2><span className="text-[#F800AE]">D</span>emo</h2>
      </div>
      <input 
        className="w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        type="text" 
        id="search" 
        aria-describedby="helper-text-explanation" 
        placeholder={t('github').placeholder}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          console.log('e.key: ', search);
          if (e.key === "Enter")
            setSearchQuery(search)
          }}
      >
      </input>
      <div className="text-xs text-center mb-6 text-gray-500 dark:text-gray-400">
        <p>{t('github').descriptionpt1}</p>
        <p>{t('github').descriptionpt2}</p>
      </div>
      <button onClick={() => setSearchQuery(search)} type="button" className="max-w-60 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">{t('github').button}</button>
    </div>
  )
}

export default GithubSearch;
