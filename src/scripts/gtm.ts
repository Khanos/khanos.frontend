export function loadGTM(w: Window, d: Document, s: string, l: string, i: string) {
  // Ensure the dataLayer array exists
  (w as any)[l] = (w as any)[l] || [];
  (w as any)[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // Get the first script element
  const f = d.getElementsByTagName(s)[0];
  // Create a new script element
  const j = d.createElement(s) as HTMLScriptElement;
  const dl = l !== 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;

  // Insert the new script element before the first script element
  f?.parentNode?.insertBefore(j, f);
};
