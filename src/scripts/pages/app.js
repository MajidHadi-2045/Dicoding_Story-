import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#updateAuthNav();
    this.#setupLogoClick(); // Tambahkan setup klik logo
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #updateAuthNav() {
    const authNav = document.querySelector('#auth-nav');

    if (!authNav) return;

    if (localStorage.getItem('token')) {
      const name = localStorage.getItem('name') || 'User';
      authNav.innerHTML = `<a href="#" id="logout-link">Logout (${name})</a>`;

      document.querySelector('#logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        location.hash = '#/';
        this.#updateAuthNav();
      });
    } else {
      authNav.innerHTML = `<a href="#/login">Login</a>`;
    }
  }

  #setupLogoClick() {
    const logo = document.querySelector('.brand-name');
    if (!logo) return;

    logo.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#/';
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.focus();
      }, 200); // Delay agar render selesai
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        this.#updateAuthNav();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#updateAuthNav();
    }
  }
}

export default App;
