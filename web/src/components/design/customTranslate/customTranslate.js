import translations from './translations';

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  let result = translations[template];
  if (result == null) {
   // console.log('没有翻译', template);
    return template;
  }

  // 替换变量
  result = result.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });

  return result;
}
