export default class LoginView {
  async render() {
    return `
      <section class="auth-page">
        <h1>Masuk ke Cerita App</h1>
        <form id="form-login">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Masuk</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('form-login');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      const user = JSON.parse(localStorage.getItem('user'));

      if (user && user.email === email && user.password === password) {
        // Simulasi login sukses
        localStorage.setItem('token', 'FAKE_TOKEN_123');
        location.hash = '/';
      } else {
        alert('Email atau password salah!');
      }
    });
  }
}
