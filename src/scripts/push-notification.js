const BASE_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

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
    console.log('[Push] Converted VAPID key:', applicationServerKey);

    // Langkah 3: Siapkan opsi subscription
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey,
    };
    console.log('[Push] subscribeOptions:', subscribeOptions);

    // Langkah 4: Subscribe ke PushManager
    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('[Push] pushSubscription:', pushSubscription);
    console.log('[Push] pushSubscription.keys:', pushSubscription.keys);

    // Langkah 5: Validasi token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token login tidak ditemukan');
    }

    // Langkah 6: Validasi subscription keys
    if (!pushSubscription || !pushSubscription.keys) {
      throw new Error('Push subscription keys tidak tersedia');
    }

    // Langkah 7: Kirim subscription ke server Dicoding
    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: pushSubscription.keys.p256dh,
          auth: pushSubscription.keys.auth,
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
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
