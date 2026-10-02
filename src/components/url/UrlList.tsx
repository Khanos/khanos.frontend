import type { urlShortenerListProps } from '../../types';
import { useTranslations } from '../../i18n/utils';
import { padNumber } from '../../utils';
import './styles.css'

type tLang = (str: any) => any;
const t: tLang = useTranslations(document.documentElement.lang as any);

const UrlList: React.FC<urlShortenerListProps> = (props) => {
  const { urlList, onDelete, disabled } = props;

  return(
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="flex items-center justify-center">
          <div className="container">
            <table
              className="w-full flex flex-row text-left text-sm font-light text-surface dark:text-white overflow-hidden">
              <thead
                className="border-b border-neutral-200 font-medium dark:border-white/10">
                <tr className="hidden sm:table-row">
                  <th scope="col" className="px-6 py-4">{t('url').table.header.number}</th>
                  <th scope="col" className="px-6 py-4">{t('url').table.header.original}</th>
                  <th scope="col" className="px-6 py-4">{t('url').table.header.short}</th>
                  <th scope="col" className="px-6 py-4">{t('url').table.header.action}</th>
                </tr>
              </thead>
              <tbody className="flex-1 sm:flex-none">
                { urlList.length === 0 && <tr><td colSpan={4} className="text-center">{t('url').table.noData}</td></tr> }
                { urlList.map((url, index) => {
                  return (
                    <tr key={index} className="flex flex-col sm:table-row border-b border-neutral-200 dark:border-white/10">
                      <td className="px-6 py-4 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-ellipsis break-all overflow-hidden hover:text-clip">{url.original_url}</td>
                      <td className="px-6 py-4">{`https://epilef.app/${padNumber(url.short_url)}`}</td>
                      <td className="px-6 py-4 flex flex-row gap-2">
                        <a href={url.original_url} target="_blank" rel="noreferrer" className="text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center">{t('url').table.visit}</a>
                        <button className="text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center" onClick={() => navigator.clipboard.writeText(`https://epilef.app/${padNumber(url.short_url)}`)} aria-label={t('url').table.copy}>{t('url').table.copy}</button>
                        {<button disabled={disabled} onClick={() => onDelete(url.short_url)} className="text-white bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center">{t('url').table.delete}</button>}
                      </td>
                    </tr>
                  )
                }) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlList;