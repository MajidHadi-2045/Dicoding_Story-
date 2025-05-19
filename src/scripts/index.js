// CSS imports
import '../styles/styles.css';
import { registerPushNotification } from './push-notification.js';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
    .then((reg) => {
      console.log('[Service Worker] Terdaftar');
      registerPushNotification(reg);
    })
    .catch((err) => {
      console.error('[Service Worker] Gagal:', err);
    });
}

navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
