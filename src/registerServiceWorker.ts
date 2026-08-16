// Service Worker registration helper

export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use relative path sw.js to support sub-paths (like GitHub Pages)
      const baseUrl = (import.meta as any).env?.BASE_URL || './';
      const swUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}sw.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    });
  }
}

