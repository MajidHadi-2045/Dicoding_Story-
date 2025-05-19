self.addEventListener('push', function (event) {
  let title = 'Notifikasi Baru';
  let options = {
    body: 'Ada notifikasi dari Aplikasi Cerita.',
    icon: '/images/android-chrome-192x192.png',
    badge: '/images/android-chrome-192x192.png',
  };

  try {
    if (event.data) {
      const raw = event.data.text(); // Ambil data mentah dulu
      const data = JSON.parse(raw); // Coba parse JSON
      title = data.title || title;
      options = { ...options, ...data.options };
    }
  } catch (error) {
    // Jika bukan JSON atau gagal parsing, isi body tetap pakai teks mentah
    options.body = event.data?.text() || options.body;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin); // Ganti jika ingin arahkan ke halaman tertentu

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen.href && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

// Fallback offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/404.html'))
  );
});
