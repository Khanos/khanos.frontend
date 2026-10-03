/** Shared by Astro configuration and runtime clients; contains no credentials.
 * @param {string | undefined} value
 * @param {boolean} development
 */
export function parseBackendBase(value, development) {
  const url = new URL(value || 'https://khanos-backend.herokuapp.com/api/');
  const loopback = development && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(loopback && url.protocol === 'http:')) ||
      url.username || url.password || url.search || url.hash || !url.pathname.endsWith('/')) throw new Error('Invalid backend URL');
  return url;
}
