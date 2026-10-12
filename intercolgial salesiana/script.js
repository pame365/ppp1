/* Encontrémonos — navegación y validaciones de demostración.
   Antes de publicar: configura un backend seguro y cambia el número de WhatsApp. */
"use strict";

const CONFIG = {
  // Formato internacional sin + ni espacios. Ecuador: 593 + número.
  whatsappNumber: "593963080360"
};

const pages = [...document.querySelectorAll("[data-panel]")];
const navLinks = [...document.querySelectorAll("[data-page]")];
const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function showPage(pageName, updateHistory = true) {
  const target = pages.find(page => page.dataset.panel === pageName);
  if (!target) return;
  pages.forEach(page => page.classList.toggle("active", page === target));
  document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    const active = link.dataset.page === pageName;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (updateHistory) history.pushState({ page: pageName }, "", `#${pageName}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleInternalNavigation(event) {
  const link = event.target.closest('a[data-page]');
  if (!link) return;
  event.preventDefault();
  showPage(link.dataset.page);
}
document.addEventListener("click", handleInternalNavigation);

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

window.addEventListener("popstate", () => {
  const pageName = location.hash.replace("#", "") || "inicio";
  showPage(pageName, false);
});

const initialPage = location.hash.replace("#", "");
if (pages.some(page => page.dataset.panel === initialPage)) showPage(initialPage, false);
const yearEl = document.getElementById("currentYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();




/* Foto: vista previa local y límites básicos. No se sube a un servidor. */
const photoInput = document.getElementById("personPhoto");
const photoPreview = document.getElementById("photoPreview");
const photoPreviewWrap = document.getElementById("photoPreviewWrap");
let currentPhotoUrl = null;

photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    photoInput.value = "";
    showToast("Formato no válido. Usa JPG, PNG o WebP.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    photoInput.value = "";
    showToast("La imagen supera los 5 MB.");
    return;
  }
  if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
  currentPhotoUrl = URL.createObjectURL(file);
  photoPreview.src = currentPhotoUrl;
  photoPreviewWrap.hidden = false;
});
document.getElementById("removePhoto").addEventListener("click", () => {
  photoInput.value = "";
  photoPreview.removeAttribute("src");
  photoPreviewWrap.hidden = true;
  if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
  currentPhotoUrl = null;
});

/* Reporte: se guarda en Firebase (solo el administrador puede leerlo). */
document.getElementById("reportForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const campos = ["personName","personId","personAge","birthDate","personHeight",
    "personBuild","hairColor","eyeColor","distinctiveMarks","clothing","lastSeen",
    "lastSeenTime","lastLocation","lastContact","medicalInfo","familyName",
    "familyEmail","familyPhone","officialReport","extraInfo"];

  const data = {};
  campos.forEach(id => {
    const el = document.getElementById(id);
    const valor = el ? el.value.trim() : "";
    if (valor) data[id] = valor;
  });
  data.estado = "nuevo";
  data.createdAt = firebase.database.ServerValue.TIMESTAMP;

  const button = form.querySelector('button[type="submit"]');
  const result = document.getElementById("reportResult");
  button.disabled = true;
  try {
    await db.ref("reportes").push(data);
    form.reset();
    photoPreviewWrap.hidden = true;
        showToast("Gracias. Tu reporte fue recibido. Si es aprobado, aparecerá en Casos recientes.");
    showPage("inicio");
  } catch (error) {
    showToast("No se pudo enviar el reporte. Inténtalo de nuevo.");
  } finally {
    button.disabled = false;
  }
});

const whatsappLink = document.getElementById("whatsappLink");
if (whatsappLink) whatsappLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Hola, necesito orientación sobre la plataforma Encontrémonos.")}`;





document.querySelectorAll(".hero-carousel").forEach((carousel) => {
  const slides = carousel.querySelectorAll(".hero-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const prev = carousel.querySelector(".carousel-btn.prev");
  const next = carousel.querySelector(".carousel-btn.next");

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 4000);
  }

  prev.addEventListener("click", () => {
    showSlide(current - 1);
    startTimer();
  });

  next.addEventListener("click", () => {
    showSlide(current + 1);
    startTimer();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      startTimer();
    });
  });

  showSlide(0);
  startTimer();
});

/* ---------- Foro con moderación (Firebase) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyCck5HYtygspb2fT-rT63UMKZ6GNWaKGUk",
  authDomain: "nex0rg.firebaseapp.com",
  databaseURL: "https://nex0rg-default-rtdb.firebaseio.com",
  projectId: "nex0rg",
  storageBucket: "nex0rg.firebasestorage.app",
  messagingSenderId: "684713151482",
  appId: "1:684713151482:web:722bb2fb9e9619e0113243"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function buildPost(data, statusText, tagText) {
  const post = document.createElement("article");
  post.className = "forum-post";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = (data.name || "?").charAt(0).toLocaleUpperCase("es");
  const content = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "post-meta";
  const author = document.createElement("strong");
  author.textContent = data.name;
  const status = document.createElement("span");
  status.textContent = statusText;
  meta.append(author, status);
  const body = document.createElement("p");
  body.textContent = data.message;          // textContent evita inyección de HTML
  const tag = document.createElement("span");
  tag.className = "post-tag";
  tag.textContent = tagText;
  content.append(meta, body, tag);
  post.append(avatar, content);
  return post;
}

/* Enviar: el mensaje va a "pendientes", no se muestra. */
document.getElementById("forumForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.getElementById("forumName").value.trim().slice(0, 40);
  const topic = document.getElementById("forumTopic").value;
  const message = document.getElementById("forumMessage").value.trim().slice(0, 600);
  if (!name || !message) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await db.ref("foro/pendientes").push({
      name, topic, message,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
    form.reset();
    showToast("Gracias. Tu mensaje será publicado cuando sea revisado.");
  } catch (error) {
    showToast("No se pudo enviar el mensaje. Inténtalo de nuevo.");
  } finally {
    button.disabled = false;
  }
});

/* Mostrar solo los aprobados (los 50 más recientes). */
const approvedBox = document.getElementById("approvedMessages");
db.ref("foro/aprobados").orderByChild("createdAt").limitToLast(50).on("value", snapshot => {
  const items = [];
  snapshot.forEach(child => { items.push(child.val()); });
  approvedBox.replaceChildren(
    ...items.reverse().map(item => buildPost(item, "Publicado", `${item.topic}`))
  );
});

/* ---------- Casos (Firebase) ---------- */
function buildCase(data, index) {
  const card = document.createElement("article");
  card.className = "case-card";

  const photo = document.createElement("div");
  photo.className = "case-photo " + ["photo-one", "photo-two", "photo-three"][index % 3];
  if (data.photo) {
    const img = document.createElement("img");
    img.src = data.photo;
    img.alt = "";
    photo.append(img);
  } else {
    photo.textContent = (data.name || "?").charAt(0).toLocaleUpperCase("es");
    photo.style.cssText = "display:grid;place-items:center;font-size:3rem;font-weight:700";
  }

  const body = document.createElement("div");
  body.className = "case-body";
  const status = document.createElement("span");
  status.className = "case-status";
  status.textContent = data.status || "CASO PUBLICADO";
  const title = document.createElement("h3");
  title.textContent = data.name || "";
  const place = document.createElement("p");
  const pin = document.createElement("span");
  pin.textContent = "⌖";
  place.append(pin, " " + (data.city || ""));
  const age = document.createElement("p");
  age.textContent = "Edad: " + (data.age || "—");
  const desc = document.createElement("p");
  desc.className = "case-desc";
  desc.textContent = data.description || "";

  let action;
  if (data.status === "EJEMPLO") {
    action = document.createElement("button");
    action.type = "button";
    action.addEventListener("click", () => showToast("Esta es una ficha de ejemplo."));
  } else {
    action = document.createElement("a");
    action.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Hola, tengo información sobre el caso de " + data.name)}`;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
  }
  action.className = "text-button";
  action.textContent = "¿La has visto? - COMUNÍCATE CON NOSOTROS ↗";

  body.append(status, title, place, age, desc, action);
  card.append(photo, body);
  return card;
}

function renderCases(gridId, emptyId, items) {
  document.getElementById(gridId).replaceChildren(...items.map((item, i) => buildCase(item, i)));
  const empty = document.getElementById(emptyId);
  if (empty) empty.hidden = items.length > 0;
}

function bindSearch(inputId, gridId, emptyId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase("es");
    let visible = 0;
    document.querySelectorAll(`#${gridId} .case-card`).forEach(card => {
      const ok = card.textContent.toLocaleLowerCase("es").includes(query);
      card.hidden = !ok;
      if (ok) visible++;
    });
    const empty = document.getElementById(emptyId);
    if (empty) empty.hidden = visible > 0;
  });
}
bindSearch("caseSearch", "caseGrid", "noCases");
bindSearch("allCaseSearch", "allCasesGrid", "noAllCases");

/* Inicio muestra los 3 más recientes; la página Casos muestra todos. */
db.ref("casos").orderByChild("createdAt").on("value", snapshot => {
  const items = [];
  snapshot.forEach(child => { items.push(child.val()); });
  items.reverse();
  renderCases("caseGrid", "noCases", items.slice(0, 3));
  renderCases("allCasesGrid", "noAllCases", items);
});