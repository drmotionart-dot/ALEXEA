/* Minimal service worker: keeps the app shell available offline.
   Network first (so updates arrive), cache as fallback. API calls (/api/) are never cached here:
   the app's own offline queue handles comments and status changes. Bump V when files change. */
var V = 'alexea-v2';
var SHELL = [
  '/', '/home', '/calendar', '/hands-on', '/attendance', '/tools', '/candidates', '/activity', '/account',
  '/shared.css', '/topbar.css', '/tool-drawings.js', '/station-sprite.js', '/install.js',
  '/manifest.webmanifest', '/assets/alexea-logo.jpg', '/icon-192.png'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.indexOf('/api/') > -1 || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var c = r.clone();
    caches.open(V).then(function (x) { x.put(e.request, c); }).catch(function () {});
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
