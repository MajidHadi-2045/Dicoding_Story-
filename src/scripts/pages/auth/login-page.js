import LoginView from '../auth/login-view.js';

export default class LoginPage {
  async render() {
    return LoginView.render();
  }

  async afterRender() {
    const form = document.querySelector('#form-login');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      // Lakukan autentikasi dummy (contoh)
      if (email === 'user@example.com' && password === 'password') {
        localStorage.setItem('token', 'fake-token');
        location.hash = '/';
      } else {
        alert('Email atau password salah');
      }
    });
  }
}
