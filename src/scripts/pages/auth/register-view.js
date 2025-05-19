export default class RegisterView {
  async render() {
    return `
      <section class="auth-page">
        <h1>Daftar Akun Cerita App</h1>
        <form id="form-register">
          <input type="text" id="name" placeholder="Nama" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Daftar</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('form-register');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      };

      // Simpan user ke localStorage (sementara, jika tidak pakai backend)
      localStorage.setItem('user', JSON.stringify(user));
      alert('Registrasi berhasil!');
      location.hash = '/login';
    });
  }
}
