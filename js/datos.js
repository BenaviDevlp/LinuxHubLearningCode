/* ============================================================
   DATOS DE LA APLICACIÓN
   - NIVELES: nombres legibles de cada nivel.
   - CONOCIMIENTOS: guía de aprendizaje por nivel.
   - QUIZZES: preguntas de autoevaluación por nivel.
   - LOGROS: catálogo de insignias desbloqueables.
   Estas constantes son globales y las usa app.js.
   ============================================================ */

const NIVELES = {
  principiante: "Principiante",
  intermedio:  "Intermedio",
  avanzado:    "Avanzado"
};

/* ------------------------------------------------------------
   BASE DE CONOCIMIENTOS (Guía por nivel)
   Cada tema: { titulo, contenido }. Se usa <code>...</code>
   para resaltar comandos.
   ------------------------------------------------------------ */
const CONOCIMIENTOS = {
  principiante: [
    { titulo: "¿Qué es Linux Mint?",
      contenido:
        "Linux Mint es una distribución (sistema operativo) basada en Ubuntu/Debian, "
        + "pensada para ser fácil de usar, estable y cómoda para quien viene de Windows.\n\n"
        + "• Es gratuita y de código abierto.\n"
        + "• Trae un escritorio cómodo (Cinnamon, MATE o XFCE).\n"
        + "• Incluye navegador, multimedia y LibreOffice ya instalados.\n"
        + "• Cinnamon es el escritorio recomendado para empezar." },
    { titulo: "El escritorio Cinnamon: partes básicas",
      contenido:
        "Cinnamon se parece a Windows, así que te resultará familiar:\n\n"
        + "• Panel inferior: barra de tareas con menú, apps abiertas y bandeja.\n"
        + "• Menú (abajo izquierda): equivale al menú Inicio.\n"
        + "• Área de notificaciones y reloj a la derecha.\n"
        + "• Espacios de trabajo: escritorios virtuales." },
    { titulo: "Instalar y desinstalar programas",
      contenido:
        "La forma más fácil es el «Gestor de programas»:\n\n"
        + "1. Abre el Menú y busca «Gestor de programas».\n"
        + "2. Busca el programa (VLC, GIMP, Telegram...).\n"
        + "3. Pulsa «Instalar» e introduce tu contraseña.\n\n"
        + "Para quitarlo, búscalo y pulsa «Quitar»." },
    { titulo: "Actualizar el sistema",
      contenido:
        "Mantener el sistema actualizado es clave para la seguridad:\n\n"
        + "• El icono de escudo del panel avisa de actualizaciones.\n"
        + "• También desde terminal:\n"
        + "   <code>sudo apt update</code> (refresca la lista)\n"
        + "   <code>sudo apt upgrade</code> (instala las actualizaciones)" },
    { titulo: "Carpetas y archivos (Nemo)",
      contenido:
        "Nemo es el explorador de archivos de Cinnamon:\n\n"
        + "• Tu carpeta personal es <code>/home/tu_usuario</code>.\n"
        + "• No hay «C:». Todo cuelga de la raíz <code>/</code>.\n"
        + "• Archivos que empiezan por punto están ocultos; Ctrl+H para verlos." },
    { titulo: "Abrir la terminal y primeros comandos",
      contenido:
        "Abre la terminal con Ctrl+Alt+T.\n\n"
        + "• <code>pwd</code> — carpeta actual.\n"
        + "• <code>ls</code> — lista archivos.\n"
        + "• <code>cd carpeta</code> — entra en una carpeta.\n"
        + "• <code>cd ..</code> — sube un nivel.\n"
        + "• <code>clear</code> — limpia la pantalla." },
    { titulo: "Permisos de administrador (sudo)",
      contenido:
        "Tu usuario normal no puede tocar el sistema por seguridad.\n\n"
        + "• Usa <code>sudo</code> delante del comando para tareas de admin.\n"
        + "• Ej: <code>sudo apt install vlc</code> pedirá tu contraseña.\n"
        + "• Al escribir la contraseña no se ve nada: es normal." }
  ],

  intermedio: [
    { titulo: "Gestión de paquetes con APT",
      contenido:
        "APT es el gestor de paquetes de Mint:\n\n"
        + "• <code>sudo apt update</code> — actualiza la lista.\n"
        + "• <code>sudo apt upgrade</code> — actualiza programas.\n"
        + "• <code>sudo apt install nombre</code> — instala.\n"
        + "• <code>sudo apt remove nombre</code> — desinstala.\n"
        + "• <code>sudo apt autoremove</code> — limpia huérfanos." },
    { titulo: "Permisos de archivos (chmod, chown)",
      contenido:
        "Permisos para propietario (u), grupo (g) y otros (o).\n"
        + "lectura=4, escritura=2, ejecución=1.\n\n"
        + "• <code>ls -l</code> — muestra permisos.\n"
        + "• <code>chmod 755 archivo</code> — asigna por números.\n"
        + "• <code>chmod +x script.sh</code> — hace ejecutable.\n"
        + "• <code>sudo chown usuario:grupo archivo</code> — cambia dueño." },
    { titulo: "Manejo de archivos por terminal",
      contenido:
        "• <code>cp origen destino</code> — copiar (-r para carpetas).\n"
        + "• <code>mv origen destino</code> — mover o renombrar.\n"
        + "• <code>rm archivo</code> — borrar (¡sin papelera!).\n"
        + "• <code>mkdir carpeta</code> — crear carpeta.\n"
        + "• <code>find . -name \"*.txt\"</code> — buscar archivos." },
    { titulo: "Editar texto en terminal (nano)",
      contenido:
        "nano es un editor sencillo en terminal:\n\n"
        + "• <code>nano archivo.txt</code> — abre/crea.\n"
        + "• Ctrl+O — guardar. Ctrl+X — salir.\n"
        + "• Ctrl+W — buscar.\n"
        + "• Para archivos del sistema: <code>sudo nano /ruta</code>." },
    { titulo: "Tuberías y redirección (| > >>)",
      contenido:
        "Combina comandos:\n\n"
        + "• <code>|</code> pasa la salida a otro comando: <code>ls -l | grep .txt</code>.\n"
        + "• <code>></code> guarda en archivo (sobrescribe): <code>ls > lista.txt</code>.\n"
        + "• <code>>></code> añade al final.\n"
        + "• <code>grep texto archivo</code> — busca líneas." },
    { titulo: "Procesos y rendimiento",
      contenido:
        "• <code>top</code> / <code>htop</code> — monitor en vivo.\n"
        + "• <code>ps aux</code> — lista procesos.\n"
        + "• <code>kill PID</code> — termina un proceso.\n"
        + "• <code>df -h</code> — espacio en disco.\n"
        + "• <code>free -h</code> — uso de RAM." },
    { titulo: "Repositorios y PPAs",
      contenido:
        "Los programas vienen de «repositorios»:\n\n"
        + "• Repos oficiales en «Orígenes de software».\n"
        + "• <code>sudo add-apt-repository ppa:nombre/ppa</code> — añade un PPA.\n"
        + "• Luego <code>sudo apt update</code> e instala.\n"
        + "• Mint también soporta Flatpak." }
  ],

  avanzado: [
    { titulo: "Scripting en Bash",
      contenido:
        "Automatiza tareas con scripts:\n\n"
        + "<code>#!/bin/bash</code> (shebang)\n"
        + "<code>echo \"Hola $USER\"</code>\n\n"
        + "1. <code>nano backup.sh</code>\n"
        + "2. <code>chmod +x backup.sh</code>\n"
        + "3. <code>./backup.sh</code>\n\n"
        + "Usa variables, <code>if/else</code>, <code>for</code>, <code>while</code> y argumentos <code>$1</code>." },
    { titulo: "Servicios con systemd",
      contenido:
        "• <code>systemctl status servicio</code> — estado.\n"
        + "• <code>sudo systemctl start/stop/restart servicio</code>.\n"
        + "• <code>sudo systemctl enable servicio</code> — al arrancar.\n"
        + "• <code>journalctl -u servicio</code> — logs del servicio." },
    { titulo: "Tareas programadas con cron",
      contenido:
        "• <code>crontab -e</code> — edita tus tareas.\n"
        + "• Formato: <code>min hora día mes díaSemana comando</code>.\n"
        + "   Ej: <code>0 3 * * * /home/user/backup.sh</code> (cada día 03:00).\n"
        + "• <code>crontab -l</code> — lista tareas." },
    { titulo: "Redes y diagnóstico",
      contenido:
        "• <code>ip a</code> — interfaces e IPs.\n"
        + "• <code>ping host</code> — conectividad.\n"
        + "• <code>ss -tuln</code> — puertos en escucha.\n"
        + "• <code>ssh usuario@host</code> — conexión remota.\n"
        + "• <code>scp archivo usuario@host:/ruta</code> — copiar por SSH." },
    { titulo: "Firewall con UFW",
      contenido:
        "• <code>sudo ufw enable</code> — activar.\n"
        + "• <code>sudo ufw status verbose</code> — ver reglas.\n"
        + "• <code>sudo ufw allow 22</code> — permitir puerto.\n"
        + "• <code>sudo ufw deny 23</code> — bloquear puerto." },
    { titulo: "Discos, particiones y montaje",
      contenido:
        "• <code>lsblk</code> — discos y particiones.\n"
        + "• <code>sudo mount /dev/sdb1 /mnt</code> — montar.\n"
        + "• <code>sudo umount /mnt</code> — desmontar.\n"
        + "• <code>/etc/fstab</code> — montajes automáticos.\n"
        + "• <code>du -sh carpeta</code> — tamaño." },
    { titulo: "Copias de seguridad con rsync",
      contenido:
        "• <code>rsync -av origen/ destino/</code> — copia con atributos.\n"
        + "• <code>rsync -av --delete origen/ destino/</code> — espeja.\n"
        + "• <code>rsync -avz origen/ user@host:/ruta/</code> — remota.\n\n"
        + "Combínalo con cron para backups automáticos." }
  ]
};

/* ------------------------------------------------------------
   QUIZZES: preguntas por nivel.
   Cada pregunta: { tema, pregunta, opciones[], correcta (índice) }.
   "tema" se usa para sugerir qué repasar al fallar.
   ------------------------------------------------------------ */
const QUIZZES = {
  principiante: [
    { tema: "Terminal básica", pregunta: "¿Qué comando muestra la carpeta en la que estás?",
      opciones: ["ls", "pwd", "cd", "dir"], correcta: 1 },
    { tema: "Terminal básica", pregunta: "¿Qué comando lista los archivos de una carpeta?",
      opciones: ["ls", "list", "show", "open"], correcta: 0 },
    { tema: "Permisos (sudo)", pregunta: "Para ejecutar una tarea de administrador usas...",
      opciones: ["admin", "root!", "sudo", "super"], correcta: 2 },
    { tema: "Actualizaciones", pregunta: "¿Qué comando refresca la lista de paquetes?",
      opciones: ["apt upgrade", "apt update", "apt refresh", "apt list"], correcta: 1 },
    { tema: "Sistema de archivos", pregunta: "La carpeta personal del usuario suele ser...",
      opciones: ["C:/Users", "/root", "/home/usuario", "/usr"], correcta: 2 }
  ],
  intermedio: [
    { tema: "APT", pregunta: "¿Qué comando instala un paquete?",
      opciones: ["apt get nombre", "sudo apt install nombre", "apt add nombre", "install nombre"], correcta: 1 },
    { tema: "Permisos", pregunta: "<code>chmod +x script.sh</code> sirve para...",
      opciones: ["Borrar el script", "Hacerlo ejecutable", "Cambiar el dueño", "Comprimirlo"], correcta: 1 },
    { tema: "Redirección", pregunta: "¿Qué hace <code>ls > lista.txt</code>?",
      opciones: ["Lee lista.txt", "Añade al final", "Guarda la salida sobrescribiendo", "Borra lista.txt"], correcta: 2 },
    { tema: "Procesos", pregunta: "¿Qué comando muestra el espacio libre en disco?",
      opciones: ["free -h", "df -h", "du", "top"], correcta: 1 },
    { tema: "Tuberías", pregunta: "El símbolo <code>|</code> sirve para...",
      opciones: ["Comentar", "Pasar la salida de un comando a otro", "Crear archivos", "Cerrar la terminal"], correcta: 1 }
  ],
  avanzado: [
    { tema: "Bash scripting", pregunta: "La primera línea de un script bash suele ser...",
      opciones: ["#!/bin/bash", "// bash", "<bash>", "import bash"], correcta: 0 },
    { tema: "systemd", pregunta: "Para que un servicio arranque con el sistema usas...",
      opciones: ["systemctl start", "systemctl enable", "systemctl run", "service on"], correcta: 1 },
    { tema: "cron", pregunta: "¿Con qué editas tus tareas programadas de usuario?",
      opciones: ["cron -e", "crontab -e", "crontab -l", "systemctl cron"], correcta: 1 },
    { tema: "Firewall UFW", pregunta: "¿Qué permite el puerto 22 (SSH)?",
      opciones: ["ufw deny 22", "ufw open 22", "ufw allow 22", "ufw ssh on"], correcta: 2 },
    { tema: "rsync", pregunta: "¿Qué opción de rsync espeja borrando lo que no está en origen?",
      opciones: ["--mirror", "--delete", "--sync", "--force"], correcta: 1 }
  ]
};

/* ------------------------------------------------------------
   CATÁLOGO DE LOGROS / INSIGNIAS
   Cada logro: { id, icono, titulo, desc, condicion(estado) }.
   La función condicion recibe un objeto con métricas y devuelve
   true si el logro está desbloqueado.
   ------------------------------------------------------------ */
const LOGROS = [
  { id: "primera_nota", icono: "📝", titulo: "Primer paso", desc: "Crea tu primera nota.",
    condicion: m => m.totalNotas >= 1 },
  { id: "diez_notas", icono: "✍️", titulo: "Tomador de notas", desc: "Crea 10 notas.",
    condicion: m => m.totalNotas >= 10 },
  { id: "usa_etiquetas", icono: "🏷️", titulo: "Organizado", desc: "Usa al menos una etiqueta.",
    condicion: m => m.totalEtiquetas >= 1 },
  { id: "explora_niveles", icono: "🧭", titulo: "Explorador", desc: "Crea notas en los 3 niveles.",
    condicion: m => m.nivelesConNotas >= 3 },
  { id: "maestro_terminal", icono: "💻", titulo: "Maestro de la terminal", desc: "Ejecuta 10 comandos en la terminal de práctica.",
    condicion: m => m.comandosTerminal >= 10 },
  { id: "primer_quiz", icono: "🎯", titulo: "Autoevaluado", desc: "Completa un quiz.",
    condicion: m => m.quizzesHechos >= 1 },
  { id: "quiz_perfecto", icono: "🌟", titulo: "Puntuación perfecta", desc: "Saca 100% en un quiz.",
    condicion: m => m.quizPerfecto },
  { id: "nivel_completo", icono: "🏅", titulo: "Nivel dominado", desc: "Cubre todos los temas de un nivel.",
    condicion: m => m.algunNivelCompleto },

  /* ---- Logros de la Academia (módulos y lecciones) ---- */
  { id: "primera_leccion", icono: "📖", titulo: "Estudiante", desc: "Completa tu primera lección.",
    condicion: m => m.leccionesCompletadas >= 1 },
  { id: "tema_completado", icono: "✅", titulo: "Tema completado", desc: "Completa 5 lecciones.",
    condicion: m => m.leccionesCompletadas >= 5 },
  { id: "veinte_lecciones", icono: "📚", titulo: "Devorador de cursos", desc: "Completa 20 lecciones.",
    condicion: m => m.leccionesCompletadas >= 20 },
  { id: "primer_modulo", icono: "🎓", titulo: "Módulo dominado", desc: "Completa un módulo entero.",
    condicion: m => m.modulosCompletados >= 1 },
  { id: "primer_script", icono: "📜", titulo: "Primer script en Bash", desc: "Completa una lección de Bash.",
    condicion: m => m.leccionBash },
  { id: "hola_python", icono: "🐍", titulo: "Hola Mundo en Python", desc: "Completa una lección de Python.",
    condicion: m => m.leccionPython },
  { id: "etica_primero", icono: "⚖️", titulo: "Ética primero", desc: "Completa el módulo de ética del hacking.",
    condicion: m => m.eticaCompletada },
  { id: "nmap_lab", icono: "🛡️", titulo: "Maestro de Nmap (lab)", desc: "Completa la lección de herramientas de seguridad.",
    condicion: m => m.leccionHerramientas },
  { id: "cien_palabras", icono: "🌐", titulo: "100 palabras en inglés", desc: "Repasa 20 flashcards de inglés.",
    condicion: m => m.flashcardsVistas >= 20 },

  /* ---- Gamificación: rachas, XP y certificados ---- */
  { id: "racha_3", icono: "🔥", titulo: "En racha", desc: "Estudia 3 días seguidos.",
    condicion: m => m.racha >= 3 },
  { id: "nivel_xp_5", icono: "⭐", titulo: "Nivel 5", desc: "Alcanza el nivel global 5.",
    condicion: m => m.nivelGlobal >= 5 },
  { id: "primer_certificado", icono: "📜", titulo: "Certificado", desc: "Desbloquea tu primer certificado.",
    condicion: m => m.modulosCompletados >= 1 },

  /* ---- Logros de comandos y hacking profesional ---- */
  { id: "caja_herramientas", icono: "🧰", titulo: "Caja de herramientas", desc: "Guarda 10 comandos en favoritos.",
    condicion: m => m.comandosFavoritos >= 10 },
  { id: "metodologo", icono: "🧪", titulo: "Metodólogo", desc: "Completa la lección de metodología de pentesting.",
    condicion: m => m.metodologiaCompletada },
  { id: "pentester_pro", icono: "🛡️", titulo: "Pentester en formación", desc: "Completa todo el módulo de Hacking Ético.",
    condicion: m => m.hackingCompleto },

  /* ---- Features de enganche: retos, misiones y proyectos ---- */
  { id: "reto_constante", icono: "📅", titulo: "Constante", desc: "Completa 3 retos diarios.",
    condicion: m => (m.retosDiarios || 0) >= 3 },
  { id: "misionero", icono: "🧭", titulo: "Misionero de la terminal", desc: "Completa 3 misiones en la terminal.",
    condicion: m => (m.misionesTerminal || 0) >= 3 },
  { id: "constructor", icono: "🏗️", titulo: "Manos a la obra", desc: "Completa tu primer proyecto práctico.",
    condicion: m => (m.proyectosCompletados || 0) >= 1 }
];
