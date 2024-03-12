import { useState, useCallback, useEffect } from 'react';
import { gerUrlList, addShortUrl } from '../../services';
import type { urlShortenerType, urlListType } from '../../types';
import { useTranslations } from '../../i18n/utils';
import UrlList from './UrlList';

type tLang = (str: any) => any;
const t: tLang = useTranslations(document.documentElement.lang as any);

export const UrlMain = () => {
  const [url, setUrl] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [urlList, setUrlList] = useState<urlShortenerType[]>([]);

  const addUrl = async (url: string) => {
    setWarning('');
    const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
    if(!urlRegex.test(url)) {
      setWarning(t('url').invalid);
      setUrl('');
      return;
    }
    if(urlList.some((item) => item.original_url === url)) {
      setWarning(t('url').alreadyInList);
      return;
    }
    const response = await addShortUrl(url) as urlShortenerType;
    if(response.original_url === url) {
      setUrlList([...urlList, response]);
      setUrl('');
    } else {
      setWarning(t('url').fetchError);
    }
  };

  const fetchUrlList = useCallback(async () => {
    setLoading(true);
    if(urlList.length > 0) return;
    const response = await gerUrlList() as urlListType;
    setLoading(false);
    if(response === undefined) return;
    setUrlList(response.data);
  }, [urlList]);

  useEffect(() => {
    fetchUrlList();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mb-6"> 
      <div className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
        <h1><span className="text-[#F800AE]">URL</span> Shortener</h1>
        <p className="text-sm">{t('url').description}</p>
      </div>
      <div className="relative mb-10">
        <input 
          className="w-[80vw] max-w-4xl min-h-14 pr-[110px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          type="text" 
          id="search" 
          aria-describedby="helper-text-explanation" 
          value={url}
          placeholder={t('url').placeholder}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              addUrl(url);
            }}
        >
        </input>
        <button onClick={() => addUrl(url)} type="button" className="absolute end-2 bottom-4 max-w-60 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{t('url').button}</button>
        { warning && <p className="text-red-500 text-sm absolute bottom-[-1.5rem]">{warning}</p> }
      </div>
      { loading ?
        <p>{ t('url').loading }</p>
        :
        <UrlList urlList={urlList} setUrlList={setUrlList}/>
      }
    </div>
  )
}

export default UrlMain;