/* "Install app" helper and service worker registration. Used by every page; Home and My account show the button.
   Android/Chrome: shows the real install prompt. iPhone/iPad (Safari): shows the Add to Home Screen steps. */
(function () {
  var dp = null;
  var ua = navigator.userAgent || '';
  var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var listeners = [];

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); dp = e; listeners.forEach(function (fn) { try { fn(true); } catch (x) {} }); });
  window.addEventListener('appinstalled', function () { dp = null; });

  function standalone() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  }

  window.ALX_canInstall = function () { return !!dp; };
  window.ALX_onInstallReady = function (fn) { listeners.push(fn); if (dp) fn(true); };

  window.ALX_install = function (btn, panel) {
    if (!btn || !panel) return;
    if (standalone()) { btn.style.display = 'none'; panel.style.display = 'none'; return; }
    btn.style.display = '';
    panel.innerHTML = '<b style="font-weight:500">Install ALEXEA on your phone</b><br>' +
      (ios
        ? 'iPhone or iPad (Safari): tap the <b>Share</b> button, then <b>Add to Home Screen</b>, then <b>Add</b>.'
        : 'Android (Chrome): open the browser menu (three dots) and choose <b>Install app</b> or <b>Add to Home screen</b>.') +
      '<br><span style="opacity:.8">Then open it from your home screen like any other app.</span>';
    panel.style.display = 'none';
    btn.onclick = function () {
      if (dp) {
        dp.prompt();
        dp.userChoice.then(function () { dp = null; }).catch(function () {});
      } else {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      }
    };
    window.ALX_onInstallReady(function (ready) {
      if (ready && btn) panel.style.display = 'none';
    });
  };

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
