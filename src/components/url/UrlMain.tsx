import { useState, useEffect } from 'react';
import { gerUrlList, addShortUrl, deleteShortUrl } from '../../services';
import { validOriginalUrl } from '../../services/contracts';
import type { urlShortenerType } from '../../types';
import { useTranslations } from '../../i18n/utils';
import UrlList from './UrlList';

const t: (key: any) => any = useTranslations(document.documentElement.lang as any);

export const UrlMain = () => {
  const [url, setUrl] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlList, setUrlList] = useState<urlShortenerType[]>([]);
  const [next, setNext] = useState<string | null>(null);

  const fetchPage = async (after?: string) => {
    setLoading(true);
    setWarning('');
    try {
      const response = await gerUrlList(after);
      setUrlList(current => {
        const records = after ? [...current, ...response.data] : response.data;
        return records.filter((record, index) => records.findIndex(item => item.short_url === record.short_url) === index).sort((a, b) => a._id.localeCompare(b._id));
      });
      setNext(response.pagination.next);
    } catch { setWarning(t('url').fetchError); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const addUrl = async () => {
    if (loading) return;
    setWarning('');
    if (!validOriginalUrl(url)) { setWarning(t('url').invalid); return; }
    if (urlList.some(item => item.original_url === url)) { setWarning(t('url').alreadyInList); return; }
    setLoading(true);
    try {
      const response = await addShortUrl(url);
      setUrl('');
      setUrlList(current => current.some(item => item.short_url === response.short_url) ? current : [...current, response]);
    } catch { setWarning(t('url').fetchError); }
    finally { setLoading(false); }
  };
  const removeUrl = async (code: number) => {
    setLoading(true);
    setWarning('');
    try {
      await deleteShortUrl(code);
      setUrlList(current => current.filter(item => item.short_url !== code));
    } catch { setWarning(t('url').fetchError); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col justify-center items-center mb-6">
      <div className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
        <h1><span className="text-[#F800AE]">URL</span> Shortener</h1>
        <p className="text-sm">{t('url').description}</p>
      </div>
      <div className="relative mb-10">
        <input className="w-[80vw] max-w-4xl min-h-14 pr-[110px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50" type="text" id="search" value={url} placeholder={t('url').placeholder} onChange={event => setUrl(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') addUrl(); }} disabled={loading} />
        <button onClick={addUrl} disabled={loading} type="button" className="absolute end-2 bottom-4 max-w-60 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" aria-label={t('url').button}>{t('url').button}</button>
      </div>
      {warning && <p role="alert" className="text-red-500 text-sm mb-4">{warning}</p>}
      {loading && <p role="status">{t('url').loading}</p>}
      <UrlList urlList={urlList} onDelete={removeUrl} disabled={loading} />
      {next && <button type="button" disabled={loading} onClick={() => fetchPage(next)} className="mt-4 text-white bg-gray-600 rounded-lg px-4 py-2">{t('url').loadMore}</button>}
      {!next && urlList.length === 0 && !loading && <button type="button" onClick={() => fetchPage()}>{t('url').retry}</button>}
    </div>
  );
};
export default UrlMain;
