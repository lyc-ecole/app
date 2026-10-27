// Les Yeux du Coeur – keeps the app usable offline.
// Change VERSION each time you upload new files so phones pick up the update.
const VERSION = 'lyc-v5';
const SHELL = ['./', 'index.html', 'app.js', 'firebase-config.js', 'manifest.webmanifest',
  'img/logo.png', 'img/stamp.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Firebase data and sign-in always go to the network (Firestore keeps its own offline copy).
  if (/firestore\.googleapis|identitytoolkit|securetoken|googleapis\.com\/identity/.test(url.host + url.pathname)) return;
  const sameOrigin = url.origin === location.origin;
  const cacheable = sameOrigin || /gstatic\.com\/firebasejs|fonts\.(googleapis|gstatic)\.com/.test(url.href);
  if (!cacheable) return;
  // Network first for our own files (so updates arrive), cache as fallback when offline.
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
