const CACHE = 'guia-ev-v3';

const FILES = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './css/app.css',
  './js/app.js',
  './js/config.js',
  './js/state.js',
  './js/loader.js',
  './js/drugs.js',
  './js/pump.js',
  './js/protocols.js',
  './js/utils.js',
  './js/calculators.js',
  './js/cart.js',
  './data/categories.json',
  './data/drugs-ev.json',
  './data/drugs-vo.json',
  './data/protocols.json',
  './data/pump.json',
  './data/solutions.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
