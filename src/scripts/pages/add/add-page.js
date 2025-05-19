import { submitStory } from '../../presenter/story-presenter.js';
import { initLayerMap } from '../map-utils.js';

let selectedPhoto = null;
let activeStream = null;

export default class AddPage {
  #lat = null;
  #lon = null;

  async render() {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 100);
      return `<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>`;
    }

    return `
      <section class="add-form">
        <h1>Tambahkan Cerita</h1>
        <form id="story-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label>Upload Foto</label>
            <div style="margin-bottom: 0.5rem;">Gunakan salah satu metode:</div>
            <button type="button" id="open-folder">📁 Open Folder</button>
            <button type="button" id="open-camera">📷 Open Camera</button>
            <input type="file" id="file-input" accept="image/*" style="display:none;" />
            <input type="file" id="mobile-camera-input" accept="image/*" capture="environment" style="display:none;" />
            <div id="webcam-container" style="display:none; margin-top:1rem;">
              <video id="webcam" autoplay playsinline style="width:100%; border-radius:6px;"></video><br/>
              <button type="button" id="capture-photo" style="margin-top:0.5rem;">📸 Ambil Foto</button>
              <canvas id="snapshot" style="display:none;"></canvas>
            </div>
            <div id="preview-container" style="margin-top: 1rem;"></div>
          </div>

          <div class="form-group">
            <label>Lokasi (klik di peta)</label>
            <div id="map"></div>
          </div>

          <button type="submit">Submit Cerita</button>
          <div id="form-message" style="margin-top: 1rem;"></div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const previewContainer = document.getElementById('preview-container');

    const renderPreview = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`;
      };
      reader.readAsDataURL(file);
    };

    // Folder
    document.getElementById('open-folder').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
      selectedPhoto = e.target.files[0];
      renderPreview(selectedPhoto);
    });

    // Kamera otomatis: detect mobile/desktop
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    document.getElementById('open-camera').addEventListener('click', async () => {
      if (isMobile) {
        document.getElementById('mobile-camera-input').click();
      } else {
        const webcamContainer = document.getElementById('webcam-container');
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('snapshot');
        const captureBtn = document.getElementById('capture-photo');

        webcamContainer.style.display = 'block';
        try {
          activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = activeStream;
        } catch (err) {
          alert('Tidak dapat mengakses webcam: ' + err.message);
        }

        captureBtn.onclick = () => {
          const context = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            selectedPhoto = new File([blob], 'webcam-capture.jpg', {
              type: 'image/jpeg',
            });
            renderPreview(selectedPhoto);
          }, 'image/jpeg');

          if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
            activeStream = null;
          }
          webcamContainer.style.display = 'none';
        };
      }
    });

    document.getElementById('mobile-camera-input').addEventListener('change', (e) => {
      selectedPhoto = e.target.files[0];
      renderPreview(selectedPhoto);
    });

    // Peta dengan multi layer
    initLayerMap('map', (lat, lon) => {
      this.#lat = lat;
      this.#lon = lon;
    });


    window.addEventListener('hashchange', () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = null;
      }
    });

    document.getElementById('story-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const messageEl = document.getElementById('form-message');
      messageEl.textContent = 'Mengirim...';

      const description = document.getElementById('description').value;
      if (!selectedPhoto) {
        messageEl.textContent = 'Silakan pilih atau ambil foto terlebih dahulu.';
        return;
      }

      const result = await submitStory({
        description,
        photo: selectedPhoto,
        lat: this.#lat,
        lon: this.#lon,
      });

      if (!result.error) {
        messageEl.textContent = 'Cerita berhasil dikirim!';
        e.target.reset();
        previewContainer.innerHTML = '';
        selectedPhoto = null;
        if (this.marker) map.removeLayer(this.marker);
        setTimeout(() => {
          location.hash = '#/';
        }, 1500);
      } else {
        messageEl.textContent = `Gagal: ${result.message}`;
      }
    });
  }
}
