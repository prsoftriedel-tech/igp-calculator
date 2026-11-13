const CACHE = 'igp-content-quality-v127-20261113';
const PRECACHE = ["/","/.nojekyll","/.well-known/apple-app-site-association","/404.html","/_expo/static/js/web/entry-fa0cd750488b47e587b0e4e45e29168e.js","/ads.txt","/adsense-config.json","/anleitungen/kraftstoff.html","/anleitungen/reifen.html","/anleitungen/rennstrategie.html","/assets/__paypal-task/source/node_modules/expo-router/assets/arrow_down.017bc6ba3fc25503e5eb5e53826d48a8.png","/assets/__paypal-task/source/node_modules/expo-router/assets/error.d1ea1496f9057eb392d5bbf3732a61b7.png","/assets/__paypal-task/source/node_modules/expo-router/assets/file.19eeb73b9593a38f8e9f418337fc7d10.png","/assets/__paypal-task/source/node_modules/expo-router/assets/forward.d8b800c443b8972542883e0b9de2bdc6.png","/assets/__paypal-task/source/node_modules/expo-router/assets/pkg.ab19f4cbc543357183a20571f68380a3.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/back-icon-mask.0a328cd9c1afd0afe8e3b1ec5165b1b4.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@2x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@3x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@4x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@2x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@3x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@4x.png","/assets/__paypal-task/source/node_modules/expo-router/assets/react-navigation/elements/search-icon.286d67d3f74808a60a78d3ebf1a5fb57.png","/assets/__paypal-task/source/node_modules/expo-router/assets/sitemap.412dd9275b6b48ad28f5e3d81bb1f626.png","/assets/__paypal-task/source/node_modules/expo-router/assets/unmatched.20e71bdf79e3a97bf55fd9e164041578.png","/assets/assets/stint-fuel-splash.498f0349a5b886710ba2283d56e967ad.png","/crawler-login-config.json","/favicon.ico","/index.html","/manifest.webmanifest","/metadata.json","/public-site.js","/pwa-icon-192.png","/pwa-icon-512.png","/pwa-icon.png","/rechner/index.html","/rechner.html","/robots.txt","/site.css","/sitemap.xml"];
const CONTENT_PAGES = ["/app-ads.txt","/content.css","/anleitungen/","/rechner-demo.html","/methodik.html","/ueber-uns.html","/faq.html","/kontakt.html","/impressum.html","/anleitungen/push-level.html","/anleitungen/boxenstopp-undercut.html","/anleitungen/regenstrategie.html","/anleitungen/setup-grundlagen.html","/anleitungen/strategie-italien.html","/anleitungen/ein-zwei-drei-stopps.html","/anleitungen/testdaten-erfassen.html","/anleitungen/haeufige-fehler.html"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await cache.addAll(['/', '/rechner/', '/site.css', '/public-site.js']);
    await Promise.all([...PRECACHE, ...CONTENT_PAGES].filter(url => !url.endsWith('/adsense-config.json') && !url.endsWith('/crawler-login-config.json'))
      .map(url => cache.add(url).catch(() => undefined)));
    await self.skipWaiting();
  }));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('igp-') && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname === '/adsense-config.json' || url.pathname === '/crawler-login-config.json' || url.pathname.startsWith('/crawler-login') || url.pathname.startsWith('/crawler-session')) return;
  if (['paypal', 'subscription_id', 'token', 'ba_token'].some(key => url.searchParams.has(key))) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, response.clone())));
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match(url.pathname.startsWith('/rechner') ? '/rechner/' : '/')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, response.clone())));
    return response;
  })));
});
