const CACHE = 'amoozesh-ba-amir-v82';
const PDF_ASSETS = [...Array.from({length:26},(_,i)=>'./assets/pdfs/grade6-lesson-'+String(i+1).padStart(2,'0')+'.pdf'), ...Array.from({length:7},(_,i)=>'./assets/pdfs/grade6-chapter-'+(i+1)+'.pdf')];
const ASSETS = ['./', './index.html', './privacy.html', './manifest.webmanifest', './icon.svg', './study-hero.svg', './art-math.svg', './art-english.svg', './art-science.svg', './primary-grades-v1.js', './app-home-v2.js', './app-home-v3.js', './dictionary-openjam.js', './app-tree-menu.js', './english-hybrid-library-v1.js', './biamoz-library.js', './visual-polish-v14.css', './visual-polish-v15.css', './visual-polish-v16.css', './home-refresh-v17.css', './support-center-v1.css', './visual-polish-v18.css', './support-center-v1.js', './global-toolbar-v1.js', './video-library-v1.js', './online-classroom-v1.js', './backend-config.js', './auth.js', './english-studio-v3.js', './math-game-engine-v2.js', './math-worksheets-v2.js', './math-lesson-depth-v1.js', './navigation-history-v1.js', './learning-tools-suite-v1.js', './whiteboard-pro-v1.js', './dictionary-unified-v1.js', './grade6-ch1-worksheet-pack.js', './grade6-pdf-library-v1.js', './student-growth-suite-v1.js', './group-progress-board-v1.js', './smart-tutor-input-v1.js', './504-essential-words.json', ...PDF_ASSETS];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.endsWith('/health')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});