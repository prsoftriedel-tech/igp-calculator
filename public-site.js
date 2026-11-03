(() => {
  const url = new URL(window.location.href);
  // Keep existing app bookmarks and PayPal return/cancel URLs working.
  const legacy = ['page', 'paypal', 'subscription_id', 'leagueUrl', 'raceId'];
  if ((url.pathname === '/' || url.pathname === '/index.html') && legacy.some(key => url.searchParams.has(key))) {
    url.pathname = '/rechner/';
    window.location.replace(url.href);
    return;
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
    });
  }
})();
