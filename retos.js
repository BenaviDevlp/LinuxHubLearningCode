/* ============================================================
   RETOS (retos.js)
   Features de enganche que se apoyan en app.js (global):
     1) Reto diario (una pregunta nueva cada día).
     2) Misiones en la terminal (objetivos verificables).
     3) Proyectos prácticos al final de cada curso.
   Depende de: leer, escribir, mostrarToast, escapar,
   evaluarLogros, actualizarPanelXP, actualizarXPHeader,
   obtenerNodo, fsRaiz, reiniciarFS, MODULOS.
   Las claves de almacenamiento se comparten con app.js por
   string literal (retoDiarioLinuxMint, etc.).
   ============================================================ */
"use strict";

const CLAVE_RETO      = "retoDiarioLinuxMint";
const CLAVE_MISIONES  = "misionesTerminalLinuxMint";
const CLAVE_PROYECTOS = "proyectosLinuxMint";

/* ============================================================
   1) RETO DIARIO
   ============================================================ */
const RETOS_DIARIOS = [
  { p: "¿Qué comando muestra la carpeta en la que estás?", o: ["pwd", "cd", "ls", "dir"], c: 0,
    tip: "pwd = print working directory." },
  { p: "¿Cómo listas archivos incluyendo los ocultos?", o: ["ls -a", "ls -l", "ls --hidden", "lsa"], c: 0,
    tip: "La opción -a muestra también los que empiezan por punto." },
  { p: "¿Qué comando crea una carpeta?", o: ["touch", "mkdir", "newdir", "create"], c: 1,
    tip: "mkdir = make directory." },
  { p: "¿Cómo das permiso de ejecución a un script?", o: ["chmod +x script.sh", "run script.sh", "exec script.sh", "chmod -x script.sh"], c: 0,
    tip: "+x añade el permiso de ejecución." },
  { p: "¿Qué hace 'ls > lista.txt'?", o: ["Lee lista.txt", "Guarda la salida sobrescribiendo", "Añade al final", "Borra lista.txt"], c: 1,
    tip: "'>' redirige sobrescribiendo; '>>' añade." },
  { p: "¿Qué comando muestra el espacio libre en disco?", o: ["free -h", "df -h", "du", "lsblk"], c: 1,
    tip: "df = disk free." },
  { p: "¿Con qué actualizas la lista de paquetes en Mint?", o: ["apt upgrade", "apt update", "apt refresh", "apt list"], c: 1,
    tip: "update refresca la lista; upgrade instala." },
  { p: "¿Qué comando busca texto dentro de archivos?", o: ["find", "grep", "locate", "search"], c: 1,
    tip: "grep filtra líneas que coinciden con un patrón." },
  { p: "¿Cómo copias una carpeta con su contenido?", o: ["cp carpeta destino", "cp -r carpeta destino", "mv carpeta destino", "scp carpeta destino"], c: 1,
    tip: "-r = recursivo (incluye subcarpetas)." },
  { p: "¿Qué hace 'sudo'?", o: ["Borra archivos", "Ejecuta como administrador", "Apaga el equipo", "Lista usuarios"], c: 1,
    tip: "sudo = ejecutar con privilegios de root." },
  { p: "¿Qué comando termina un proceso por su PID?", o: ["stop", "end", "kill", "quit"], c: 2,
    tip: "kill PID envía una señal de cierre al proceso." },
  { p: "¿Cuál muestra los procesos en vivo?", o: ["top", "ps once", "jobs", "run"], c: 0,
    tip: "top (o htop) es un monitor en tiempo real." },
  { p: "¿Qué hace el símbolo '|' (pipe)?", o: ["Comenta", "Pasa la salida de un comando a otro", "Crea archivos", "Cierra la terminal"], c: 1,
    tip: "La tubería conecta comandos: ls | grep txt." },
  { p: "¿Cómo ves tu IP local?", o: ["ip a", "myip", "ipconfig", "showip"], c: 0,
    tip: "'ip a' lista interfaces y direcciones." },
  { p: "¿Qué carpeta es la personal del usuario?", o: ["/root", "/home/usuario", "/usr", "C:/Users"], c: 1,
    tip: "Tu home cuelga de /home/tu_usuario." },
  { p: "¿Qué comando empaqueta y comprime con gzip?", o: ["zip -r", "tar -czf", "gz", "compress"], c: 1,
    tip: "tar -czf archivo.tar.gz carpeta/" }
];

function fechaHoy() { return new Date().toISOString().slice(0, 10); }
function retoDeHoyIndice() { return Math.floor(Date.now() / 86400000) % RETOS_DIARIOS.length; }

function renderRetoDiario() {
  const cont = document.getElementById("retoDiario");
  if (!cont) return;
  const idx = retoDeHoyIndice();
  const reto = RETOS_DIARIOS[idx];
  const estado = leer(CLAVE_RETO, {});
  const hecho = estado.fecha === fechaHoy();

  const opciones = reto.o.map((op, j) => {
    let clase = "reto-opcion";
    if (hecho) {
      if (j === reto.c) clase += " correcta";
      else if (j === estado.elegida && !estado.acierto) clase += " incorrecta";
    }
    const dis = hecho ? "disabled" : `onclick="responderReto(${j})"`;
    return `<button class="${clase}" ${dis}>${escapar(op)}</button>`;
  }).join("");

  const pie = hecho
    ? `<div class="reto-feedback ${estado.acierto ? "ok" : "no"}">
         ${estado.acierto ? "¡Correcto!" : "La próxima será."} ${escapar(reto.tip)}
         <span class="reto-manana">Vuelve mañana para un nuevo reto.</span>
       </div>`
    : `<div class="reto-pista">Responde y suma XP. Hay un reto nuevo cada día.</div>`;

  cont.innerHTML = `
    <div class="reto-cab">
      <span class="reto-badge">Reto diario</span>
      <span class="reto-fecha">${fechaHoy()}</span>
    </div>
    <div class="reto-pregunta">${escapar(reto.p)}</div>
    <div class="reto-opciones">${opciones}</div>
    ${pie}`;
}

function responderReto(j) {
  const idx = retoDeHoyIndice();
  const reto = RETOS_DIARIOS[idx];
  const previo = leer(CLAVE_RETO, {});
  if (previo.fecha === fechaHoy()) return;            // ya respondió hoy
  const acierto = (j === reto.c);
  escribir(CLAVE_RETO, {
    fecha: fechaHoy(), elegida: j, acierto,
    total: (previo.total || 0) + 1
  });
  renderRetoDiario();
  if (typeof evaluarLogros === "function") evaluarLogros();
  if (typeof actualizarPanelXP === "function") actualizarPanelXP();
  if (typeof actualizarXPHeader === "function") actualizarXPHeader();
  mostrarToast(acierto ? "¡Reto diario superado! +15 XP" : "Reto registrado. ¡Mañana otro!");
}

/* ============================================================
   2) MISIONES EN LA TERMINAL
   Cada misión tiene un objetivo verificable sobre el sistema
   de archivos simulado (fsRaiz / obtenerNodo de app.js).
   ============================================================ */

// Busca recursivamente un archivo por nombre que cumpla un predicado
function buscarArchivoFS(nodo, nombre, pred) {
  if (!nodo || nodo.tipo !== "dir") return false;
  for (const k of Object.keys(nodo.hijos)) {
    const h = nodo.hijos[k];
    if (h.tipo === "file" && k === nombre && pred(h)) return true;
    if (h.tipo === "dir" && buscarArchivoFS(h, nombre, pred)) return true;
  }
  return false;
}

const MISIONES_TERMINAL = [
  { id: "mt1", titulo: "Tu carpeta de trabajo",
    obj: "Crea una carpeta llamada proyecto",
    pista: "mkdir proyecto",
    check: () => { const n = obtenerNodo(["home", "usuario", "proyecto"]); return !!(n && n.tipo === "dir"); } },

  { id: "mt2", titulo: "Tu primer archivo",
    obj: "Crea un archivo dentro de la carpeta proyecto",
    pista: "cd proyecto  →  touch notas.txt",
    check: () => { const n = obtenerNodo(["home", "usuario", "proyecto"]);
      return !!(n && n.tipo === "dir" && Object.values(n.hijos).some(h => h.tipo === "file")); } },

  { id: "mt3", titulo: "Escribe con echo",
    obj: "Crea un archivo saludo.txt con algún texto dentro (usa echo)",
    pista: "echo hola mundo > saludo.txt",
    check: () => buscarArchivoFS(typeof fsRaiz !== "undefined" ? fsRaiz : null, "saludo.txt", f => (f.contenido || "").trim().length > 0) },

  { id: "mt4", titulo: "Limpieza",
    obj: "Borra el archivo bienvenida.txt de tu carpeta personal",
    pista: "cd ~  →  rm bienvenida.txt",
    check: () => { const n = obtenerNodo(["home", "usuario", "bienvenida.txt"]); return !n; } },

  { id: "mt5", titulo: "Estructura de una web",
    obj: "Crea una carpeta web con un archivo index.html dentro",
    pista: "mkdir web → cd web → touch index.html",
    check: () => { const n = obtenerNodo(["home", "usuario", "web"]);
      return !!(n && n.tipo === "dir" && n.hijos["index.html"] && n.hijos["index.html"].tipo === "file"); } }
];

function estadoMisiones() {
  const e = leer(CLAVE_MISIONES, { actual: 0, completadas: [] });
  if (!Array.isArray(e.completadas)) e.completadas = [];
  if (typeof e.actual !== "number") e.actual = 0;
  return e;
}

// Devuelve el índice de la primera misión no completada (o -1 si todas)
function primeraMisionPendiente(comp) {
  for (let i = 0; i < MISIONES_TERMINAL.length; i++) {
    if (!comp.includes(MISIONES_TERMINAL[i].id)) return i;
  }
  return -1;
}

function renderMisionesTerminal() {
  const cont = document.getElementById("terminalMisiones");
  if (!cont) return;
  const e = estadoMisiones();
  const total = MISIONES_TERMINAL.length;
  const hechas = e.completadas.length;

  // Si la misión "actual" ya está hecha, avanza a la siguiente pendiente
  let idx = e.actual;
  if (idx >= total || (MISIONES_TERMINAL[idx] && e.completadas.includes(MISIONES_TERMINAL[idx].id))) {
    idx = primeraMisionPendiente(e.completadas);
  }

  if (idx === -1) {
    cont.innerHTML = `
      <div class="mis-cab">
        <span class="mis-badge">Misiones</span>
        <span class="mis-prog">${hechas}/${total} completadas</span>
      </div>
      <div class="mis-obj mis-fin">¡Completaste todas las misiones! Eres un crack de la terminal.
        <button class="btn-secundario mis-reset" onclick="reiniciarMisiones()">Repetir misiones</button>
      </div>`;
    return;
  }

  e.actual = idx;
  escribir(CLAVE_MISIONES, e);
  const m = MISIONES_TERMINAL[idx];
  cont.innerHTML = `
    <div class="mis-cab">
      <span class="mis-badge">Misión ${idx + 1}/${total}</span>
      <span class="mis-prog">${hechas}/${total} completadas</span>
    </div>
    <div class="mis-obj">
      <span class="mis-check">○</span>
      <div>
        <b>${escapar(m.titulo)}</b>
        <div class="mis-desc">${escapar(m.obj)}</div>
        <div class="mis-pista">Pista: <code>${escapar(m.pista)}</code></div>
      </div>
    </div>
    <div class="mis-acciones">
      <button class="btn-secundario" onclick="saltarMision()">Saltar</button>
      <button class="btn-secundario" onclick="reiniciarTerminalFS()">Reiniciar terminal</button>
    </div>`;
}

// Se llama tras cada comando: comprueba si se cumplió la misión actual
function verificarMisionTerminal() {
  const cont = document.getElementById("terminalMisiones");
  if (!cont) return;
  const e = estadoMisiones();
  const idx = e.actual;
  const m = MISIONES_TERMINAL[idx];
  if (!m || e.completadas.includes(m.id)) return;

  let ok = false;
  try { ok = m.check(); } catch (_) { ok = false; }
  if (!ok) return;

  e.completadas.push(m.id);
  e.actual = primeraMisionPendiente(e.completadas);
  if (e.actual === -1) e.actual = MISIONES_TERMINAL.length;
  escribir(CLAVE_MISIONES, e);

  // Animación rápida de "completada" antes de pasar a la siguiente
  const check = cont.querySelector(".mis-check");
  if (check) { check.textContent = "✓"; check.classList.add("hecho"); }
  mostrarToast("Misión completada: " + m.titulo);
  if (typeof evaluarLogros === "function") evaluarLogros();
  if (typeof actualizarXPHeader === "function") actualizarXPHeader();
  setTimeout(renderMisionesTerminal, 700);
}

function saltarMision() {
  const e = estadoMisiones();
  e.actual = (e.actual + 1);
  if (e.actual >= MISIONES_TERMINAL.length) e.actual = primeraMisionPendiente(e.completadas);
  if (e.actual === -1) e.actual = MISIONES_TERMINAL.length;
  escribir(CLAVE_MISIONES, e);
  renderMisionesTerminal();
}

function reiniciarMisiones() {
  escribir(CLAVE_MISIONES, { actual: 0, completadas: [] });
  renderMisionesTerminal();
  mostrarToast("Misiones reiniciadas");
}

// Reinicia el sistema de archivos simulado y limpia la salida
function reiniciarTerminalFS() {
  if (typeof reiniciarFS === "function") reiniciarFS();
  const salida = document.getElementById("terminalSalida");
  if (salida) salida.innerHTML = "";
  if (typeof actualizarPrompt === "function") actualizarPrompt();
  if (typeof imprimirTerminal === "function") imprimirTerminal("Terminal reiniciada. ¡A por la misión!");
  if (typeof enfocarTerminal === "function") enfocarTerminal();
  renderMisionesTerminal();
}

/* ============================================================
   3) PROYECTOS PRÁCTICOS (al final de cada curso)
   ============================================================ */
const PROYECTOS = {
  "linux-principiante": {
    titulo: "Organiza tu carpeta personal",
    intro: "Pon en práctica lo aprendido creando una estructura de carpetas y moviéndote por ella.",
    pasos: [
      "Abre la terminal de práctica (botón 💻 del menú superior).",
      "Crea una carpeta 'documentos' y otra 'descargas' con mkdir.",
      "Entra en 'documentos' con cd y crea un archivo 'apuntes.txt' con touch.",
      "Escribe una línea dentro con echo \"Mi primer apunte\" > apuntes.txt.",
      "Comprueba el contenido con cat apuntes.txt."
    ],
    entregable: "Una carpeta 'documentos' con un archivo 'apuntes.txt' que contenga texto."
  },
  "linux-intermedio": {
    titulo: "Audita tu sistema (en papel)",
    intro: "Practica los comandos de diagnóstico y permisos sobre tu propio equipo.",
    pasos: [
      "Lista los procesos que más memoria consumen: ps aux --sort=-%mem | head.",
      "Mira el espacio libre en disco con df -h.",
      "Crea un script vacío 'tareas.sh' y dale permiso de ejecución con chmod +x.",
      "Filtra en un log con grep (ej: grep -i error /var/log/syslog).",
      "Anota en tus notas qué encontraste de cada comando."
    ],
    entregable: "Una nota en tu cuaderno con la salida de 3 comandos de diagnóstico."
  },
  "linux-avanzado": {
    titulo: "Programa un backup automático",
    intro: "Combina scripting, permisos y cron para automatizar una copia de seguridad.",
    pasos: [
      "Escribe un script 'backup.sh' que use rsync para copiar una carpeta.",
      "Dale permisos con chmod +x backup.sh y pruébalo con ./backup.sh.",
      "Programa su ejecución diaria con crontab -e (ej: 0 3 * * *).",
      "Verifica las tareas programadas con crontab -l."
    ],
    entregable: "Un script backup.sh funcional programado en cron."
  },
  "bash": {
    titulo: "Tu primer script útil",
    intro: "Crea un script de Bash que salude e informe del sistema.",
    pasos: [
      "Crea 'info.sh' empezando por el shebang #!/bin/bash.",
      "Muestra un saludo con el nombre de usuario: echo \"Hola $USER\".",
      "Muestra la fecha actual con $(date) y el espacio en disco con df -h.",
      "Hazlo ejecutable (chmod +x info.sh) y córrelo con ./info.sh."
    ],
    entregable: "Un script info.sh que salude y muestre datos del sistema."
  },
  "python": {
    titulo: "Mini-automatización en Python",
    intro: "Aplica variables, control de flujo y archivos en un programa pequeño.",
    pasos: [
      "Crea 'tareas.py' que pida al usuario una tarea por consola.",
      "Guarda cada tarea en una lista y, al terminar, escríbelas en 'tareas.txt'.",
      "Usa un bucle while y un condicional para salir al escribir 'fin'.",
      "Ejecútalo con python3 tareas.py y revisa el archivo generado."
    ],
    entregable: "Un programa tareas.py que guarde una lista de tareas en un archivo."
  },
  "hacking": {
    titulo: "Reconocimiento ético de TU equipo",
    intro: "Practica metodología y herramientas SOLO sobre tu propia máquina/laboratorio.",
    pasos: [
      "Descubre tus puertos abiertos locales: ss -tuln.",
      "Escanea tu propio equipo con nmap -sV localhost (solo el tuyo).",
      "Anota qué servicios están expuestos y si deberían estarlo.",
      "Propón en una nota cómo reducir la superficie de ataque."
    ],
    entregable: "Una nota con tu escaneo local y propuestas de endurecimiento. Solo en equipos propios o autorizados."
  },
  "redes": {
    titulo: "Diseña y reconoce tu propia red",
    intro: "Une subnetting (VLSM) con reconocimiento: planifica una red y luego explórala como lo haría un pentester (en tu propia red/lab).",
    pasos: [
      "Diseña con VLSM la red 192.168.10.0/24 para 3 áreas: Soporte 25 PC, Ventas 12 PC y Dirección 5 PC (de mayor a menor).",
      "Anota para cada subred: dirección de red, máscara/prefijo, primer host, último host y broadcast.",
      "Averigua tu red real con ip a / ip route e identifica tu rango (CIDR).",
      "Descubre los hosts vivos de TU red con nmap -sn TU_RED/24.",
      "Elige un host propio y mira sus servicios con nmap -sV, y propón cómo segmentar para reducir el riesgo."
    ],
    entregable: "Una nota con tu tabla VLSM (3 subredes) y el resultado del escaneo de tu propia red. Solo en redes propias o autorizadas."
  }
};

function renderizarProyectoModulo(modId) {
  const cont = document.getElementById("proyectoModulo");
  if (!cont) return;
  const proy = PROYECTOS[modId];
  if (!proy) { cont.classList.add("oculto"); cont.innerHTML = ""; return; }

  const completados = leer(CLAVE_PROYECTOS, {});
  const hecho = !!completados[modId];

  cont.classList.remove("oculto");
  cont.innerHTML = `
    <div class="proy-cab">
      <span class="proy-badge">Proyecto final</span>
      <h3>${escapar(proy.titulo)} ${hecho ? '<span class="proy-ok">✓ completado</span>' : ""}</h3>
    </div>
    <p class="proy-intro">${escapar(proy.intro)}</p>
    <ol class="proy-pasos">${proy.pasos.map(p => `<li>${escapar(p)}</li>`).join("")}</ol>
    <div class="proy-entregable"><b>Entregable:</b> ${escapar(proy.entregable)}</div>
    <div class="proy-acciones">
      <button class="${hecho ? "btn-secundario" : "btn-primario"}" onclick="completarProyecto('${modId}')">
        ${hecho ? "Marcar como pendiente" : "Marcar proyecto como completado"}
      </button>
    </div>`;
}

function completarProyecto(modId) {
  const completados = leer(CLAVE_PROYECTOS, {});
  completados[modId] = !completados[modId];
  escribir(CLAVE_PROYECTOS, completados);
  renderizarProyectoModulo(modId);
  if (typeof evaluarLogros === "function") evaluarLogros();
  if (typeof actualizarXPHeader === "function") actualizarXPHeader();
  mostrarToast(completados[modId] ? "¡Proyecto completado! +60 XP" : "Proyecto marcado como pendiente");
}

/* ============================================================
   ARRANQUE
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderRetoDiario();
});
