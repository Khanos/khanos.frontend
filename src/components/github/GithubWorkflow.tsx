import { useTranslations } from '../../i18n/utils';

type tLang = (str: any) => any;

const t: tLang = useTranslations(document.documentElement.lang as any);

const GithubWorkflow = () => {
  return (
    <div className="flex flex-col justify-center text-xl text-center text-gray-500 dark:text-gray-400 mb-6">
      <p>{t('github').workflowpt1}</p>
      <p>{t('github').workflowpt2} <a href="https://github.com/Khanos/khanos.backend" target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">GitHub</a></p>
    </div>
  );
}

export default GithubWorkflow;