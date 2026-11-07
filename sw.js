/* Minimal service worker: keeps the app shell available offline.
   Network first (so updates arrive), cache as fallback. API calls (/api/) are never cached here:
   the app's own offline queue handles comments and status changes. Bump V when files change. */
var V='alexea-v1';
var SHELL=['home.html','calendar.html','hands-on.html','attendance.html','tools.html','import.html','activity.html','accounts.html','shared.css','topbar.css','tool-drawings.js','station-sprite.js','courses-2026.js','install.js','manifest.webmanifest','assets/alexea-logo.jpg','assets/icon-192.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=V}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!='GET'||u.pathname.indexOf('/api/')>-1||u.origin!=location.origin)return;
  e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}))});
