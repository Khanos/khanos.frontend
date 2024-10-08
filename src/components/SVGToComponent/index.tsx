import React, { useState } from 'react';
import { FaReact, FaVuejs, FaAngular, FaCode, FaCopy } from 'react-icons/fa';
import { 
  svgToReactComponent,
  svgToVueComponent,
  svgToAngularComponent,
  svgToSvelteComponent,
} from '../../utils/svg';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTranslations } from '../../i18n/utils';

type tLang = (str: any) => any;

const t: tLang = useTranslations(document.documentElement.lang as any);

const SvgToComponentConverter = () => {
  const [svgText, setSvgText] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [result, setResult] = useState('');

  const handleTransform = async () => {
    let transformedText = '';
    switch (selectedFramework) {
      case 'react':
        transformedText = await svgToReactComponent(svgText);
        break;
      case 'vue':
        transformedText = await svgToVueComponent(svgText);
        break;
      case 'angular':
        transformedText = await svgToAngularComponent(svgText);
        break;
      case 'svelte':
        transformedText = await svgToSvelteComponent(svgText);
        break;
      default:
        break;
    }
    setResult(transformedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen p-0 md:p-10 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('svgToComponent').title}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t('svgToComponent').description}
        </p>
      </div>
      <div className="w-full bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
        <div className="container mb-4">
          <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="svgText">
            {t('svgToComponent').svgInputLabel}
          </label>
          <textarea
            value={svgText}
            onChange={(e) => setSvgText(e.target.value)}
            placeholder={t('svgToComponent').svgText.placeholder}
            className="w-full p-2 border rounded text-gray-600 dark:text-gray-100 dark:bg-[#272822]"
            rows={6}
          />
        </div>
        <div className="container max-w-sm mx-auto mb-10">
          <div className="flex justify-around flex-wrap md:flex-nowrap mb-4 p-2">
            <label className="flex items-center p-2 md:p-0">
              <input
                type="radio"
                value="react"
                checked={selectedFramework === 'react'}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="mr-2"
              />
              <FaReact className="text-blue-500 mr-1" />
              {t('svgToComponent').framework.react}
            </label>
            <label className="flex items-center p-2 md:p-0">
              <input
                type="radio"
                value="vue"
                checked={selectedFramework === 'vue'}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="mr-2"
              />
              <FaVuejs className="text-green-500 mr-1" />
              {t('svgToComponent').framework.vue}
            </label>
            <label className="flex items-center p-2 md:p-0">
              <input
                type="radio"
                value="angular"
                checked={selectedFramework === 'angular'}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="mr-2"
              />
              <FaAngular className="text-red-500 mr-1" />
              {t('svgToComponent').framework.angular}
            </label>
            <label className="flex items-center p-2 md:p-0">
              <input
                type="radio"
                value="svelte"
                checked={selectedFramework === 'svelte'}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="mr-2"
              />
              <FaCode className="text-purple-500 mr-1" />
              {t('svgToComponent').framework.svelte}
            </label>
          </div>
          <button
            onClick={handleTransform}
            className="w-full text-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {t('svgToComponent').button}
          </button>
        </div>
        <div className="relative mb-4">
          {result && (
            <pre className="mt-4">
              <SyntaxHighlighter className="rounded-lg" language="javascript" style={monokai}>
                {result}
              </SyntaxHighlighter>
            </pre>
          )}
         {result && result !== 'Invalid SVG' &&  <button
            onClick={handleCopy}
            className="absolute top-4 right-4 text-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-2 focus:outline-none dark:focus:ring-purple-800 p-4 rounded-full group"
          >
            <FaCopy />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-gray-100 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-800 dark:text-gray-200">
              {t('svgToComponent').copy}
            </span>
          </button>}
        </div>
      </div>
    </div>
  );
};

export default SvgToComponentConverter;