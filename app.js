/* ============================================================
   CUADERNO LINUX MINT — Lógica principal (app.js)
   Depende de datos.js (NIVELES, CONOCIMIENTOS, QUIZZES, LOGROS).
   Persistencia completa con localStorage.
   ============================================================ */
"use strict";

/* ---- Claves de almacenamiento en localStorage ---- */
const CLAVE_NOTAS    = "notasLinuxMint_v2";   // notas por nivel (con etiquetas)
const CLAVE_CONFIG   = "configLinuxMint";     // preferencias (tema, nombre)
const CLAVE_LOGROS   = "logrosLinuxMint";     // insignias desbloqueadas
const CLAVE_QUIZ     = "quizLinuxMint";       // resultados de quizzes
const CLAVE_METRICAS = "metricasLinuxMint";   // métricas varias (terminal, racha)
const CLAVE_LECC     = "leccionesLinuxMint";  // lecciones completadas por módulo
const CLAVE_FLASH    = "flashcardsLinuxMint"; // índices de flashcards aprendidas
const CLAVE_FAVCMD   = "favComandosLinuxMint"; // ids de comandos favoritos

/* ---- Estado en memoria ---- */
let nivelActual = null;       // nivel seleccionado (notas)
let etiquetaFiltro = null;    // etiqueta activa para filtrar notas
let moduloActual = null;      // módulo de la academia abierto
let leccionActual = 0;        // índice de lección abierta
let _metricasCache = null;    // caché de calcularMetricas() (la invalida escribir())

/* Pantallas de nivel superior (para navegación centralizada) */
const PANTALLAS = ["pantallaBienvenida", "pantallaNotas", "pantallaAcademia", "pantallaModulo", "pantallaCertificados", "pantallaServidor", "pantallaComandos"];
function mostrarPantalla(id) {
  PANTALLAS.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.toggle("oculto", p !== id);
  });
  window.scrollTo(0, 0);
}

/* ============================================================
   PERSISTENCIA GENÉRICA
   ============================================================ */
function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : porDefecto;
  } catch (e) { console.error("Error leyendo", clave, e); return porDefecto; }
}
function escribir(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
  _metricasCache = null;   // cualquier escritura invalida la caché de métricas
}

/* Notas: estructura { principiante:[], intermedio:[], avanzado:[] } */
function cargarNotas() {
  const d = leer(CLAVE_NOTAS, null) || {};
  return {
    principiante: d.principiante || [],
    intermedio:  d.intermedio  || [],
    avanzado:    d.avanzado    || []
  };
}
function guardarNotas(datos) { escribir(CLAVE_NOTAS, datos); }

/* ============================================================
   UTILIDADES
   ============================================================ */
// Escapa HTML para mostrar texto del usuario de forma segura
function escapar(texto) {
  if (!texto) return "";
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// Igual que escapar, pero "revive" las etiquetas <code> de la guía/quiz
function conCodigo(texto) {
  return escapar(texto).replace(/&lt;code&gt;/g, "<code>").replace(/&lt;\/code&gt;/g, "</code>");
}
// Quita las etiquetas <code> dejando texto plano
function sinCodigo(texto) { return (texto || "").replace(/<\/?code>/g, ""); }

// Fecha ISO -> texto legible en español
function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-ES",
      { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (e) { return iso; }
}

// Notificación flotante temporal
let toastTimer = null;
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

/* ============================================================
   TEMA OSCURO / CLARO (con persistencia)
   ============================================================ */
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  // Cambiamos el icono del botón según el tema
  const btn = document.getElementById("btnTema");
  if (btn) btn.textContent = (tema === "oscuro") ? "🌙" : "☀️";
}
function alternarTema() {
  const config = leer(CLAVE_CONFIG, { tema: "oscuro" });
  config.tema = (config.tema === "oscuro") ? "claro" : "oscuro";
  escribir(CLAVE_CONFIG, config);
  aplicarTema(config.tema);
  mostrarToast(config.tema === "oscuro" ? "🌙 Modo oscuro" : "☀️ Modo claro");
}

/* ============================================================
   NAVEGACIÓN ENTRE PANTALLAS Y PESTAÑAS
   ============================================================ */
function seleccionarNivel(nivel) {
  nivelActual = nivel;
  etiquetaFiltro = null;
  mostrarPantalla("pantallaNotas");
  document.getElementById("etiquetaNivel").textContent = NIVELES[nivel];
  document.getElementById("indicadorNivel").innerHTML = "Nivel: <b>" + NIVELES[nivel] + "</b>";
  document.getElementById("inputBuscar").value = "";
  cancelarFormulario();
  cambiarVista("notas");
  renderizarNotas();
  renderizarGuia();
  prepararQuiz();
  actualizarProgreso();
}

function volverAlMenu() {
  nivelActual = null;
  mostrarPantalla("pantallaBienvenida");
  document.getElementById("indicadorNivel").textContent = "Selecciona un nivel";
  actualizarConteos();
  renderizarModulos();
  actualizarPanelXP();
}

// Alterna entre las pestañas Notas / Guía / Quiz
function cambiarVista(vista) {
  const mapa = { notas: "vistaNotas", guia: "vistaGuia", quiz: "vistaQuiz" };
  Object.keys(mapa).forEach(k => {
    document.getElementById(mapa[k]).classList.toggle("oculto", k !== vista);
    document.getElementById("pestana" + k.charAt(0).toUpperCase() + k.slice(1))
      .classList.toggle("activa", k === vista);
  });
}

/* ============================================================
   CRUD DE NOTAS (con etiquetas)
   ============================================================ */
function mostrarFormularioNueva() {
  document.getElementById("tituloFormulario").textContent = "Nueva nota";
  document.getElementById("notaId").value = "";
  document.getElementById("inputTitulo").value = "";
  document.getElementById("inputContenido").value = "";
  document.getElementById("inputEtiquetas").value = "";
  document.getElementById("formularioNota").classList.remove("oculto");
  document.getElementById("inputTitulo").focus();
}
function cancelarFormulario() {
  document.getElementById("formularioNota").classList.add("oculto");
}

// Convierte el texto del campo etiquetas en un array limpio
function parsearEtiquetas(texto) {
  return texto.split(",")
    .map(t => t.trim().replace(/^#/, "").toLowerCase())  // quita # y espacios
    .filter(t => t.length > 0)
    .filter((t, i, arr) => arr.indexOf(t) === i);          // sin duplicados
}

function guardarNota() {
  const titulo = document.getElementById("inputTitulo").value.trim();
  const contenido = document.getElementById("inputContenido").value.trim();
  const etiquetas = parsearEtiquetas(document.getElementById("inputEtiquetas").value);
  const id = document.getElementById("notaId").value;

  if (!titulo) {
    mostrarToast("⚠️ Ponle un título al tema");
    document.getElementById("inputTitulo").focus();
    return;
  }

  const datos = cargarNotas();
  const lista = datos[nivelActual];

  if (id) {
    // Edición
    const nota = lista.find(n => String(n.id) === String(id));
    if (nota) { nota.titulo = titulo; nota.contenido = contenido; nota.etiquetas = etiquetas; nota.editada = new Date().toISOString(); }
    mostrarToast("✅ Nota actualizada");
  } else {
    // Creación (fecha automática)
    lista.push({ id: Date.now(), titulo, contenido, etiquetas, fecha: new Date().toISOString(), editada: null });
    mostrarToast("✅ Nota guardada");
  }

  guardarNotas(datos);
  cancelarFormulario();
  renderizarNotas();
  actualizarProgreso();
  evaluarLogros();
}

function editarNota(id) {
  const nota = cargarNotas()[nivelActual].find(n => String(n.id) === String(id));
  if (!nota) return;
  document.getElementById("tituloFormulario").textContent = "Editar nota";
  document.getElementById("notaId").value = nota.id;
  document.getElementById("inputTitulo").value = nota.titulo;
  document.getElementById("inputContenido").value = nota.contenido;
  document.getElementById("inputEtiquetas").value = (nota.etiquetas || []).join(", ");
  document.getElementById("formularioNota").classList.remove("oculto");
  document.getElementById("formularioNota").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("inputTitulo").focus();
}

function eliminarNota(id) {
  if (!confirm("¿Seguro que quieres eliminar esta nota? No se puede deshacer.")) return;
  const datos = cargarNotas();
  datos[nivelActual] = datos[nivelActual].filter(n => String(n.id) !== String(id));
  guardarNotas(datos);
  renderizarNotas();
  actualizarProgreso();
  mostrarToast("🗑️ Nota eliminada");
}

/* ============================================================
   BÚSQUEDA Y FILTRADO POR ETIQUETAS
   ============================================================ */
function limpiarBusqueda() {
  document.getElementById("inputBuscar").value = "";
  etiquetaFiltro = null;
  renderizarNotas();
}
// Activa/desactiva el filtro por una etiqueta concreta
function filtrarPorEtiqueta(tag) {
  etiquetaFiltro = (etiquetaFiltro === tag) ? null : tag;
  renderizarNotas();
}

// Renderiza la barra de etiquetas disponibles en el nivel
function renderizarBarraEtiquetas() {
  const lista = cargarNotas()[nivelActual] || [];
  const todas = new Set();
  lista.forEach(n => (n.etiquetas || []).forEach(t => todas.add(t)));
  const barra = document.getElementById("barraEtiquetas");

  if (todas.size === 0) { barra.innerHTML = ""; return; }

  let html = `<span class="chip-etiqueta ${!etiquetaFiltro ? "activa" : ""}" onclick="filtrarPorEtiqueta(null)">Todas</span>`;
  html += [...todas].sort().map(t =>
    `<span class="chip-etiqueta ${etiquetaFiltro === t ? "activa" : ""}" onclick="filtrarPorEtiqueta('${t}')">#${escapar(t)}</span>`
  ).join("");
  barra.innerHTML = html;
}

/* ============================================================
   RENDER DE LA LISTA DE NOTAS (aplica búsqueda + etiqueta)
   ============================================================ */
function renderizarNotas() {
  const lista = cargarNotas()[nivelActual] || [];
  const contenedor = document.getElementById("listaNotas");
  const busqueda = (document.getElementById("inputBuscar").value || "").toLowerCase().trim();

  // Filtrado en tiempo real
  let filtradas = lista.filter(n => {
    const coincideTexto = !busqueda ||
      n.titulo.toLowerCase().includes(busqueda) ||
      (n.contenido || "").toLowerCase().includes(busqueda);
    const coincideTag = !etiquetaFiltro || (n.etiquetas || []).includes(etiquetaFiltro);
    return coincideTexto && coincideTag;
  });

  // Orden: más reciente primero
  filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  renderizarBarraEtiquetas();

  if (filtradas.length === 0) {
    const mensaje = (busqueda || etiquetaFiltro)
      ? "No hay notas que coincidan con el filtro."
      : "Todavía no tienes notas en este nivel.<br>Pulsa <b>“＋ Nueva nota”</b> para empezar.";
    contenedor.innerHTML = `<div class="vacio"><span class="icono">📝</span>${mensaje}</div>`;
    return;
  }

  contenedor.innerHTML = filtradas.map(nota => {
    const tags = (nota.etiquetas || []).map(t =>
      `<span class="tag" onclick="filtrarPorEtiqueta('${t}')">#${escapar(t)}</span>`).join("");
    return `
      <article class="nota">
        <div class="nota-cabecera">
          <div class="nota-titulo">${escapar(nota.titulo)}</div>
          <span class="nota-fecha">📅 ${formatearFecha(nota.fecha)}</span>
        </div>
        ${tags ? `<div class="nota-etiquetas">${tags}</div>` : ""}
        <div class="nota-contenido">${escapar(nota.contenido) || "<i style='color:var(--texto-suave)'>(Sin contenido)</i>"}</div>
        <div class="nota-botones">
          <button class="btn-secundario" onclick="editarNota('${nota.id}')">✏️ Editar</button>
          <button class="btn-peligro" onclick="eliminarNota('${nota.id}')">🗑️ Eliminar</button>
        </div>
      </article>`;
  }).join("");
}

/* ============================================================
   PROGRESO POR NIVEL
   "Cubierto" = un tema de la guía cuyo título coincide con
   alguna nota creada por el usuario en ese nivel.
   ============================================================ */
function calcularProgreso(nivel) {
  const temas = CONOCIMIENTOS[nivel] || [];
  const notas = cargarNotas()[nivel] || [];
  const titulosNotas = notas.map(n => n.titulo.trim().toLowerCase());
  const cubiertos = temas.filter(t => titulosNotas.includes(t.titulo.trim().toLowerCase())).length;
  return { cubiertos, total: temas.length };
}

// Actualiza la barra de progreso de la pantalla de notas
function actualizarProgreso() {
  if (!nivelActual) return;
  const { cubiertos, total } = calcularProgreso(nivelActual);
  const pct = total ? Math.round((cubiertos / total) * 100) : 0;
  document.getElementById("progresoTexto").innerHTML =
    `Has cubierto <b>${cubiertos}</b> de <b>${total}</b> temas de la guía (${pct}%)`;
  document.getElementById("progresoRelleno").style.width = pct + "%";
}

// Actualiza las tarjetas de la bienvenida (mini barras + conteos)
function actualizarConteos() {
  Object.keys(NIVELES).forEach(nivel => {
    const { cubiertos, total } = calcularProgreso(nivel);
    const pct = total ? Math.round((cubiertos / total) * 100) : 0;
    const elConteo = document.getElementById("conteo-" + nivel);
    const elBarra = document.getElementById("miniprog-" + nivel);
    if (elConteo) elConteo.textContent = `${cubiertos}/${total} temas (${pct}%)`;
    if (elBarra) elBarra.style.width = pct + "%";
  });
}

/* ============================================================
   GUÍA DE APRENDIZAJE
   ============================================================ */
function renderizarGuia() {
  const temas = CONOCIMIENTOS[nivelActual] || [];
  document.getElementById("listaGuia").innerHTML = temas.map((tema, i) => `
    <div class="guia-tema" id="guia-${i}">
      <div class="guia-tema-cabecera" onclick="alternarTemaGuia(${i})">
        <span class="flecha">▶</span>
        <span class="guia-tema-titulo">${escapar(tema.titulo)}</span>
      </div>
      <div class="guia-tema-cuerpo">
        <div class="guia-tema-contenido">${conCodigo(tema.contenido)}</div>
        <button class="btn-secundario" onclick="agregarGuiaANotas(${i})">＋ A mis notas</button>
      </div>
    </div>`).join("");
}
function alternarTemaGuia(i) {
  document.getElementById("guia-" + i).classList.toggle("abierto");
}
function agregarGuiaANotas(i) {
  const tema = CONOCIMIENTOS[nivelActual][i];
  if (!tema) return;
  const datos = cargarNotas();
  if (datos[nivelActual].some(n => n.titulo === tema.titulo)) {
    mostrarToast("ℹ️ Ese tema ya está en tus notas");
    return;
  }
  // Etiqueta automática con el nombre del nivel para facilitar el filtrado
  datos[nivelActual].push({
    id: Date.now(), titulo: tema.titulo, contenido: sinCodigo(tema.contenido),
    etiquetas: [nivelActual], fecha: new Date().toISOString(), editada: null
  });
  guardarNotas(datos);
  renderizarNotas();
  actualizarProgreso();
  evaluarLogros();
  mostrarToast("✅ Tema añadido a tus notas");
}

/* ============================================================
   QUIZ / AUTOEVALUACIÓN
   ============================================================ */
let respuestasUsuario = [];   // índice elegido por el usuario en cada pregunta

// Prepara la pestaña de quiz (muestra inicio + historial)
function prepararQuiz() {
  document.getElementById("quizInicio").classList.remove("oculto");
  document.getElementById("quizContenedor").classList.add("oculto");
  document.getElementById("quizResultado").classList.add("oculto");
  // Oculta la sala de preparación si quedó visible (definida en experiencia.js)
  const prep = document.getElementById("quizPreparacion");
  if (prep) { prep.classList.add("oculto"); prep.innerHTML = ""; }
  renderizarHistorialQuiz();
}

// Muestra el historial de intentos previos del nivel
function renderizarHistorialQuiz() {
  const resultados = leer(CLAVE_QUIZ, []).filter(r => r.nivel === nivelActual);
  const cont = document.getElementById("historialQuiz");
  if (resultados.length === 0) { cont.innerHTML = ""; return; }
  let html = "<h4>📊 Intentos anteriores</h4>";
  html += resultados.slice(-5).reverse().map(r =>
    `<div class="quiz-registro">${formatearFecha(r.fecha)} — <b>${r.aciertos}/${r.total}</b> aciertos</div>`).join("");
  cont.innerHTML = html;
}

// Inicia el quiz del nivel actual
function iniciarQuiz() {
  const preguntas = QUIZZES[nivelActual] || [];
  if (preguntas.length === 0) { mostrarToast("No hay quiz para este nivel"); return; }
  respuestasUsuario = new Array(preguntas.length).fill(null);

  document.getElementById("quizInicio").classList.add("oculto");
  document.getElementById("quizResultado").classList.add("oculto");
  const cont = document.getElementById("quizContenedor");
  cont.classList.remove("oculto");

  let html = preguntas.map((p, i) => `
    <div class="quiz-pregunta" id="pregunta-${i}">
      <span class="num">Pregunta ${i + 1} de ${preguntas.length}</span>
      <div class="enunciado">${conCodigo(p.pregunta)}</div>
      ${p.opciones.map((op, j) =>
        `<button class="quiz-opcion" id="op-${i}-${j}" onclick="elegirOpcion(${i},${j})">${conCodigo(op)}</button>`
      ).join("")}
    </div>`).join("");
  html += `<button class="btn-primario" onclick="corregirQuiz()">✅ Corregir test</button>`;
  // Barra del temporizador (la activa el modo cronometrado de experiencia.js)
  html = `<div id="quizTimer" class="quiz-timer oculto"></div>` + html;
  cont.innerHTML = html;
  if (typeof iniciarCronometroQuiz === "function") iniciarCronometroQuiz();
}

// Registra la opción elegida por el usuario
function elegirOpcion(preg, opc) {
  respuestasUsuario[preg] = opc;
  // Resalta visualmente la opción seleccionada
  const preguntas = QUIZZES[nivelActual];
  preguntas[preg].opciones.forEach((_, j) =>
    document.getElementById(`op-${preg}-${j}`).classList.toggle("seleccionada", j === opc));
}

// Corrige el test, muestra resultado y guarda.
// forzar=true (timeout): corrige aunque falten respuestas (cuentan como fallo).
function corregirQuiz(forzar) {
  const preguntas = QUIZZES[nivelActual];
  if (!forzar && respuestasUsuario.includes(null)) {
    mostrarToast("⚠️ Responde todas las preguntas");
    return;
  }
  if (typeof detenerCronometroQuiz === "function") detenerCronometroQuiz();

  let aciertos = 0;
  const temasFallados = [];

  preguntas.forEach((p, i) => {
    const elegido = respuestasUsuario[i];
    const correcto = p.correcta;
    // Pinta correctas e incorrectas
    document.getElementById(`op-${i}-${correcto}`).classList.add("correcta");
    if (elegido === correcto) aciertos++;
    else {
      if (elegido !== null) document.getElementById(`op-${i}-${elegido}`).classList.add("incorrecta");
      temasFallados.push(p.tema);
    }
  });

  // Guardar resultado en localStorage
  const resultados = leer(CLAVE_QUIZ, []);
  resultados.push({ nivel: nivelActual, fecha: new Date().toISOString(), aciertos, total: preguntas.length });
  escribir(CLAVE_QUIZ, resultados);

  mostrarResultadoQuiz(aciertos, preguntas.length, temasFallados);
  evaluarLogros();
}

// Muestra la caja de resultados con sugerencias de repaso
function mostrarResultadoQuiz(aciertos, total, temasFallados) {
  const cont = document.getElementById("quizResultado");
  cont.classList.remove("oculto");
  const pct = Math.round((aciertos / total) * 100);
  // Temas únicos a repasar
  const repasar = [...new Set(temasFallados)];

  let repasoHtml = "";
  if (repasar.length === 0) {
    repasoHtml = `<p style="color:var(--verde-mint);margin-top:14px;">🌟 ¡Perfecto! No necesitas repasar nada.</p>`;
  } else {
    repasoHtml = `<div class="quiz-repaso"><h4>📚 Te conviene repasar:</h4><ul>${
      repasar.map(t => `<li>${escapar(t)}</li>`).join("")}</ul></div>`;
  }

  cont.innerHTML = `
    <div class="quiz-resultado-caja">
      <div class="puntaje">${aciertos}/${total}</div>
      <p>Has acertado el <b>${pct}%</b></p>
      ${repasoHtml}
      <div style="margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="btn-primario" onclick="iniciarQuiz()">🔄 Reintentar</button>
        <button class="btn-secundario" onclick="prepararQuiz()">Volver</button>
      </div>
    </div>`;
  document.getElementById("quizContenedor").classList.add("oculto");
}

/* ============================================================
   LOGROS / GAMIFICACIÓN
   ============================================================ */
// Reúne todas las métricas necesarias para evaluar los logros
// Se cachea hasta la siguiente escritura (escribir() limpia la caché),
// evitando releer y parsear localStorage en llamadas seguidas.
function calcularMetricas() {
  if (_metricasCache) return _metricasCache;
  const notas = cargarNotas();
  const todas = [].concat(notas.principiante, notas.intermedio, notas.avanzado);
  const quizzes = leer(CLAVE_QUIZ, []);
  const metricas = leer(CLAVE_METRICAS, { comandosTerminal: 0, racha: 0, ultimoDia: null });
  const lecc = leer(CLAVE_LECC, {});
  const flash = leer(CLAVE_FLASH, []);

  // Lecciones completadas por módulo
  let leccionesCompletadas = 0;
  let modulosCompletados = 0;
  MODULOS.forEach(m => {
    const total = (LECCIONES[m.id] || []).length;
    const hechas = lecc[m.id] ? Object.keys(lecc[m.id]).filter(k => lecc[m.id][k]).length : 0;
    leccionesCompletadas += hechas;
    if (total > 0 && hechas >= total) modulosCompletados++;
  });

  const completada = (modId, leccId) => !!(lecc[modId] && lecc[modId][leccId]);
  const algunaDe = modId => lecc[modId] && Object.values(lecc[modId]).some(Boolean);

  // Módulo de hacking completo (para certificado y logro)
  const hackingTotal = (LECCIONES["hacking"] || []).length;
  const hackingHechas = lecc["hacking"] ? Object.keys(lecc["hacking"]).filter(k => lecc["hacking"][k]).length : 0;
  const hackingCompleto = hackingTotal > 0 && hackingHechas >= hackingTotal;

  // Comandos favoritos del diccionario
  const comandosFavoritos = (leer(CLAVE_FAVCMD, []) || []).length;

  // Features de enganche (retos.js)
  const retosDiarios = (leer("retoDiarioLinuxMint", {}).total) || 0;
  const misionesTerminal = ((leer("misionesTerminalLinuxMint", {}).completadas) || []).length;
  const proyectosCompletados = Object.values(leer("proyectosLinuxMint", {})).filter(Boolean).length;

  // XP derivada (fórmula estable para no duplicar al recargar)
  const logros = leer(CLAVE_LOGROS, {});
  const numLogros = Object.values(logros).filter(Boolean).length;
  const xp = leccionesCompletadas * 50 + quizzes.length * 20 + numLogros * 25 + flash.length * 3
           + retosDiarios * 15 + misionesTerminal * 20 + proyectosCompletados * 60;
  const nivelGlobal = Math.floor(xp / 250) + 1;

  _metricasCache = {
    totalNotas: todas.length,
    totalEtiquetas: todas.filter(n => (n.etiquetas || []).length > 0).length,
    nivelesConNotas: Object.keys(NIVELES).filter(nv => (notas[nv] || []).length > 0).length,
    comandosTerminal: metricas.comandosTerminal || 0,
    quizzesHechos: quizzes.length,
    quizPerfecto: quizzes.some(q => q.aciertos === q.total && q.total > 0),
    algunNivelCompleto: Object.keys(NIVELES).some(nv => {
      const p = calcularProgreso(nv);
      return p.total > 0 && p.cubiertos === p.total;
    }),
    // Nuevas métricas
    leccionesCompletadas,
    modulosCompletados,
    leccionBash: algunaDe("bash"),
    leccionPython: algunaDe("python"),
    eticaCompletada: completada("hacking", "hk-1"),
    leccionHerramientas: completada("hacking", "hk-5"),
    metodologiaCompletada: completada("hacking", "hk-2"),
    hackingCompleto,
    comandosFavoritos,
    flashcardsVistas: flash.length,
    racha: metricas.racha || 0,
    retosDiarios,
    misionesTerminal,
    proyectosCompletados,
    xp, nivelGlobal
  };
  return _metricasCache;
}

// Comprueba qué logros se han desbloqueado y avisa de los nuevos
function evaluarLogros() {
  const metricas = calcularMetricas();
  const desbloqueados = leer(CLAVE_LOGROS, {});
  let nuevos = [];

  LOGROS.forEach(logro => {
    if (logro.condicion(metricas) && !desbloqueados[logro.id]) {
      desbloqueados[logro.id] = true;
      nuevos.push(logro);
    }
  });

  if (nuevos.length > 0) {
    escribir(CLAVE_LOGROS, desbloqueados);
    // Avisamos del primero (si hay varios, igual se ven todos en el panel)
    mostrarToast("🏆 ¡Logro desbloqueado: " + nuevos[0].titulo + "!");
  }
}

// Abre el panel de logros
function abrirLogros() {
  renderizarLogros();
  document.getElementById("modalLogros").classList.remove("oculto");
}
function cerrarLogros() { document.getElementById("modalLogros").classList.add("oculto"); }

// Dibuja todas las insignias (desbloqueadas y bloqueadas)
function renderizarLogros() {
  const desbloqueados = leer(CLAVE_LOGROS, {});
  const total = LOGROS.length;
  const conseguidos = LOGROS.filter(l => desbloqueados[l.id]).length;

  let html = `<p style="margin-bottom:16px;color:var(--texto-suave);">
                Has conseguido <b style="color:var(--verde-mint)">${conseguidos}</b> de <b>${total}</b> insignias.</p>`;
  html += `<div class="panel-logros-grid panel-logros">` + LOGROS.map(l => {
    const ok = desbloqueados[l.id];
    return `<div class="logro ${ok ? "desbloqueado" : ""}">
              <span class="icono">${ok ? l.icono : "🔒"}</span>
              <div class="titulo">${escapar(l.titulo)}</div>
              <div class="desc">${escapar(l.desc)}</div>
            </div>`;
  }).join("") + `</div>`;

  document.getElementById("panelLogros").innerHTML = html;
}

/* ============================================================
   TERMINAL SIMULADA
   Sistema de archivos en memoria. Soporta: ls, cd, pwd, mkdir,
   cat, echo, touch, rm, clear, help.
   ============================================================ */

// Árbol de archivos simulado. Carpetas: {tipo:'dir', hijos:{}}. Archivos: {tipo:'file', contenido:''}
let fsRaiz, fsCwd;
function reiniciarFS() {
  fsRaiz = { tipo: "dir", hijos: {
    home: { tipo: "dir", hijos: {
      usuario: { tipo: "dir", hijos: {
        Documentos: { tipo: "dir", hijos: {} },
        Descargas:  { tipo: "dir", hijos: {} },
        "bienvenida.txt": { tipo: "file", contenido: "¡Bienvenido a la terminal de práctica de Linux Mint!\nPrueba: ls, cd Documentos, pwd, mkdir proyectos, echo hola > nota.txt, cat nota.txt" }
      }}
    }}
  }};
  fsCwd = ["home", "usuario"];   // empezamos en la carpeta personal
}

// Devuelve el nodo (dir/file) en una ruta dada (array de segmentos), o null
function obtenerNodo(segmentos) {
  let nodo = fsRaiz;
  for (const seg of segmentos) {
    if (nodo.tipo !== "dir" || !nodo.hijos[seg]) return null;
    nodo = nodo.hijos[seg];
  }
  return nodo;
}

// Resuelve una ruta (relativa o absoluta) a un array de segmentos normalizado
function resolverRuta(ruta) {
  let base;
  if (ruta.startsWith("/")) base = [];
  else if (ruta.startsWith("~")) { base = ["home", "usuario"]; ruta = ruta.slice(1); }
  else base = [...fsCwd];

  ruta.split("/").forEach(seg => {
    if (seg === "" || seg === ".") return;
    if (seg === "..") base.pop();
    else base.push(seg);
  });
  return base;
}

// Actualiza el prompt mostrando la ruta actual (~ para la carpeta personal)
function actualizarPrompt() {
  let ruta = "/" + fsCwd.join("/");
  if (ruta.startsWith("/home/usuario")) ruta = "~" + ruta.slice("/home/usuario".length);
  document.getElementById("terminalPrompt").textContent = `usuario@mint:${ruta}$`;
}

// Imprime una línea en la salida de la terminal
function imprimirTerminal(texto, clase) {
  const salida = document.getElementById("terminalSalida");
  const linea = document.createElement("div");
  if (clase) linea.className = clase;
  linea.textContent = texto;
  salida.appendChild(linea);
  salida.scrollTop = salida.scrollHeight;
}

// Procesa un comando escrito por el usuario
function ejecutarComando(entrada) {
  const promptActual = document.getElementById("terminalPrompt").textContent;
  imprimirTerminal(promptActual + " " + entrada, "cmd-eco");   // eco del comando

  const trozos = entrada.trim().split(/\s+/);
  const cmd = trozos[0];
  const args = trozos.slice(1);
  if (!cmd) return;

  // Contabilizamos comandos para el logro "Maestro de la terminal"
  const metricas = leer(CLAVE_METRICAS, { comandosTerminal: 0 });
  metricas.comandosTerminal = (metricas.comandosTerminal || 0) + 1;
  escribir(CLAVE_METRICAS, metricas);

  switch (cmd) {
    case "help":
      imprimirTerminal("Comandos: ls, cd <dir>, pwd, mkdir <dir>, touch <archivo>, cat <archivo>, echo <texto> [> archivo], rm <nombre>, clear, help");
      break;

    case "pwd":
      imprimirTerminal("/" + fsCwd.join("/"));
      break;

    case "ls": {
      const ruta = args[0] ? resolverRuta(args[0]) : [...fsCwd];
      const nodo = obtenerNodo(ruta);
      if (!nodo) imprimirTerminal("ls: no existe la ruta '" + args[0] + "'", "cmd-error");
      else if (nodo.tipo === "file") imprimirTerminal(args[0]);
      else {
        const nombres = Object.keys(nodo.hijos);
        imprimirTerminal(nombres.length ? nombres.map(n => nodo.hijos[n].tipo === "dir" ? n + "/" : n).join("   ") : "(carpeta vacía)");
      }
      break;
    }

    case "cd": {
      if (!args[0]) { fsCwd = ["home", "usuario"]; actualizarPrompt(); break; }
      const destino = resolverRuta(args[0]);
      const nodo = obtenerNodo(destino);
      if (!nodo) imprimirTerminal("cd: no existe '" + args[0] + "'", "cmd-error");
      else if (nodo.tipo !== "dir") imprimirTerminal("cd: '" + args[0] + "' no es una carpeta", "cmd-error");
      else { fsCwd = destino; actualizarPrompt(); }
      break;
    }

    case "mkdir": {
      if (!args[0]) { imprimirTerminal("mkdir: falta el nombre", "cmd-error"); break; }
      const padre = obtenerNodo(fsCwd);
      if (padre.hijos[args[0]]) imprimirTerminal("mkdir: '" + args[0] + "' ya existe", "cmd-error");
      else padre.hijos[args[0]] = { tipo: "dir", hijos: {} };
      break;
    }

    case "touch": {
      if (!args[0]) { imprimirTerminal("touch: falta el nombre", "cmd-error"); break; }
      const padre = obtenerNodo(fsCwd);
      if (!padre.hijos[args[0]]) padre.hijos[args[0]] = { tipo: "file", contenido: "" };
      break;
    }

    case "cat": {
      if (!args[0]) { imprimirTerminal("cat: falta el archivo", "cmd-error"); break; }
      const nodo = obtenerNodo(resolverRuta(args[0]));
      if (!nodo) imprimirTerminal("cat: '" + args[0] + "' no existe", "cmd-error");
      else if (nodo.tipo === "dir") imprimirTerminal("cat: '" + args[0] + "' es una carpeta", "cmd-error");
      else imprimirTerminal(nodo.contenido || "(archivo vacío)");
      break;
    }

    case "echo": {
      // Soporta redirección: echo texto > archivo  /  echo texto >> archivo
      const idx = args.indexOf(">"); const idxApp = args.indexOf(">>");
      if (idx !== -1 || idxApp !== -1) {
        const usaAppend = idxApp !== -1;
        const corte = usaAppend ? idxApp : idx;
        const texto = args.slice(0, corte).join(" ");
        const nombre = args[corte + 1];
        if (!nombre) { imprimirTerminal("echo: falta el archivo destino", "cmd-error"); break; }
        const padre = obtenerNodo(fsCwd);
        if (!padre.hijos[nombre]) padre.hijos[nombre] = { tipo: "file", contenido: "" };
        if (padre.hijos[nombre].tipo !== "file") { imprimirTerminal("echo: destino no válido", "cmd-error"); break; }
        padre.hijos[nombre].contenido = usaAppend
          ? (padre.hijos[nombre].contenido + (padre.hijos[nombre].contenido ? "\n" : "") + texto)
          : texto;
      } else {
        imprimirTerminal(args.join(" "));
      }
      break;
    }

    case "rm": {
      if (!args[0]) { imprimirTerminal("rm: falta el nombre", "cmd-error"); break; }
      const padre = obtenerNodo(fsCwd);
      if (!padre.hijos[args[0]]) imprimirTerminal("rm: '" + args[0] + "' no existe", "cmd-error");
      else delete padre.hijos[args[0]];
      break;
    }

    case "clear":
      document.getElementById("terminalSalida").innerHTML = "";
      break;

    default:
      imprimirTerminal(cmd + ": comando no encontrado. Escribe 'help'.", "cmd-error");
  }

  evaluarLogros();   // por si se desbloquea "Maestro de la terminal"
  if (typeof verificarMisionTerminal === "function") verificarMisionTerminal();
}

function abrirTerminal() {
  if (!fsRaiz) reiniciarFS();
  document.getElementById("modalTerminal").classList.remove("oculto");
  document.getElementById("terminalSalida").innerHTML = "";
  imprimirTerminal("Terminal de práctica — escribe 'help' para empezar.");
  actualizarPrompt();
  if (typeof renderMisionesTerminal === "function") renderMisionesTerminal();
  setTimeout(enfocarTerminal, 50);
}
function cerrarTerminal() { document.getElementById("modalTerminal").classList.add("oculto"); }
function enfocarTerminal() { document.getElementById("terminalInput").focus(); }

/* ============================================================
   RESUMEN INTELIGENTE (agrupado por nivel o etiqueta)
   ============================================================ */
function abrirResumen() {
  document.getElementById("modalResumen").classList.remove("oculto");
  renderizarResumen();
}
function cerrarResumen() { document.getElementById("modalResumen").classList.add("oculto"); }

// Devuelve las notas a incluir según el filtro de nivel, con su nivel anotado
function notasFiltradas() {
  const datos = cargarNotas();
  const filtro = document.getElementById("filtroNivel").value;
  const niveles = (filtro === "todos") ? Object.keys(NIVELES) : [filtro];
  let arr = [];
  niveles.forEach(nv => (datos[nv] || []).forEach(n => arr.push({ ...n, _nivel: nv })));
  return arr;
}

// Ordena un array de notas según el criterio elegido
function ordenarNotas(arr) {
  const orden = document.getElementById("ordenResumen").value;
  return arr.sort((a, b) => {
    if (orden === "titulo") return a.titulo.localeCompare(b.titulo, "es");
    if (orden === "fecha-asc") return new Date(a.fecha) - new Date(b.fecha);
    return new Date(b.fecha) - new Date(a.fecha);
  });
}

// Construye y muestra el resumen en pantalla
function renderizarResumen() {
  const agrupar = document.getElementById("agruparPor").value;   // nivel | etiqueta
  const notas = notasFiltradas();
  const area = document.getElementById("areaImprimible");

  // --- Bloque de cobertura de temas (qué tengo cubierto) ---
  let cobertura = `<div class="resumen-cobertura"><h3>✅ Temas cubiertos</h3>`;
  Object.keys(NIVELES).forEach(nv => {
    const p = calcularProgreso(nv);
    cobertura += `<div class="cobertura-nivel">${NIVELES[nv]}: 
      <span class="ok">${p.cubiertos} cubiertos</span> / 
      <span class="pend">${p.total} temas de la guía</span></div>`;
  });
  cobertura += `</div>`;

  if (notas.length === 0) {
    area.innerHTML = `<div class="vacio"><span class="icono">📭</span>Aún no hay notas para resumir.</div>`;
    return;
  }

  // --- Agrupación ---
  const grupos = {};   // clave -> [notas]
  if (agrupar === "nivel") {
    notas.forEach(n => { (grupos[NIVELES[n._nivel]] = grupos[NIVELES[n._nivel]] || []).push(n); });
  } else {
    // Agrupar por etiqueta (una nota puede aparecer en varias; sin etiqueta -> "Sin etiqueta")
    notas.forEach(n => {
      const tags = (n.etiquetas || []).length ? n.etiquetas : ["sin etiqueta"];
      tags.forEach(t => { (grupos["#" + t] = grupos["#" + t] || []).push(n); });
    });
  }

  let html = `<h2 style="color:var(--verde-mint);margin-bottom:4px;">🐧 Resumen de aprendizaje — Linux Mint</h2>`;
  html += `<p style="color:var(--texto-suave);font-size:0.85rem;margin-bottom:16px;">Generado el ${formatearFecha(new Date().toISOString())}</p>`;
  html += cobertura;

  // Recorremos los grupos ordenados alfabéticamente
  Object.keys(grupos).sort().forEach(clave => {
    const items = ordenarNotas(grupos[clave]);
    html += `<div class="resumen-grupo"><h3>${escapar(clave)} <span style="font-size:0.8rem;color:var(--texto-suave)">(${items.length})</span></h3>`;
    items.forEach((n, i) => {
      const tags = (n.etiquetas || []).map(t => "#" + t).join(" ");
      html += `<div class="resumen-item">
        <h4>${i + 1}. ${escapar(n.titulo)}</h4>
        <div class="meta">📅 ${formatearFecha(n.fecha)}${tags ? " · " + escapar(tags) : ""}</div>
        <p>${escapar(n.contenido) || "(Sin contenido)"}</p>
      </div>`;
    });
    html += `</div>`;
  });

  html += `<p style="margin-top:20px;color:var(--texto-suave);font-size:0.85rem;border-top:1px solid var(--borde);padding-top:10px;">Total: <b>${notas.length}</b> notas.</p>`;
  area.innerHTML = html;
}

/* ============================================================
   EXPORTACIÓN DEL RESUMEN (texto, markdown, copiar, PDF)
   ============================================================ */
// Versión en texto plano
function generarTextoResumen() {
  const notas = ordenarNotas(notasFiltradas());
  let t = "===== RESUMEN DE APRENDIZAJE — LINUX MINT =====\n";
  t += "Generado el " + formatearFecha(new Date().toISOString()) + "\n";
  Object.keys(NIVELES).forEach(nv => { const p = calcularProgreso(nv); t += `- ${NIVELES[nv]}: ${p.cubiertos}/${p.total} temas cubiertos\n`; });
  t += "\n";
  notas.forEach((n, i) => {
    t += (i + 1) + ". " + n.titulo + " [" + NIVELES[n._nivel] + "]\n";
    if ((n.etiquetas || []).length) t += "   Etiquetas: " + n.etiquetas.map(x => "#" + x).join(" ") + "\n";
    t += "   Fecha: " + formatearFecha(n.fecha) + "\n";
    t += "   " + (n.contenido || "(Sin contenido)").replace(/\n/g, "\n   ") + "\n\n";
  });
  t += "Total: " + notas.length + " notas.\n";
  return t;
}

// Versión en Markdown
function generarMarkdown() {
  const notas = ordenarNotas(notasFiltradas());
  let md = "# 🐧 Resumen de aprendizaje — Linux Mint\n\n";
  md += "_Generado el " + formatearFecha(new Date().toISOString()) + "_\n\n";
  md += "## Temas cubiertos\n\n";
  Object.keys(NIVELES).forEach(nv => { const p = calcularProgreso(nv); md += `- **${NIVELES[nv]}**: ${p.cubiertos}/${p.total} temas\n`; });
  md += "\n## Notas\n\n";
  notas.forEach(n => {
    md += "### " + n.titulo + "\n\n";
    md += "- **Nivel:** " + NIVELES[n._nivel] + "\n";
    md += "- **Fecha:** " + formatearFecha(n.fecha) + "\n";
    if ((n.etiquetas || []).length) md += "- **Etiquetas:** " + n.etiquetas.map(x => "`#" + x + "`").join(" ") + "\n";
    md += "\n" + (n.contenido || "_(Sin contenido)_") + "\n\n";
  });
  return md;
}

// Descarga genérica de un archivo de texto
function descargarArchivo(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: tipo + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function descargarTexto()    { descargarArchivo("resumen-linux-mint.txt", generarTextoResumen(), "text/plain"); mostrarToast("⬇️ Descargando .txt"); }
function descargarMarkdown() { descargarArchivo("resumen-linux-mint.md", generarMarkdown(), "text/markdown"); mostrarToast("⬇️ Descargando .md"); }

function copiarResumen() {
  const texto = generarTextoResumen();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).then(() => mostrarToast("📋 Resumen copiado")).catch(() => copiarFallback(texto));
  } else copiarFallback(texto);
}
function copiarFallback(texto) {
  const ta = document.createElement("textarea");
  ta.value = texto; document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); mostrarToast("📋 Resumen copiado"); }
  catch (e) { mostrarToast("No se pudo copiar"); }
  document.body.removeChild(ta);
}
// PDF: usamos el diálogo de impresión del navegador (permite "Guardar como PDF")
function exportarPDF() { mostrarToast("🖨️ Usa “Guardar como PDF” en el diálogo"); setTimeout(() => window.print(), 300); }

/* ============================================================
   ARRANQUE
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Aplicar tema guardado
  aplicarTema(leer(CLAVE_CONFIG, { tema: "oscuro" }).tema);

  registrarDiaEstudio();   // cuenta la racha de estudio del día
  actualizarConteos();
  renderizarModulos();     // tarjetas de la academia
  actualizarPanelXP();     // panel de XP/nivel/racha
  evaluarLogros();

  // Cerrar modales al hacer clic fuera del contenido
  ["modalResumen", "modalTerminal", "modalLogros", "modalCertificado"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", e => { if (e.target.id === id) el.classList.add("oculto"); });
  });

  // Cerrar cualquier modal abierto con la tecla Escape
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal-fondo:not(.oculto)").forEach(m => m.classList.add("oculto"));
  });

  // Accesibilidad de modales: foco atrapado dentro y devuelto al cerrar
  inicializarFocoModales();

  // Ctrl/Cmd + Enter para guardar nota
  document.getElementById("inputContenido").addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") guardarNota();
  });

  // Enter en la terminal ejecuta el comando
  const termInput = document.getElementById("terminalInput");
  termInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const valor = termInput.value;
      termInput.value = "";
      ejecutarComando(valor);
    }
  });
});

/* ============================================================
   ACCESIBILIDAD DE MODALES: foco atrapado + devolución del foco
   Centralizado: observa cuándo un modal muestra/oculta la clase
   "oculto" sin necesidad de tocar cada abrir/cerrar.
   ============================================================ */
let focoPrevioModal = null;   // elemento que tenía el foco antes de abrir

// Selector de elementos enfocables dentro de un contenedor
function elementosEnfocables(contenedor) {
  return [...contenedor.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(el => el.offsetParent !== null);   // solo los visibles
}

function inicializarFocoModales() {
  const modales = document.querySelectorAll(".modal-fondo");

  // Tab/Shift+Tab queda confinado dentro del modal abierto
  document.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const abierto = document.querySelector(".modal-fondo:not(.oculto)");
    if (!abierto) return;
    const foco = elementosEnfocables(abierto);
    if (foco.length === 0) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primero.focus();
    }
  });

  // Observa el cambio de clase "oculto" para mover/restaurar el foco
  modales.forEach(modal => {
    const obs = new MutationObserver(() => {
      const visible = !modal.classList.contains("oculto");
      if (visible && modal.dataset.abierto !== "1") {
        modal.dataset.abierto = "1";
        focoPrevioModal = document.activeElement;
        const foco = elementosEnfocables(modal);
        if (foco.length) setTimeout(() => foco[0].focus(), 30);
      } else if (!visible && modal.dataset.abierto === "1") {
        modal.dataset.abierto = "0";
        if (focoPrevioModal && typeof focoPrevioModal.focus === "function") {
          focoPrevioModal.focus();
        }
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
  });
}

/* ============================================================
   GAMIFICACIÓN GLOBAL: XP, NIVEL Y RACHA DE ESTUDIO
   ============================================================ */
// Registra que hoy ha habido actividad y actualiza la racha de días seguidos
function registrarDiaEstudio() {
  const hoy = new Date().toISOString().slice(0, 10);   // YYYY-MM-DD
  const m = leer(CLAVE_METRICAS, { comandosTerminal: 0, racha: 0, ultimoDia: null });
  if (m.ultimoDia === hoy) return;                      // ya contaba hoy
  const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  m.racha = (m.ultimoDia === ayer) ? (m.racha || 0) + 1 : 1;
  m.ultimoDia = hoy;
  escribir(CLAVE_METRICAS, m);
}

// Actualiza el indicador de XP del encabezado
function actualizarXPHeader() {
  const m = calcularMetricas();
  const el = document.getElementById("xpIndicador");
  if (el) el.textContent = `Nv.${m.nivelGlobal} · ${m.xp} XP`;
}

// Dibuja el panel de progreso global en la bienvenida
function actualizarPanelXP() {
  const m = calcularMetricas();
  const xpNivel = m.xp % 250;                 // XP dentro del nivel actual
  const pct = Math.round((xpNivel / 250) * 100);
  const panel = document.getElementById("panelXP");
  if (!panel) return;
  panel.innerHTML = `
    <div class="xp-fila">
      <div class="xp-bloque"><span class="xp-num">Nivel ${m.nivelGlobal}</span><span class="xp-lbl">Nivel global</span></div>
      <div class="xp-bloque"><span class="xp-num">${m.xp}</span><span class="xp-lbl">XP total</span></div>
      <div class="xp-bloque"><span class="xp-num">🔥 ${m.racha}</span><span class="xp-lbl">Días de racha</span></div>
      <div class="xp-bloque"><span class="xp-num">${m.leccionesCompletadas}</span><span class="xp-lbl">Lecciones</span></div>
      <div class="xp-bloque"><span class="xp-num">${m.modulosCompletados}/${MODULOS.length}</span><span class="xp-lbl">Módulos</span></div>
    </div>
    <div class="progreso-barra" style="margin-top:12px;"><div class="progreso-relleno" style="width:${pct}%"></div></div>
    <div class="xp-sub">Te faltan ${250 - xpNivel} XP para el nivel ${m.nivelGlobal + 1}</div>`;
  actualizarXPHeader();
}

/* ============================================================
   ACADEMIA: tarjetas de módulos
   ============================================================ */
// Progreso de un módulo: { hechas, total }
function progresoModulo(modId) {
  const total = (LECCIONES[modId] || []).length;
  const lecc = leer(CLAVE_LECC, {});
  const hechas = lecc[modId] ? Object.keys(lecc[modId]).filter(k => lecc[modId][k]).length : 0;
  return { hechas, total };
}

// Renderiza las tarjetas de módulos (en bienvenida y/o en pantalla Academia)
function renderizarModulos() {
  const html = MODULOS.map(m => {
    const p = progresoModulo(m.id);
    const pct = p.total ? Math.round((p.hechas / p.total) * 100) : 0;
    const completo = p.total > 0 && p.hechas >= p.total;
    return `
      <div class="tarjeta-modulo" onclick="abrirModulo('${m.id}')">
        <span class="icono">${m.icono}</span>
        <h3>${escapar(m.nombre)} ${completo ? "✅" : ""}</h3>
        <small>${escapar(m.desc)}</small>
        <div class="mini-progreso"><div class="mini-progreso-barra" style="width:${pct}%"></div></div>
        <div class="conteo">${p.hechas}/${p.total} lecciones (${pct}%)</div>
      </div>`;
  }).join("");
  ["gridModulos", "gridModulosAcademia"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

/* ============================================================
   VISTA DE MÓDULO Y LECCIONES
   ============================================================ */
function abrirModulo(modId) {
  moduloActual = modId;
  leccionActual = 0;
  const modulo = MODULOS.find(m => m.id === modId);
  mostrarPantalla("pantallaModulo");
  document.getElementById("moduloTitulo").textContent = modulo.icono + " " + modulo.nombre;

  // El módulo de inglés usa una vista especial
  if (modulo.especial === "ingles") {
    document.getElementById("moduloLecciones").classList.add("oculto");
    document.getElementById("vistaIngles").classList.remove("oculto");
    renderizarIngles();
  } else {
    document.getElementById("moduloLecciones").classList.remove("oculto");
    document.getElementById("vistaIngles").classList.add("oculto");
    renderizarListaLecciones();
    renderizarLeccion(0);
  }
  actualizarProgresoModulo();
  if (typeof renderizarProyectoModulo === "function") renderizarProyectoModulo(modId);
}

function actualizarProgresoModulo() {
  const p = progresoModulo(moduloActual);
  const pct = p.total ? Math.round((p.hechas / p.total) * 100) : 0;
  document.getElementById("moduloProgresoTexto").innerHTML =
    `<b>${p.hechas}</b> de <b>${p.total}</b> lecciones completadas (${pct}%)`;
  document.getElementById("moduloProgresoRelleno").style.width = pct + "%";
}

// Lista lateral de lecciones del módulo
function renderizarListaLecciones() {
  const lecciones = LECCIONES[moduloActual] || [];
  const hechas = (leer(CLAVE_LECC, {})[moduloActual]) || {};
  document.getElementById("listaLecciones").innerHTML = lecciones.map((l, i) => `
    <button class="item-leccion ${i === leccionActual ? "activa" : ""}" onclick="renderizarLeccion(${i})">
      <span class="estado">${hechas[l.id] ? "✅" : "⭕"}</span>
      <span class="tit">${i + 1}. ${escapar(l.titulo)}</span>
    </button>`).join("");
}

// Renderiza el contenido docente de una lección
function renderizarLeccion(i) {
  leccionActual = i;
  const lecciones = LECCIONES[moduloActual] || [];
  const l = lecciones[i];
  if (!l) return;
  const hechas = (leer(CLAVE_LECC, {})[moduloActual]) || {};
  const completada = !!hechas[l.id];

  // Construye una sección con título e icono
  const bloque = (icono, titulo, contenidoHTML) =>
    `<div class="lec-bloque"><h4>${icono} ${titulo}</h4>${contenidoHTML}</div>`;
  const lista = arr => `<ul>${arr.map(x => `<li>${conCodigo(x)}</li>`).join("")}</ul>`;

  let html = `<h3 class="lec-titulo">${escapar(l.titulo)}</h3>`;
  html += bloque("📘", "Concepto", `<p>${conCodigo(l.concepto)}</p>`);
  if (l.ejemplos) html += bloque("🔧", "Ejemplos prácticos y casos de uso", `<p>${conCodigo(l.ejemplos)}</p>`);
  if (l.codigo)   html += bloque("💻", "Código de ejemplo comentado", `<pre class="bloque-codigo"><code>${escapar(l.codigo)}</code></pre>`);
  const errs = l.errores || l.erroresComunes;        // compatibilidad de nombres
  if (errs)       html += bloque("⚠️", "Errores comunes", lista(errs));
  if (l.tips)     html += bloque("🎓", "Tips del profesor", lista(l.tips));
  if (l.defensa)  html += bloque("🛡️", "Contraparte defensiva (blue team)", `<p>${conCodigo(l.defensa)}</p>`);
  // Comandos relacionados: enlazan con el diccionario de comandos
  if (l.comandos && l.comandos.length) {
    const chips = l.comandos.map(id => {
      const c = (typeof COMANDOS !== "undefined") ? COMANDOS.find(x => x.id === id) : null;
      return c ? `<button class="chip-comando" onclick="irAComando('${id}')">🧰 ${escapar(c.nombre)}</button>` : "";
    }).join("");
    if (chips) html += bloque("🔗", "Comandos relacionados (abre su ficha)", `<div class="chips-comandos">${chips}</div>`);
  }
  if (l.resumen)  html += bloque("📝", "Mini resumen", `<p>${conCodigo(l.resumen)}</p>`);
  if (l.preguntas) html += bloque("❓", "Preguntas de repaso", lista(l.preguntas));

  // Navegación y botón de completar
  html += `<div class="lec-pie">
    <button class="btn-secundario" onclick="renderizarLeccion(${Math.max(0, i - 1)})" ${i === 0 ? "disabled" : ""}>← Anterior</button>
    <button class="${completada ? "btn-secundario" : "btn-primario"}" onclick="marcarLeccionCompletada('${l.id}')">
      ${completada ? "✅ Completada (desmarcar)" : "✔️ Marcar como completada"}</button>
    <button class="btn-secundario" onclick="renderizarLeccion(${Math.min(lecciones.length - 1, i + 1)})" ${i === lecciones.length - 1 ? "disabled" : ""}>Siguiente →</button>
  </div>`;

  document.getElementById("lecturaLeccion").innerHTML = html;
  renderizarListaLecciones();
  document.getElementById("lecturaLeccion").scrollTop = 0;
}

// Marca/desmarca una lección como completada y actualiza progreso, XP y logros
function marcarLeccionCompletada(leccId) {
  const lecc = leer(CLAVE_LECC, {});
  if (!lecc[moduloActual]) lecc[moduloActual] = {};
  const estaba = !!lecc[moduloActual][leccId];
  lecc[moduloActual][leccId] = !estaba;        // alterna
  escribir(CLAVE_LECC, lecc);

  if (!estaba) {
    registrarDiaEstudio();
    mostrarToast("✔️ ¡Lección completada! +50 XP");
  }

  evaluarLogros();
  actualizarProgresoModulo();
  renderizarLeccion(leccionActual);
  actualizarXPHeader();

  // ¿Se acaba de completar el módulo entero?
  const p = progresoModulo(moduloActual);
  if (!estaba && p.total > 0 && p.hechas === p.total) {
    const modulo = MODULOS.find(m => m.id === moduloActual);
    mostrarToast("🎓 ¡Módulo completado! Certificado desbloqueado: " + modulo.nombre);
  }
}

/* ============================================================
   MÓDULO DE INGLÉS TÉCNICO (vista especial e interactiva)
   ============================================================ */
let flashIndex = 0;       // tarjeta actual
let flashVolteada = false;

function renderizarIngles() {
  flashIndex = 0; flashVolteada = false;
  const hechas = (leer(CLAVE_LECC, {})["ingles"]) || {};
  const cont = document.getElementById("vistaIngles");

  // Tabla de vocabulario
  const filasVocab = INGLES.vocabulario.map(v =>
    `<tr><td><b>${escapar(v.en)}</b></td><td>${escapar(v.es)}</td><td><i>/${escapar(v.pron)}/</i></td><td><span class="tag">${escapar(v.cat)}</span></td></tr>`).join("");

  // Frases
  const filasFrases = INGLES.frases.map(f =>
    `<div class="frase-en"><b>EN:</b> ${escapar(f.en)}<br><b>ES:</b> ${escapar(f.es)}</div>`).join("");

  // Ejercicio emparejar (selects)
  const opcionesEs = INGLES.ejercicios.emparejar.map(e => e.es);
  const empareja = INGLES.ejercicios.emparejar.map((e, i) =>
    `<div class="ej-fila"><span class="ej-en">${escapar(e.en)}</span>
       <select id="emp-${i}">
         <option value="">— elige —</option>
         ${opcionesEs.map(o => `<option value="${escapar(o)}">${escapar(o)}</option>`).join("")}
       </select>
       <span class="ej-res" id="empres-${i}"></span></div>`).join("");

  // Ejercicio completar (botones)
  const completar = INGLES.ejercicios.completar.map((c, i) =>
    `<div class="ej-fila-col"><p>${escapar(c.frase)}</p>
       <div>${c.opciones.map((o, j) =>
         `<button class="quiz-opcion" id="comp-${i}-${j}" onclick="elegirCompletar(${i},${j})">${escapar(o)}</button>`).join("")}</div></div>`).join("");

  // Ejercicio traducir (revelar solución)
  const traducir = INGLES.ejercicios.traducir.map((t, i) =>
    `<div class="ej-fila-col"><p><b>${escapar(t.en)}</b></p>
       <button class="btn-secundario" onclick="document.getElementById('trad-${i}').classList.toggle('oculto')">Ver solución</button>
       <p id="trad-${i}" class="oculto" style="color:var(--verde-claro)">${escapar(t.es)}</p></div>`).join("");

  cont.innerHTML = `
    <div class="guia-intro">🌐 Inglés técnico aplicado a Linux y ciberseguridad. Repasa, practica y completa cada sección.</div>

    <!-- SECCIÓN 1: FLASHCARDS -->
    <h3 class="seccion-titulo">🃏 Flashcards de vocabulario</h3>
    <div id="flashArea"></div>
    <button class="btn-secundario" onclick="marcarSeccionIngles('en-1')">${hechas["en-1"] ? "✅ Vocabulario completado" : "✔️ Marcar vocabulario como completado"}</button>

    <h3 class="seccion-titulo">📖 Tabla de vocabulario</h3>
    <div class="tabla-scroll"><table class="tabla-vocab"><thead><tr><th>Inglés</th><th>Español</th><th>Pronunciación</th><th>Categoría</th></tr></thead><tbody>${filasVocab}</tbody></table></div>

    <!-- SECCIÓN 2: FRASES -->
    <h3 class="seccion-titulo">💬 Frases y expresiones técnicas</h3>
    ${filasFrases}
    <button class="btn-secundario" onclick="marcarSeccionIngles('en-2')">${hechas["en-2"] ? "✅ Frases completadas" : "✔️ Marcar frases como completadas"}</button>

    <!-- SECCIÓN 3: LECTURA -->
    <h3 class="seccion-titulo">📰 ${escapar(INGLES.lectura.titulo)}</h3>
    <div class="lectura-en">${escapar(INGLES.lectura.textoEn)}</div>
    <div class="lec-bloque"><h4>🔎 Explicación</h4><p>${conCodigo(INGLES.lectura.explicacion)}</p></div>
    <button class="btn-secundario" onclick="marcarSeccionIngles('en-3')">${hechas["en-3"] ? "✅ Lectura completada" : "✔️ Marcar lectura como completada"}</button>

    <!-- SECCIÓN 4: EJERCICIOS -->
    <h3 class="seccion-titulo">✏️ Ejercicios</h3>
    <h4 class="ej-tit">1) Empareja término y traducción</h4>${empareja}
    <button class="btn-secundario" onclick="comprobarEmparejar()">Comprobar emparejamiento</button>
    <h4 class="ej-tit">2) Completa la frase</h4>${completar}
    <h4 class="ej-tit">3) Traduce (autoevaluación)</h4>${traducir}
    <br><button class="btn-primario" onclick="marcarSeccionIngles('en-4')">${hechas["en-4"] ? "✅ Ejercicios completados" : "✔️ Marcar ejercicios como completados"}</button>
  `;
  renderizarFlashcard();
}

// Dibuja la flashcard actual
function renderizarFlashcard() {
  const total = INGLES.vocabulario.length;
  const v = INGLES.vocabulario[flashIndex];
  const conocidas = leer(CLAVE_FLASH, []);
  const sabida = conocidas.includes(flashIndex);
  document.getElementById("flashArea").innerHTML = `
    <div class="flashcard ${flashVolteada ? "volteada" : ""}" onclick="voltearFlash()">
      <div class="flash-cara flash-frente">
        <span class="flash-lbl">EN ${sabida ? "· ✅ la sé" : ""}</span>
        <span class="flash-txt">${escapar(v.en)}</span>
        <span class="flash-pista">(toca para ver la traducción)</span>
      </div>
      <div class="flash-cara flash-detras">
        <span class="flash-lbl">ES</span>
        <span class="flash-txt">${escapar(v.es)}</span>
        <span class="flash-pista">/${escapar(v.pron)}/</span>
      </div>
    </div>
    <div class="flash-controles">
      <button class="btn-secundario" onclick="flashMover(-1)">← Anterior</button>
      <span class="flash-cont">${flashIndex + 1} / ${total}</span>
      <button class="btn-secundario" onclick="flashMover(1)">Siguiente →</button>
      <button class="btn-primario" onclick="flashSabida()">👍 La sé</button>
    </div>`;
}
function voltearFlash() { flashVolteada = !flashVolteada; renderizarFlashcard(); }
function flashMover(dir) {
  const total = INGLES.vocabulario.length;
  flashIndex = (flashIndex + dir + total) % total;
  flashVolteada = false;
  renderizarFlashcard();
}
function flashSabida() {
  const conocidas = leer(CLAVE_FLASH, []);
  if (!conocidas.includes(flashIndex)) {
    conocidas.push(flashIndex);
    escribir(CLAVE_FLASH, conocidas);
    mostrarToast("👍 ¡Palabra aprendida! +3 XP");
    evaluarLogros();
    actualizarXPHeader();
  }
  flashMover(1);
}

// Ejercicio: comprobar emparejamiento
function comprobarEmparejar() {
  INGLES.ejercicios.emparejar.forEach((e, i) => {
    const sel = document.getElementById("emp-" + i);
    const res = document.getElementById("empres-" + i);
    if (sel.value === e.es) { res.textContent = "✅"; }
    else { res.textContent = sel.value ? "❌" : "—"; }
  });
}
// Ejercicio: elegir opción en completar
function elegirCompletar(i, j) {
  const c = INGLES.ejercicios.completar[i];
  c.opciones.forEach((_, k) => {
    const b = document.getElementById(`comp-${i}-${k}`);
    b.classList.remove("correcta", "incorrecta", "seleccionada");
  });
  const btn = document.getElementById(`comp-${i}-${j}`);
  btn.classList.add(j === c.correcta ? "correcta" : "incorrecta");
}

// Marca una sección del módulo de inglés como completada
function marcarSeccionIngles(leccId) {
  const lecc = leer(CLAVE_LECC, {});
  if (!lecc["ingles"]) lecc["ingles"] = {};
  if (!lecc["ingles"][leccId]) {
    lecc["ingles"][leccId] = true;
    escribir(CLAVE_LECC, lecc);
    registrarDiaEstudio();
    mostrarToast("✔️ Sección completada");
    evaluarLogros();
    actualizarXPHeader();
    actualizarProgresoModulo();
    renderizarIngles();
    const p = progresoModulo("ingles");
    if (p.hechas === p.total) mostrarToast("🎓 ¡Módulo de Inglés completado! Certificado desbloqueado.");
  }
}

/* ============================================================
   CERTIFICADOS
   ============================================================ */
let certActual = null;   // { titulo } del certificado mostrado

function abrirCertificados() {
  mostrarPantalla("pantallaCertificados");
  const cfg = leer(CLAVE_CONFIG, {});
  document.getElementById("inputNombreCert").value = cfg.nombre || "";
  renderizarListaCertificados();
}
function guardarNombreCert() {
  const cfg = leer(CLAVE_CONFIG, { tema: "oscuro" });
  cfg.nombre = document.getElementById("inputNombreCert").value;
  escribir(CLAVE_CONFIG, cfg);
}

function renderizarListaCertificados() {
  document.getElementById("listaCertificados").innerHTML = MODULOS.map(m => {
    const p = progresoModulo(m.id);
    const completo = p.total > 0 && p.hechas >= p.total;
    return `
      <div class="cert-card ${completo ? "desbloqueado" : ""}">
        <span class="cert-icono">${completo ? "📜" : "🔒"}</span>
        <div class="cert-info">
          <h3>${escapar(m.cert)}</h3>
          <small>${completo ? "Completado · ¡Certificado disponible!" : `Progreso: ${p.hechas}/${p.total} lecciones`}</small>
        </div>
        <button class="${completo ? "btn-primario" : "btn-secundario"}" ${completo ? "" : "disabled"} onclick="verCertificado('${m.id}')">
          ${completo ? "Ver certificado" : "Bloqueado"}
        </button>
      </div>`;
  }).join("");
}

// Genera el SVG del certificado (sin recursos externos: se puede exportar a PNG)
function generarSVGCertificado(nombre, titulo, fecha) {
  const n = escapar(nombre || "Estudiante");
  const t = escapar(titulo);
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="680" viewBox="0 0 1000 680" font-family="Segoe UI, Ubuntu, sans-serif">
    <rect width="1000" height="680" fill="#1b1d1e"/>
    <rect x="20" y="20" width="960" height="640" fill="#23262a" stroke="#6fbf4f" stroke-width="6" rx="18"/>
    <rect x="40" y="40" width="920" height="600" fill="none" stroke="#3b7a2a" stroke-width="2" rx="12"/>
    <text x="500" y="120" text-anchor="middle" font-size="54">🐧</text>
    <text x="500" y="180" text-anchor="middle" fill="#8fd96f" font-size="40" font-weight="bold">CERTIFICADO DE FINALIZACIÓN</text>
    <text x="500" y="225" text-anchor="middle" fill="#a8b0a4" font-size="20">Plataforma de aprendizaje Linux Mint</text>
    <text x="500" y="300" text-anchor="middle" fill="#e6e6e6" font-size="22">Se otorga el presente certificado a</text>
    <text x="500" y="365" text-anchor="middle" fill="#6fbf4f" font-size="46" font-weight="bold">${n}</text>
    <line x1="280" y1="385" x2="720" y2="385" stroke="#3b7a2a" stroke-width="2"/>
    <text x="500" y="435" text-anchor="middle" fill="#e6e6e6" font-size="22">por completar con éxito el módulo</text>
    <text x="500" y="490" text-anchor="middle" fill="#8fd96f" font-size="32" font-weight="bold">${t}</text>
    <text x="300" y="600" text-anchor="middle" fill="#a8b0a4" font-size="18">Fecha: ${escapar(fecha)}</text>
    <text x="700" y="600" text-anchor="middle" fill="#a8b0a4" font-size="18">Firma: Academia Linux Mint</text>
    <text x="300" y="575" text-anchor="middle" font-size="26">📅</text>
    <text x="700" y="575" text-anchor="middle" font-size="26">✍️</text>
  </svg>`;
}

function verCertificado(modId) {
  const m = MODULOS.find(x => x.id === modId);
  const p = progresoModulo(modId);
  if (!(p.total > 0 && p.hechas >= p.total)) { mostrarToast("🔒 Completa el módulo para desbloquearlo"); return; }
  const cfg = leer(CLAVE_CONFIG, {});
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  certActual = { titulo: m.cert, nombre: cfg.nombre || "Estudiante", fecha };
  document.getElementById("certificadoVista").innerHTML = generarSVGCertificado(certActual.nombre, certActual.titulo, fecha);
  document.getElementById("modalCertificado").classList.remove("oculto");
}
function cerrarCertificado() { document.getElementById("modalCertificado").classList.add("oculto"); }

/* ============================================================
   GUÍA: CREA TU PRIMERA PÁGINA WEB PÚBLICA CON LINUX
   ============================================================ */
function abrirGuiaServidor() {
  mostrarPantalla("pantallaServidor");
}

/* ============================================================
   DICCIONARIO INTERACTIVO DE COMANDOS
   ============================================================ */
let categoriaCmd = "Todos";   // filtro de categoría activo

function abrirComandos() {
  mostrarPantalla("pantallaComandos");
  renderizarFiltrosComandos();
  renderizarComandos();
}
function limpiarBusquedaCmd() {
  document.getElementById("inputBuscarCmd").value = "";
  categoriaCmd = "Todos";
  renderizarFiltrosComandos();
  renderizarComandos();
}
function filtrarCategoriaCmd(cat) {
  categoriaCmd = cat;
  renderizarFiltrosComandos();
  renderizarComandos();
}

// Dibuja los chips de categoría (incluye "Todos" y "★ Favoritos")
function renderizarFiltrosComandos() {
  const cats = ["Todos", ...CATEGORIAS_CMD, "★ Favoritos"];
  document.getElementById("filtrosComandos").innerHTML = cats.map(c =>
    `<span class="chip-etiqueta ${categoriaCmd === c ? "activa" : ""}" onclick="filtrarCategoriaCmd('${c}')">${escapar(c)}</span>`
  ).join("");
}

// Marca/desmarca un comando como favorito
function toggleFavComando(id) {
  const favs = leer(CLAVE_FAVCMD, []);
  const i = favs.indexOf(id);
  if (i === -1) { favs.push(id); mostrarToast("⭐ Añadido a favoritos"); }
  else { favs.splice(i, 1); mostrarToast("Quitado de favoritos"); }
  escribir(CLAVE_FAVCMD, favs);
  evaluarLogros();
  renderizarComandos();
}

// Renderiza las fichas según búsqueda y categoría
function renderizarComandos() {
  const q = (document.getElementById("inputBuscarCmd").value || "").toLowerCase().trim();
  const favs = leer(CLAVE_FAVCMD, []);

  let lista = COMANDOS.filter(c => {
    // Filtro por categoría
    if (categoriaCmd === "★ Favoritos") { if (!favs.includes(c.id)) return false; }
    else if (categoriaCmd !== "Todos" && c.cat !== categoriaCmd) return false;
    // Filtro por texto (nombre, descripción, caso de uso, sintaxis)
    if (!q) return true;
    const texto = (c.nombre + " " + c.desc + " " + (c.caso || "") + " " + c.sintaxis + " " +
      (c.ejemplos || []).map(e => e.c + " " + e.n).join(" ")).toLowerCase();
    return texto.includes(q);
  });

  const cont = document.getElementById("listaComandos");
  document.getElementById("cmdContador").textContent =
    `${lista.length} comando(s) · ${favs.length} en favoritos`;

  if (lista.length === 0) {
    cont.innerHTML = `<div class="vacio"><span class="icono">🔍</span>Ningún comando coincide con tu búsqueda.</div>`;
    return;
  }

  cont.innerHTML = lista.map(c => {
    const esFav = favs.includes(c.id);
    const opciones = (c.opciones || []).length
      ? `<div class="cmd-bloque"><b>Opciones más usadas:</b><ul>${c.opciones.map(o => `<li><code>${escapar(o)}</code></li>`).join("")}</ul></div>` : "";
    const ejemplos = (c.ejemplos || []).map(e =>
      `<div class="cmd-ejemplo"><code>${escapar(e.c)}</code><span class="cmd-ej-nota">${escapar(e.n)}</span></div>`).join("");
    const aviso = c.aviso
      ? `<div class="cmd-aviso">⚠️ ${escapar(c.aviso)}</div>` : "";
    return `
      <article class="cmd-ficha" id="cmd-${c.id}">
        <div class="cmd-cabecera">
          <span class="cmd-nombre">${escapar(c.nombre)}</span>
          <span class="cmd-cat">${escapar(c.cat)}</span>
          <button class="cmd-fav ${esFav ? "activo" : ""}" onclick="toggleFavComando('${c.id}')" title="Favorito">${esFav ? "⭐" : "☆"}</button>
        </div>
        <code class="cmd-sintaxis">${escapar(c.sintaxis)}</code>
        <p class="cmd-desc">${escapar(c.desc)}</p>
        ${opciones}
        ${ejemplos ? `<div class="cmd-bloque"><b>Ejemplos:</b>${ejemplos}</div>` : ""}
        ${c.caso ? `<div class="cmd-caso"><b>💼 En un trabajo real:</b> ${escapar(c.caso)}</div>` : ""}
        ${aviso}
        <div class="cmd-fuente">📄 Fuente: ${escapar(c.fuente)}</div>
      </article>`;
  }).join("");
}

// Desde una lección: abre el diccionario y resalta una ficha concreta
function irAComando(id) {
  const c = COMANDOS.find(x => x.id === id);
  if (!c) { abrirComandos(); return; }
  categoriaCmd = "Todos";
  abrirComandos();
  document.getElementById("inputBuscarCmd").value = c.nombre;
  renderizarComandos();
  // Resalta y desplaza a la ficha
  setTimeout(() => {
    const ficha = document.getElementById("cmd-" + id);
    if (ficha) { ficha.scrollIntoView({ behavior: "smooth", block: "center" }); ficha.classList.add("resaltado"); setTimeout(() => ficha.classList.remove("resaltado"), 1800); }
  }, 100);
}


// Descarga el certificado como imagen PNG (convirtiendo el SVG en canvas)
function descargarCertificadoImagen() {
  const svg = document.querySelector("#certificadoVista svg");
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = 1000; canvas.height = 680;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    a.download = "certificado-" + (certActual ? certActual.titulo.replace(/\s+/g, "_") : "linux") + ".png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    mostrarToast("🖼️ Certificado descargado");
  };
  img.src = svg64;
}

// Imprime / guarda como PDF abriendo una ventana solo con el certificado
function imprimirCertificado() {
  const svg = document.getElementById("certificadoVista").innerHTML;
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>Certificado</title></head>
    <body style="margin:0;display:flex;justify-content:center;align-items:center;">${svg}</body></html>`);
  w.document.close();
  setTimeout(() => { w.print(); }, 400);
}
