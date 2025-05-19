// pages/register-page.js
import { doRegister } from '../../presenter/auth-presenter.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="login-page">
        <div class="login-box">
          <h2>Daftar Akun</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" placeholder="Nama lengkap" required />
              <i class="fa-solid fa-user icon"></i>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email aktif" required />
              <i class="fa-solid fa-envelope icon"></i>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="********" required />
              <i class="fa-solid fa-lock icon"></i>
            </div>

            <button type="submit">Daftar</button>
            <div id="register-message" style="margin-top: 1rem; color: red;"></div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    const messageEl = document.querySelector('#register-message');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      doRegister(
        name,
        email,
        password,
        (result) => {
          messageEl.textContent = result.message;
          form.reset();
          setTimeout(() => {
            location.hash = '#/login';
          }, 1500);
        },
        (error) => {
          messageEl.textContent = error.message;
        }
      );
    });
  }
}
