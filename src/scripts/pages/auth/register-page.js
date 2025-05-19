import RegisterView from '../auth/register-view.js';

export default class RegisterPage {
  async render() {
    return RegisterView.render();
  }

  async afterRender() {
    const form = document.querySelector('#form-register');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      // Simulasi pendaftaran
      console.log('User terdaftar:', { name, email });
      alert('Pendaftaran berhasil! Silakan login.');
      location.hash = '/login';
    });
  }
}
