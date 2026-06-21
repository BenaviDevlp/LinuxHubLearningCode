/* ============================================================
   EXPERIENCIA (experiencia.js)
   Funciones nuevas que se apoyan en app.js (global):
     1) Tutorial guiado tipo "spotlight" (resalta secciones).
     2) Mi cuenta: perfil local para personalizar certificados.
     3) Sala de preparación del quiz (modo misión, gamificado).
   Depende de: leer/escribir, CLAVE_CONFIG, mostrarToast,
   mostrarPantalla, volverAlMenu, QUIZZES, NIVELES, nivelActual,
   iniciarQuiz, abrirCertificados.
   ============================================================ */
"use strict";

/* Claves de almacenamiento propias de este módulo */
const CLAVE_TUTORIAL = "tutorialVistoLinuxMint";
const CLAVE_CUENTA   = "cuentaLinuxMint";

/* ============================================================
   1) TUTORIAL GUIADO (SPOTLIGHT TOUR)
   ============================================================ */
const PASOS_TOUR = [
  { sel: '[data-tour="xp"]', icono: "📊", titulo: "Tu progreso global",
    txt: "Aquí ves tu nivel, la experiencia (XP) que ganas y tu racha de días estudiando. Cada lección, quiz y logro suma puntos." },
  { sel: '[data-tour="niveles"]', icono: "📓", titulo: "Notas por nivel",
    txt: "Tu cuaderno personal. Elige Principiante, Intermedio o Avanzado para leer la guía, tomar notas y autoevaluarte con un quiz." },
  { sel: '[data-tour="academia"]', icono: "🎓", titulo: "Academia",
    txt: "Cursos guiados paso a paso: teoría, ejemplos, código y repaso. Al completar un módulo desbloqueas su certificado." },
  { sel: '[data-tour="herramientas"]', icono: "🧰", titulo: "Herramientas y recursos",
    txt: "Diccionario de comandos, guía para publicar tu web, generador de resumen y tus certificados. Todo a un clic." },
  { sel: '#btnCuenta', icono: "👤", titulo: "Tu cuenta",
    txt: "Crea tu cuenta para que tus certificados salgan con tu nombre real y datos actualizados. Se guarda en este dispositivo." },
  { sel: '#btnTerminal', icono: "💻", titulo: "Terminal de práctica",
    txt: "Una terminal simulada y segura para practicar comandos (ls, cd, mkdir...) sin miedo a romper nada." },
  { sel: '#btnLogros', icono: "🏆", titulo: "Logros",
    txt: "Desbloquea insignias a medida que avanzas. ¿Podrás conseguirlas todas?" },
  { sel: '#btnTema', icono: "🌙", titulo: "Tema claro u oscuro",
    txt: "Cambia el aspecto cuando quieras. ¡Listo! Pulsa Finalizar y empieza a aprender." }
];

let tourPaso = 0;
let tourActivo = false;

// ¿Estamos en una pantalla pequeña (móvil)?
function esMovilTour() { return window.matchMedia("(max-width: 600px)").matches; }

// Lanza el tutorial. force=true lo muestra aunque ya se haya visto.
function iniciarTutorial(force) {
  if (!force && leer(CLAVE_TUTORIAL, false)) return;   // ya lo vio
  // Aseguramos estar en la pantalla de bienvenida (donde están las secciones)
  if (typeof mostrarPantalla === "function") mostrarPantalla("pantallaBienvenida");

  tourPaso = 0;
  tourActivo = true;
  construirOverlayTour();
  mostrarPasoTour();

  window.addEventListener("resize", reposicionarTour);
  window.addEventListener("scroll", reposicionarTour, true);
  document.addEventListener("keydown", teclasTour);
}

function construirOverlayTour() {
  if (document.getElementById("tourOverlay")) return;
  const ov = document.createElement("div");
  ov.id = "tourOverlay";
  ov.innerHTML = `
    <div class="tour-spot" id="tourSpot"></div>
    <div class="tour-tooltip" id="tourTooltip" role="dialog" aria-modal="true" aria-label="Tutorial">
      <div class="tour-cab"><span id="tourIcono">✨</span><h3 id="tourTitulo"></h3></div>
      <p id="tourTexto"></p>
      <div class="tour-pie">
        <span class="tour-conteo" id="tourConteo"></span>
        <div class="tour-botones">
          <button class="btn-secundario" id="tourSaltar" onclick="terminarTutorial()">Saltar</button>
          <button class="btn-secundario" id="tourAnterior" onclick="tourMover(-1)">← Anterior</button>
          <button class="btn-primario" id="tourSiguiente" onclick="tourMover(1)">Siguiente →</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);
}

function mostrarPasoTour() {
  const paso = PASOS_TOUR[tourPaso];
  const destino = document.querySelector(paso.sel);
  // Si el elemento no existe o está oculto, saltamos al siguiente
  if (!destino || destino.offsetParent === null) { return tourMover(1); }

  // En móvil llevamos el elemento a la zona alta (debajo del header);
  // en escritorio lo centramos.
  if (esMovilTour()) {
    const r0 = destino.getBoundingClientRect();
    const y = window.scrollY + r0.top - 90;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  } else {
    destino.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.getElementById("tourIcono").textContent = paso.icono;
  document.getElementById("tourTitulo").textContent = paso.titulo;
  document.getElementById("tourTexto").textContent = paso.txt;
  document.getElementById("tourConteo").textContent = `Paso ${tourPaso + 1} de ${PASOS_TOUR.length}`;
  document.getElementById("tourAnterior").style.visibility = tourPaso === 0 ? "hidden" : "visible";
  document.getElementById("tourSiguiente").textContent =
    (tourPaso === PASOS_TOUR.length - 1) ? "Finalizar ✓" : "Siguiente →";

  // Esperamos a que termine el scroll para medir posición real
  setTimeout(reposicionarTour, 320);
}

// Coloca el recuadro de luz sobre el destino y el tooltip al lado
function reposicionarTour() {
  if (!tourActivo) return;
  const paso = PASOS_TOUR[tourPaso];
  const destino = document.querySelector(paso.sel);
  const spot = document.getElementById("tourSpot");
  const tip = document.getElementById("tourTooltip");
  if (!destino || !spot || !tip) return;

  const r = destino.getBoundingClientRect();
  const pad = 8;
  spot.style.top = (r.top - pad) + "px";
  spot.style.left = (r.left - pad) + "px";
  spot.style.width = (r.width + pad * 2) + "px";
  spot.style.height = (r.height + pad * 2) + "px";

  // En móvil: panel fijo a lo ancho, en la mitad opuesta al elemento
  // resaltado (así nunca lo tapa). En escritorio: flota junto al elemento.
  if (esMovilTour()) {
    tip.style.width = "auto";
    tip.style.left = "12px";
    tip.style.right = "12px";
    const centro = r.top + r.height / 2;
    if (centro < window.innerHeight * 0.45) {
      tip.style.top = "auto"; tip.style.bottom = "12px";     // elemento arriba -> panel abajo
    } else {
      tip.style.bottom = "auto"; tip.style.top = "12px";     // elemento abajo -> panel arriba
    }
    return;
  }

  // Escritorio: reseteamos posibles estilos de móvil y flotamos
  tip.style.right = "auto";
  tip.style.bottom = "auto";
  tip.style.width = "";
  const tipH = tip.offsetHeight || 180;
  const tipW = tip.offsetWidth || 320;
  const margen = 14;
  let top = r.bottom + margen;
  if (top + tipH > window.innerHeight - 10) {
    top = r.top - tipH - margen;                 // colocar encima
    if (top < 10) top = Math.max(10, (window.innerHeight - tipH) / 2);
  }
  let left = r.left + r.width / 2 - tipW / 2;     // centrado sobre el destino
  left = Math.max(12, Math.min(left, window.innerWidth - tipW - 12));
  tip.style.top = top + "px";
  tip.style.left = left + "px";
}

function tourMover(dir) {
  tourPaso += dir;
  if (tourPaso >= PASOS_TOUR.length) return terminarTutorial();
  if (tourPaso < 0) tourPaso = 0;
  mostrarPasoTour();
}

function teclasTour(e) {
  if (!tourActivo) return;
  if (e.key === "Escape") terminarTutorial();
  else if (e.key === "ArrowRight") tourMover(1);
  else if (e.key === "ArrowLeft") tourMover(-1);
}

function terminarTutorial() {
  tourActivo = false;
  escribir(CLAVE_TUTORIAL, true);
  const ov = document.getElementById("tourOverlay");
  if (ov) ov.remove();
  window.removeEventListener("resize", reposicionarTour);
  window.removeEventListener("scroll", reposicionarTour, true);
  document.removeEventListener("keydown", teclasTour);
}

/* ============================================================
   2) MI CUENTA (perfil local para certificados)
   - Una cuenta por dispositivo, guardada en localStorage.
   - La contraseña NO se guarda en claro: se almacena su hash
     SHA-256 (vía Web Crypto). Es una cuenta local de demo.
   - El nombre completo se sincroniza con los certificados.
   ============================================================ */

// Devuelve el hash SHA-256 (hex) de un texto, o null si no hay Web Crypto
async function hashTexto(texto) {
  if (!(window.crypto && window.crypto.subtle)) return "plano:" + texto; // respaldo
  const datos = new TextEncoder().encode(texto);
  const buf = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function obtenerCuenta() { return leer(CLAVE_CUENTA, null); }

// Sincroniza el nombre de la cuenta con el usado en certificados (CLAVE_CONFIG)
function sincronizarNombreCert(nombreCompleto) {
  const cfg = leer(CLAVE_CONFIG, { tema: "oscuro" });
  cfg.nombre = nombreCompleto;
  escribir(CLAVE_CONFIG, cfg);
  const input = document.getElementById("inputNombreCert");
  if (input) input.value = nombreCompleto;
}

// Actualiza el botón del header con la inicial del usuario
function actualizarIndicadorCuenta() {
  const cuenta = obtenerCuenta();
  const btn = document.getElementById("btnCuenta");
  if (!btn) return;
  if (cuenta && cuenta.sesion) {
    const inicial = (cuenta.nombre || "?").trim().charAt(0).toUpperCase();
    btn.textContent = inicial || "?";
    btn.classList.add("con-sesion");
    btn.title = "Mi cuenta · " + cuenta.nombre + " " + (cuenta.apellido || "");
  } else {
    btn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#ic-user"></use></svg>';
    btn.classList.remove("con-sesion");
    btn.title = "Mi cuenta";
  }
}

function abrirCuenta() {
  renderizarCuenta();
  document.getElementById("modalCuenta").classList.remove("oculto");
}
function cerrarCuenta() { document.getElementById("modalCuenta").classList.add("oculto"); }

// Dibuja el contenido del modal según el estado (sin cuenta / sesión cerrada / dentro)
function renderizarCuenta() {
  const cuenta = obtenerCuenta();
  const cont = document.getElementById("cuentaCuerpo");
  const titulo = document.getElementById("tituloCuenta");

  // Caso 1: sesión iniciada -> perfil
  if (cuenta && cuenta.sesion) {
    titulo.textContent = "Mi perfil";
    const completo = `${escapar(cuenta.nombre)} ${escapar(cuenta.apellido || "")}`.trim();
    cont.innerHTML = `
      <div class="cuenta-perfil">
        <div class="cuenta-avatar">${(cuenta.nombre || "?").charAt(0).toUpperCase()}</div>
        <div>
          <div class="cuenta-nombre">${completo}</div>
          <div class="cuenta-email">${escapar(cuenta.email || "Sin correo")}</div>
        </div>
      </div>
      <div class="cuenta-nota">Tus certificados se generarán a nombre de <b>${completo}</b>.</div>
      <div class="campo">
        <label for="cuentaEditarNombre">Nombre</label>
        <input type="text" id="cuentaEditarNombre" value="${escapar(cuenta.nombre)}" />
      </div>
      <div class="campo">
        <label for="cuentaEditarApellido">Apellido</label>
        <input type="text" id="cuentaEditarApellido" value="${escapar(cuenta.apellido || "")}" />
      </div>
      <div class="form-botones">
        <button class="btn-primario" onclick="guardarPerfil()">Guardar cambios</button>
        <button class="btn-secundario" onclick="irAMisCertificados()">Mis certificados</button>
        <button class="btn-peligro" onclick="cerrarSesion()">Cerrar sesión</button>
      </div>`;
    return;
  }

  // Caso 2: existe cuenta pero la sesión está cerrada -> iniciar sesión
  if (cuenta) {
    titulo.textContent = "Iniciar sesión";
    cont.innerHTML = `
      <div class="cuenta-perfil">
        <div class="cuenta-avatar">${(cuenta.nombre || "?").charAt(0).toUpperCase()}</div>
        <div>
          <div class="cuenta-nombre">Hola de nuevo, ${escapar(cuenta.nombre)}</div>
          <div class="cuenta-email">${escapar(cuenta.email || "")}</div>
        </div>
      </div>
      <div class="cuenta-nota">Introduce tu contraseña para continuar con tu sesión.</div>
      <div class="campo">
        <label for="loginPass">Contraseña</label>
        <input type="password" id="loginPass" placeholder="Tu contraseña" onkeydown="if(event.key==='Enter')iniciarSesion()" />
      </div>
      <div class="form-botones">
        <button class="btn-primario" onclick="iniciarSesion()">Entrar</button>
        <button class="btn-secundario" onclick="borrarCuenta()">Usar otra cuenta</button>
      </div>`;
    setTimeout(() => { const p = document.getElementById("loginPass"); if (p) p.focus(); }, 40);
    return;
  }

  // Caso 3: no hay cuenta -> registro
  titulo.textContent = "Crear cuenta";
  cont.innerHTML = `
    <div class="cuenta-nota">Crea tu cuenta para personalizar tus certificados con tus datos reales.
      Se guarda solo en este dispositivo y la contraseña se almacena cifrada (hash).</div>
    <div class="campo">
      <label for="regNombre">Nombre *</label>
      <input type="text" id="regNombre" placeholder="Ej: Ana" />
    </div>
    <div class="campo">
      <label for="regApellido">Apellido</label>
      <input type="text" id="regApellido" placeholder="Ej: García" />
    </div>
    <div class="campo">
      <label for="regEmail">Correo (opcional)</label>
      <input type="email" id="regEmail" placeholder="ana@ejemplo.com" />
    </div>
    <div class="campo">
      <label for="regPass">Contraseña *</label>
      <input type="password" id="regPass" placeholder="Mínimo 4 caracteres" />
    </div>
    <div class="form-botones">
      <button class="btn-primario" onclick="crearCuenta()">Crear mi cuenta</button>
    </div>`;
  setTimeout(() => { const n = document.getElementById("regNombre"); if (n) n.focus(); }, 40);
}

async function crearCuenta() {
  const nombre = document.getElementById("regNombre").value.trim();
  const apellido = document.getElementById("regApellido").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value;

  if (!nombre) { mostrarToast("⚠️ Escribe tu nombre"); return; }
  if (!pass || pass.length < 4) { mostrarToast("⚠️ La contraseña debe tener al menos 4 caracteres"); return; }

  const hash = await hashTexto(pass);
  const cuenta = { nombre, apellido, email, hash, sesion: true, creada: new Date().toISOString() };
  escribir(CLAVE_CUENTA, cuenta);
  sincronizarNombreCert(`${nombre} ${apellido}`.trim());
  actualizarIndicadorCuenta();
  renderizarCuenta();
  mostrarToast("Cuenta creada. Tus certificados ya llevan tu nombre");
}

async function iniciarSesion() {
  const cuenta = obtenerCuenta();
  if (!cuenta) return;
  const pass = document.getElementById("loginPass").value;
  const hash = await hashTexto(pass);
  if (hash !== cuenta.hash) { mostrarToast("❌ Contraseña incorrecta"); return; }
  cuenta.sesion = true;
  escribir(CLAVE_CUENTA, cuenta);
  sincronizarNombreCert(`${cuenta.nombre} ${cuenta.apellido || ""}`.trim());
  actualizarIndicadorCuenta();
  renderizarCuenta();
  mostrarToast("Bienvenido de nuevo, " + cuenta.nombre);
}

function guardarPerfil() {
  const cuenta = obtenerCuenta();
  if (!cuenta) return;
  const nombre = document.getElementById("cuentaEditarNombre").value.trim();
  const apellido = document.getElementById("cuentaEditarApellido").value.trim();
  if (!nombre) { mostrarToast("⚠️ El nombre no puede estar vacío"); return; }
  cuenta.nombre = nombre; cuenta.apellido = apellido;
  escribir(CLAVE_CUENTA, cuenta);
  sincronizarNombreCert(`${nombre} ${apellido}`.trim());
  actualizarIndicadorCuenta();
  renderizarCuenta();
  mostrarToast("Perfil actualizado");
}

function cerrarSesion() {
  const cuenta = obtenerCuenta();
  if (!cuenta) return;
  cuenta.sesion = false;
  escribir(CLAVE_CUENTA, cuenta);
  actualizarIndicadorCuenta();
  renderizarCuenta();
  mostrarToast("Sesión cerrada");
}

function borrarCuenta() {
  if (!confirm("¿Borrar la cuenta de este dispositivo? Tus notas y progreso se conservan, pero deberás crear una cuenta nueva.")) return;
  localStorage.removeItem(CLAVE_CUENTA);
  actualizarIndicadorCuenta();
  renderizarCuenta();
  mostrarToast("Cuenta eliminada");
}

function irAMisCertificados() {
  cerrarCuenta();
  if (typeof abrirCertificados === "function") abrirCertificados();
}

/* ============================================================
   3) SALA DE PREPARACIÓN DEL QUIZ (modo misión)
   Briefing gamificado antes de cada quiz: objetivos, reglas y
   una cuenta atrás animada que da paso al test.
   ============================================================ */
const FRASES_MISION = [
  "Respira hondo: cada error es un comando que aprendes",
  "Confía en lo que practicaste en la terminal",
  "Sin prisa: lee bien cada pregunta",
  "Modo concentración activado",
  "A por todas: el kernel cree en ti"
];

let quizCronometrado = false;   // modo reloj activado en la sala de preparación
let _quizTimerId = null;        // id del intervalo del temporizador
const SEG_POR_PREGUNTA = 15;    // segundos por pregunta en modo cronometrado

function abrirSalaPreparacion() {
  if (typeof nivelActual === "undefined" || !nivelActual) { mostrarToast("Selecciona un nivel"); return; }
  const preguntas = (typeof QUIZZES !== "undefined" && QUIZZES[nivelActual]) || [];
  if (preguntas.length === 0) { mostrarToast("No hay quiz para este nivel"); return; }

  // Objetivos = temas únicos que cubre el quiz
  const objetivos = [...new Set(preguntas.map(p => p.tema))];
  const frase = FRASES_MISION[Math.floor(Math.random() * FRASES_MISION.length)];
  const nombreNivel = (typeof NIVELES !== "undefined" && NIVELES[nivelActual]) || nivelActual;

  document.getElementById("quizInicio").classList.add("oculto");
  document.getElementById("quizResultado").classList.add("oculto");
  document.getElementById("quizContenedor").classList.add("oculto");

  const prep = document.getElementById("quizPreparacion");
  prep.classList.remove("oculto");
  prep.innerHTML = `
    <div class="sala-prep">
      <div class="prep-cabecera">
        <span class="prep-badge">MISIÓN</span>
        <h3>Quiz · Nivel ${escapar(nombreNivel)}</h3>
        <p class="prep-frase">${escapar(frase)}</p>
      </div>

      <div class="prep-grid">
        <div class="prep-dato"><span class="prep-num">${preguntas.length}</span><span class="prep-lbl">preguntas</span></div>
        <div class="prep-dato"><span class="prep-num">${objetivos.length}</span><span class="prep-lbl">temas</span></div>
        <div class="prep-dato"><span class="prep-num">∞</span><span class="prep-lbl">sin reloj</span></div>
      </div>

      <div class="prep-objetivos">
        <h4>Objetivos de la misión</h4>
        <div class="prep-chips">
          ${objetivos.map(o => `<span class="prep-chip">${escapar(o)}</span>`).join("")}
        </div>
      </div>

      <div class="prep-reglas">
        <h4>Reglas</h4>
        <ul>
          <li>Responde todas las preguntas antes de corregir.</li>
          <li>Al terminar verás tu puntuación y qué repasar.</li>
          <li>Puedes reintentar las veces que quieras.</li>
        </ul>
      </div>

      <div class="prep-modo">
        <button class="prep-toggle ${quizCronometrado ? "activo" : ""}" id="prepToggle"
                role="switch" aria-checked="${quizCronometrado ? "true" : "false"}" onclick="alternarCronometro()">
          <span class="prep-toggle-pip"></span>
          <span class="prep-toggle-txt">Modo cronometrado · 15 s por pregunta</span>
        </button>
      </div>

      <div class="prep-botones">
        <button class="btn-secundario" onclick="cancelarPreparacion()">← Volver</button>
        <button class="btn-primario btn-grande" onclick="lanzarCuentaAtras()">Estoy listo</button>
      </div>
    </div>`;
  prep.scrollIntoView({ behavior: "smooth", block: "center" });
}

function cancelarPreparacion() {
  document.getElementById("quizPreparacion").classList.add("oculto");
  document.getElementById("quizPreparacion").innerHTML = "";
  document.getElementById("quizInicio").classList.remove("oculto");
}

// Cuenta atrás 3-2-1-¡YA! y arranque del quiz real
function lanzarCuentaAtras() {
  const prep = document.getElementById("quizPreparacion");
  const pasos = ["3", "2", "1", "¡YA!"];
  let i = 0;
  prep.innerHTML = `<div class="cuenta-atras"><span id="cuentaNum" class="cuenta-num"></span></div>`;
  const num = document.getElementById("cuentaNum");

  const tick = () => {
    num.textContent = pasos[i];
    num.classList.remove("late");
    void num.offsetWidth;          // reinicia la animación
    num.classList.add("late");
    i++;
    if (i < pasos.length) {
      setTimeout(tick, 750);
    } else {
      setTimeout(() => {
        prep.classList.add("oculto");
        prep.innerHTML = "";
        if (typeof iniciarQuiz === "function") iniciarQuiz();
      }, 650);
    }
  };
  tick();
}

/* ---- Modo cronometrado del quiz ---- */
function alternarCronometro() {
  quizCronometrado = !quizCronometrado;
  const b = document.getElementById("prepToggle");
  if (b) {
    b.classList.toggle("activo", quizCronometrado);
    b.setAttribute("aria-checked", quizCronometrado ? "true" : "false");
  }
}

// La llama iniciarQuiz() (app.js). Solo actúa si el modo está activado.
function iniciarCronometroQuiz() {
  detenerCronometroQuiz();
  const barra = document.getElementById("quizTimer");
  if (!barra) return;
  if (!quizCronometrado) { barra.classList.add("oculto"); return; }

  const nPreg = (typeof QUIZZES !== "undefined" && QUIZZES[nivelActual]) ? QUIZZES[nivelActual].length : 5;
  const totalSeg = nPreg * SEG_POR_PREGUNTA;
  let restante = totalSeg;

  barra.classList.remove("oculto");
  const pintar = () => {
    const mm = String(Math.floor(restante / 60)).padStart(2, "0");
    const ss = String(restante % 60).padStart(2, "0");
    const pct = Math.max(0, (restante / totalSeg) * 100);
    const critico = restante <= 10 ? " critico" : "";
    barra.innerHTML = `
      <div class="quiz-timer-fila">
        <span class="quiz-timer-num${critico}">⏱ ${mm}:${ss}</span>
        <span class="quiz-timer-lbl">tiempo restante</span>
      </div>
      <div class="quiz-timer-barra"><div class="quiz-timer-relleno${critico}" style="width:${pct}%"></div></div>`;
  };
  pintar();

  _quizTimerId = setInterval(() => {
    restante--;
    if (restante <= 0) {
      pintar();
      detenerCronometroQuiz();
      mostrarToast("¡Se acabó el tiempo! Corrigiendo...");
      if (typeof corregirQuiz === "function") corregirQuiz(true);   // fuerza la corrección
      return;
    }
    pintar();
  }, 1000);
}

function detenerCronometroQuiz() {
  if (_quizTimerId) { clearInterval(_quizTimerId); _quizTimerId = null; }
}
document.addEventListener("DOMContentLoaded", () => {
  actualizarIndicadorCuenta();

  // Lanza el tutorial automáticamente la primera vez (con un pequeño
  // margen para que la bienvenida ya esté renderizada por app.js)
  if (!leer(CLAVE_TUTORIAL, false)) {
    setTimeout(() => iniciarTutorial(false), 700);
  }

  // Cerrar el modal de cuenta al hacer clic fuera
  const mc = document.getElementById("modalCuenta");
  if (mc) mc.addEventListener("click", e => { if (e.target.id === "modalCuenta") cerrarCuenta(); });
});

/* ============================================================
   4) BUSCADOR GLOBAL + NAVEGACIÓN DEL MENÚ
   Indexa cursos, lecciones, comandos, temas de guía y secciones,
   y permite saltar directamente a cada uno.
   ============================================================ */
let _indiceBusqueda = null;
let _resultadosActuales = [];

function construirIndiceBusqueda() {
  if (_indiceBusqueda) return _indiceBusqueda;
  const idx = [];

  if (typeof MODULOS !== "undefined") MODULOS.forEach(m => idx.push({
    tipo: "Curso", titulo: m.nombre, desc: m.desc,
    clave: (m.nombre + " " + m.desc).toLowerCase(),
    accion: () => abrirModulo(m.id)
  }));

  if (typeof LECCIONES !== "undefined") Object.keys(LECCIONES).forEach(modId => {
    (LECCIONES[modId] || []).forEach((l, i) => idx.push({
      tipo: "Lección", titulo: l.titulo,
      desc: (l.concepto || "").replace(/\s+/g, " ").slice(0, 80),
      clave: (l.titulo + " " + (l.concepto || "")).toLowerCase(),
      accion: () => irALeccion(modId, i)
    }));
  });

  if (typeof COMANDOS !== "undefined") COMANDOS.forEach(c => idx.push({
    tipo: "Comando", titulo: c.nombre, desc: c.desc,
    clave: (c.nombre + " " + c.desc + " " + (c.caso || "") + " " + c.cat).toLowerCase(),
    accion: () => irAComando(c.id)
  }));

  if (typeof CONOCIMIENTOS !== "undefined") Object.keys(CONOCIMIENTOS).forEach(nivel => {
    CONOCIMIENTOS[nivel].forEach(t => idx.push({
      tipo: "Guía", titulo: t.titulo,
      desc: (t.contenido || "").replace(/<\/?code>/g, "").replace(/\s+/g, " ").slice(0, 80),
      clave: (t.titulo + " " + t.contenido).toLowerCase(),
      accion: () => { seleccionarNivel(nivel); cambiarVista("guia"); }
    }));
  });

  // Secciones y herramientas de la plataforma
  [
    { t: "Terminal de práctica", d: "Practica comandos en una terminal simulada", a: () => abrirTerminal() },
    { t: "Diccionario de comandos", d: "Referencia rápida de comandos de Linux", a: () => abrirComandos() },
    { t: "Publica tu web", d: "Pasos para servir tu propia web con Linux", a: () => abrirGuiaServidor() },
    { t: "Mis certificados", d: "Consulta y descarga tus certificados", a: () => abrirCertificados() },
    { t: "Mis logros", d: "Insignias que has desbloqueado", a: () => abrirLogros() }
  ].forEach(s => idx.push({
    tipo: "Sección", titulo: s.t, desc: s.d,
    clave: (s.t + " " + s.d).toLowerCase(), accion: s.a
  }));

  _indiceBusqueda = idx;
  return idx;
}

// Orden de tipos para agrupar los resultados
const ORDEN_TIPOS = ["Curso", "Lección", "Comando", "Guía", "Sección"];

function buscarGlobal(q) {
  const cont = document.getElementById("resultadosGlobal");
  if (!cont) return;
  q = (q || "").toLowerCase().trim();

  if (q.length < 2) { cont.classList.add("oculto"); cont.innerHTML = ""; return; }

  const res = construirIndiceBusqueda().filter(it => it.clave.includes(q)).slice(0, 14);
  _resultadosActuales = res;

  if (res.length === 0) {
    cont.innerHTML = `<div class="resultado-vacio">Sin resultados para “<b>${escapar(q)}</b>”. Prueba con “permisos”, “nmap”, “bash”...</div>`;
    cont.classList.remove("oculto");
    return;
  }

  // Agrupa por tipo manteniendo el índice original para el onclick
  let html = "";
  ORDEN_TIPOS.forEach(tipo => {
    const delTipo = res.map((it, i) => ({ it, i })).filter(x => x.it.tipo === tipo);
    if (delTipo.length === 0) return;
    delTipo.forEach(({ it, i }) => {
      html += `
        <button class="resultado-item" onclick="ejecutarResultado(${i})">
          <span class="resultado-tipo">${it.tipo}</span>
          <span class="resultado-info">
            <span class="resultado-titulo">${escapar(it.titulo)}</span>
            <span class="resultado-desc">${escapar(it.desc || "")}</span>
          </span>
        </button>`;
    });
  });
  cont.innerHTML = html;
  cont.classList.remove("oculto");
}

function ejecutarResultado(i) {
  const it = _resultadosActuales[i];
  if (!it) return;
  cerrarResultadosBusqueda();
  const inp = document.getElementById("busquedaGlobal");
  if (inp) inp.value = "";
  if (typeof it.accion === "function") it.accion();
}

function cerrarResultadosBusqueda() {
  const cont = document.getElementById("resultadosGlobal");
  if (cont) { cont.classList.add("oculto"); cont.innerHTML = ""; }
}

// Abre un módulo en una lección concreta
function irALeccion(modId, idx) {
  if (typeof abrirModulo !== "function") return;
  abrirModulo(modId);
  if (typeof renderizarLeccion === "function" && idx > 0) renderizarLeccion(idx);
}

// "Cursos" del menú: vuelve al inicio y baja a la sección de cursos
function irACursos() {
  if (typeof mostrarPantalla === "function") mostrarPantalla("pantallaBienvenida");
  setTimeout(() => {
    const el = document.querySelector('[data-tour="academia"]');
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

// Cierra los resultados al hacer clic fuera del buscador
document.addEventListener("click", e => {
  const caja = document.querySelector(".hero-busqueda");
  if (caja && !caja.contains(e.target)) cerrarResultadosBusqueda();
});

/* ============================================================
   MENÚ MÓVIL (hamburguesa)
   ============================================================ */
function alternarMenuMovil() {
  const m = document.getElementById("menuPrincipal");
  const b = document.getElementById("btnMenu");
  if (!m) return;
  const abierto = m.classList.toggle("abierto");
  if (b) b.setAttribute("aria-expanded", abierto ? "true" : "false");
}
function cerrarMenuMovil() {
  const m = document.getElementById("menuPrincipal");
  const b = document.getElementById("btnMenu");
  if (m) m.classList.remove("abierto");
  if (b) b.setAttribute("aria-expanded", "false");
}

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menuPrincipal");
  // Al pulsar una opción del menú, ciérralo
  if (menu) menu.addEventListener("click", e => {
    if (e.target.closest(".menu-link")) cerrarMenuMovil();
  });
  // Cerrar al tocar fuera del menú o del botón
  document.addEventListener("click", e => {
    const m = document.getElementById("menuPrincipal");
    const b = document.getElementById("btnMenu");
    if (!m || !m.classList.contains("abierto")) return;
    if (m.contains(e.target) || (b && (e.target === b || b.contains(e.target)))) return;
    cerrarMenuMovil();
  });
});
