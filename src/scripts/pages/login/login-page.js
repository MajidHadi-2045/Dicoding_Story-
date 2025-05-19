// pages/login-page.js
import { doLogin } from '../../presenter/auth-presenter.js';

export default class LoginPage {
  async render() {
    return `
      <section class="login-page">
        <div class="login-box">
          <h2>Masuk</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required />
              <i class="fa-solid fa-user icon"></i>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="********" required />
              <i class="fa-solid fa-lock icon"></i>
            </div>

            <button type="submit">Sign In</button>
            <div id="login-message" style="margin-top: 1rem; color: red;"></div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    const messageEl = document.querySelector('#login-message');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;

      doLogin(
        email,
        password,
        (result) => {
          messageEl.textContent = result.message;
          localStorage.setItem('token', result.loginResult.token);
          localStorage.setItem('name', result.loginResult.name);
          window.location.hash = '#/';
        },
        (error) => {
          messageEl.textContent = error.message;
        }
      );
    });
  }
}
