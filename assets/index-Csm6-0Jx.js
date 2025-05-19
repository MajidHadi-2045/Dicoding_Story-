var B=a=>{throw TypeError(a)};var I=(a,e,t)=>e.has(a)||B("Cannot "+t);var s=(a,e,t)=>(I(a,e,"read from private field"),t?t.call(a):e.get(a)),d=(a,e,t)=>e.has(a)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),p=(a,e,t,i)=>(I(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t),h=(a,e,t)=>(I(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const A="https://story-api.dicoding.dev/v1",R="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";let M=!1;async function U(a){var e;if(!M){M=!0;try{const t=await Notification.requestPermission();if(console.log("[Push] Permission:",t),t!=="granted")return;const i=await a.pushManager.getSubscription();if(i){console.log("[Push] Sudah subscribe:",i);return}const n=H(R),o=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:n}),r=(e=o==null?void 0:o.toJSON)==null?void 0:e.call(o).keys;if(!r||!r.p256dh||!r.auth)throw new Error("Push subscription keys tidak tersedia.");const c=localStorage.getItem("token");if(!c)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${A}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify({endpoint:o.endpoint,keys:{p256dh:r.p256dh,auth:r.auth}})})).ok)throw new Error("Gagal mengirim subscription");console.log("[Push] Subscription berhasil!")}catch(t){console.error("[Push] Gagal:",t.message)}}}async function q(a){try{const e=await a.pushManager.getSubscription();if(!e){alert("Tidak ada notifikasi yang aktif.");return}const t=localStorage.getItem("token");if(!t){alert("Token login tidak ditemukan");return}if(!(await fetch(`${A}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal hapus subscription di server");const n=await e.unsubscribe();alert(n?"Notifikasi berhasil dimatikan 📴":"Gagal menonaktifkan notifikasi")}catch(e){console.error("[Push] Gagal unsubscribe:",e.message),alert(`Gagal mematikan notifikasi: ${e.message}`)}}function H(a){const e="=".repeat((4-a.length%4)%4),t=(a+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(t);return new Uint8Array([...i].map(n=>n.charCodeAt(0)))}const N={BASE_URL:"https://story-api.dicoding.dev/v1"},P=N.BASE_URL;async function x(){const a=localStorage.getItem("token");return(await(await fetch(`${P}/stories`,{headers:{Authorization:`Bearer ${a}`}})).json()).listStory||[]}async function j({description:a,photo:e,lat:t,lon:i}){const n=localStorage.getItem("token"),o=new FormData;return o.append("description",a),o.append("photo",e),t&&i&&(o.append("lat",t),o.append("lon",i)),await(await fetch(`${P}/stories`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:o})).json()}async function G({email:a,password:e}){return await(await fetch(`${P}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})})).json()}async function _({name:a,email:e,password:t}){return await(await fetch(`${P}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,email:e,password:t})})).json()}function z(a){typeof(a==null?void 0:a.onLoading)=="function"&&a.onLoading(),x().then(e=>{typeof(a==null?void 0:a.onSuccess)=="function"&&a.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(a==null?void 0:a.onError)=="function"&&a.onError(e)})}function F({description:a,photo:e,lat:t,lon:i}){return j({description:a,photo:e,lat:t,lon:i})}class J{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}z({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:t=>{document.getElementById("loading-indicator").style.display="none",this.showStories(t),this.showMap(t)},onError:()=>{const t=document.getElementById("story-list");t.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const t=document.getElementById("story-list");if(t.innerHTML="",!e.length){t.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,n.setAttribute("data-id",i.id),n.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),t.appendChild(n)})}showMap(e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(i).bindPopup(`<strong>${n.name}</strong><br>${n.description}`)})}}class K{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function V(a,e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(a,{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i);let n;return i.on("click",o=>{n?n.setLatLng(o.latlng):n=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let u=null,g=null;var w,k;class W{constructor(){d(this,w,null);d(this,k,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),t=n=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(n)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",n=>{u=n.target.files[0],t(u)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const n=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),c=document.getElementById("capture-photo");n.style.display="block";try{g=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=g}catch(E){alert("Tidak dapat mengakses webcam: "+E.message)}c.onclick=()=>{const E=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,E.drawImage(o,0,0),r.toBlob(T=>{u=new File([T],"webcam-capture.jpg",{type:"image/jpeg"}),t(u)},"image/jpeg"),g&&(g.getTracks().forEach(T=>T.stop()),o.srcObject=null,g=null),n.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",n=>{u=n.target.files[0],t(u)}),V("map",(n,o)=>{p(this,w,n),p(this,k,o)}),window.addEventListener("hashchange",()=>{g&&(g.getTracks().forEach(n=>n.stop()),g=null)}),document.getElementById("story-form").addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!u){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const c=await F({description:r,photo:u,lat:s(this,w),lon:s(this,k)});c.error?o.textContent=`Gagal: ${c.message}`:(o.textContent="Cerita berhasil dikirim!",n.target.reset(),e.innerHTML="",u=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}w=new WeakMap,k=new WeakMap;async function Y(a,e,t,i){try{const n=await G({email:a,password:e});t(n)}catch(n){console.error("Login gagal:",n),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function Z(a,e,t,i,n){try{const o=await _({name:a,email:e,password:t});i(o)}catch(o){console.error("Registrasi gagal:",o),n({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class Q{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#login-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.email.value,o=e.password.value;Y(n,o,r=>{t.textContent=r.message,localStorage.setItem("token",r.loginResult.token),localStorage.setItem("name",r.loginResult.name),window.location.hash="#/"},r=>{t.textContent=r.message})})}}class X{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.name.value,o=e.email.value,r=e.password.value;Z(n,o,r,c=>{t.textContent=c.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},c=>{t.textContent=c.message})})}}function C(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function ee(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function D(){return location.hash.replace("#","")||"/"}function te(){const a=D(),e=C(a);return ee(e)}function ae(){const a=D();return C(a)}var f;class ne{constructor(e){d(this,f);p(this,f,e)}async showDetail(e){try{const i=(await x()).find(n=>n.id===e);i?s(this,f).displayStory(i):s(this,f).displayError("Cerita tidak ditemukan.")}catch{s(this,f).displayError("Gagal mengambil data cerita.")}}}f=new WeakMap;var S;class ie{constructor(){d(this,S)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=ae();p(this,S,new ne(this)),s(this,S).showDetail(e)}displayStory(e){const t=document.getElementById("story-detail");t.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${e.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${e.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const t=document.getElementById("story-detail");t.innerHTML=`<p style="color:red;">${e}</p>`}}S=new WeakMap;const oe={"/":new J,"/about":new K,"/add":new W,"/login":new Q,"/register":new X,"/story/:id":new ie};var y,b,m,l,O,v,$;class re{constructor({navigationDrawer:e,drawerButton:t,content:i}){d(this,l);d(this,y,null);d(this,b,null);d(this,m,null);p(this,y,i),p(this,b,t),p(this,m,e),h(this,l,O).call(this),h(this,l,v).call(this),h(this,l,$).call(this)}async renderPage(){const e=te(),t=oe[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,y).innerHTML=await t.render(),await t.afterRender(),h(this,l,v).call(this)}):(s(this,y).innerHTML=await t.render(),await t.afterRender(),h(this,l,v).call(this))}}y=new WeakMap,b=new WeakMap,m=new WeakMap,l=new WeakSet,O=function(){s(this,b).addEventListener("click",()=>{s(this,m).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,m).contains(e.target)&&!s(this,b).contains(e.target)&&s(this,m).classList.remove("open"),s(this,m).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&s(this,m).classList.remove("open")})})},v=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const t=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${t})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,l,v).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},$=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",t=>{t.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const a=new re({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await a.renderPage(),window.addEventListener("hashchange",async()=>{await a.renderPage()});const e=document.getElementById("toggle-push-btn");async function t(){return!("serviceWorker"in navigator)||!("PushManager"in window)?!1:!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}async function i(n){n?(e.innerHTML='<i class="fa-solid fa-bell-slash"></i> Matikan Notifikasi',e.dataset.state="on"):(e.innerHTML='<i class="fa-solid fa-bell"></i> Aktifkan Notifikasi',e.dataset.state="off")}if(e){const n=await navigator.serviceWorker.ready,o=await t();await i(o),e.addEventListener("click",async()=>{e.dataset.state==="on"?await q(n):await U(n);const c=await t();await i(c)})}});
