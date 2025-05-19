var B=t=>{throw TypeError(t)};var T=(t,e,a)=>e.has(t)||B("Cannot "+a);var s=(t,e,a)=>(T(t,e,"read from private field"),a?a.call(t):e.get(t)),c=(t,e,a)=>e.has(t)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a),p=(t,e,a,o)=>(T(t,e,"write to private field"),o?o.call(t,a):e.set(t,a),a),h=(t,e,a)=>(T(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const O="https://story-api.dicoding.dev/v1",$="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function R(t){try{const e=await Notification.requestPermission();if(console.log("[Push] Permission:",e),e!=="granted"){console.warn("[Push] Izin notifikasi ditolak oleh pengguna");return}const o={userVisibleOnly:!0,applicationServerKey:q($)},n=await t.pushManager.subscribe(o);if(console.log("[Push] pushSubscription:",n),!n||!n.keys||!n.keys.p256dh||!n.keys.auth)throw new Error("Push subscription keys tidak tersedia. Browser kemungkinan tidak mendukung VAPID.");const i=localStorage.getItem("token");if(!i)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${O}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({endpoint:n.endpoint,keys:{p256dh:n.keys.p256dh,auth:n.keys.auth}})})).ok)throw new Error("Gagal mengirim subscription");console.log("[Push] Subscription berhasil!")}catch(e){console.error("[Push] Gagal:",e.message)}}function q(t){const e="=".repeat((4-t.length%4)%4),a=(t+e).replace(/-/g,"+").replace(/_/g,"/"),o=atob(a);return new Uint8Array([...o].map(n=>n.charCodeAt(0)))}const U={BASE_URL:"https://story-api.dicoding.dev/v1"},E=U.BASE_URL;async function A(){const t=localStorage.getItem("token");return(await(await fetch(`${E}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json()).listStory||[]}async function H({description:t,photo:e,lat:a,lon:o}){const n=localStorage.getItem("token"),i=new FormData;return i.append("description",t),i.append("photo",e),a&&o&&(i.append("lat",a),i.append("lon",o)),await(await fetch(`${E}/stories`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:i})).json()}async function j({email:t,password:e}){return await(await fetch(`${E}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})})).json()}async function _({name:t,email:e,password:a}){return await(await fetch(`${E}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:a})})).json()}function z(t){typeof(t==null?void 0:t.onLoading)=="function"&&t.onLoading(),A().then(e=>{typeof(t==null?void 0:t.onSuccess)=="function"&&t.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(t==null?void 0:t.onError)=="function"&&t.onError(e)})}function N({description:t,photo:e,lat:a,lon:o}){return H({description:t,photo:e,lat:a,lon:o})}class F{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}z({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:a=>{document.getElementById("loading-indicator").style.display="none",this.showStories(a),this.showMap(a)},onError:()=>{const a=document.getElementById("story-list");a.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const a=document.getElementById("story-list");if(a.innerHTML="",!e.length){a.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(o=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <img src="${o.photoUrl}" alt="Cerita oleh ${o.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${o.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${o.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(o.createdAt).toLocaleString("id-ID")}</small></p>
      `,n.setAttribute("data-id",o.id),n.addEventListener("click",()=>{location.hash=`#/story/${o.id}`}),a.appendChild(n)})}showMap(e){const a={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},o=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[a.OpenStreetMap]});L.control.layers(a).addTo(o),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(o).bindPopup(`<strong>${n.name}</strong><br>${n.description}`)})}}class G{async render(){return`
      <section class="container about-modern">
        <h1 class="about-title">Apakah Kamu Siap Bergambung Bersama Aplikasi Cerita?</h1>
        <div class="about-content">
          <div class="about-image">
            <img src="/images/profil.png" alt="Foto Majid" />
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function K(t,e){const a={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},o=L.map(t,{center:[-2.5489,118.0149],zoom:5,layers:[a.OpenStreetMap]});L.control.layers(a).addTo(o);let n;return o.on("click",i=>{n?n.setLatLng(i.latlng):n=L.marker(i.latlng).addTo(o),typeof e=="function"&&e(i.latlng.lat,i.latlng.lng)}),o}let d=null,g=null;var w,k;class V{constructor(){c(this,w,null);c(this,k,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),a=n=>{const i=new FileReader;i.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},i.readAsDataURL(n)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",n=>{d=n.target.files[0],a(d)});const o=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(o)document.getElementById("mobile-camera-input").click();else{const n=document.getElementById("webcam-container"),i=document.getElementById("webcam"),r=document.getElementById("snapshot"),m=document.getElementById("capture-photo");n.style.display="block";try{g=await navigator.mediaDevices.getUserMedia({video:!0}),i.srcObject=g}catch(P){alert("Tidak dapat mengakses webcam: "+P.message)}m.onclick=()=>{const P=r.getContext("2d");r.width=i.videoWidth,r.height=i.videoHeight,P.drawImage(i,0,0),r.toBlob(I=>{d=new File([I],"webcam-capture.jpg",{type:"image/jpeg"}),a(d)},"image/jpeg"),g&&(g.getTracks().forEach(I=>I.stop()),i.srcObject=null,g=null),n.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",n=>{d=n.target.files[0],a(d)}),K("map",(n,i)=>{p(this,w,n),p(this,k,i)}),window.addEventListener("hashchange",()=>{g&&(g.getTracks().forEach(n=>n.stop()),g=null)}),document.getElementById("story-form").addEventListener("submit",async n=>{n.preventDefault();const i=document.getElementById("form-message");i.textContent="Mengirim...";const r=document.getElementById("description").value;if(!d){i.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const m=await N({description:r,photo:d,lat:s(this,w),lon:s(this,k)});m.error?i.textContent=`Gagal: ${m.message}`:(i.textContent="Cerita berhasil dikirim!",n.target.reset(),e.innerHTML="",d=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}w=new WeakMap,k=new WeakMap;async function W(t,e,a,o){try{const n=await j({email:t,password:e});a(n)}catch(n){console.error("Login gagal:",n),o({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function J(t,e,a,o,n){try{const i=await _({name:t,email:e,password:a});o(i)}catch(i){console.error("Registrasi gagal:",i),n({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class Y{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),a=document.querySelector("#login-message");e.addEventListener("submit",o=>{o.preventDefault();const n=e.email.value,i=e.password.value;W(n,i,r=>{a.textContent=r.message,localStorage.setItem("token",r.loginResult.token),localStorage.setItem("name",r.loginResult.name),window.location.hash="#/"},r=>{a.textContent=r.message})})}}class Z{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),a=document.querySelector("#register-message");e.addEventListener("submit",o=>{o.preventDefault();const n=e.name.value,i=e.email.value,r=e.password.value;J(n,i,r,m=>{a.textContent=m.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},m=>{a.textContent=m.message})})}}function M(t){const e=t.split("/");return{resource:e[1]||null,id:e[2]||null}}function Q(t){let e="";return t.resource&&(e=e.concat(`/${t.resource}`)),t.id&&(e=e.concat("/:id")),e||"/"}function D(){return location.hash.replace("#","")||"/"}function X(){const t=D(),e=M(t);return Q(e)}function ee(){const t=D();return M(t)}var f;class te{constructor(e){c(this,f);p(this,f,e)}async showDetail(e){try{const o=(await A()).find(n=>n.id===e);o?s(this,f).displayStory(o):s(this,f).displayError("Cerita tidak ditemukan.")}catch{s(this,f).displayError("Gagal mengambil data cerita.")}}}f=new WeakMap;var S;class ae{constructor(){c(this,S)}async render(){return`
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
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"})}displayError(e){const a=document.getElementById("story-detail");a.innerHTML=`<p style="color:red;">${e}</p>`}}S=new WeakMap;const ne={"/":new F,"/about":new G,"/add":new V,"/login":new Y,"/register":new Z,"/story/:id":new ae};var y,b,u,l,x,v,C;class oe{constructor({navigationDrawer:e,drawerButton:a,content:o}){c(this,l);c(this,y,null);c(this,b,null);c(this,u,null);p(this,y,o),p(this,b,a),p(this,u,e),h(this,l,x).call(this),h(this,l,v).call(this),h(this,l,C).call(this)}async renderPage(){const e=X(),a=ne[e];document.startViewTransition?document.startViewTransition(async()=>{s(this,y).innerHTML=await a.render(),await a.afterRender(),h(this,l,v).call(this)}):(s(this,y).innerHTML=await a.render(),await a.afterRender(),h(this,l,v).call(this))}}y=new WeakMap,b=new WeakMap,u=new WeakMap,l=new WeakSet,x=function(){s(this,b).addEventListener("click",()=>{s(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!s(this,u).contains(e.target)&&!s(this,b).contains(e.target)&&s(this,u).classList.remove("open"),s(this,u).querySelectorAll("a").forEach(a=>{a.contains(e.target)&&s(this,u).classList.remove("open")})})},v=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const a=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${a})</a>`,document.querySelector("#logout-link").addEventListener("click",o=>{o.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",h(this,l,v).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},C=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",a=>{a.preventDefault(),location.hash="#/",setTimeout(()=>{const o=document.getElementById("main-content");o&&o.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const t=new oe({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()})});"serviceWorker"in navigator&&"PushManager"in window&&navigator.serviceWorker.register("/Dicoding_Story-/sw.js").then(t=>{console.log("[Service Worker] Terdaftar"),R(t)}).catch(t=>{console.error("[Service Worker] Gagal:",t)});
