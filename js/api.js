(function () {
  var BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || '';
  function token() { return localStorage.getItem('token'); }
  function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mustChange');
  }
  async function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var t = token();
    if (t) headers.Authorization = 'Bearer ' + t;
    var res = await fetch(BASE + path, Object.assign({}, opts, { headers: headers }));
    var data = {};
    try { data = await res.json(); } catch (e) {}
    if (res.status === 401) {
      clearSession();
      var here = location.pathname;
      if (here !== '/account' && here !== '/accounts') {
        location.replace('/account?next=' + encodeURIComponent(here + location.search));
      }
      throw new Error(data.error || 'Please log in again.');
    }
    if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
    return data;
  }
  window.api = api;
  window.apiToken = token;
  window.apiClearSession = clearSession;
})();
