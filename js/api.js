(function () {
  const BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || '';
  function token() { return localStorage.getItem('token'); }
  async function api(path, opts) {
    opts = opts || {};
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    const t = token();
    if (t) headers.Authorization = 'Bearer ' + t;
    const res = await fetch(BASE + path, Object.assign({}, opts, { headers }));
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!location.pathname.endsWith('accounts.html')) location.href = 'accounts.html';
      throw new Error(data.error || 'Unauthorized');
    }
    if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
    return data;
  }
  window.api = api;
})();
