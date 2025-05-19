import { fetchStories } from '../../scripts/data/api.js';

export default class ListPage {
  render() {
    return /*html*/`
      <section class="container">
        <h1>Daftar Cerita</h1>
        <ul id="story-list"></ul>
        <div id="map" style="height:300px"></div>
      </section>`;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    const { listStory } = await fetchStories(token);
    const ul = document.getElementById('story-list');
    
    // Menggunakan forEach untuk menambahkan cerita ke dalam elemen <ul>
    listStory.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = /*html*/`
        <a href="#/stories/${s.id}">
          <img src="${s.photoUrl}" alt="Cerita ${s.name}">
          <h2>${s.name}</h2>
          <p>${s.description}</p>
          <small>${new Date(s.createdAt).toLocaleDateString()}</small>
        </a>
      `;
      ul.appendChild(li);
    });

    // Inisialisasi peta dengan Leaflet
    const map = L.map('map').setView([0, 0], 2); // Set view awal
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Menambahkan marker ke peta berdasarkan data cerita
    listStory.forEach(s => {
      L.marker([s.lat, s.lon])
        .addTo(map)
        .bindPopup(`<b>${s.name}</b><br>${s.description}`);
    });
  }
}
