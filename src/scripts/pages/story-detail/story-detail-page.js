import { parseActivePathname } from '../../routes/url-parser.js';
import StoryDetailPresenter from './story-detail-presenter.js';

export default class StoryDetailPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    this.#presenter = new StoryDetailPresenter(this);
    this.#presenter.showDetail(id);
  }

  displayStory(story) {
    const container = document.getElementById('story-detail');
    container.innerHTML = `
      <div class="story-image-wrapper">
        <img src="${story.photoUrl}" alt="Foto ${story.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${story.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${story.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(story.createdAt).toLocaleString('id-ID')}</small></p>
    `;

    const image = document.querySelector('.story-detail-image');
    image.animate([
      { opacity: 0, transform: 'scale(0.95)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  }

  displayError(message) {
    const container = document.getElementById('story-detail');
    container.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}
