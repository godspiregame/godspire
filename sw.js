/* GODSPIRE · sw.js (app instalável): rede primeiro, para cada versão nova chegar logo ao telemóvel;
   sem rede, abre a última versão guardada. O tools/site.ps1 troca o 127 pelo número do build. */
const CACHE = 'godspire-127';
const FILES = ['./', './index.html', './manifest.webmanifest', './app-192.png', './app-512.png', './app-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // só se guardam as respostas boas do próprio site (Sábio)
  // cache: 'no-cache' pergunta sempre ao servidor (o GitHub manda guardar 10 min e a versão nova demorava a chegar)
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
