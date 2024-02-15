import React from 'react';

const ChangeLanguage = (props) => {
  const { lang } = props;

  const getLangTitle = () => {
    if (lang === 'en') {
      return '🇪🇸 Español';
    } else {
      return '🇺🇸 English';
    }
  };

  return (
    <div style={{
      padding: '1rem'
    }}>
      <a href={ `${lang === 'en' ? '/?lang=es' : '/'}` } className="hover:underline">{ getLangTitle() }</a>
    </div>
  );
};

export default ChangeLanguage;