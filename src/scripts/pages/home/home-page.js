import { fetchStories } from '../../presenter/story-presenter.js';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    if (!token) {
      location.hash = '#/login';
      return;
    }

    fetchStories({
      onLoading: () => {
        document.getElementById('loading-indicator').style.display = 'block';
      },
      onSuccess: (stories) => {
        document.getElementById('loading-indicator').style.display = 'none';
        this.showStories(stories);
        this.showMap(stories);
      },
      onError: () => {
        const container = document.getElementById('story-list');
        container.innerHTML = '<p style="text-align:center;">Gagal memuat data cerita.</p>';
        document.getElementById('loading-indicator').style.display = 'none';
      },
    });
  }

  showStories(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = '';

    if (!stories.length) {
      container.innerHTML = '<p style="text-align:center;">Tidak ada data cerita.</p>';
      return;
    }

    stories.forEach((story) => {
      const card = document.createElement('div');
      card.className = 'story-card';

      card.innerHTML = `
        <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${story.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${story.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(story.createdAt).toLocaleString('id-ID')}</small></p>
      `;

      // Tambahkan data-id agar bisa digunakan untuk navigasi
      card.setAttribute('data-id', story.id);

      // Navigasi ke halaman detail saat diklik
      card.addEventListener('click', () => {
        location.hash = `#/story/${story.id}`;
      });

      container.appendChild(card);
    });
  }

  showMap(stories) {
    const baseMaps = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }),
      "Topo Map": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors'
      }),
      "Carto Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      })
    };

    const map = L.map('map', {
      center: [-2.5489, 118.0149],
      zoom: 5,
      layers: [baseMaps["OpenStreetMap"]],
    });

    L.control.layers(baseMaps).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  }
}
