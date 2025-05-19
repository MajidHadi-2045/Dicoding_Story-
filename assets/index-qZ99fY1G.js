var B=t=>{throw TypeError(t)};var T=(t,e,n)=>e.has(t)||B("Cannot "+n);var s=(t,e,n)=>(T(t,e,"read from private field"),n?n.call(t):e.get(t)),c=(t,e,n)=>e.has(t)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),p=(t,e,n,i)=>(T(t,e,"write to private field"),i?i.call(t,n):e.set(t,n),n),h=(t,e,n)=>(T(t,e,"access private method"),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const O="https://story-api.dicoding.dev/v1",$="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function R(t){try{const e=await Notification.requestPermission();if(console.log("[Push] Permission:",e),e!=="granted"){console.warn("[Push] Izin ditolak");return}const n=await t.pushManager.getSubscription();if(n){console.log("[Push] Sudah subscribe:",n);return}const i=q($),a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:i});console.log("[Push] pushSubscription:",a);const o=localStorage.getItem("token");if(!o)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${O}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:a.endpoint,keys:a.toJSON().keys})})).ok)throw new Error("Gagal mengirim subscription");console.log("[Push] Subscription berhasil!")}catch(e){console.error("[Push] Gagal:",e.message||e)}}function q(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(n),a=new Uint8Array(i.length);for(let o=0;o<i.length;++o)a[o]=i.charCodeAt(o);return a}const U={BASE_URL:"https://story-api.dicoding.dev/v1"},E=U.BASE_URL;async function A(){const t=localStorage.getItem("token");return(await(await fetch(`${E}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json()).listStory||[]}async function H({description:t,photo:e,lat:n,lon:i}){const a=localStorage.getItem("token"),o=new FormData;return o.append("description",t),o.append("photo",e),n&&i&&(o.append("lat",n),o.append("lon",i)),await(await fetch(`${E}/stories`,{method:"POST",headers:{Authorization:`Bearer ${a}`},body:o})).json()}async function j({email:t,password:e}){return await(await fetch(`${E}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})})).json()}async function _({name:t,email:e,password:n}){return await(await fetch(`${E}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:n})})).json()}function N(t){typeof(t==null?void 0:t.onLoading)=="function"&&t.onLoading(),A().then(e=>{typeof(t==null?void 0:t.onSuccess)=="function"&&t.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(t==null?void 0:t.onError)=="function"&&t.onError(e)})}function z({description:t,photo:e,lat:n,lon:i}){return H({description:t,photo:e,lat:n,lon:i})}class F{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}N({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:n=>{document.getElementById("loading-indicator").style.display="none",this.showStories(n),this.showMap(n)},onError:()=>{const n=document.getElementById("story-list");n.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const n=document.getElementById("story-list");if(n.innerHTML="",!e.length){n.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const a=document.createElement("div");a.className="story-card",a.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,a.setAttribute("data-id",i.id),a.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),n.appendChild(a)})}showMap(e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i),e.forEach(a=>{a.lat&&a.lon&&L.marker([a.lat,a.lon]).addTo(i).bindPopup(`<strong>${a.name}</strong><br>${a.description}`)})}}class G{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function J(t,e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(t,{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i);let a;return i.on("click",o=>{a?a.setLatLng(o.latlng):a=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let d=null,g=null;var w,S;class K{constructor(){c(this,w,null);c(this,S,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),n=a=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(a)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",a=>{d=a.target.files[0],n(d)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const a=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),m=document.getElementById("capture-photo");a.style.display="block";try{g=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=g}catch(P){alert("Tidak dapat mengakses webcam: "+P.message)}m.onclick=()=>{const P=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,P.drawImage(o,0,0),r.toBlob(I=>{d=new File([I],"webcam-capture.jpg",{type:"image/jpeg"}),n(d)},"image/jpeg"),g&&(g.getTracks().forEach(I=>I.stop()),o.srcObject=null,g=null),a.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",a=>{d=a.target.files[0],n(d)}),J("map",(a,o)=>{p(this,w,a),p(this,S,o)}),window.addEventListener("hashchange",()=>{g&&(g.getTracks().forEach(a=>a.stop()),g=null)}),document.getElementById("story-form").addEventListener("submit",async a=>{a.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!d){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const m=await z({description:r,photo:d,lat:s(this,w),lon:s(this,S)});m.error?o.textContent=`Gagal: ${m.message}`:(o.textContent="Cerita berhasil dikirim!",a.target.reset(),e.innerHTML="",d=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}w=new WeakMap,S=new WeakMap;async function W(t,e,n,i){try{const a=await j({email:t,password:e});n(a)}catch(a){console.error("Login gagal:",a),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function V(t,e,n,i,a){try{const o=await _({name:t,email:e,password:n});i(o)}catch(o){console.error("Registrasi gagal:",o),a({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class Y{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),n=document.querySelector("#login-message");e.addEventListener("submit",i=>{i.preventDefault();const a=e.email.value,o=e.password.value;W(a,o,r=>{n.textContent=r.message,localStorage.setItem("token",r.loginResult.token),localStorage.setItem("name",r.loginResult.name),window.location.hash="#/"},r=>{n.textContent=r.message})})}}class Z{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),n=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const a=e.name.value,o=e.email.value,r=e.password.value;V(a,o,r,m=>{n.textContent=m.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},m=>{n.textContent=m.message})})}}function M(t){const e=t.split("/");return{resource:e[1]||null,id:e[2]||null}}function Q(t){let e="";return t.resource&&(e=e.concat(`/${t.resource}`)),t.id&&(e=e.concat("/:id")),e||"/"}function x(){return location.hash.replace("#","")||"/"}function X(){const t=x(),e=M(t);return Q(e)}function ee(){const t=x();return M(t)}var f;class te{constructor(e){c(this,f);p(this,f,e)}async showDetail(e){try{const i=(await A()).find(a=>a.id===e);i?s(this,f).displayStory(i):s(this,f).displayError("Cerita tidak ditemukan.")}catch{s(this,f).displayError("Gagal mengambil data cerita.")}}}f=new WeakMap;var k;class ne{constructor(){c(this,k)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>

        <!-- Tombol kembali yang lebih rapi dan bisa ditata -->
        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=ee();p(this,k,new te(this)),s(this,k).showDetail(e)}displayStory(e){const n=document.getElementById("story-detail");n.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${e.name}</h3>
      <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${e.description}</p>
      <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const n=document.getElementById("story-detail");n.innerHTML=`<p style="color:red;">${e}</p>`}}k=new WeakMap;const ae={"/":new F,"/about":new G,"/add":new K,"/login":new Y,"/register":new Z,"/story/:id":new ne};var y,b,u,l,D,v,C;class oe{constructor({navigationDrawer:e,drawerButton:n,content:i}){c(this,l);c(this,y,null);c(this,b,null);c(this,u,null);p(this,y,i),p(this,b,n),p(this,u,e),h(this,l,D).call(this),h(this,l,v).call(this),h(this,l,C).call(this)}async renderPage(){const e=X(),n=ae[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,y).innerHTML=await n.render(),await n.afterRender(),h(this,l,v).call(this)}):(s(this,y).innerHTML=await n.render(),await n.afterRender(),h(this,l,v).call(this))}}y=new WeakMap,b=new WeakMap,u=new WeakMap,l=new WeakSet,D=function(){s(this,b).addEventListener("click",()=>{s(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,u).contains(e.target)&&!s(this,b).contains(e.target)&&s(this,u).classList.remove("open"),s(this,u).querySelectorAll("a").forEach(n=>{n.contains(e.target)&&s(this,u).classList.remove("open")})})},v=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const n=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${n})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,l,v).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},C=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",n=>{n.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const t=new oe({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()})});"serviceWorker"in navigator&&"PushManager"in window&&navigator.serviceWorker.register("/Dicoding_Story-/sw.js").then(t=>{console.log("[Service Worker] Terdaftar"),R(t)}).catch(t=>{console.error("[Service Worker] Gagal:",t)});
