(function () {
  function user() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { return null; }
  }
  function isHead() { const u = user(); return !!(u && u.role === 'head'); }
  function requireAuth() {
    if (!localStorage.getItem('token')) {
      const back = encodeURIComponent(location.pathname + location.search);
      location.href = 'accounts.html?next=' + back;
      return false;
    }
    return true;
  }
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.href = 'accounts.html';
  }
  window.session = { user, isHead, requireAuth, logout };
})();
