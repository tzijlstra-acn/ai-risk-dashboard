// XSS protection — escape all dynamic data before rendering as raw HTML (OWASP A03)
// In JSX rendering we rely on React's built-in escaping; this util is for any dangerouslySetInnerHTML use-case
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
// Never store or expose secrets client-side — all API keys belong server-side
