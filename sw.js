try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
} catch (e) {
  console.error('Workbox gagal dimuat dari CDN:', e);
}

if (workbox) {
  console.log('✅ Workbox berhasil dimuat');

  workbox.core.setCacheNameDetails({
    prefix: 'dicoding-story-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
  });

  workbox.precaching.precacheAndRoute([
    { url: '/Dicoding_Story-/', revision: '1' },
    { url: '/Dicoding_Story-/index.html', revision: '1' },
    { url: '/Dicoding_Story-/manifest.webmanifest', revision: '1' },
    { url: '/Dicoding_Story-/images/android-chrome-192x192.png', revision: '1' },
    { url: '/Dicoding_Story-/images/android-chrome-512x512.png', revision: '1' },
    { url: '/Dicoding_Story-/404.html', revision: '1' }
  ], {
    ignoreURLParametersMatching: [/.*/],
  });

  workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com'),
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources'
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({ url, request }) =>
      url.origin === 'https://story-api.dicoding.dev' &&
      url.pathname.startsWith('/v1/stories') &&
      request.method === 'GET',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'dicoding-api-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 })
      ]
    })
  );

  // 🔔 PUSH HANDLER — tidak tampilkan notifikasi duplikat
  self.addEventListener('push', (event) => {
    if (!event.data) return;

    let payload;
    try {
      payload = event.data.json();
    } catch (e) {
      payload = {
        title: 'Aplikasi Cerita',
        options: {
          body: event.data.text() || 'Ada cerita baru!',
        }
      };
    }

    if (!payload.title && !payload.options?.body) return;

    const title = payload.title || 'Aplikasi Cerita';
    const options = {
      ...payload.options,
      icon: '/Dicoding_Story-/images/android-chrome-192x192.png',
      badge: '/Dicoding_Story-/images/android-chrome-192x192.png',
      tag: payload.options?.tag || 'cerita-update',
      renotify: false,
      data: {
        url: payload.options?.data?.url || '/Dicoding_Story-/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || '/Dicoding_Story-/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
        for (const client of clientsArr) {
          if (client.url.includes(urlToOpen) && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      })
    );
  });

  self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  });

} else {
  console.error('❌ Workbox gagal dimuat.');
}
