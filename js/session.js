(function () {
  var PATHS = {
    home: '/',
    calendar: '/calendar',
    handsOn: '/hands-on',
    attendance: '/attendance',
    tools: '/tools',
    candidates: '/candidates',
    activity: '/activity',
    account: '/account'
  };
  function user() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { return null; }
  }
  function isHead() { var u = user(); return !!(u && u.role === 'head'); }
  function onAccountPage() {
    var p = location.pathname;
    return p === '/account' || p === '/accounts' || p === '/accounts.html' || p === '/account.html';
  }
  function requireAuth() {
    if (!localStorage.getItem('token')) {
      if (onAccountPage()) return false;
      var back = location.pathname + location.search;
      location.replace('/account?next=' + encodeURIComponent(back));
      return false;
    }
    return true;
  }
  function logout() {
    localStorage.clear();
    location.replace('/account');
  }
  function guardHead() {
    if (!requireAuth()) return false;
    if (!isHead()) { location.replace(PATHS.home); return false; }
    return true;
  }
  function setSession(token, userObj) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    if (userObj && userObj.mustChangePassword) localStorage.setItem('mustChange', '1');
    else localStorage.removeItem('mustChange');
  }
  function mustChange() { return localStorage.getItem('mustChange') === '1'; }
  function clearMustChange() { localStorage.removeItem('mustChange'); }
  window.session = {
    user: user, isHead: isHead, requireAuth: requireAuth, guardHead: guardHead,
    logout: logout, setSession: setSession, mustChange: mustChange,
    clearMustChange: clearMustChange, paths: PATHS
  };
})();
