import { fetchStories } from '../data/api.js';
import { parseActive }  from '../routes/url-parser.js';

export default class DetailPage {
  render() {
    return `<section class="container">
      <h1>Detail Cerita</h1>
      <div id="detail"></div>
      <div id="map-detail" style="height:300px"></div>
    </section>`;
  }
  async afterRender() {
    const { id } = parseActive();
    const token = localStorage.getItem('token');
    const { listStory } = await fetchStories(token);
    const s = listStory.find(x=>x.id===id);
    document.getElementById('detail').innerHTML = /*html*/`
      <img src="${s.photoUrl}" alt="Cerita ${s.name}">
      <h2>${s.name}</h2>
      <p>${s.description}</p>`;
    const map = L.map('map-detail').setView([s.lat,s.lon],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(map);
    L.marker([s.lat,s.lon]).addTo(map)
      .bindPopup(`<b>${s.name}</b><br>${s.description}`)
      .openPopup();
  }
}
