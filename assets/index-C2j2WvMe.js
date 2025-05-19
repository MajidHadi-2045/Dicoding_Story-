var P=a=>{throw TypeError(a)};var B=(a,e,t)=>e.has(a)||P("Cannot "+t);var s=(a,e,t)=>(B(a,e,"read from private field"),t?t.call(a):e.get(a)),c=(a,e,t)=>e.has(a)?P("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),p=(a,e,t,i)=>(B(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t),h=(a,e,t)=>(B(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();async function O(a){try{const e=await a.pushManager.getSubscription();if(!e){console.warn("[Push] Belum ada subscription aktif.");return}const t=localStorage.getItem("token");if(!t){console.error("[Push] Token tidak ditemukan");return}if(!(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal menghapus subscription dari server");await e.unsubscribe()?(console.log("[Push] Berhasil unsubscribe dari browser dan server"),alert("Notifikasi berhasil dimatikan.")):console.warn("[Push] Gagal unsubscribe dari browser")}catch(e){console.error("[Push] Gagal unsubscribe:",e.message)}}const $={BASE_URL:"https://story-api.dicoding.dev/v1"},E=$.BASE_URL;async function M(){const a=localStorage.getItem("token");return(await(await fetch(`${E}/stories`,{headers:{Authorization:`Bearer ${a}`}})).json()).listStory||[]}async function R({description:a,photo:e,lat:t,lon:i}){const n=localStorage.getItem("token"),o=new FormData;return o.append("description",a),o.append("photo",e),t&&i&&(o.append("lat",t),o.append("lon",i)),await(await fetch(`${E}/stories`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:o})).json()}async function q({email:a,password:e}){return await(await fetch(`${E}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})})).json()}async function H({name:a,email:e,password:t}){return await(await fetch(`${E}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,email:e,password:t})})).json()}function j(a){typeof(a==null?void 0:a.onLoading)=="function"&&a.onLoading(),M().then(e=>{typeof(a==null?void 0:a.onSuccess)=="function"&&a.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(a==null?void 0:a.onError)=="function"&&a.onError(e)})}function U({description:a,photo:e,lat:t,lon:i}){return R({description:a,photo:e,lat:t,lon:i})}class N{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}j({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:t=>{document.getElementById("loading-indicator").style.display="none",this.showStories(t),this.showMap(t)},onError:()=>{const t=document.getElementById("story-list");t.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const t=document.getElementById("story-list");if(t.innerHTML="",!e.length){t.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,n.setAttribute("data-id",i.id),n.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),t.appendChild(n)})}showMap(e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(i).bindPopup(`<strong>${n.name}</strong><br>${n.description}`)})}}class F{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function z(a,e){const t={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(a,{center:[-2.5489,118.0149],zoom:5,layers:[t.OpenStreetMap]});L.control.layers(t).addTo(i);let n;return i.on("click",o=>{n?n.setLatLng(o.latlng):n=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let d=null,g=null;var w,k;class G{constructor(){c(this,w,null);c(this,k,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),t=n=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(n)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",n=>{d=n.target.files[0],t(d)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const n=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),m=document.getElementById("capture-photo");n.style.display="block";try{g=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=g}catch(T){alert("Tidak dapat mengakses webcam: "+T.message)}m.onclick=()=>{const T=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,T.drawImage(o,0,0),r.toBlob(I=>{d=new File([I],"webcam-capture.jpg",{type:"image/jpeg"}),t(d)},"image/jpeg"),g&&(g.getTracks().forEach(I=>I.stop()),o.srcObject=null,g=null),n.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",n=>{d=n.target.files[0],t(d)}),z("map",(n,o)=>{p(this,w,n),p(this,k,o)}),window.addEventListener("hashchange",()=>{g&&(g.getTracks().forEach(n=>n.stop()),g=null)}),document.getElementById("story-form").addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!d){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const m=await U({description:r,photo:d,lat:s(this,w),lon:s(this,k)});m.error?o.textContent=`Gagal: ${m.message}`:(o.textContent="Cerita berhasil dikirim!",n.target.reset(),e.innerHTML="",d=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}w=new WeakMap,k=new WeakMap;async function _(a,e,t,i){try{const n=await q({email:a,password:e});t(n)}catch(n){console.error("Login gagal:",n),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function J(a,e,t,i,n){try{const o=await H({name:a,email:e,password:t});i(o)}catch(o){console.error("Registrasi gagal:",o),n({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class K{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#login-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.email.value,o=e.password.value;_(n,o,r=>{t.textContent=r.message,localStorage.setItem("token",r.loginResult.token),localStorage.setItem("name",r.loginResult.name),window.location.hash="#/"},r=>{t.textContent=r.message})})}}class V{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const n=e.name.value,o=e.email.value,r=e.password.value;J(n,o,r,m=>{t.textContent=m.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},m=>{t.textContent=m.message})})}}function x(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function W(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function D(){return location.hash.replace("#","")||"/"}function Z(){const a=D(),e=x(a);return W(e)}function Q(){const a=D();return x(a)}var f;class X{constructor(e){c(this,f);p(this,f,e)}async showDetail(e){try{const i=(await M()).find(n=>n.id===e);i?s(this,f).displayStory(i):s(this,f).displayError("Cerita tidak ditemukan.")}catch{s(this,f).displayError("Gagal mengambil data cerita.")}}}f=new WeakMap;var S;class Y{constructor(){c(this,S)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=Q();p(this,S,new X(this)),s(this,S).showDetail(e)}displayStory(e){const t=document.getElementById("story-detail");t.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${e.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${e.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const t=document.getElementById("story-detail");t.innerHTML=`<p style="color:red;">${e}</p>`}}S=new WeakMap;const ee={"/":new N,"/about":new F,"/add":new G,"/login":new K,"/register":new V,"/story/:id":new Y};var y,b,u,l,A,v,C;class te{constructor({navigationDrawer:e,drawerButton:t,content:i}){c(this,l);c(this,y,null);c(this,b,null);c(this,u,null);p(this,y,i),p(this,b,t),p(this,u,e),h(this,l,A).call(this),h(this,l,v).call(this),h(this,l,C).call(this)}async renderPage(){const e=Z(),t=ee[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,y).innerHTML=await t.render(),await t.afterRender(),h(this,l,v).call(this)}):(s(this,y).innerHTML=await t.render(),await t.afterRender(),h(this,l,v).call(this))}}y=new WeakMap,b=new WeakMap,u=new WeakMap,l=new WeakSet,A=function(){s(this,b).addEventListener("click",()=>{s(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,u).contains(e.target)&&!s(this,b).contains(e.target)&&s(this,u).classList.remove("open"),s(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&s(this,u).classList.remove("open")})})},v=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const t=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${t})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,l,v).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},C=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",t=>{t.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const a=new te({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await a.renderPage(),window.addEventListener("hashchange",async()=>{await a.renderPage()});const e=document.getElementById("unsubscribe-btn");e&&e.addEventListener("click",async()=>{const t=await navigator.serviceWorker.ready;await O(t)})});
