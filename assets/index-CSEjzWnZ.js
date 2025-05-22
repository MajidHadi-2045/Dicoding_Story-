var U=t=>{throw TypeError(t)};var x=(t,e,n)=>e.has(t)||U("Cannot "+n);var d=(t,e,n)=>(x(t,e,"read from private field"),n?n.call(t):e.get(t)),m=(t,e,n)=>e.has(t)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),h=(t,e,n,i)=>(x(t,e,"write to private field"),i?i.call(t,n):e.set(t,n),n),p=(t,e,n)=>(x(t,e,"access private method"),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const V="https://story-api.dicoding.dev/v1",te="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function ne(t){try{if(await Notification.requestPermission()!=="granted"){alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.");return}const n=await t.pushManager.getSubscription();n&&(await n.unsubscribe(),console.log("[Push] Subscription lama dihapus."));const i=ie(te),a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:i}),o=localStorage.getItem("token");if(!o)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${V}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:a.endpoint,keys:a.toJSON().keys})})).ok)throw new Error("Gagal mengirim subscription ke server");await K("Notifikasi Diaktifkan","Kamu akan menerima notifikasi cerita baru 🎉"),console.log("[Push] Subscription berhasil.")}catch(e){console.error("[Push] Gagal aktifkan:",e.message),alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.")}}async function ae(t){try{const e=await t.pushManager.getSubscription();if(!e){alert("Tidak ada notifikasi yang aktif.");return}const n=localStorage.getItem("token");if(!n){alert("Token login tidak ditemukan");return}if(!(await fetch(`${V}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal hapus subscription di server");await e.unsubscribe()?(await K("Notifikasi Dimatikan","Kamu tidak akan menerima notifikasi lagi 🔕"),console.log("[Push] Unsubscribe berhasil.")):alert("Gagal menonaktifkan notifikasi")}catch(e){console.error("[Push] Gagal unsubscribe:",e.message),alert("Notifikasi tidak dapat dimatikan saat ini. Silakan muat ulang halaman.")}}async function K(t,e){if(Notification.permission!=="granted"){alert(`${t}
${e}`);return}(await navigator.serviceWorker.ready).showNotification(t,{body:e,icon:"/images/android-chrome-192x192.png",badge:"/images/android-chrome-192x192.png"})}function ie(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(n);return new Uint8Array([...i].map(a=>a.charCodeAt(0)))}const oe={BASE_URL:"https://story-api.dicoding.dev/v1"},T=oe.BASE_URL;async function re(){const t=localStorage.getItem("token");return(await(await fetch(`${T}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json()).listStory||[]}async function se({description:t,photo:e,lat:n,lon:i}){const a=localStorage.getItem("token"),o=new FormData;return o.append("description",t),o.append("photo",e),n&&i&&(o.append("lat",n),o.append("lon",i)),await(await fetch(`${T}/stories`,{method:"POST",headers:{Authorization:`Bearer ${a}`},body:o})).json()}async function ce({email:t,password:e}){return await(await fetch(`${T}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})})).json()}async function de({name:t,email:e,password:n}){return await(await fetch(`${T}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:n})})).json()}async function le(t){const e=localStorage.getItem("token");return(await(await fetch(`https://story-api.dicoding.dev/v1/stories/${t}`,{headers:{Authorization:`Bearer ${e}`}})).json()).story}function ue(t){typeof(t==null?void 0:t.onLoading)=="function"&&t.onLoading(),re().then(e=>{typeof(t==null?void 0:t.onSuccess)=="function"&&t.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(t==null?void 0:t.onError)=="function"&&t.onError(e)})}function me({description:t,photo:e,lat:n,lon:i}){return se({description:t,photo:e,lat:n,lon:i})}class pe{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}ue({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:n=>{document.getElementById("loading-indicator").style.display="none",this.showStories(n),this.showMap(n)},onError:()=>{const n=document.getElementById("story-list");n.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const n=document.getElementById("story-list");if(n.innerHTML="",!e.length){n.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const a=document.createElement("div");a.className="story-card",a.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,a.setAttribute("data-id",i.id),a.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),n.appendChild(a)})}showMap(e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i),e.forEach(a=>{a.lat&&a.lon&&L.marker([a.lat,a.lon]).addTo(i).bindPopup(`<strong>${a.name}</strong><br>${a.description}`)})}}class ge{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function fe(t,e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(t,{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i);let a;return i.on("click",o=>{a?a.setLatLng(o.latlng):a=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let g=null,y=null;var B,D;class he{constructor(){m(this,B,null);m(this,D,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),n=a=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(a)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",a=>{g=a.target.files[0],n(g)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const a=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),c=document.getElementById("capture-photo");a.style.display="block";try{y=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=y}catch(s){alert("Tidak dapat mengakses webcam: "+s.message)}c.onclick=()=>{const s=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,s.drawImage(o,0,0),r.toBlob(l=>{g=new File([l],"webcam-capture.jpg",{type:"image/jpeg"}),n(g)},"image/jpeg"),y&&(y.getTracks().forEach(l=>l.stop()),o.srcObject=null,y=null),a.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",a=>{g=a.target.files[0],n(g)}),fe("map",(a,o)=>{h(this,B,a),h(this,D,o)}),window.addEventListener("hashchange",()=>{y&&(y.getTracks().forEach(a=>a.stop()),y=null)}),document.getElementById("story-form").addEventListener("submit",async a=>{a.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!g){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const c=await me({description:r,photo:g,lat:d(this,B),lon:d(this,D)});c.error?o.textContent=`Gagal: ${c.message}`:(o.textContent="Cerita berhasil dikirim!",a.target.reset(),e.innerHTML="",g=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}B=new WeakMap,D=new WeakMap;async function ye(t,e,n,i){try{const a=await ce({email:t,password:e});n(a)}catch(a){console.error("Login gagal:",a),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function be(t,e,n,i,a){try{const o=await de({name:t,email:e,password:n});i(o)}catch(o){console.error("Registrasi gagal:",o),a({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class ve{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),n=document.querySelector("#login-message");e.addEventListener("submit",o=>{o.preventDefault();const r=e.email.value,c=e.password.value;ye(r,c,s=>{n.textContent=s.message,localStorage.setItem("token",s.loginResult.token),localStorage.setItem("name",s.loginResult.name),window.location.hash="#/"},s=>{n.textContent=s.message})});const i=document.getElementById("password");document.getElementById("togglePassword").addEventListener("click",()=>{const o=i.getAttribute("type")==="password"?"text":"password";i.setAttribute("type",o)})}}class we{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),n=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const a=e.name.value,o=e.email.value,r=e.password.value;be(a,o,r,c=>{n.textContent=c.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},c=>{n.textContent=c.message})})}}function J(t){const e=t.split("/");return{resource:e[1]||null,id:e[2]||null}}function ke(t){let e="";return t.resource&&(e=e.concat(`/${t.resource}`)),t.id&&(e=e.concat("/:id")),e||"/"}function Y(){return location.hash.replace("#","")||"/"}function Le(){const t=Y(),e=J(t);return ke(e)}function Se(){const t=Y();return J(t)}var b;class Ee{constructor(e){m(this,b);h(this,b,e)}async showDetail(e){try{const n=await le(e);n?d(this,b).displayStory(n):d(this,b).displayError("Cerita tidak ditemukan.")}catch(n){console.error(n),d(this,b).displayError("Gagal mengambil data cerita.")}}}b=new WeakMap;const N=(t,e)=>e.some(n=>t instanceof n);let q,_;function Ie(){return q||(q=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Be(){return _||(_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const R=new WeakMap,$=new WeakMap,A=new WeakMap;function De(t){const e=new Promise((n,i)=>{const a=()=>{t.removeEventListener("success",o),t.removeEventListener("error",r)},o=()=>{n(v(t.result)),a()},r=()=>{i(t.error),a()};t.addEventListener("success",o),t.addEventListener("error",r)});return A.set(e,t),e}function Me(t){if(R.has(t))return;const e=new Promise((n,i)=>{const a=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",r),t.removeEventListener("abort",r)},o=()=>{n(),a()},r=()=>{i(t.error||new DOMException("AbortError","AbortError")),a()};t.addEventListener("complete",o),t.addEventListener("error",r),t.addEventListener("abort",r)});R.set(t,e)}let j={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return R.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return v(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Z(t){j=t(j)}function Pe(t){return Be().includes(t)?function(...e){return t.apply(F(this),e),v(this.request)}:function(...e){return v(t.apply(F(this),e))}}function Te(t){return typeof t=="function"?Pe(t):(t instanceof IDBTransaction&&Me(t),N(t,Ie())?new Proxy(t,j):t)}function v(t){if(t instanceof IDBRequest)return De(t);if($.has(t))return $.get(t);const e=Te(t);return e!==t&&($.set(t,e),A.set(e,t)),e}const F=t=>A.get(t);function Ae(t,e,{blocked:n,upgrade:i,blocking:a,terminated:o}={}){const r=indexedDB.open(t,e),c=v(r);return i&&r.addEventListener("upgradeneeded",s=>{i(v(r.result),s.oldVersion,s.newVersion,v(r.transaction),s)}),n&&r.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),c.then(s=>{o&&s.addEventListener("close",()=>o()),a&&s.addEventListener("versionchange",l=>a(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const Ce=["get","getKey","getAll","getAllKeys","count"],xe=["put","add","delete","clear"],O=new Map;function z(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(O.get(e))return O.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,a=xe.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(a||Ce.includes(n)))return;const o=async function(r,...c){const s=this.transaction(r,a?"readwrite":"readonly");let l=s.store;return i&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),a&&s.done]))[0]};return O.set(e,o),o}Z(t=>({...t,get:(e,n,i)=>z(e,n)||t.get(e,n,i),has:(e,n)=>!!z(e,n)||t.has(e,n)}));const $e=["continue","continuePrimaryKey","advance"],W={},H=new WeakMap,Q=new WeakMap,Oe={get(t,e){if(!$e.includes(e))return t[e];let n=W[e];return n||(n=W[e]=function(...i){H.set(this,Q.get(this)[e](...i))}),n}};async function*Ne(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const n=new Proxy(e,Oe);for(Q.set(n,e),A.set(n,F(e));e;)yield n,e=await(H.get(n)||e.continue()),H.delete(n)}function G(t,e){return e===Symbol.asyncIterator&&N(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&N(t,[IDBIndex,IDBObjectStore])}Z(t=>({...t,get(e,n,i){return G(e,n)?Ne:t.get(e,n,i)},has(e,n){return G(e,n)||t.has(e,n)}}));const Re="dicoding-story-db",je=1,w="stories",C=()=>Ae(Re,je,{upgrade(t){if(!t.objectStoreNames.contains(w)){const e=t.createObjectStore(w,{keyPath:"id"});e.createIndex("name","name",{unique:!1}),e.createIndex("createdAt","createdAt",{unique:!1}),console.log(`[IndexedDB] Object store "${w}" dibuat.`)}}}),Fe=async t=>{if(!t||!t.id)throw new Error("Cerita tidak memiliki ID.");await(await C()).put(w,t),console.log(`[IndexedDB] Cerita "${t.id}" disimpan.`)},He=async()=>{const e=await(await C()).getAll(w);return console.log(`[IndexedDB] Mengambil ${e.length} cerita.`),e},Ue=async t=>{const n=await(await C()).get(w,t);return console.log(`[IndexedDB] Cerita ID "${t}" ditemukan:`,!!n),n},qe=async t=>{await(await C()).delete(w,t),console.log(`[IndexedDB] Cerita ID "${t}" dihapus.`)};var M,k,P;class _e{constructor(){m(this,k);m(this,M)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>
        <div id="favorite-action"></div>

        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=Se();h(this,M,new Ee(this)),d(this,M).showDetail(e)}async displayStory(e){const n=document.getElementById("story-detail");n.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3>${e.name}</h3>
      <p>${e.description}</p>
      <p><small>Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"});try{await p(this,k,P).call(this,e)}catch(a){console.error("Favorite button error:",a)}}displayError(e){const n=document.getElementById("story-detail");n.innerHTML=`<p style="color:red;">${e}</p>`}}M=new WeakMap,k=new WeakSet,P=async function(e){const n=document.getElementById("favorite-action");await Ue(e.id)?(n.innerHTML='<button id="remove-favorite" class="favorite-btn">🗑️ Hapus dari Favorit</button>',document.getElementById("remove-favorite").addEventListener("click",async()=>{await qe(e.id),alert("Cerita dihapus dari favorit!"),await p(this,k,P).call(this,e)})):(n.innerHTML='<button id="save-favorite" class="favorite-btn">❤️ Simpan ke Favorit</button>',document.getElementById("save-favorite").addEventListener("click",async()=>{await Fe(e),alert("Cerita disimpan ke favorit!"),await p(this,k,P).call(this,e)}))};class ze{async render(){return`
      <section class="container">
        <h2 class="section-title">Cerita Favorit</h2>
        <div id="favorites-list" class="card-container"></div>
      </section>
    `}async afterRender(){const e=document.getElementById("favorites-list"),n=await He();if(!n.length){e.innerHTML='<p style="text-align:center;">Tidak ada cerita favorit.</p>';return}n.forEach(i=>{const a=document.createElement("div");a.className="story-card",a.innerHTML=`
        <img src="${i.photoUrl}" />
        <h3>${i.name}</h3>
        <p>${i.description}</p>
        <p><small>Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,a.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),e.appendChild(a)})}}const We={"/":new pe,"/about":new ge,"/add":new he,"/login":new ve,"/register":new we,"/favorites":new ze,"/story/:id":new _e};var S,E,f,u,X,I,ee;class Ge{constructor({navigationDrawer:e,drawerButton:n,content:i}){m(this,u);m(this,S,null);m(this,E,null);m(this,f,null);h(this,S,i),h(this,E,n),h(this,f,e),p(this,u,X).call(this),p(this,u,I).call(this),p(this,u,ee).call(this)}async renderPage(){const e=Le(),n=We[e];document.startViewTransition?document.startViewTransition(async()=>{d(this,S).innerHTML=await n.render(),await n.afterRender(),p(this,u,I).call(this)}):(d(this,S).innerHTML=await n.render(),await n.afterRender(),p(this,u,I).call(this))}}S=new WeakMap,E=new WeakMap,f=new WeakMap,u=new WeakSet,X=function(){d(this,E).addEventListener("click",()=>{d(this,f).classList.toggle("open")}),document.body.addEventListener("click",e=>{!d(this,f).contains(e.target)&&!d(this,E).contains(e.target)&&d(this,f).classList.remove("open"),d(this,f).querySelectorAll("a").forEach(n=>{n.contains(e.target)&&d(this,f).classList.remove("open")})})},I=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const n=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${n})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",p(this,u,I).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},ee=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",n=>{n.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const t=new Ge({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()});const e=document.getElementById("toggle-push-btn");async function n(){return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}async function i(a){e&&(a?(e.classList.remove("off"),e.classList.add("on"),e.innerHTML='<i class="fa-solid fa-bell-slash"></i> Matikan Notifikasi',e.dataset.state="on"):(e.classList.remove("on"),e.classList.add("off"),e.innerHTML='<i class="fa-solid fa-bell"></i> Aktifkan Notifikasi',e.dataset.state="off"))}if(e&&"serviceWorker"in navigator&&"PushManager"in window&&(await navigator.serviceWorker.ready,await i(await n()),e.addEventListener("click",async()=>{const a=e.dataset.state,o=await navigator.serviceWorker.ready;a==="on"?await ae(o):await ne(o);const r=await n();await i(r)})),"serviceWorker"in navigator){console.log("🛠️ Mencoba register service worker...");try{const a=await navigator.serviceWorker.register("/Dicoding_Story-/sw.js");console.log("✅ Service Worker berhasil didaftarkan:",a)}catch(a){console.error("❌ Gagal mendaftarkan Service Worker:",a)}}});
