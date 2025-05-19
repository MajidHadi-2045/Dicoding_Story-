const BASE_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker terdaftar:', registration.scope);
      await registerPushNotification(registration);  // panggil fungsi utama
    } catch (err) {
      console.error('Gagal mendaftarkan SW:', err);
    }
  });
}

export async function registerPushNotification(registration) {
  try {
    // Langkah 1: Minta izin notifikasi
    const permission = await Notification.requestPermission();
    console.log('[Push] Permission:', permission);

    if (permission !== 'granted') {
      console.warn('[Push] Izin notifikasi ditolak oleh pengguna');
      return;
    }

    // Langkah 2: Konversi VAPID key ke Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey,
    };

    // Langkah 3: Subscribe ke PushManager
    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('[Push] pushSubscription:', pushSubscription);

    // Langkah 4: Validasi subscription keys
    const keys = pushSubscription?.toJSON?.().keys;
    if (!keys || !keys.p256dh || !keys.auth) {
      throw new Error('Push subscription keys tidak tersedia. Browser kemungkinan tidak mendukung VAPID.');
    }

    // Langkah 5: Ambil token login
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token login tidak ditemukan');
    }

    // Langkah 6: Kirim subscription ke server Dicoding
    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      }),
    });

    if (!response.ok) throw new Error('Gagal mengirim subscription');
    console.log('[Push] Subscription berhasil!');
  } catch (err) {
    console.error('[Push] Gagal:', err.message);
  }
}

// Fungsi bantu konversi VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
