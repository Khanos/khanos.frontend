type ChangeLanguageProps = {
  lang: string;
};

const ChangeLanguage = (props: ChangeLanguageProps) => {
  const { lang } = props;

  const getLangTitle = () => {
    if (lang === 'en') {
      return '🇪🇸';
    } else {
      return '🇺🇸';
    }
  };

  const getLangHoverTitle = () => {
    if (lang === 'en') {
      return 'Cambiar a español';
    } else {
      return 'Change to English';
    }
  };

  return (
    <div style={{
      margin: '0.4rem 0.5rem 0.5rem 0.5rem',
      fontSize: '1.3rem',
      width: '1rem',
      height: '1rem',
    }}
      title={getLangHoverTitle()}
    >
      <a href={ `${lang === 'en' ? '/?lang=es' : '/?lang=en'}` } className="hover:scale-105 transition">{ getLangTitle() }</a>
    </div>
  );
};

export default ChangeLanguage;