var B=t=>{throw TypeError(t)};var T=(t,e,a)=>e.has(t)||B("Cannot "+a);var s=(t,e,a)=>(T(t,e,"read from private field"),a?a.call(t):e.get(t)),d=(t,e,a)=>e.has(t)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a),p=(t,e,a,i)=>(T(t,e,"write to private field"),i?i.call(t,a):e.set(t,a),a),h=(t,e,a)=>(T(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const $="https://story-api.dicoding.dev/v1",R="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";"serviceWorker"in navigator&&window.addEventListener("load",async()=>{try{const t=await navigator.serviceWorker.register("/Dicoding_Story-/sw.js");console.log("Service Worker terdaftar:",t.scope),await A(t)}catch(t){console.error("Gagal mendaftarkan SW:",t)}});async function A(t){var e;try{const a=await Notification.requestPermission();if(console.log("[Push] Permission:",a),a!=="granted"){console.warn("[Push] Izin notifikasi ditolak oleh pengguna");return}const n={userVisibleOnly:!0,applicationServerKey:q(R)},o=await t.pushManager.subscribe(n);console.log("[Push] pushSubscription:",o);const r=(e=o==null?void 0:o.toJSON)==null?void 0:e.call(o).keys;if(!r||!r.p256dh||!r.auth)throw new Error("Push subscription keys tidak tersedia. Browser kemungkinan tidak mendukung VAPID.");const c=localStorage.getItem("token");if(!c)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${$}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify({endpoint:o.endpoint,keys:{p256dh:r.p256dh,auth:r.auth}})})).ok)throw new Error("Gagal mengirim subscription");console.log("[Push] Subscription berhasil!")}catch(a){console.error("[Push] Gagal:",a.message)}}function q(t){const e="=".repeat((4-t.length%4)%4),a=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(a);return new Uint8Array([...i].map(n=>n.charCodeAt(0)))}const U={BASE_URL:"https://story-api.dicoding.dev/v1"},P=U.BASE_URL;async function M(){const t=localStorage.getItem("token");return(await(await fetch(`${P}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json()).listStory||[]}async function H({description:t,photo:e,lat:a,lon:i}){const n=localStorage.getItem("token"),o=new FormData;return o.append("description",t),o.append("photo",e),a&&i&&(o.append("lat",a),o.append("lon",i)),await(await fetch(`${P}/stories`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:o})).json()}async function j({email:t,password:e}){return await(await fetch(`${P}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})})).json()}async function _({name:t,email:e,password:a}){return await(await fetch(`${P}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:a})})).json()}function N(t){typeof(t==null?void 0:t.onLoading)=="function"&&t.onLoading(),M().then(e=>{typeof(t==null?void 0:t.onSuccess)=="function"&&t.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(t==null?void 0:t.onError)=="function"&&t.onError(e)})}function z({description:t,photo:e,lat:a,lon:i}){return H({description:t,photo:e,lat:a,lon:i})}class F{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}N({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:a=>{document.getElementById("loading-indicator").style.display="none",this.showStories(a),this.showMap(a)},onError:()=>{const a=document.getElementById("story-list");a.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const a=document.getElementById("story-list");if(a.innerHTML="",!e.length){a.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,n.setAttribute("data-id",i.id),n.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),a.appendChild(n)})}showMap(e){const a={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[a.OpenStreetMap]});L.control.layers(a).addTo(i),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(i).bindPopup(`<strong>${n.name}</strong><br>${n.description}`)})}}class G{async render(){return`
      <section class="container about-modern">
        <h1 class="about-title">Apakah Kamu Siap Bergambung Bersama Aplikasi Cerita?</h1>
        <div class="about-content">
          <div class="about-image">
            <img src="public/images/profil.png" alt="Foto Majid" />
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function W(t,e){const a={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(t,{center:[-2.5489,118.0149],zoom:5,layers:[a.OpenStreetMap]});L.control.layers(a).addTo(i);let n;return i.on("click",o=>{n?n.setLatLng(o.latlng):n=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let m=null,g=null;var w,k;class K{constructor(){d(this,w,null);d(this,k,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),a=n=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(n)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",n=>{m=n.target.files[0],a(m)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const n=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),c=document.getElementById("capture-photo");n.style.display="block";try{g=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=g}catch(E){alert("Tidak dapat mengakses webcam: "+E.message)}c.onclick=()=>{const E=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,E.drawImage(o,0,0),r.toBlob(I=>{m=new File([I],"webcam-capture.jpg",{type:"image/jpeg"}),a(m)},"image/jpeg"),g&&(g.getTracks().forEach(I=>I.stop()),o.srcObject=null,g=null),n.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",n=>{m=n.target.files[0],a(m)}),W("map",(n,o)=>{p(this,w,n),p(this,k,o)}),window.addEventListener("hashchange",()=>{g&&(g.getTracks().forEach(n=>n.stop()),g=null)}),document.getElementById("story-form").addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!m){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const c=await z({description:r,photo:m,lat:s(this,w),lon:s(this,k)});c.error?o.textContent=`Gagal: ${c.message}`:(o.textContent="Cerita berhasil dikirim!",n.target.reset(),e.innerHTML="",m=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}w=new WeakMap,k=new WeakMap;async function J(t,e,a,i){try{const n=await j({email:t,password:e});a(n)}catch(n){console.error("Login gagal:",n),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function V(t,e,a,i,n){try{const o=await _({name:t,email:e,password:a});i(o)}catch(o){console.error("Registrasi gagal:",o),n({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class Y{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),a=document.querySelector("#login-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.email.value,o=e.password.value;J(n,o,r=>{a.textContent=r.message,localStorage.setItem("token",r.loginResult.token),localStorage.setItem("name",r.loginResult.name),window.location.hash="#/"},r=>{a.textContent=r.message})})}}class Z{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),a=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.name.value,o=e.email.value,r=e.password.value;V(n,o,r,c=>{a.textContent=c.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},c=>{a.textContent=c.message})})}}function D(t){const e=t.split("/");return{resource:e[1]||null,id:e[2]||null}}function Q(t){let e="";return t.resource&&(e=e.concat(`/${t.resource}`)),t.id&&(e=e.concat("/:id")),e||"/"}function x(){return location.hash.replace("#","")||"/"}function X(){const t=x(),e=D(t);return Q(e)}function ee(){const t=x();return D(t)}var f;class te{constructor(e){d(this,f);p(this,f,e)}async showDetail(e){try{const i=(await M()).find(n=>n.id===e);i?s(this,f).displayStory(i):s(this,f).displayError("Cerita tidak ditemukan.")}catch{s(this,f).displayError("Gagal mengambil data cerita.")}}}f=new WeakMap;var S;class ae{constructor(){d(this,S)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=ee();p(this,S,new te(this)),s(this,S).showDetail(e)}displayStory(e){const a=document.getElementById("story-detail");a.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${e.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${e.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const a=document.getElementById("story-detail");a.innerHTML=`<p style="color:red;">${e}</p>`}}S=new WeakMap;const ne={"/":new F,"/about":new G,"/add":new K,"/login":new Y,"/register":new Z,"/story/:id":new ae};var y,v,u,l,C,b,O;class oe{constructor({navigationDrawer:e,drawerButton:a,content:i}){d(this,l);d(this,y,null);d(this,v,null);d(this,u,null);p(this,y,i),p(this,v,a),p(this,u,e),h(this,l,C).call(this),h(this,l,b).call(this),h(this,l,O).call(this)}async renderPage(){const e=X(),a=ne[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,y).innerHTML=await a.render(),await a.afterRender(),h(this,l,b).call(this)}):(s(this,y).innerHTML=await a.render(),await a.afterRender(),h(this,l,b).call(this))}}y=new WeakMap,v=new WeakMap,u=new WeakMap,l=new WeakSet,C=function(){s(this,v).addEventListener("click",()=>{s(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,u).contains(e.target)&&!s(this,v).contains(e.target)&&s(this,u).classList.remove("open"),s(this,u).querySelectorAll("a").forEach(a=>{a.contains(e.target)&&s(this,u).classList.remove("open")})})},b=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const a=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${a})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,l,b).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},O=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",a=>{a.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const t=new oe({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()})});"serviceWorker"in navigator&&"PushManager"in window&&navigator.serviceWorker.register("/Dicoding_Story-/sw.js").then(t=>{console.log("[Service Worker] Terdaftar"),A(t)}).catch(t=>{console.error("[Service Worker] Gagal:",t)});
