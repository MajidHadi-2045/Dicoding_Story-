var B=a=>{throw TypeError(a)};var T=(a,e,t)=>e.has(a)||B("Cannot "+t);var s=(a,e,t)=>(T(a,e,"read from private field"),t?t.call(a):e.get(a)),u=(a,e,t)=>e.has(a)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),g=(a,e,t,i)=>(T(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t),h=(a,e,t)=>(T(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const A="https://story-api.dicoding.dev/v1",N="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function R(a){try{if(await Notification.requestPermission()!=="granted"){alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.");return}const t=await a.pushManager.getSubscription();t&&(await t.unsubscribe(),console.log("[Push] Subscription lama dihapus."));const i=q(N),n=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:i}),o=localStorage.getItem("token");if(!o)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${A}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:n.endpoint,keys:n.toJSON().keys})})).ok)throw new Error("Gagal mengirim subscription ke server");await M("Notifikasi Diaktifkan","Kamu akan menerima notifikasi cerita baru 🎉"),console.log("[Push] Subscription berhasil.")}catch(e){console.error("[Push] Gagal aktifkan:",e.message),alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.")}}async function U(a){try{const e=await a.pushManager.getSubscription();if(!e){alert("Tidak ada notifikasi yang aktif.");return}const t=localStorage.getItem("token");if(!t){alert("Token login tidak ditemukan");return}if(!(await fetch(`${A}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal hapus subscription di server");await e.unsubscribe()?(await M("Notifikasi Dimatikan","Kamu tidak akan menerima notifikasi lagi 🔕"),console.log("[Push] Unsubscribe berhasil.")):alert("Gagal menonaktifkan notifikasi")}catch(e){console.error("[Push] Gagal unsubscribe:",e.message),alert("Notifikasi tidak dapat dimatikan saat ini. Silakan muat ulang halaman.")}}async function M(a,e){if(Notification.permission!=="granted"){alert(`${a}
${e}`);return}(await navigator.serviceWorker.ready).showNotification(a,{body:e,icon:"/images/android-chrome-192x192.png",badge:"/images/android-chrome-192x192.png"})}function q(a){const e="=".repeat((4-a.length%4)%4),t=(a+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(t);return new Uint8Array([...i].map(n=>n.charCodeAt(0)))}const H={BASE_URL:"https://story-api.dicoding.dev/v1"},I=H.BASE_URL;async function x(){const a=localStorage.getItem("token");return(await(await fetch(`${I}/stories`,{headers:{Authorization:`Bearer ${a}`}})).json()).listStory||[]}async function j({description:a,photo:e,lat:t,lon:i}){const n=localStorage.getItem("token"),o=new FormData;return o.append("description",a),o.append("photo",e),t&&i&&(o.append("lat",t),o.append("lon",i)),await(await fetch(`${I}/stories`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:o})).json()}async function z({email:a,password:e}){return await(await fetch(`${I}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})})).json()}async function _({name:a,email:e,password:t}){return await(await fetch(`${I}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,email:e,password:t})})).json()}function G(a){typeof(a==null?void 0:a.onLoading)=="function"&&a.onLoading(),x().then(e=>{typeof(a==null?void 0:a.onSuccess)=="function"&&a.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(a==null?void 0:a.onError)=="function"&&a.onError(e)})}function F({description:a,photo:e,lat:t,lon:i}){return j({description:a,photo:e,lat:t,lon:i})}class K{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}G({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:t=>{document.getElementById("loading-indicator").style.display="none",this.showStories(t),this.showMap(t)},onError:()=>{const t=document.getElementById("story-list");t.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const t=document.getElementById("story-list");if(t.innerHTML="",!e.length){t.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,n.setAttribute("data-id",i.id),n.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),t.appendChild(n)})}showMap(e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(i).bindPopup(`<strong>${n.name}</strong><br>${n.description}`)})}}class J{async render(){return`
      <section class="container about-modern">
        <h1 class="about-title">Apakah Kamu Siap Bergambung Bersama Aplikasi Cerita?</h1>
        <div class="about-content">
          <div class="about-image">
            <img src="/Dicoding_Story-/images/profil.png" alt="Foto Majid" />
          </div>
          <div class="about-text">
            <h2>Untuk Semua Pengguna</h2>
            <p>
              Aplikasi ini dibuat untuk membantu pengguna membagikan cerita berbasis lokasi dengan cepat dan mudah. Dibangun menggunakan teknologi SPA dan terintegrasi dengan Dicoding Story API.
            </p>

            <h3>Fitur Unggulan</h3>
            <ul class="features">
              <li>✅ Tambah cerita dengan lokasi peta interaktif</li>
              <li>✅ Upload foto langsung dari kamera</li>
              <li>✅ SPA cepat dan ringan tanpa reload halaman</li>
            </ul>

            <p class="github-link">
              >> <strong>GitHub:</strong> 
              <a href="https://github.com/MajidHadi-2045" target="_blank">https://github.com/MajidHadi-2045</a>
            </p>
          </div>
        </div>
      </section>
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function W(a,e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(a,{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i);let n;return i.on("click",o=>{n?n.setLatLng(o.latlng):n=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let m=null,f=null;var k,S;class V{constructor(){u(this,k,null);u(this,S,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),t=n=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(n)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",n=>{m=n.target.files[0],t(m)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const n=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),l=document.getElementById("capture-photo");n.style.display="block";try{f=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=f}catch(d){alert("Tidak dapat mengakses webcam: "+d.message)}l.onclick=()=>{const d=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,d.drawImage(o,0,0),r.toBlob(P=>{m=new File([P],"webcam-capture.jpg",{type:"image/jpeg"}),t(m)},"image/jpeg"),f&&(f.getTracks().forEach(P=>P.stop()),o.srcObject=null,f=null),n.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",n=>{m=n.target.files[0],t(m)}),W("map",(n,o)=>{g(this,k,n),g(this,S,o)}),window.addEventListener("hashchange",()=>{f&&(f.getTracks().forEach(n=>n.stop()),f=null)}),document.getElementById("story-form").addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!m){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const l=await F({description:r,photo:m,lat:s(this,k),lon:s(this,S)});l.error?o.textContent=`Gagal: ${l.message}`:(o.textContent="Cerita berhasil dikirim!",n.target.reset(),e.innerHTML="",m=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}k=new WeakMap,S=new WeakMap;async function Y(a,e,t,i){try{const n=await z({email:a,password:e});t(n)}catch(n){console.error("Login gagal:",n),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function Z(a,e,t,i,n){try{const o=await _({name:a,email:e,password:t});i(o)}catch(o){console.error("Registrasi gagal:",o),n({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class Q{async render(){return`
      <section class="login-page">
        <div class="login-box">
          <h2>Masuk ke Cerita App</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required />
              <i class="fa-solid fa-user icon"></i>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div style="position: relative;">
                <input type="password" id="password" name="password" placeholder="********" required />
                <i id="togglePassword" class="fa-solid fa-eye-slash icon" 
                   style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;"></i>
              </div>
            </div>

            <button type="submit">Masuk</button>
            <div id="login-message" style="margin-top: 1rem; color: red;"></div>
          </form>

          <p style="margin-top: 1rem;">Belum punya akun? <a href="#/register" class="register-link">Register now</a></p>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#login-message");e.addEventListener("submit",o=>{o.preventDefault();const r=e.email.value,l=e.password.value;Y(r,l,d=>{t.textContent=d.message,localStorage.setItem("token",d.loginResult.token),localStorage.setItem("name",d.loginResult.name),window.location.hash="#/"},d=>{t.textContent=d.message})});const i=document.getElementById("password");document.getElementById("togglePassword").addEventListener("click",()=>{const o=i.getAttribute("type")==="password"?"text":"password";i.setAttribute("type",o)})}}class X{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.name.value,o=e.email.value,r=e.password.value;Z(n,o,r,l=>{t.textContent=l.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},l=>{t.textContent=l.message})})}}function D(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function ee(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function C(){return location.hash.replace("#","")||"/"}function te(){const a=C(),e=D(a);return ee(e)}function ae(){const a=C();return D(a)}var y;class ne{constructor(e){u(this,y);g(this,y,e)}async showDetail(e){try{const i=(await x()).find(n=>n.id===e);i?s(this,y).displayStory(i):s(this,y).displayError("Cerita tidak ditemukan.")}catch{s(this,y).displayError("Gagal mengambil data cerita.")}}}y=new WeakMap;var E;class ie{constructor(){u(this,E)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=ae();g(this,E,new ne(this)),s(this,E).showDetail(e)}displayStory(e){const t=document.getElementById("story-detail");t.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${e.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${e.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const t=document.getElementById("story-detail");t.innerHTML=`<p style="color:red;">${e}</p>`}}E=new WeakMap;const oe={"/":new K,"/about":new J,"/add":new V,"/login":new Q,"/register":new X,"/story/:id":new ie};var b,v,p,c,O,w,$;class re{constructor({navigationDrawer:e,drawerButton:t,content:i}){u(this,c);u(this,b,null);u(this,v,null);u(this,p,null);g(this,b,i),g(this,v,t),g(this,p,e),h(this,c,O).call(this),h(this,c,w).call(this),h(this,c,$).call(this)}async renderPage(){const e=te(),t=oe[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,b).innerHTML=await t.render(),await t.afterRender(),h(this,c,w).call(this)}):(s(this,b).innerHTML=await t.render(),await t.afterRender(),h(this,c,w).call(this))}}b=new WeakMap,v=new WeakMap,p=new WeakMap,c=new WeakSet,O=function(){s(this,v).addEventListener("click",()=>{s(this,p).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,p).contains(e.target)&&!s(this,v).contains(e.target)&&s(this,p).classList.remove("open"),s(this,p).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&s(this,p).classList.remove("open")})})},w=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const t=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${t})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,c,w).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},$=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",t=>{t.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const a=new re({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await a.renderPage(),window.addEventListener("hashchange",async()=>{await a.renderPage()});const e=document.getElementById("toggle-push-btn");async function t(){return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}async function i(n){e&&(n?(e.classList.remove("off"),e.classList.add("on"),e.innerHTML='<i class="fa-solid fa-bell-slash"></i> Matikan Notifikasi',e.dataset.state="on"):(e.classList.remove("on"),e.classList.add("off"),e.innerHTML='<i class="fa-solid fa-bell"></i> Aktifkan Notifikasi',e.dataset.state="off"))}e&&"serviceWorker"in navigator&&"PushManager"in window&&(await navigator.serviceWorker.ready,await i(await t()),e.addEventListener("click",async()=>{const n=e.dataset.state,o=await navigator.serviceWorker.ready;n==="on"?await U(o):await R(o);const r=await t();await i(r)}))});
