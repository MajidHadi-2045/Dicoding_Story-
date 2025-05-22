var U=t=>{throw TypeError(t)};var x=(t,e,n)=>e.has(t)||U("Cannot "+n);var c=(t,e,n)=>(x(t,e,"read from private field"),n?n.call(t):e.get(t)),m=(t,e,n)=>e.has(t)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),h=(t,e,n,i)=>(x(t,e,"write to private field"),i?i.call(t,n):e.set(t,n),n),p=(t,e,n)=>(x(t,e,"access private method"),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const K="https://story-api.dicoding.dev/v1",ne="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function ae(t){try{if(await Notification.requestPermission()!=="granted"){alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.");return}const n=await t.pushManager.getSubscription();n&&(await n.unsubscribe(),console.log("[Push] Subscription lama dihapus."));const i=oe(ne),a=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:i}),o=localStorage.getItem("token");if(!o)throw new Error("Token login tidak ditemukan");if(!(await fetch(`${K}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:a.endpoint,keys:a.toJSON().keys})})).ok)throw new Error("Gagal mengirim subscription ke server");await J("Notifikasi Diaktifkan","Kamu akan menerima notifikasi cerita baru 🎉"),console.log("[Push] Subscription berhasil.")}catch(e){console.error("[Push] Gagal aktifkan:",e.message),alert("Notifikasi tidak dapat diaktifkan saat ini. Silakan muat ulang halaman atau periksa izin notifikasi di browser Anda.")}}async function ie(t){try{const e=await t.pushManager.getSubscription();if(!e){alert("Tidak ada notifikasi yang aktif.");return}const n=localStorage.getItem("token");if(!n){alert("Token login tidak ditemukan");return}if(!(await fetch(`${K}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({endpoint:e.endpoint})})).ok)throw new Error("Gagal hapus subscription di server");await e.unsubscribe()?(await J("Notifikasi Dimatikan","Kamu tidak akan menerima notifikasi lagi 🔕"),console.log("[Push] Unsubscribe berhasil.")):alert("Gagal menonaktifkan notifikasi")}catch(e){console.error("[Push] Gagal unsubscribe:",e.message),alert("Notifikasi tidak dapat dimatikan saat ini. Silakan muat ulang halaman.")}}async function J(t,e){if(Notification.permission!=="granted"){alert(`${t}
${e}`);return}(await navigator.serviceWorker.ready).showNotification(t,{body:e,icon:"/images/android-chrome-192x192.png",badge:"/images/android-chrome-192x192.png"})}function oe(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(n);return new Uint8Array([...i].map(a=>a.charCodeAt(0)))}const re={BASE_URL:"https://story-api.dicoding.dev/v1"},T=re.BASE_URL;async function se(){const t=localStorage.getItem("token");return(await(await fetch(`${T}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json()).listStory||[]}async function ce({description:t,photo:e,lat:n,lon:i}){const a=localStorage.getItem("token"),o=new FormData;return o.append("description",t),o.append("photo",e),n&&i&&(o.append("lat",n),o.append("lon",i)),await(await fetch(`${T}/stories`,{method:"POST",headers:{Authorization:`Bearer ${a}`},body:o})).json()}async function de({email:t,password:e}){return await(await fetch(`${T}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})})).json()}async function le({name:t,email:e,password:n}){return await(await fetch(`${T}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:n})})).json()}async function ue(t){const e=localStorage.getItem("token");return(await(await fetch(`https://story-api.dicoding.dev/v1/stories/${t}`,{headers:{Authorization:`Bearer ${e}`}})).json()).story}function me(t){typeof(t==null?void 0:t.onLoading)=="function"&&t.onLoading(),se().then(e=>{typeof(t==null?void 0:t.onSuccess)=="function"&&t.onSuccess(e)}).catch(e=>{console.error("Gagal mengambil data cerita:",e),typeof(t==null?void 0:t.onError)=="function"&&t.onError(e)})}function pe({description:t,photo:e,lat:n,lon:i}){return ce({description:t,photo:e,lat:n,lon:i})}class ge{async render(){return`
      <section class="container">
        <h2 class="section-title" style="text-align:center;">Story List</h2>
        <div id="loading-indicator" class="loader" style="display:none; text-align:center;"></div>
        <div id="story-list" class="card-container"></div>

        <h2 class="section-title" style="text-align:center;">Story Location</h2>
        <div id="map"></div>
      </section>
    `}async afterRender(){if(!localStorage.getItem("token")){location.hash="#/login";return}me({onLoading:()=>{document.getElementById("loading-indicator").style.display="block"},onSuccess:n=>{document.getElementById("loading-indicator").style.display="none",this.showStories(n),this.showMap(n)},onError:()=>{const n=document.getElementById("story-list");n.innerHTML='<p style="text-align:center;">Gagal memuat data cerita.</p>',document.getElementById("loading-indicator").style.display="none"}})}showStories(e){const n=document.getElementById("story-list");if(n.innerHTML="",!e.length){n.innerHTML='<p style="text-align:center;">Tidak ada data cerita.</p>';return}e.forEach(i=>{const a=document.createElement("div");a.className="story-card",a.innerHTML=`
        <img src="${i.photoUrl}" alt="Cerita oleh ${i.name}" />
        <h3><i class="fa-solid fa-user" aria-hidden="true"></i> ${i.name}</h3>
        <p><i class="fa-solid fa-align-left" aria-hidden="true"></i> ${i.description}</p>
        <p><small><i class="fa-solid fa-clock" aria-hidden="true"></i> Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,a.setAttribute("data-id",i.id),a.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),n.appendChild(a)})}showMap(e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map("map",{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i),e.forEach(a=>{a.lat&&a.lon&&L.marker([a.lat,a.lon]).addTo(i).bindPopup(`<strong>${a.name}</strong><br>${a.description}`)})}}class fe{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("main-content");e&&e.focus()}}function he(t,e){const n={OpenStreetMap:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),"Topo Map":L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap contributors"}),"Carto Dark":L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a>',subdomains:"abcd",maxZoom:19})},i=L.map(t,{center:[-2.5489,118.0149],zoom:5,layers:[n.OpenStreetMap]});L.control.layers(n).addTo(i);let a;return i.on("click",o=>{a?a.setLatLng(o.latlng):a=L.marker(o.latlng).addTo(i),typeof e=="function"&&e(o.latlng.lat,o.latlng.lng)}),i}let g=null,y=null;var B,D;class ye{constructor(){m(this,B,null);m(this,D,null)}async render(){return localStorage.getItem("token")?`
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
    `:(setTimeout(()=>{window.location.hash="#/login"},100),'<section class="container"><p>Anda harus login untuk menambahkan cerita.</p></section>')}async afterRender(){const e=document.getElementById("preview-container"),n=a=>{const o=new FileReader;o.onload=r=>{e.innerHTML=`<img src="${r.target.result}" alt="Preview" style="max-width:100%; border-radius:6px;" />`},o.readAsDataURL(a)};document.getElementById("open-folder").addEventListener("click",()=>{document.getElementById("file-input").click()}),document.getElementById("file-input").addEventListener("change",a=>{g=a.target.files[0],n(g)});const i=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);document.getElementById("open-camera").addEventListener("click",async()=>{if(i)document.getElementById("mobile-camera-input").click();else{const a=document.getElementById("webcam-container"),o=document.getElementById("webcam"),r=document.getElementById("snapshot"),d=document.getElementById("capture-photo");a.style.display="block";try{y=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=y}catch(s){alert("Tidak dapat mengakses webcam: "+s.message)}d.onclick=()=>{const s=r.getContext("2d");r.width=o.videoWidth,r.height=o.videoHeight,s.drawImage(o,0,0),r.toBlob(l=>{g=new File([l],"webcam-capture.jpg",{type:"image/jpeg"}),n(g)},"image/jpeg"),y&&(y.getTracks().forEach(l=>l.stop()),o.srcObject=null,y=null),a.style.display="none"}}}),document.getElementById("mobile-camera-input").addEventListener("change",a=>{g=a.target.files[0],n(g)}),he("map",(a,o)=>{h(this,B,a),h(this,D,o)}),window.addEventListener("hashchange",()=>{y&&(y.getTracks().forEach(a=>a.stop()),y=null)}),document.getElementById("story-form").addEventListener("submit",async a=>{a.preventDefault();const o=document.getElementById("form-message");o.textContent="Mengirim...";const r=document.getElementById("description").value;if(!g){o.textContent="Silakan pilih atau ambil foto terlebih dahulu.";return}const d=await pe({description:r,photo:g,lat:c(this,B),lon:c(this,D)});d.error?o.textContent=`Gagal: ${d.message}`:(o.textContent="Cerita berhasil dikirim!",a.target.reset(),e.innerHTML="",g=null,this.marker&&map.removeLayer(this.marker),setTimeout(()=>{location.hash="#/"},1500))})}}B=new WeakMap,D=new WeakMap;async function be(t,e,n,i){try{const a=await de({email:t,password:e});n(a)}catch(a){console.error("Login gagal:",a),i({error:!0,message:"Login gagal. Silakan coba lagi."})}}async function ve(t,e,n,i,a){try{const o=await le({name:t,email:e,password:n});i(o)}catch(o){console.error("Registrasi gagal:",o),a({error:!0,message:"Registrasi gagal. Silakan coba lagi."})}}class we{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),n=document.querySelector("#login-message");e.addEventListener("submit",o=>{o.preventDefault();const r=e.email.value,d=e.password.value;be(r,d,s=>{n.textContent=s.message,localStorage.setItem("token",s.loginResult.token),localStorage.setItem("name",s.loginResult.name),window.location.hash="#/"},s=>{n.textContent=s.message})});const i=document.getElementById("password");document.getElementById("togglePassword").addEventListener("click",()=>{const o=i.getAttribute("type")==="password"?"text":"password";i.setAttribute("type",o)})}}class ke{async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),n=document.querySelector("#register-message");e.addEventListener("submit",i=>{i.preventDefault();const a=e.name.value,o=e.email.value,r=e.password.value;ve(a,o,r,d=>{n.textContent=d.message,e.reset(),setTimeout(()=>{location.hash="#/login"},1500)},d=>{n.textContent=d.message})})}}function Y(t){const e=t.split("/");return{resource:e[1]||null,id:e[2]||null}}function Le(t){let e="";return t.resource&&(e=e.concat(`/${t.resource}`)),t.id&&(e=e.concat("/:id")),e||"/"}function Z(){return location.hash.replace("#","")||"/"}function Se(){const t=Z(),e=Y(t);return Le(e)}function Ee(){const t=Z();return Y(t)}var b;class Ie{constructor(e){m(this,b);h(this,b,e)}async showDetail(e){try{const n=await ue(e);n?c(this,b).displayStory(n):c(this,b).displayError("Cerita tidak ditemukan.")}catch(n){console.error(n),c(this,b).displayError("Gagal mengambil data cerita.")}}}b=new WeakMap;const N=(t,e)=>e.some(n=>t instanceof n);let q,_;function Be(){return q||(q=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function De(){return _||(_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const R=new WeakMap,$=new WeakMap,A=new WeakMap;function Me(t){const e=new Promise((n,i)=>{const a=()=>{t.removeEventListener("success",o),t.removeEventListener("error",r)},o=()=>{n(w(t.result)),a()},r=()=>{i(t.error),a()};t.addEventListener("success",o),t.addEventListener("error",r)});return A.set(e,t),e}function Pe(t){if(R.has(t))return;const e=new Promise((n,i)=>{const a=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",r),t.removeEventListener("abort",r)},o=()=>{n(),a()},r=()=>{i(t.error||new DOMException("AbortError","AbortError")),a()};t.addEventListener("complete",o),t.addEventListener("error",r),t.addEventListener("abort",r)});R.set(t,e)}let j={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return R.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return w(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Q(t){j=t(j)}function Te(t){return De().includes(t)?function(...e){return t.apply(F(this),e),w(this.request)}:function(...e){return w(t.apply(F(this),e))}}function Ae(t){return typeof t=="function"?Te(t):(t instanceof IDBTransaction&&Pe(t),N(t,Be())?new Proxy(t,j):t)}function w(t){if(t instanceof IDBRequest)return Me(t);if($.has(t))return $.get(t);const e=Ae(t);return e!==t&&($.set(t,e),A.set(e,t)),e}const F=t=>A.get(t);function Ce(t,e,{blocked:n,upgrade:i,blocking:a,terminated:o}={}){const r=indexedDB.open(t,e),d=w(r);return i&&r.addEventListener("upgradeneeded",s=>{i(w(r.result),s.oldVersion,s.newVersion,w(r.transaction),s)}),n&&r.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),d.then(s=>{o&&s.addEventListener("close",()=>o()),a&&s.addEventListener("versionchange",l=>a(l.oldVersion,l.newVersion,l))}).catch(()=>{}),d}const xe=["get","getKey","getAll","getAllKeys","count"],$e=["put","add","delete","clear"],O=new Map;function z(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(O.get(e))return O.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,a=$e.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(a||xe.includes(n)))return;const o=async function(r,...d){const s=this.transaction(r,a?"readwrite":"readonly");let l=s.store;return i&&(l=l.index(d.shift())),(await Promise.all([l[n](...d),a&&s.done]))[0]};return O.set(e,o),o}Q(t=>({...t,get:(e,n,i)=>z(e,n)||t.get(e,n,i),has:(e,n)=>!!z(e,n)||t.has(e,n)}));const Oe=["continue","continuePrimaryKey","advance"],G={},H=new WeakMap,X=new WeakMap,Ne={get(t,e){if(!Oe.includes(e))return t[e];let n=G[e];return n||(n=G[e]=function(...i){H.set(this,X.get(this)[e](...i))}),n}};async function*Re(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const n=new Proxy(e,Ne);for(X.set(n,e),A.set(n,F(e));e;)yield n,e=await(H.get(n)||e.continue()),H.delete(n)}function W(t,e){return e===Symbol.asyncIterator&&N(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&N(t,[IDBIndex,IDBObjectStore])}Q(t=>({...t,get(e,n,i){return W(e,n)?Re:t.get(e,n,i)},has(e,n){return W(e,n)||t.has(e,n)}}));const je="dicoding-story-db",Fe=1,k="stories",C=()=>Ce(je,Fe,{upgrade(t){if(!t.objectStoreNames.contains(k)){const e=t.createObjectStore(k,{keyPath:"id"});e.createIndex("name","name",{unique:!1}),e.createIndex("createdAt","createdAt",{unique:!1}),console.log(`[IndexedDB] Object store "${k}" dibuat.`)}}}),He=async t=>{if(!t||!t.id)throw new Error("Cerita tidak memiliki ID.");await(await C()).put(k,t),console.log(`[IndexedDB] Cerita "${t.id}" disimpan.`)},Ue=async()=>{const e=await(await C()).getAll(k);return console.log(`[IndexedDB] Mengambil ${e.length} cerita.`),e},qe=async t=>{const n=await(await C()).get(k,t);return console.log(`[IndexedDB] Cerita ID "${t}" ditemukan:`,!!n),n},_e=async t=>{await(await C()).delete(k,t),console.log(`[IndexedDB] Cerita ID "${t}" dihapus.`)};var M,S,P;class ze{constructor(){m(this,S);m(this,M)}async render(){return`
      <section class="container">
        <h2 class="section-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>
        <div id="favorite-action"></div>

        <div class="back-wrapper">
          <a href="#/" class="back-button">← Kembali ke Beranda</a>
        </div>
      </section>
    `}async afterRender(){const{id:e}=Ee();h(this,M,new Ie(this)),c(this,M).showDetail(e)}async displayStory(e){const n=document.getElementById("story-detail");n.innerHTML=`
      <div class="story-image-wrapper">
        <img src="${e.photoUrl}" alt="Foto ${e.name}" class="story-detail-image" />
      </div>
      <h3>${e.name}</h3>
      <p>${e.description}</p>
      <p><small>Dibuat pada: ${new Date(e.createdAt).toLocaleString("id-ID")}</small></p>
    `,document.querySelector(".story-detail-image").animate([{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],{duration:300,easing:"ease-out"});try{await p(this,S,P).call(this,e)}catch(a){console.error("Favorite button error:",a)}}displayError(e){const n=document.getElementById("story-detail");n.innerHTML=`<p style="color:red;">${e}</p>`}}M=new WeakMap,S=new WeakSet,P=async function(e){const n=document.getElementById("favorite-action");await qe(e.id)?(n.innerHTML='<button id="remove-favorite" class="favorite-btn">🗑️ Hapus dari Favorit</button>',document.getElementById("remove-favorite").addEventListener("click",async()=>{await _e(e.id),alert("Cerita dihapus dari favorit!"),await p(this,S,P).call(this,e)})):(n.innerHTML='<button id="save-favorite" class="favorite-btn">❤️ Simpan ke Favorit</button>',document.getElementById("save-favorite").addEventListener("click",async()=>{await He(e),alert("Cerita disimpan ke favorit!"),await p(this,S,P).call(this,e)}))};class Ge{async render(){return`
      <section class="container">
        <h2 class="section-title">Cerita Favorit</h2>
        <div id="favorites-list" class="card-container"></div>
      </section>
    `}async afterRender(){const e=document.getElementById("favorites-list"),n=await Ue();if(!n.length){e.innerHTML='<p style="text-align:center;">Tidak ada cerita favorit.</p>';return}n.forEach(i=>{const a=document.createElement("div");a.className="story-card",a.innerHTML=`
        <img src="${i.photoUrl}" />
        <h3>${i.name}</h3>
        <p>${i.description}</p>
        <p><small>Dibuat: ${new Date(i.createdAt).toLocaleString("id-ID")}</small></p>
      `,a.addEventListener("click",()=>{location.hash=`#/story/${i.id}`}),e.appendChild(a)})}}class We{async render(){return`
      <section class="not-found-page">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
        <a href="#/">Kembali ke Beranda</a>
      </section>
    `}async afterRender(){}}const V={"/":new ge,"/about":new fe,"/add":new ye,"/login":new we,"/register":new ke,"/favorites":new Ge,"/story/:id":new ze,"*":new We};var v,E,f,u,ee,I,te;class Ve{constructor({navigationDrawer:e,drawerButton:n,content:i}){m(this,u);m(this,v,null);m(this,E,null);m(this,f,null);h(this,v,i),h(this,E,n),h(this,f,e),p(this,u,ee).call(this),p(this,u,I).call(this),p(this,u,te).call(this)}async renderPage(){const e=Se(),n=V[e]||V["*"];if(!n){c(this,v).innerHTML="<h2>Terjadi kesalahan: route tidak dikenali.</h2>";return}document.startViewTransition?document.startViewTransition(async()=>{c(this,v).innerHTML=await n.render(),await n.afterRender(),p(this,u,I).call(this)}):(c(this,v).innerHTML=await n.render(),await n.afterRender(),p(this,u,I).call(this))}}v=new WeakMap,E=new WeakMap,f=new WeakMap,u=new WeakSet,ee=function(){c(this,E).addEventListener("click",()=>{c(this,f).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,f).contains(e.target)&&!c(this,E).contains(e.target)&&c(this,f).classList.remove("open"),c(this,f).querySelectorAll("a").forEach(n=>{n.contains(e.target)&&c(this,f).classList.remove("open")})})},I=function(){const e=document.querySelector("#auth-nav");if(e)if(localStorage.getItem("token")){const n=localStorage.getItem("name")||"User";e.innerHTML=`<a href="#" id="logout-link">Logout (${n})</a>`,document.querySelector("#logout-link").addEventListener("click",i=>{i.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("name"),location.hash="#/",p(this,u,I).call(this)})}else e.innerHTML='<a href="#/login">Login</a>'},te=function(){const e=document.querySelector(".brand-name");e&&e.addEventListener("click",n=>{n.preventDefault(),location.hash="#/",setTimeout(()=>{const i=document.getElementById("main-content");i&&i.focus()},200)})};document.addEventListener("DOMContentLoaded",async()=>{const t=new Ve({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()});const e=document.getElementById("toggle-push-btn");async function n(){return!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}async function i(a){e&&(a?(e.classList.remove("off"),e.classList.add("on"),e.innerHTML='<i class="fa-solid fa-bell-slash"></i> Matikan Notifikasi',e.dataset.state="on"):(e.classList.remove("on"),e.classList.add("off"),e.innerHTML='<i class="fa-solid fa-bell"></i> Aktifkan Notifikasi',e.dataset.state="off"))}if("serviceWorker"in navigator&&"PushManager"in window)try{const a=await navigator.serviceWorker.register("/Dicoding_Story-/sw.js");console.log("✅ Service Worker berhasil didaftarkan:",a.scope),await i(await n()),e&&e.addEventListener("click",async()=>{e.dataset.state==="on"?await ie(a):await ae(a);const r=await n();await i(r)})}catch(a){console.error("❌ Gagal mendaftarkan Service Worker:",a)}else console.warn("❌ Service Worker atau PushManager tidak didukung di browser ini.")});
