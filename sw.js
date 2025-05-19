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
