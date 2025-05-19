const CACHE_NAME = 'app-shell-v1';
const BASE = '/Dicoding_Story/';

const APP_SHELL_FILES = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}styles/styles.css`,
  `${BASE}scripts/index.js`,
  `${BASE}images/android-chrome-192x192.png`,
  `${BASE}images/android-chrome-512x512.png`,
  `${BASE}manifest.webmanifest`,
  `${BASE}404.html`
];

// Cache App Shell saat install
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
});

// Bersihkan cache lama saat activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

// Gunakan cache saat offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((res) => {
      return res || caches.match('/404.html');
    }))
  );
});

// Tangani push notification
self.addEventListener('push', function (event) {
  let title = 'Notifikasi Baru';
  let options = {
    body: 'Ada notifikasi dari Aplikasi Cerita.',
    icon: './images/android-chrome-192x192.png',
    badge: './images/android-chrome-192x192.png',
  };

  try {
    if (event.data) {
      const raw = event.data.text();
      const data = JSON.parse(raw);
      title = data.title || title;
      options = { ...options, ...data.options };
    }
  } catch (error) {
    options.body = event.data?.text() || options.body;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Tangani klik pada notifikasi
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen.href && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
