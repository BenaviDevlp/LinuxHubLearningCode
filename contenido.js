/* ============================================================
   CONTENIDO EDUCATIVO (contenido.js)
   - MODULOS: metadatos de cada módulo/curso.
   - LECCIONES: lecciones docentes por módulo. Cada lección tiene
     secciones: concepto, ejemplos, codigo, errores, tips, resumen,
     preguntas (preguntas de repaso).
   - INGLES: datos del módulo de inglés técnico (vocabulario,
     frases, lectura, ejercicios, flashcards).
   Globales usadas por app.js.
   ============================================================ */

/* Lista de módulos. "cert" = nombre que aparecerá en el certificado.
   "especial" marca módulos con vista propia (ej: inglés). */
const MODULOS = [
  { id: "linux-principiante", nombre: "Linux · Principiante", icono: "🌱",
    desc: "Primeros pasos: qué es Linux, el escritorio de Mint, archivos, terminal, software y permisos.", cert: "Linux Mint — Nivel Principiante" },
  { id: "linux-intermedio", nombre: "Linux · Intermedio", icono: "⚙️",
    desc: "Usuarios y permisos, procesos, pipes, editores, variables de entorno, paquetes y discos.", cert: "Linux Mint — Nivel Intermedio" },
  { id: "linux-avanzado", nombre: "Linux · Avanzado", icono: "🚀",
    desc: "systemd, cron, redes, SSH, logs y hardening básico del sistema.", cert: "Linux Mint — Nivel Avanzado" },
  { id: "bash", nombre: "Bash Scripting", icono: "📜",
    desc: "Automatiza tareas: shebang, variables, condicionales, bucles, funciones y scripts reales.", cert: "Bash Scripting" },
  { id: "python", nombre: "Python desde cero", icono: "🐍",
    desc: "Tipos, control de flujo, listas/diccionarios, funciones, archivos, errores y automatización en Linux.", cert: "Python desde cero" },
  { id: "hacking", nombre: "Hacking Ético", icono: "🛡️",
    desc: "Ciberseguridad legal y profesional: ética, metodología, OWASP, herramientas y defensa.", cert: "Hacking Ético y Ciberseguridad" },
  { id: "ingles", nombre: "Inglés Técnico", icono: "🌐", especial: "ingles",
    desc: "Inglés aplicado a Linux y seguridad: vocabulario, frases, lectura, ejercicios y flashcards.", cert: "Inglés Técnico para IT" }
];

/* ============================================================
   LECCIONES
   ============================================================ */
const LECCIONES = {

  /* ---------------- LINUX PRINCIPIANTE ---------------- */
  "linux-principiante": [
    {
      id: "lxp-1", titulo: "¿Qué es Linux y qué es una distribución?",
      concepto:
        "Linux es el núcleo (kernel) de un sistema operativo libre y de código abierto creado por Linus Torvalds en 1991. "
        + "El kernel es la pieza que habla con el hardware (CPU, memoria, discos). Por sí solo no se usa: se combina con programas, "
        + "un escritorio y herramientas para formar una «distribución» (distro).\n\n"
        + "Linux Mint es una distro basada en Ubuntu (que a su vez se basa en Debian). Es famosa por ser estable, ligera y "
        + "amigable para quien viene de Windows. Piensa en el kernel como el motor de un coche y en la distro como el coche completo, "
        + "listo para conducir.",
      ejemplos:
        "• Distros populares: Ubuntu, Debian, Fedora, Arch, y Linux Mint.\n"
        + "• Linux está en todas partes: servidores web, Android, routers, la mayoría de supercomputadoras y la nube.\n"
        + "• Mint ofrece tres «sabores» de escritorio: Cinnamon (recomendado), MATE y XFCE (el más ligero).",
      codigo:
        "# Ver qué versión de Linux Mint tienes instalada\n"
        + "lsb_release -a\n\n"
        + "# Ver información del kernel\n"
        + "uname -r",
      errores: [
        "Creer que «Linux» y «Ubuntu/Mint» son lo mismo: Linux es el kernel; la distro es el sistema completo.",
        "Pensar que en Linux no hay software: hay miles de programas gratuitos en el gestor de software."
      ],
      tips: [
        "Si tu equipo es antiguo, prueba el escritorio XFCE; rinde muy bien con pocos recursos.",
        "Empieza siempre con la versión LTS (soporte a largo plazo): es la más estable."
      ],
      resumen:
        "Linux es el kernel; una distribución como Linux Mint añade escritorio y programas para crear un sistema usable. "
        + "Mint es ideal para empezar por su estabilidad y facilidad.",
      preguntas: [
        "¿Cuál es la diferencia entre el kernel Linux y una distribución?",
        "¿En qué distribución se basa Linux Mint?",
        "¿Qué escritorio de Mint recomendarías para un equipo con pocos recursos?"
      ]
    },
    {
      id: "lxp-2", titulo: "El escritorio de Linux Mint (Cinnamon)",
      concepto:
        "El escritorio es la capa visual con la que interactúas. Cinnamon, el escritorio estrella de Mint, está pensado para "
        + "resultar familiar a usuarios de Windows. Sus partes clave son: el panel inferior (barra de tareas), el menú de aplicaciones "
        + "(equivalente al botón Inicio), el área de notificaciones con el reloj, y los espacios de trabajo (escritorios virtuales).",
      ejemplos:
        "• Abrir el menú: clic en el icono inferior izquierdo o tecla Súper (Windows).\n"
        + "• Fijar una app al panel: clic derecho sobre ella en el menú → «Añadir al panel».\n"
        + "• Cambiar el fondo, temas y applets: «Configuración del sistema».",
      codigo:
        "# Atajos de teclado útiles en Cinnamon:\n"
        + "Ctrl + Alt + T     -> abrir la terminal\n"
        + "Super (Windows)    -> abrir el menú\n"
        + "Ctrl + Alt + Flechas -> cambiar de espacio de trabajo",
      errores: [
        "Buscar el menú en la esquina superior: en Cinnamon está abajo a la izquierda por defecto.",
        "Instalar temas de fuentes no oficiales que rompen la apariencia del sistema."
      ],
      tips: [
        "Los «applets» añaden funciones al panel (clima, monitor de CPU). Explóralos en Configuración → Applets.",
        "Usa varios espacios de trabajo para separar tareas (uno para navegar, otro para programar)."
      ],
      resumen:
        "Cinnamon ofrece un escritorio familiar y personalizable. Domina el menú, el panel y los espacios de trabajo para moverte con soltura.",
      preguntas: [
        "¿Qué tecla abre el menú de aplicaciones?",
        "¿Para qué sirven los espacios de trabajo?",
        "¿Dónde personalizas temas y fondos?"
      ]
    },
    {
      id: "lxp-3", titulo: "El sistema de archivos de Linux",
      concepto:
        "En Windows hay unidades como C: o D:. En Linux todo cuelga de una única raíz llamada «/». Las carpetas importantes son: "
        + "/home (tus archivos personales), /etc (configuración del sistema), /bin y /usr/bin (programas), /var (logs y datos variables), "
        + "y /tmp (temporales). Tu carpeta personal es /home/tu_usuario, abreviada como «~».",
      ejemplos:
        "• /home/ana/Documentos — documentos de la usuaria ana.\n"
        + "• /etc/hosts — archivo de configuración de nombres de red.\n"
        + "• Archivos ocultos empiezan por punto (.bashrc) y se ven con Ctrl+H en el explorador.",
      codigo:
        "# Ir a tu carpeta personal y listar su contenido\n"
        + "cd ~\n"
        + "ls -la   # -l detalle, -a incluye ocultos\n\n"
        + "# Ver el árbol desde la raíz\n"
        + "ls /",
      errores: [
        "Intentar borrar o editar archivos de /etc sin entender qué hacen: puede dejar el sistema inestable.",
        "Confundir mayúsculas y minúsculas: en Linux «Archivo.txt» y «archivo.txt» son distintos."
      ],
      tips: [
        "Tu zona segura para practicar es /home/tu_usuario. Evita tocar el sistema hasta tener más nivel.",
        "El símbolo ~ siempre apunta a tu carpeta personal, escribas donde escribas."
      ],
      resumen:
        "Linux organiza todo bajo la raíz /. Conoce /home, /etc, /var y /tmp, y recuerda que el sistema distingue mayúsculas de minúsculas.",
      preguntas: [
        "¿Qué representa el símbolo ~ ?",
        "¿En qué carpeta se guarda la configuración del sistema?",
        "¿Cómo se muestran los archivos ocultos en el explorador?"
      ]
    },
    {
      id: "lxp-4", titulo: "Terminal básica: ls, cd, pwd, mkdir, cp, mv, rm",
      concepto:
        "La terminal te permite controlar el sistema escribiendo comandos. Es más rápida y potente que el ratón una vez la dominas. "
        + "Un comando suele tener la forma: «comando -opciones argumentos». Empezaremos por los comandos de navegación y manejo de archivos.",
      ejemplos:
        "• pwd — muestra la carpeta actual (Print Working Directory).\n"
        + "• ls — lista archivos; ls -l da detalle, ls -a muestra ocultos.\n"
        + "• cd carpeta — entra; cd .. sube un nivel; cd ~ va a tu casa.\n"
        + "• mkdir proyectos — crea una carpeta.\n"
        + "• cp archivo copia.txt — copia; cp -r para carpetas.\n"
        + "• mv viejo.txt nuevo.txt — mueve o renombra.\n"
        + "• rm archivo.txt — borra (¡sin papelera!); rm -r carpeta para carpetas.",
      codigo:
        "# Crear una estructura de práctica paso a paso\n"
        + "cd ~                 # ir a la carpeta personal\n"
        + "mkdir practica       # crear carpeta\n"
        + "cd practica          # entrar en ella\n"
        + "echo \"hola\" > saludo.txt   # crear un archivo con texto\n"
        + "cp saludo.txt copia.txt     # copiarlo\n"
        + "mv copia.txt backup.txt     # renombrarlo\n"
        + "ls -l                # ver el resultado\n"
        + "rm backup.txt        # borrar el backup",
      errores: [
        "Usar rm -rf sin pensar: borra todo sin confirmación y NO hay papelera. Revisa siempre la ruta.",
        "Olvidar las comillas en nombres con espacios: usa \"mi archivo.txt\" o escapa el espacio."
      ],
      tips: [
        "Pulsa Tab para autocompletar nombres de archivos y carpetas; ahorra tiempo y evita errores.",
        "Usa la flecha arriba para repetir comandos anteriores."
      ],
      resumen:
        "Con pwd, ls, cd, mkdir, cp, mv y rm ya puedes navegar y gestionar archivos por terminal. Practica en ~/practica sin miedo.",
      preguntas: [
        "¿Qué comando renombra un archivo?",
        "¿Por qué hay que tener cuidado con rm -rf?",
        "¿Para qué sirve la tecla Tab en la terminal?"
      ]
    },
    {
      id: "lxp-5", titulo: "Instalar software: APT y el Gestor de programas",
      concepto:
        "En Linux el software se instala desde «repositorios» (almacenes oficiales de programas verificados). Esto es más seguro que "
        + "descargar instaladores sueltos de internet. Puedes usar la app gráfica «Gestor de programas» o el comando APT en la terminal.",
      ejemplos:
        "• Gestor de programas: buscar «VLC» → Instalar.\n"
        + "• APT instala también las dependencias (otros programas que necesita) automáticamente.\n"
        + "• Formatos modernos: además de APT, Mint soporta Flatpak para apps aisladas y siempre actualizadas.",
      codigo:
        "# Flujo típico con APT (necesita sudo = permisos de admin)\n"
        + "sudo apt update          # refresca la lista de paquetes\n"
        + "sudo apt install vlc     # instala el reproductor VLC\n"
        + "sudo apt remove vlc      # lo desinstala\n"
        + "sudo apt upgrade         # actualiza todo el software\n"
        + "apt search editor        # busca paquetes relacionados",
      errores: [
        "Ejecutar «apt install» sin «sudo»: dará error de permisos.",
        "Olvidar «apt update» antes de instalar: puede que no encuentre la última versión."
      ],
      tips: [
        "«sudo apt update && sudo apt upgrade» es la rutina de mantenimiento semanal recomendada.",
        "Si una app no está en los repos, busca su versión Flatpak antes que un .deb suelto."
      ],
      resumen:
        "Instala software desde repositorios con el Gestor de programas o APT. APT resuelve dependencias y mantiene el sistema seguro y actualizado.",
      preguntas: [
        "¿Por qué es más seguro instalar desde repositorios?",
        "¿Qué hace «sudo apt update»?",
        "¿Qué es Flatpak?"
      ]
    },
    {
      id: "lxp-6", titulo: "Permisos básicos y el rol de sudo",
      concepto:
        "Linux es multiusuario y muy cuidadoso con la seguridad. Tu usuario normal no puede modificar el sistema para evitar daños "
        + "accidentales o de malware. Cuando necesitas privilegios de administrador (root), antepones «sudo» al comando. Cada archivo "
        + "tiene un propietario y permisos de lectura (r), escritura (w) y ejecución (x).",
      ejemplos:
        "• ls -l muestra algo como: -rw-r--r-- 1 ana ana 1200 ene 10 archivo.txt\n"
        + "• Esos primeros caracteres indican el tipo y los permisos para propietario, grupo y otros.\n"
        + "• sudo te «presta» permisos de administrador solo para ese comando.",
      codigo:
        "# Ver permisos\n"
        + "ls -l archivo.txt\n\n"
        + "# Ejecutar una tarea de administrador\n"
        + "sudo apt install gimp\n"
        + "# Al escribir la contraseña no se ve nada en pantalla: es normal y seguro.",
      errores: [
        "Usar «sudo» para todo «por si acaso»: solo úsalo cuando de verdad haga falta.",
        "Asustarse porque la contraseña no aparece al teclear: Linux la oculta a propósito."
      ],
      tips: [
        "Nunca ejecutes comandos con sudo copiados de webs sin entender qué hacen.",
        "El usuario root es muy poderoso: por eso Mint lo mantiene bloqueado y usa sudo en su lugar."
      ],
      resumen:
        "El modelo de permisos protege el sistema. Usa sudo solo para tareas de administración y comprende los permisos r, w, x de los archivos.",
      preguntas: [
        "¿Qué significan las letras r, w y x?",
        "¿Por qué no se ve la contraseña al usar sudo?",
        "¿Cuándo deberías usar sudo?"
      ]
    }
  ]
};

/* ---------------- LINUX INTERMEDIO ---------------- */
LECCIONES["linux-intermedio"] = [
  {
    id: "lxi-1", titulo: "Usuarios, grupos y permisos (chmod, chown)",
    concepto:
      "Cada archivo pertenece a un usuario y a un grupo, y define permisos para tres categorías: propietario (u), grupo (g) y otros (o). "
      + "Los permisos son lectura (r=4), escritura (w=2) y ejecución (x=1). Se pueden expresar en modo simbólico (u+x) o numérico (755). "
      + "chmod cambia permisos; chown cambia el propietario.",
    ejemplos:
      "• 755 = rwxr-xr-x: el dueño puede todo (7), grupo y otros solo leer y ejecutar (5).\n"
      + "• 644 = rw-r--r--: típico de archivos de datos (el dueño lee/escribe, el resto solo lee).\n"
      + "• Para que un script se pueda ejecutar necesita el permiso x.",
    codigo:
      "# Cambiar permisos en modo numérico y simbólico\n"
      + "chmod 755 script.sh      # rwx r-x r-x\n"
      + "chmod +x script.sh       # añade ejecución a todos\n"
      + "chmod u+w,o-r datos.txt  # añade escritura al dueño, quita lectura a otros\n\n"
      + "# Cambiar propietario y grupo (requiere sudo)\n"
      + "sudo chown ana:desarrollo proyecto/\n"
      + "sudo chown -R ana carpeta/   # -R aplica recursivamente",
    errores: [
      "Usar chmod 777 «para que funcione»: da permisos totales a cualquiera; es un riesgo de seguridad grave.",
      "Olvidar -R al cambiar permisos/propietario de una carpeta con contenido."
    ],
    tips: [
      "Regla mental: suma 4(r)+2(w)+1(x). Así 6=rw, 5=rx, 7=rwx.",
      "Para archivos web/datos usa 644 y para carpetas 755; reserva 777 casi nunca."
    ],
    resumen:
      "Domina chmod (permisos) y chown (propietario). Usa los números 4/2/1 y evita el peligroso 777.",
    preguntas: [
      "¿Qué permisos otorga el número 644?",
      "¿Qué hace la opción -R en chown?",
      "¿Por qué es peligroso chmod 777?"
    ]
  },
  {
    id: "lxi-2", titulo: "Procesos: ps, top, kill",
    concepto:
      "Un proceso es un programa en ejecución. Cada uno tiene un identificador único (PID). Linux te permite ver, priorizar y terminar "
      + "procesos. Esto es vital cuando una app se cuelga o consume demasiados recursos.",
    ejemplos:
      "• ps aux — lista todos los procesos con usuario, CPU y memoria.\n"
      + "• top o htop — monitor interactivo en tiempo real.\n"
      + "• kill PID — pide cerrar un proceso; kill -9 PID lo fuerza.",
    codigo:
      "# Encontrar y cerrar un proceso que se colgó\n"
      + "ps aux | grep firefox     # buscar el PID de firefox\n"
      + "kill 4521                 # cierre ordenado (señal TERM)\n"
      + "kill -9 4521              # cierre forzado (señal KILL) si no responde\n\n"
      + "# Monitor en vivo (pulsa q para salir)\n"
      + "top",
    errores: [
      "Usar siempre kill -9: impide que el programa guarde datos; prueba primero kill normal.",
      "Matar procesos del sistema por error: si no sabes qué es, no lo cierres."
    ],
    tips: [
      "Instala htop (sudo apt install htop): es como top pero más visual y fácil de usar.",
      "En htop puedes filtrar con F4 y matar procesos con F9 sin recordar el PID."
    ],
    resumen:
      "Con ps y top/htop ves los procesos; con kill los terminas. Prefiere el cierre ordenado y reserva kill -9 para emergencias.",
    preguntas: [
      "¿Qué es un PID?",
      "¿Qué diferencia hay entre kill y kill -9?",
      "¿Qué herramienta visual recomendarías para ver procesos?"
    ]
  },
  {
    id: "lxi-3", titulo: "Redirecciones y tuberías (>, >>, |)",
    concepto:
      "Cada comando tiene una entrada estándar (teclado), una salida estándar (pantalla) y una salida de error. Puedes redirigir estas "
      + "corrientes a archivos o encadenar comandos. Esto convierte comandos sencillos en herramientas potentes combinadas.",
    ejemplos:
      "• > guarda la salida en un archivo (lo sobrescribe).\n"
      + "• >> añade al final sin borrar.\n"
      + "• | (pipe) envía la salida de un comando como entrada de otro.\n"
      + "• 2> redirige los errores.",
    codigo:
      "# Redirección a archivos\n"
      + "ls -l > listado.txt      # guarda (sobrescribe)\n"
      + "echo \"nueva linea\" >> listado.txt   # añade al final\n\n"
      + "# Tuberías: contar cuántos procesos de chrome hay\n"
      + "ps aux | grep chrome | wc -l\n\n"
      + "# Ver los 5 archivos más grandes de una carpeta\n"
      + "du -ah . | sort -rh | head -n 5",
    errores: [
      "Confundir > con >>: > borra el contenido previo del archivo.",
      "Esperar que grep encuentre algo con mayúsculas/minúsculas distintas: usa grep -i para ignorar caso."
    ],
    tips: [
      "Combina grep, sort, head y wc con pipes para analizar datos sin programar.",
      "grep -i ignora mayúsculas; grep -v invierte (muestra lo que NO coincide)."
    ],
    resumen:
      "Las redirecciones (>, >>, 2>) y las tuberías (|) te dejan encadenar comandos y procesar texto de forma profesional.",
    preguntas: [
      "¿Qué diferencia hay entre > y >> ?",
      "¿Qué hace el símbolo | ?",
      "¿Cómo cuentas líneas con wc?"
    ]
  },
  {
    id: "lxi-4", titulo: "Editar archivos en terminal: nano y vim",
    concepto:
      "Para editar configuraciones desde la terminal necesitas un editor de texto. nano es sencillo e ideal para empezar. vim es muy "
      + "potente pero tiene curva de aprendizaje por sus «modos». Ambos vienen en casi cualquier Linux, incluso en servidores sin escritorio.",
    ejemplos:
      "• nano archivo.conf — edita; los atajos aparecen abajo (^ significa Ctrl).\n"
      + "• vim archivo.conf — se abre en modo normal; pulsa i para escribir (modo inserción).\n"
      + "• En vim, Esc vuelve a modo normal y :wq guarda y sale.",
    codigo:
      "# nano: lo esencial\n"
      + "nano notas.txt\n"
      + "# Ctrl+O guardar, Enter confirmar, Ctrl+X salir, Ctrl+W buscar\n\n"
      + "# vim: supervivencia básica\n"
      + "vim notas.txt\n"
      + "# i = insertar | Esc = salir de inserción | :w guardar | :q salir | :wq ambos | :q! salir sin guardar",
    errores: [
      "Quedarse «atrapado» en vim: pulsa Esc y escribe :q! para salir sin guardar.",
      "Editar archivos de /etc sin sudo: no podrás guardar los cambios."
    ],
    tips: [
      "Empieza con nano para el día a día; aprende vim poco a poco, te hará más rápido en servidores.",
      "Antes de editar un archivo importante, haz una copia: cp archivo archivo.bak"
    ],
    resumen:
      "nano es fácil y directo; vim es potente con modos. Saber salir de vim (Esc + :q!) es un clásico imprescindible.",
    preguntas: [
      "¿Cómo se guarda y sale en nano?",
      "¿Cómo sales de vim sin guardar?",
      "¿Por qué conviene hacer una copia .bak antes de editar?"
    ]
  },
  {
    id: "lxi-5", titulo: "Variables de entorno",
    concepto:
      "Las variables de entorno son valores que el sistema y los programas consultan, como PATH (dónde buscar comandos), HOME (tu carpeta) "
      + "o LANG (idioma). Puedes verlas, crear las tuyas y hacerlas permanentes editando ~/.bashrc.",
    ejemplos:
      "• echo $HOME muestra tu carpeta personal.\n"
      + "• $PATH es la lista de carpetas donde el sistema busca los comandos.\n"
      + "• export crea una variable disponible para los programas que lances.",
    codigo:
      "# Ver variables\n"
      + "echo $HOME\n"
      + "echo $PATH\n"
      + "printenv          # lista todas\n\n"
      + "# Crear una variable temporal (solo en esta terminal)\n"
      + "export PROYECTO=/home/ana/proyectos\n"
      + "echo $PROYECTO\n\n"
      + "# Hacerla permanente: añadir la línea export al final de ~/.bashrc\n"
      + "echo 'export PROYECTO=/home/ana/proyectos' >> ~/.bashrc",
    errores: [
      "Modificar PATH borrando su valor anterior: usa export PATH=$PATH:/nueva/ruta para conservar lo existente.",
      "Esperar que una variable exportada en una terminal exista en otra: cada terminal es independiente hasta guardarla en .bashrc."
    ],
    tips: [
      "Tras editar ~/.bashrc, aplica los cambios con: source ~/.bashrc",
      "Las variables en MAYÚSCULAS son la convención para variables de entorno."
    ],
    resumen:
      "Las variables de entorno configuran el comportamiento del sistema. Conoce PATH y HOME, y usa ~/.bashrc para hacerlas permanentes.",
    preguntas: [
      "¿Qué contiene la variable PATH?",
      "¿Cómo haces permanente una variable?",
      "¿Qué comando recarga ~/.bashrc?"
    ]
  },
  {
    id: "lxi-6", titulo: "Gestión avanzada de paquetes y montaje de discos",
    concepto:
      "Más allá de instalar, APT permite limpiar, inspeccionar y reparar paquetes. Además, en Linux los dispositivos de almacenamiento "
      + "(USB, discos) se «montan» en una carpeta para acceder a ellos, y se «desmontan» antes de retirarlos.",
    ejemplos:
      "• apt autoremove elimina dependencias que ya no usa nadie.\n"
      + "• dpkg -l lista los paquetes instalados.\n"
      + "• lsblk muestra discos y particiones; mount/umount los conectan y desconectan.",
    codigo:
      "# Mantenimiento de paquetes\n"
      + "sudo apt autoremove      # limpia dependencias huérfanas\n"
      + "sudo apt --fix-broken install   # repara instalaciones a medias\n"
      + "dpkg -l | grep python    # ¿qué paquetes de python tengo?\n\n"
      + "# Discos y montaje\n"
      + "lsblk                    # ver discos y particiones\n"
      + "sudo mount /dev/sdb1 /mnt    # montar un USB en /mnt\n"
      + "sudo umount /mnt             # desmontar antes de quitarlo",
    errores: [
      "Retirar un USB sin desmontar: puedes corromper los datos. Usa umount o «expulsar».",
      "Montar en una carpeta con contenido: queda oculto temporalmente mientras esté montado."
    ],
    tips: [
      "El archivo /etc/fstab define montajes automáticos al arrancar; edítalo con cuidado y con copia previa.",
      "df -h te dice cuánto espacio libre hay en cada disco montado."
    ],
    resumen:
      "APT también limpia y repara; los discos se gestionan con lsblk, mount y umount. Desmonta siempre antes de retirar un dispositivo.",
    preguntas: [
      "¿Qué hace apt autoremove?",
      "¿Por qué hay que desmontar un USB antes de retirarlo?",
      "¿Qué muestra lsblk?"
    ]
  }
];

/* ---------------- LINUX AVANZADO ---------------- */
LECCIONES["linux-avanzado"] = [
  {
    id: "lxa-1", titulo: "systemd y gestión de servicios",
    concepto:
      "systemd es el sistema de inicio (init) de Mint moderno: arranca el sistema y gestiona los «servicios» o demonios (programas que "
      + "corren en segundo plano, como un servidor web o SSH). Se controla con systemctl, y los registros se ven con journalctl.",
    ejemplos:
      "• systemctl status ssh — estado del servicio SSH.\n"
      + "• enable hace que arranque con el sistema; start lo inicia ahora.\n"
      + "• journalctl centraliza los logs de todos los servicios.",
    codigo:
      "# Controlar un servicio (ejemplo: ssh)\n"
      + "systemctl status ssh\n"
      + "sudo systemctl start ssh      # iniciar ahora\n"
      + "sudo systemctl enable ssh     # iniciar en cada arranque\n"
      + "sudo systemctl restart ssh    # reiniciar\n"
      + "sudo systemctl disable ssh    # no arrancar al inicio\n\n"
      + "# Ver registros del servicio\n"
      + "journalctl -u ssh --no-pager | tail -n 20",
    errores: [
      "Confundir start con enable: start lo inicia ahora; enable lo deja activo en futuros arranques.",
      "No revisar journalctl cuando un servicio falla: ahí está casi siempre la causa."
    ],
    tips: [
      "systemctl list-units --type=service muestra todos los servicios activos.",
      "journalctl -f sigue los logs en tiempo real (como tail -f)."
    ],
    resumen:
      "systemd gestiona el arranque y los servicios con systemctl, y los logs con journalctl. Distingue start (ahora) de enable (al arrancar).",
    preguntas: [
      "¿Qué diferencia hay entre start y enable?",
      "¿Con qué comando ves los logs de un servicio?",
      "¿Qué es un demonio o servicio?"
    ]
  },
  {
    id: "lxa-2", titulo: "Tareas programadas con cron",
    concepto:
      "cron ejecuta comandos de forma automática y periódica: backups nocturnos, limpiezas, sincronizaciones. Cada usuario tiene su "
      + "«crontab» (tabla de tareas). La sintaxis define minuto, hora, día del mes, mes y día de la semana.",
    ejemplos:
      "• «0 3 * * *» = todos los días a las 03:00.\n"
      + "• «*/15 * * * *» = cada 15 minutos.\n"
      + "• «0 9 * * 1» = los lunes a las 09:00.",
    codigo:
      "# Editar tus tareas programadas\n"
      + "crontab -e\n\n"
      + "# Dentro del editor, una tarea por línea:\n"
      + "# min hora dia mes diaSemana   comando\n"
      + "0 3 * * *   /home/ana/backup.sh        # backup diario a las 3am\n"
      + "*/30 * * * * /home/ana/sync.sh          # cada 30 minutos\n\n"
      + "# Listar tus tareas\n"
      + "crontab -l",
    errores: [
      "Usar rutas relativas en los scripts de cron: cron no conoce tu carpeta actual, usa rutas absolutas.",
      "Olvidar dar permiso de ejecución (chmod +x) al script que llama cron."
    ],
    tips: [
      "Redirige la salida a un log para depurar: «... /backup.sh >> /home/ana/backup.log 2>&1».",
      "La web crontab.guru te ayuda a entender y crear expresiones cron."
    ],
    resumen:
      "cron automatiza tareas periódicas con su sintaxis de 5 campos. Usa rutas absolutas y registra la salida para depurar.",
    preguntas: [
      "¿Qué significa la expresión «0 3 * * *»?",
      "¿Por qué usar rutas absolutas en cron?",
      "¿Cómo listas tus tareas programadas?"
    ]
  },
  {
    id: "lxa-3", titulo: "Redes: ip, ping, ss, netstat",
    concepto:
      "Administrar redes implica conocer tu configuración (IP, puertas de enlace), comprobar conectividad y ver qué servicios escuchan en "
      + "qué puertos. Las herramientas modernas son ip y ss; netstat es la clásica equivalente.",
    ejemplos:
      "• ip a muestra tus interfaces e IPs.\n"
      + "• ping comprueba si llegas a un host.\n"
      + "• ss -tuln lista puertos en escucha (TCP/UDP).",
    codigo:
      "# Configuración de red\n"
      + "ip a                      # interfaces e IPs\n"
      + "ip route                  # tabla de rutas (puerta de enlace)\n\n"
      + "# Conectividad\n"
      + "ping -c 4 8.8.8.8         # 4 paquetes al DNS de Google\n\n"
      + "# Puertos y conexiones\n"
      + "ss -tuln                  # puertos TCP/UDP en escucha\n"
      + "ss -tp                    # conexiones con el proceso asociado",
    errores: [
      "Asumir que «no hay internet» cuando falla el DNS: prueba ping a una IP (8.8.8.8) y a un dominio (google.com) para distinguir.",
      "Usar netstat en sistemas nuevos donde no está instalado: aprende su reemplazo ss."
    ],
    tips: [
      "Si ping a la IP funciona pero al dominio no, el problema es de DNS.",
      "ss -tuln es la forma rápida de auditar qué puertos tienes abiertos."
    ],
    resumen:
      "Con ip, ping y ss diagnosticas la red: configuración, conectividad y puertos. Distinguir fallos de DNS de fallos de conexión es clave.",
    preguntas: [
      "¿Qué comando muestra tus interfaces e IPs?",
      "¿Cómo distingues un fallo de DNS de un fallo de conexión?",
      "¿Qué muestra ss -tuln?"
    ]
  },
  {
    id: "lxa-4", titulo: "SSH: acceso remoto seguro",
    concepto:
      "SSH (Secure Shell) permite controlar otro equipo por la red de forma cifrada. Es la base de la administración de servidores. "
      + "Puedes autenticarte con contraseña o, mejor, con un par de claves (pública/privada), más seguro y cómodo.",
    ejemplos:
      "• ssh usuario@servidor — abre una sesión remota.\n"
      + "• scp copia archivos por SSH.\n"
      + "• Las claves evitan teclear la contraseña y son más seguras.",
    codigo:
      "# Conexión básica\n"
      + "ssh ana@192.168.1.50\n\n"
      + "# Copiar archivos por SSH\n"
      + "scp informe.pdf ana@192.168.1.50:/home/ana/   # subir\n"
      + "scp ana@192.168.1.50:/home/ana/log.txt .       # descargar\n\n"
      + "# Autenticación por clave (recomendado)\n"
      + "ssh-keygen -t ed25519           # genera el par de claves\n"
      + "ssh-copy-id ana@192.168.1.50    # instala tu clave pública en el servidor",
    errores: [
      "Dejar el acceso SSH solo con contraseña en servidores expuestos: usa claves y desactiva el login por contraseña.",
      "Compartir la clave PRIVADA: solo se comparte la pública (.pub); la privada nunca sale de tu equipo."
    ],
    tips: [
      "Cambia el puerto por defecto (22) y usa fail2ban para frenar ataques de fuerza bruta.",
      "Guarda accesos frecuentes en ~/.ssh/config para conectarte con un alias corto."
    ],
    resumen:
      "SSH da acceso remoto cifrado; scp copia archivos. Las claves son más seguras que las contraseñas y nunca compartas la clave privada.",
    preguntas: [
      "¿Para qué sirve SSH?",
      "¿Qué clave se comparte y cuál no?",
      "¿Qué ventaja tiene autenticarse por clave frente a contraseña?"
    ]
  },
  {
    id: "lxa-5", titulo: "Logs del sistema",
    concepto:
      "Los logs (registros) son el diario del sistema: ahí quedan errores, accesos y eventos. Saber leerlos es la habilidad número uno para "
      + "diagnosticar problemas. En sistemas con systemd, journalctl centraliza casi todo; también existe la carpeta /var/log.",
    ejemplos:
      "• journalctl -xe muestra los últimos eventos con detalle.\n"
      + "• /var/log/syslog y /var/log/auth.log son clásicos (sistema y autenticación).\n"
      + "• dmesg muestra mensajes del kernel (hardware, arranque).",
    codigo:
      "# Con journalctl\n"
      + "journalctl -xe                 # últimos eventos detallados\n"
      + "journalctl -u ssh              # logs de un servicio concreto\n"
      + "journalctl --since \"1 hour ago\"\n\n"
      + "# Logs en archivos\n"
      + "sudo tail -f /var/log/syslog   # seguir el log en vivo\n"
      + "dmesg | tail                   # mensajes recientes del kernel",
    errores: [
      "Buscar a ciegas: filtra por servicio, tiempo o palabra (grep) en vez de leer miles de líneas.",
      "Olvidar sudo para leer ciertos logs protegidos como auth.log."
    ],
    tips: [
      "tail -f + grep es una combinación poderosa para vigilar errores en tiempo real.",
      "auth.log revela intentos de acceso: útil para detectar ataques de fuerza bruta."
    ],
    resumen:
      "Los logs explican qué pasó. journalctl los centraliza y /var/log guarda archivos clave. Filtra por servicio, tiempo o palabra para ir al grano.",
    preguntas: [
      "¿Qué información hay en /var/log/auth.log?",
      "¿Qué hace journalctl -xe?",
      "¿Cómo sigues un log en tiempo real?"
    ]
  },
  {
    id: "lxa-6", titulo: "Hardening básico del sistema",
    concepto:
      "«Hardening» es endurecer la seguridad reduciendo la superficie de ataque. No es una sola acción, sino un conjunto de buenas "
      + "prácticas: actualizar, activar el firewall, minimizar servicios, asegurar SSH y vigilar accesos. Mentalidad defensiva (blue team).",
    ejemplos:
      "• Mantener el sistema actualizado cierra vulnerabilidades conocidas.\n"
      + "• UFW es un firewall sencillo para controlar puertos.\n"
      + "• Desactivar servicios que no usas reduce riesgos.",
    codigo:
      "# Firewall con UFW\n"
      + "sudo apt install ufw\n"
      + "sudo ufw default deny incoming    # bloquear todo lo entrante por defecto\n"
      + "sudo ufw default allow outgoing\n"
      + "sudo ufw allow 22                 # permitir SSH si lo necesitas\n"
      + "sudo ufw enable\n"
      + "sudo ufw status verbose\n\n"
      + "# Actualizaciones de seguridad\n"
      + "sudo apt update && sudo apt upgrade",
    errores: [
      "Activar el firewall bloqueando SSH antes de permitir el puerto 22: te quedas fuera de un servidor remoto.",
      "Pensar que el hardening es «una vez y ya»: es mantenimiento continuo."
    ],
    tips: [
      "Principio de mínimo privilegio: cada usuario y servicio solo con lo que necesita.",
      "Combina UFW + fail2ban + actualizaciones automáticas para una base sólida."
    ],
    resumen:
      "El hardening reduce riesgos con buenas prácticas: actualizar, firewall (UFW), menos servicios y SSH seguro. Es un proceso continuo.",
    preguntas: [
      "¿Qué es la «superficie de ataque»?",
      "¿Qué riesgo hay al activar UFW sin permitir SSH en un servidor remoto?",
      "¿Qué es el principio de mínimo privilegio?"
    ]
  }
];

/* ---------------- BASH SCRIPTING ---------------- */
LECCIONES["bash"] = [
  {
    id: "bash-1", titulo: "Qué es un script y el shebang",
    concepto:
      "Un script de Bash es un archivo de texto con una lista de comandos que la terminal ejecuta en orden, como si los escribieras tú. "
      + "Sirve para automatizar tareas repetitivas. La primera línea, llamada «shebang» (#!/bin/bash), le dice al sistema con qué intérprete "
      + "ejecutar el archivo.",
    ejemplos:
      "• Automatizar un backup diario.\n"
      + "• Renombrar cientos de archivos a la vez.\n"
      + "• Instalar y configurar un equipo nuevo con un solo comando.",
    codigo:
      "#!/bin/bash\n"
      + "# mi primer script: hola.sh\n"
      + "echo \"¡Hola! Soy un script de Bash\"\n"
      + "echo \"Hoy es: $(date)\"\n\n"
      + "# Para ejecutarlo en la terminal:\n"
      + "#   chmod +x hola.sh   (darle permiso de ejecución, solo la 1a vez)\n"
      + "#   ./hola.sh          (ejecutarlo)",
    errores: [
      "Olvidar chmod +x: el sistema dirá «Permiso denegado».",
      "Escribir el shebang mal (#!bin/bash sin la barra inicial): el script no se interpretará bien."
    ],
    tips: [
      "Nombra tus scripts con extensión .sh y un nombre descriptivo (backup.sh).",
      "Empieza siempre con #!/bin/bash y comenta qué hace el script en las primeras líneas."
    ],
    resumen:
      "Un script automatiza comandos. El shebang (#!/bin/bash) define el intérprete y necesitas chmod +x para ejecutarlo con ./script.sh.",
    preguntas: [
      "¿Qué es el shebang y para qué sirve?",
      "¿Qué comando da permiso de ejecución a un script?",
      "¿Cómo ejecutas un script que está en la carpeta actual?"
    ]
  },
  {
    id: "bash-2", titulo: "Variables y entrada/salida",
    concepto:
      "Las variables guardan datos para reutilizarlos. En Bash se definen SIN espacios alrededor del = y se leen anteponiendo $. "
      + "Para mostrar datos se usa echo, y para pedir datos al usuario, read.",
    ejemplos:
      "• nombre=\"Ana\" define la variable; echo $nombre la muestra.\n"
      + "• read pide un valor por teclado.\n"
      + "• Las comillas dobles permiten incluir variables dentro del texto.",
    codigo:
      "#!/bin/bash\n"
      + "# Variables y entrada de usuario\n"
      + "nombre=\"Ana\"                 # sin espacios alrededor del =\n"
      + "echo \"Hola, $nombre\"\n\n"
      + "echo \"¿Cómo te llamas?\"\n"
      + "read usuario                  # guarda lo que se teclee en 'usuario'\n"
      + "echo \"Encantado, $usuario\"\n\n"
      + "# Capturar la salida de un comando en una variable\n"
      + "fecha_actual=$(date +%Y-%m-%d)\n"
      + "echo \"Fecha: $fecha_actual\"",
    errores: [
      "Poner espacios: «nombre = Ana» falla. Debe ser «nombre=Ana».",
      "Olvidar el $ al leer la variable: echo nombre imprime la palabra «nombre», no su valor."
    ],
    tips: [
      "Usa ${variable} cuando la pegues a otro texto: \"${nombre}_backup\".",
      "Las comillas dobles preservan el valor con espacios; úsalas casi siempre."
    ],
    resumen:
      "Las variables se asignan sin espacios y se leen con $. echo muestra y read pide datos. $(...) captura la salida de un comando.",
    preguntas: [
      "¿Por qué falla «x = 5» en Bash?",
      "¿Qué comando lee datos del teclado?",
      "¿Cómo guardas la salida de un comando en una variable?"
    ]
  },
  {
    id: "bash-3", titulo: "Condicionales (if) y argumentos",
    concepto:
      "Los condicionales permiten que el script tome decisiones. Se usa if/then/else/fi con corchetes [ ] para la condición. Además, "
      + "los scripts reciben «argumentos» desde la terminal: $1 es el primero, $2 el segundo, y $# cuántos hay.",
    ejemplos:
      "• Comprobar si un archivo existe antes de borrarlo.\n"
      + "• Validar que el usuario pasó los datos necesarios.\n"
      + "• -f comprueba archivos, -d carpetas, -z si una cadena está vacía.",
    codigo:
      "#!/bin/bash\n"
      + "# Uso: ./revisar.sh archivo.txt\n"
      + "if [ $# -eq 0 ]; then\n"
      + "  echo \"Error: indica un archivo. Uso: $0 <archivo>\"\n"
      + "  exit 1\n"
      + "fi\n\n"
      + "archivo=$1\n"
      + "if [ -f \"$archivo\" ]; then\n"
      + "  echo \"'$archivo' existe y es un archivo.\"\n"
      + "else\n"
      + "  echo \"'$archivo' no existe.\"\n"
      + "fi",
    errores: [
      "Olvidar los espacios dentro de los corchetes: [ -f \"$x\" ] sí; [-f \"$x\"] no.",
      "No entrecomillar variables: si están vacías o tienen espacios, la condición puede romperse."
    ],
    tips: [
      "$0 es el nombre del propio script; útil para mensajes de ayuda.",
      "Devuelve códigos de salida con exit (0 = éxito, distinto de 0 = error)."
    ],
    resumen:
      "if/then/else/fi da lógica al script. Recibe datos con $1, $2... y valida con pruebas como -f (archivo) y -d (carpeta). Cuida los espacios en [ ].",
    preguntas: [
      "¿Qué representa $1 en un script?",
      "¿Qué comprueba la prueba -f?",
      "¿Por qué son importantes los espacios dentro de [ ]?"
    ]
  },
  {
    id: "bash-4", titulo: "Bucles (for, while) y funciones",
    concepto:
      "Los bucles repiten acciones. «for» recorre una lista (archivos, números); «while» repite mientras se cumpla una condición. "
      + "Las funciones agrupan código reutilizable con un nombre, para no repetirte.",
    ejemplos:
      "• Procesar todos los .jpg de una carpeta con un for.\n"
      + "• Esperar a que algo ocurra con un while.\n"
      + "• Crear una función saludar() y llamarla varias veces.",
    codigo:
      "#!/bin/bash\n"
      + "# Bucle for sobre archivos\n"
      + "for archivo in *.txt; do\n"
      + "  echo \"Procesando: $archivo\"\n"
      + "done\n\n"
      + "# Bucle while con contador\n"
      + "i=1\n"
      + "while [ $i -le 3 ]; do\n"
      + "  echo \"Vuelta número $i\"\n"
      + "  i=$((i + 1))      # aritmética con $(( ))\n"
      + "done\n\n"
      + "# Función con parámetro\n"
      + "saludar() {\n"
      + "  echo \"Hola, $1 👋\"\n"
      + "}\n"
      + "saludar \"Ana\"\n"
      + "saludar \"Luis\"",
    errores: [
      "Crear bucles while infinitos por olvidar incrementar el contador (i=$((i+1))).",
      "Esperar que una función devuelva texto con return: return es para códigos numéricos; usa echo para devolver datos."
    ],
    tips: [
      "Dentro de una función, $1, $2... son SUS propios argumentos, no los del script.",
      "Para sumar/restar usa $(( )): total=$((a + b))."
    ],
    resumen:
      "for recorre listas y while repite con condición. Las funciones reutilizan código y reciben sus propios argumentos. Cuida el incremento para evitar bucles infinitos.",
    preguntas: [
      "¿Cuándo usarías for y cuándo while?",
      "¿Cómo se hace aritmética en Bash?",
      "¿Cómo devuelve datos una función en Bash?"
    ]
  },
  {
    id: "bash-5", titulo: "Proyecto: script de backup automático",
    concepto:
      "Vamos a unir todo lo aprendido en un script real y útil: una copia de seguridad comprimida de una carpeta, con fecha en el nombre, "
      + "validaciones y mensajes claros. Este patrón se usa de verdad en servidores combinado con cron.",
    ejemplos:
      "• Comprimir ~/Documentos en un .tar.gz con la fecha del día.\n"
      + "• Validar que la carpeta origen existe.\n"
      + "• Programarlo cada noche con cron (lección de cron en Linux Avanzado).",
    codigo:
      "#!/bin/bash\n"
      + "# backup.sh - copia de seguridad comprimida con fecha\n"
      + "# Uso: ./backup.sh <carpeta_origen> <carpeta_destino>\n\n"
      + "origen=$1\n"
      + "destino=$2\n"
      + "fecha=$(date +%Y-%m-%d_%H-%M)\n\n"
      + "# Validaciones\n"
      + "if [ $# -ne 2 ]; then\n"
      + "  echo \"Uso: $0 <origen> <destino>\"; exit 1\n"
      + "fi\n"
      + "if [ ! -d \"$origen\" ]; then\n"
      + "  echo \"Error: la carpeta origen no existe.\"; exit 1\n"
      + "fi\n"
      + "mkdir -p \"$destino\"   # crea el destino si no existe\n\n"
      + "archivo=\"$destino/backup_$fecha.tar.gz\"\n"
      + "tar -czf \"$archivo\" \"$origen\"\n\n"
      + "if [ $? -eq 0 ]; then\n"
      + "  echo \"✅ Backup creado: $archivo\"\n"
      + "else\n"
      + "  echo \"❌ Falló el backup\"; exit 1\n"
      + "fi",
    errores: [
      "No comprobar $? (código de salida) para saber si tar funcionó.",
      "Usar rutas con espacios sin comillas: rompe tar y mkdir."
    ],
    tips: [
      "Combínalo con cron: «0 2 * * * /home/ana/backup.sh /home/ana/Documentos /mnt/backups».",
      "$? guarda el resultado del último comando: 0 significa éxito."
    ],
    resumen:
      "Un buen script valida la entrada, informa con mensajes claros y comprueba resultados con $?. Este backup.sh es plantilla para tareas reales con cron.",
    preguntas: [
      "¿Para qué sirve la variable $? ?",
      "¿Qué hace «mkdir -p»?",
      "¿Cómo automatizarías este script cada noche?"
    ]
  }
];

/* ---------------- PYTHON ---------------- */
LECCIONES["python"] = [
  {
    id: "py-1", titulo: "Variables y tipos de datos",
    concepto:
      "Python es un lenguaje claro y potente, ideal para empezar a programar y muy usado en automatización, datos y ciberseguridad. "
      + "No necesitas declarar el tipo: Python lo deduce. Los tipos básicos son: int (enteros), float (decimales), str (texto) y bool "
      + "(verdadero/falso). Ya viene instalado en Linux Mint (python3).",
    ejemplos:
      "• edad = 25 → int\n"
      + "• precio = 9.99 → float\n"
      + "• nombre = \"Ana\" → str\n"
      + "• activo = True → bool",
    codigo:
      "# guardar como ejemplo.py y ejecutar con: python3 ejemplo.py\n"
      + "edad = 25\n"
      + "nombre = \"Ana\"\n"
      + "precio = 9.99\n"
      + "activo = True\n\n"
      + "print(f\"{nombre} tiene {edad} años\")  # f-string: inserta variables\n"
      + "print(type(precio))                     # <class 'float'>\n\n"
      + "# Pedir datos al usuario (siempre llega como texto)\n"
      + "ciudad = input(\"¿Tu ciudad? \")\n"
      + "print(\"Vives en \" + ciudad)",
    errores: [
      "Olvidar que input() devuelve texto: para sumar números hay que convertir con int() o float().",
      "Confundir = (asignar) con == (comparar)."
    ],
    tips: [
      "Usa f-strings (f\"...{var}...\") para construir mensajes; son lo más legible.",
      "En Linux usa siempre «python3», no «python», para evitar versiones antiguas."
    ],
    resumen:
      "Python deduce los tipos (int, float, str, bool). print muestra, input pide datos (como texto) y las f-strings insertan variables fácilmente.",
    preguntas: [
      "¿Qué tipo devuelve siempre input()?",
      "¿Qué diferencia hay entre = y ==?",
      "¿Qué es una f-string?"
    ]
  },
  {
    id: "py-2", titulo: "Estructuras de control (if, for, while)",
    concepto:
      "Python usa la INDENTACIÓN (espacios al inicio de línea) para definir bloques, en lugar de llaves. if toma decisiones; for recorre "
      + "secuencias; while repite con condición. La indentación no es estética: es obligatoria y define la estructura.",
    ejemplos:
      "• if/elif/else para varias condiciones.\n"
      + "• for recorre listas, rangos o caracteres de un texto.\n"
      + "• range(5) genera 0,1,2,3,4.",
    codigo:
      "nota = 7\n"
      + "if nota >= 9:\n"
      + "    print(\"Sobresaliente\")\n"
      + "elif nota >= 5:\n"
      + "    print(\"Aprobado\")\n"
      + "else:\n"
      + "    print(\"Suspenso\")\n\n"
      + "# for con range\n"
      + "for i in range(1, 4):     # 1, 2, 3\n"
      + "    print(f\"Iteración {i}\")\n\n"
      + "# while\n"
      + "contador = 3\n"
      + "while contador > 0:\n"
      + "    print(contador)\n"
      + "    contador -= 1         # equivale a contador = contador - 1",
    errores: [
      "Mezclar tabuladores y espacios en la indentación: Python lanzará IndentationError.",
      "Olvidar los dos puntos «:» al final de if, for o while."
    ],
    tips: [
      "Configura tu editor para usar 4 espacios por nivel (la convención de Python).",
      "range(inicio, fin) NO incluye el fin: range(1,4) son 1,2,3."
    ],
    resumen:
      "Python estructura el código con indentación obligatoria. if/elif/else decide, for recorre, while repite. No olvides los «:».",
    preguntas: [
      "¿Cómo define Python los bloques de código?",
      "¿Qué genera range(1, 4)?",
      "¿Qué error causa mezclar tabs y espacios?"
    ]
  },
  {
    id: "py-3", titulo: "Listas y diccionarios",
    concepto:
      "Las listas guardan secuencias ordenadas de elementos (se accede por índice, empezando en 0). Los diccionarios guardan pares "
      + "clave:valor, ideales cuando quieres buscar por nombre en vez de por posición. Son las estructuras más usadas en Python.",
    ejemplos:
      "• lista = [\"a\", \"b\", \"c\"]; lista[0] es \"a\".\n"
      + "• append añade, len cuenta.\n"
      + "• dic = {\"nombre\": \"Ana\", \"edad\": 25}; dic[\"nombre\"] es \"Ana\".",
    codigo:
      "# Listas\n"
      + "tareas = [\"estudiar\", \"practicar\"]\n"
      + "tareas.append(\"descansar\")     # añadir\n"
      + "print(len(tareas))              # 3\n"
      + "for t in tareas:\n"
      + "    print(\"-\", t)\n\n"
      + "# Diccionarios\n"
      + "usuario = {\"nombre\": \"Ana\", \"rol\": \"admin\"}\n"
      + "print(usuario[\"nombre\"])       # Ana\n"
      + "usuario[\"activo\"] = True        # añadir clave\n"
      + "for clave, valor in usuario.items():\n"
      + "    print(f\"{clave}: {valor}\")",
    errores: [
      "Acceder a un índice que no existe (lista[10]): lanza IndexError.",
      "Buscar una clave inexistente en un dict: usa dic.get(\"clave\") para evitar KeyError."
    ],
    tips: [
      "El último elemento de una lista es lista[-1]; los negativos cuentan desde el final.",
      "dic.get(clave, valor_por_defecto) devuelve algo seguro si la clave no existe."
    ],
    resumen:
      "Listas: secuencias ordenadas por índice (desde 0). Diccionarios: pares clave:valor. Son la base para organizar datos en Python.",
    preguntas: [
      "¿Cuál es el índice del primer elemento de una lista?",
      "¿Cómo accedes al último elemento?",
      "¿Cómo evitas un KeyError al leer un diccionario?"
    ]
  },
  {
    id: "py-4", titulo: "Funciones, módulos y manejo de errores",
    concepto:
      "Las funciones (def) agrupan código reutilizable y pueden devolver valores con return. Los módulos son archivos con funciones que "
      + "importas (import). El manejo de errores con try/except evita que el programa se caiga ante un fallo previsible.",
    ejemplos:
      "• def sumar(a, b): return a + b\n"
      + "• import os, sys, random... (módulos de la librería estándar).\n"
      + "• try/except captura errores como dividir entre cero o archivo no encontrado.",
    codigo:
      "import random\n\n"
      + "def dividir(a, b):\n"
      + "    \"\"\"Devuelve a/b y maneja la división por cero.\"\"\"\n"
      + "    try:\n"
      + "        return a / b\n"
      + "    except ZeroDivisionError:\n"
      + "        print(\"No se puede dividir entre cero\")\n"
      + "        return None\n\n"
      + "print(dividir(10, 2))     # 5.0\n"
      + "print(dividir(10, 0))     # mensaje + None\n\n"
      + "# Usar un módulo\n"
      + "print(\"Número al azar:\", random.randint(1, 100))",
    errores: [
      "Capturar todos los errores con un except vacío: oculta bugs. Captura tipos concretos.",
      "Olvidar return: la función devolverá None sin avisar."
    ],
    tips: [
      "Documenta tus funciones con un docstring (texto entre triples comillas).",
      "La librería estándar (os, sys, datetime, json) resuelve muchísimo sin instalar nada."
    ],
    resumen:
      "def crea funciones reutilizables que devuelven con return. import trae módulos. try/except gestiona errores de forma controlada y específica.",
    preguntas: [
      "¿Qué devuelve una función sin return?",
      "¿Para qué sirve try/except?",
      "¿Por qué es mala idea un except vacío?"
    ]
  },
  {
    id: "py-5", titulo: "Python aplicado: automatización en Linux",
    concepto:
      "Python brilla automatizando tareas del sistema. Con el módulo «os» y «subprocess» puedes recorrer carpetas, renombrar archivos o "
      + "ejecutar comandos. Veremos un organizador que ordena archivos por su extensión: un caso real muy útil.",
    ejemplos:
      "• Leer y escribir archivos con open().\n"
      + "• Recorrer una carpeta con os.listdir().\n"
      + "• Mover archivos con shutil.move().",
    codigo:
      "import os\n"
      + "import shutil\n\n"
      + "# Organiza los archivos de una carpeta en subcarpetas por extensión\n"
      + "carpeta = os.path.expanduser(\"~/Descargas\")\n\n"
      + "for archivo in os.listdir(carpeta):\n"
      + "    ruta = os.path.join(carpeta, archivo)\n"
      + "    if os.path.isfile(ruta):\n"
      + "        ext = archivo.split(\".\")[-1].lower()   # extensión\n"
      + "        destino = os.path.join(carpeta, ext)\n"
      + "        os.makedirs(destino, exist_ok=True)      # crea subcarpeta\n"
      + "        shutil.move(ruta, os.path.join(destino, archivo))\n"
      + "        print(f\"Movido {archivo} -> {ext}/\")\n\n"
      + "print(\"Organización completada ✅\")",
    errores: [
      "Probar scripts que mueven/borran archivos en carpetas reales: hazlo primero en una carpeta de prueba.",
      "Usar rutas fijas como /home/ana: mejor os.path.expanduser('~') para que funcione en cualquier equipo."
    ],
    tips: [
      "Prueba siempre en una carpeta de juguete con archivos de ejemplo antes de usarlo en serio.",
      "os.path.join construye rutas correctas en cualquier sistema; no concatenes con + y '/'."
    ],
    resumen:
      "Con os y shutil, Python automatiza tareas de archivos en Linux. Construye rutas con os.path.join y prueba siempre en carpetas seguras.",
    preguntas: [
      "¿Qué módulo usas para recorrer carpetas?",
      "¿Por qué usar os.path.join en vez de concatenar texto?",
      "¿Qué precaución tomar antes de mover/borrar archivos con un script?"
    ]
  }
];

/* ---------------- HACKING ÉTICO / CIBERSEGURIDAD ----------------
   Enfoque 100% educativo, legal y defensivo. NO incluye exploits
   funcionales ni instrucciones para atacar sistemas reales.
   ---------------------------------------------------------------- */
LECCIONES["hacking"] = [
  {
    id: "hk-1", titulo: "Ética y legalidad (empieza SIEMPRE aquí)",
    concepto:
      "El hacking ético consiste en usar técnicas de ataque para ENCONTRAR y CORREGIR fallos de seguridad, siempre con AUTORIZACIÓN previa "
      + "y por escrito. La diferencia entre un profesional y un delincuente no son las herramientas, sino el PERMISO y la INTENCIÓN. "
      + "Acceder a sistemas ajenos sin consentimiento es un delito en casi todos los países, aunque «solo estuvieras mirando».\n\n"
      + "Antes de cualquier prueba existe un «alcance» (scope) autorizado: qué sistemas, durante cuánto tiempo y con qué límites. "
      + "Todo lo que esté fuera del alcance está prohibido. Practica únicamente en entornos propios o en plataformas diseñadas para ello.",
    ejemplos:
      "• Una empresa contrata un pentest y firma un documento autorizando las pruebas: legal.\n"
      + "• Escanear la red de tu vecino «por curiosidad»: ilegal, aunque no causes daño.\n"
      + "• Montar tu propio laboratorio con máquinas virtuales: 100% legal y recomendado.",
    codigo:
      "# Checklist ético ANTES de cualquier prueba de seguridad:\n"
      + "# 1. ¿Tengo autorización por escrito del propietario?\n"
      + "# 2. ¿Está definido el alcance (qué IPs/sistemas y fechas)?\n"
      + "# 3. ¿Estoy dentro de ese alcance en todo momento?\n"
      + "# 4. ¿Tengo un plan para reportar lo que encuentre de forma responsable?\n"
      + "# Si alguna respuesta es 'no' -> NO continúes.",
    errores: [
      "Creer que «si no rompo nada» no es delito: el simple acceso no autorizado ya lo es.",
      "Practicar en webs o redes reales ajenas en lugar de en laboratorios propios o autorizados."
    ],
    tips: [
      "Guarda siempre el permiso por escrito y respeta el alcance al pie de la letra.",
      "La «divulgación responsable» (responsible disclosure) es reportar el fallo en privado al dueño y darle tiempo a corregirlo."
    ],
    resumen:
      "El hacking ético requiere autorización explícita y un alcance definido. Sin permiso no hay ética: practica solo en entornos propios o plataformas legales.",
    preguntas: [
      "¿Qué distingue a un hacker ético de un atacante ilegal?",
      "¿Qué es el «alcance» (scope) de un pentest?",
      "¿Qué es la divulgación responsable?"
    ]
  },
  {
    id: "hk-2", titulo: "Metodología del pentesting (las 5 fases)",
    concepto:
      "Un test de penetración profesional sigue fases ordenadas, igual que en certificaciones como CEH u OSCP. Entenderlas te da una visión "
      + "estructurada tanto para atacar (con permiso) como para defender. Las cinco fases clásicas son: reconocimiento, escaneo, explotación, "
      + "post-explotación y reporte. La fase más valiosa para la empresa es la última: el informe.",
    ejemplos:
      "• Reconocimiento: recopilar información pública (OSINT) sobre el objetivo autorizado.\n"
      + "• Escaneo: identificar puertos y servicios activos.\n"
      + "• Explotación: comprobar si una vulnerabilidad es real (en laboratorio).\n"
      + "• Post-explotación: evaluar el impacto (qué se podría alcanzar).\n"
      + "• Reporte: documentar hallazgos, riesgo y CÓMO corregirlos.",
    codigo:
      "# Las 5 fases (visión conceptual)\n"
      + "1) Reconocimiento  -> información (pasivo/activo)\n"
      + "2) Escaneo         -> puertos, servicios, versiones\n"
      + "3) Explotación     -> validar vulnerabilidades (solo en scope)\n"
      + "4) Post-explotación-> impacto y alcance, sin causar daño\n"
      + "5) Reporte         -> hallazgos + riesgo + REMEDIACIÓN\n"
      + "# Regla de oro: documenta TODO lo que haces para el informe.",
    errores: [
      "Saltar directo a «explotar» sin reconocimiento ni escaneo: poco profesional e ineficaz.",
      "Olvidar el reporte: sin recomendaciones de mitigación, el trabajo no aporta valor real."
    ],
    tips: [
      "El blue team (defensa) usa estas mismas fases para anticipar y bloquear ataques.",
      "Un buen informe prioriza por riesgo y explica la solución, no solo el problema."
    ],
    resumen:
      "El pentesting profesional sigue 5 fases: reconocimiento, escaneo, explotación, post-explotación y reporte. El informe con remediaciones es lo que aporta valor.",
    preguntas: [
      "¿Cuáles son las cinco fases del pentesting?",
      "¿Por qué el reporte es la fase más valiosa para la empresa?",
      "¿Cómo usa el blue team estas fases?"
    ]
  },
  {
    id: "hk-3", titulo: "OWASP Top 10: vulnerabilidades web explicadas",
    concepto:
      "OWASP Top 10 es la lista de referencia de los riesgos de seguridad más críticos en aplicaciones web, mantenida por una comunidad "
      + "sin ánimo de lucro. Conocerla te ayuda a programar de forma segura y a entender por dónde fallan las aplicaciones. Aquí la vemos "
      + "desde la DEFENSA: qué es cada riesgo y cómo prevenirlo.",
    ejemplos:
      "• Inyección (SQL): datos del usuario interpretados como código. Defensa: consultas parametrizadas.\n"
      + "• Autenticación rota: contraseñas débiles o sesiones mal gestionadas. Defensa: MFA y políticas robustas.\n"
      + "• XSS (Cross-Site Scripting): inyectar scripts en una web. Defensa: escapar/validar la salida.\n"
      + "• Configuración insegura: servicios con valores por defecto. Defensa: hardening y revisar configuraciones.",
    codigo:
      "# Ejemplo DEFENSIVO: prevenir inyección SQL con consultas parametrizadas (Python)\n"
      + "import sqlite3\n"
      + "con = sqlite3.connect(\"app.db\")\n"
      + "usuario = input(\"Usuario: \")\n\n"
      + "# CORRECTO: el dato va como parámetro, nunca concatenado\n"
      + "con.execute(\"SELECT * FROM users WHERE name = ?\", (usuario,))\n\n"
      + "# INCORRECTO (NO hacer): concatenar permite inyección\n"
      + "# con.execute(\"SELECT * FROM users WHERE name = '\" + usuario + \"'\")",
    errores: [
      "Confiar en los datos que envía el usuario: SIEMPRE deben validarse y sanearse.",
      "Pensar que «mi web es pequeña, nadie la atacará»: los escaneos automatizados atacan a todos."
    ],
    tips: [
      "Regla de oro: «nunca confíes en la entrada del usuario». Valida en el servidor, no solo en el navegador.",
      "Usa siempre consultas parametrizadas y frameworks que escapan la salida por defecto."
    ],
    resumen:
      "OWASP Top 10 reúne los riesgos web más críticos (inyección, XSS, autenticación rota...). La defensa clave: validar la entrada y usar consultas parametrizadas.",
    preguntas: [
      "¿Qué es una inyección SQL y cómo se previene?",
      "¿Qué es XSS y cómo se mitiga?",
      "¿Por qué nunca debes confiar en la entrada del usuario?"
    ]
  },
  {
    id: "hk-4", titulo: "Criptografía básica y seguridad de redes",
    concepto:
      "La criptografía protege la confidencialidad e integridad de los datos. Conceptos esenciales: cifrado simétrico (una sola clave) y "
      + "asimétrico (par pública/privada), funciones hash (huella irreversible) y TLS/HTTPS (cifra el tráfico web). En redes, segmentar, "
      + "cifrar y aplicar firewalls reduce el riesgo.",
    ejemplos:
      "• Hash: SHA-256 genera una huella fija; no se puede «descifrar» de vuelta.\n"
      + "• Las contraseñas se guardan «hasheadas» con sal, nunca en texto plano.\n"
      + "• HTTPS usa TLS para cifrar la comunicación entre tu navegador y la web.",
    codigo:
      "# Calcular un hash SHA-256 (defensivo, para integridad de archivos)\n"
      + "sha256sum documento.pdf\n\n"
      + "# En Python: hashear una contraseña con sal (concepto)\n"
      + "import hashlib, os\n"
      + "sal = os.urandom(16)\n"
      + "clave = \"miClaveSegura\".encode()\n"
      + "huella = hashlib.pbkdf2_hmac(\"sha256\", clave, sal, 100000)\n"
      + "print(huella.hex())   # se guarda la huella + la sal, nunca la clave",
    errores: [
      "Guardar contraseñas en texto plano o con hash sin sal: muy inseguro.",
      "Crear tu propio algoritmo de cifrado: usa estándares probados (AES, TLS), nunca inventes."
    ],
    tips: [
      "Verifica descargas comparando su hash con el que publica el autor.",
      "«No inventes criptografía»: confía en bibliotecas y protocolos auditados."
    ],
    resumen:
      "La criptografía (simétrica, asimétrica, hash, TLS) protege datos. Guarda contraseñas hasheadas con sal y usa siempre estándares probados.",
    preguntas: [
      "¿Qué diferencia hay entre cifrado simétrico y asimétrico?",
      "¿Por qué un hash no se puede «descifrar»?",
      "¿Por qué no debes inventar tu propio algoritmo de cifrado?"
    ]
  },
  {
    id: "hk-5", titulo: "Herramientas estándar (uso responsable en laboratorio)",
    concepto:
      "Estas son herramientas legítimas que usan los profesionales de seguridad. Aquí se presentan PARA QUÉ SIRVEN y su uso en un "
      + "laboratorio propio o plataforma autorizada. Nunca contra sistemas sin permiso. Conocerlas también ayuda a defenderse, porque sabes "
      + "qué buscan los atacantes.",
    ejemplos:
      "• Nmap: descubre hosts, puertos y servicios. Defensa: audita tu propia red para cerrar puertos innecesarios.\n"
      + "• Wireshark: analiza el tráfico de red. Defensa: detecta tráfico anómalo o sin cifrar.\n"
      + "• Burp Suite: analiza aplicaciones web. Defensa: prueba la seguridad de TUS apps.\n"
      + "• Metasploit: framework de pruebas de explotación, usado en laboratorios controlados.",
    codigo:
      "# Ejemplo LEGAL: escanear TU PROPIA máquina (localhost) con Nmap\n"
      + "nmap -sV localhost      # detecta servicios y versiones en tu equipo\n\n"
      + "# Auditar tu propia red doméstica (que administras)\n"
      + "# nmap -sn 192.168.1.0/24   # ¿qué dispositivos hay en mi red?\n"
      + "# Objetivo: cerrar puertos/servicios que no necesites.",
    errores: [
      "Escanear redes o sistemas que no te pertenecen: es ilegal aunque la herramienta sea legal.",
      "Confundir «tener la herramienta» con «tener permiso»: el permiso es lo que importa."
    ],
    tips: [
      "Monta un laboratorio con VirtualBox y máquinas vulnerables diseñadas para practicar (ej: Metasploitable).",
      "Aprender a usar Nmap te convierte también en mejor defensor: sabrás qué expone tu red."
    ],
    resumen:
      "Nmap, Wireshark, Burp Suite y Metasploit son herramientas profesionales. Úsalas solo en entornos propios o autorizados; conocerlas mejora tu defensa.",
    preguntas: [
      "¿Para qué sirve Nmap y cómo lo usarías de forma legal?",
      "¿Por qué tener una herramienta no equivale a tener permiso?",
      "¿Cómo ayuda Wireshark a la defensa?"
    ]
  },
  {
    id: "hk-6", titulo: "Mentalidad defensiva y dónde practicar legalmente",
    concepto:
      "La mejor forma de defender es entender cómo se ataca, pero aplicándolo a PROTEGER. El «blue team» defiende; el «red team» simula "
      + "ataques autorizados; el «purple team» combina ambos para mejorar. Para aprender de forma segura y legal existen plataformas con "
      + "laboratorios listos para practicar sin meterte en problemas.",
    ejemplos:
      "• Defensa: actualizaciones, firewall, MFA, copias de seguridad, monitoreo de logs.\n"
      + "• Detección: revisar auth.log y alertas para identificar intentos de intrusión.\n"
      + "• Respuesta: tener un plan ante incidentes (aislar, analizar, recuperar).",
    codigo:
      "# Plataformas LEGALES para practicar (entornos diseñados para ello):\n"
      + "# - TryHackMe        (guiado, ideal para empezar)\n"
      + "# - Hack The Box     (retos más avanzados)\n"
      + "# - OverTheWire      (juegos de wargames por SSH)\n"
      + "# - PortSwigger Web Security Academy (web, gratis)\n"
      + "# - Tu propio laboratorio con VirtualBox + máquinas vulnerables\n"
      + "# Todas: practicar sin atacar sistemas reales ajenos.",
    errores: [
      "Querer ir directo a «hackear» sin bases de redes, sistemas y programación.",
      "Saltarse la práctica en laboratorios y arriesgarse con sistemas reales: ilegal e innecesario."
    ],
    tips: [
      "Combina red y blue: cada técnica de ataque que aprendas, estúdiala también como defensa.",
      "Documenta tus prácticas de laboratorio: te servirá de portfolio profesional."
    ],
    resumen:
      "Comprender el ataque sirve para defender mejor (blue/red/purple team). Practica solo en plataformas legales como TryHackMe, Hack The Box o tu propio laboratorio.",
    preguntas: [
      "¿Qué diferencia hay entre blue team y red team?",
      "Menciona dos plataformas legales para practicar seguridad.",
      "¿Por qué conviene estudiar cada ataque también como defensa?"
    ]
  }
];

/* ---------------- INGLÉS TÉCNICO (módulo especial) ----------------
   Tiene una vista propia. Las "lecciones" son las actividades que,
   al completarse, desbloquean el certificado del módulo.
   ------------------------------------------------------------------ */
LECCIONES["ingles"] = [
  { id: "en-1", titulo: "Vocabulario y flashcards" },
  { id: "en-2", titulo: "Frases técnicas" },
  { id: "en-3", titulo: "Lectura técnica" },
  { id: "en-4", titulo: "Ejercicios" }
];

/* Datos del módulo de inglés. pron = pronunciación aproximada en español. */
const INGLES = {
  // Vocabulario clave (también alimenta las flashcards)
  vocabulario: [
    { en: "file", es: "archivo", pron: "fáil", cat: "Terminal" },
    { en: "folder / directory", es: "carpeta / directorio", pron: "fólder / dairéctori", cat: "Terminal" },
    { en: "path", es: "ruta", pron: "paz", cat: "Terminal" },
    { en: "command", es: "comando / orden", pron: "kománd", cat: "Terminal" },
    { en: "permission", es: "permiso", pron: "permíshon", cat: "Terminal" },
    { en: "owner", es: "propietario", pron: "óuner", cat: "Terminal" },
    { en: "to run / execute", es: "ejecutar", pron: "tu ran / éksekiut", cat: "Terminal" },
    { en: "to remove / delete", es: "eliminar / borrar", pron: "tu rimúv / dilít", cat: "Terminal" },
    { en: "package", es: "paquete", pron: "pákich", cat: "Software" },
    { en: "to install / update", es: "instalar / actualizar", pron: "instól / apdéit", cat: "Software" },
    { en: "network", es: "red", pron: "nétuork", cat: "Redes" },
    { en: "host", es: "equipo / anfitrión", pron: "joust", cat: "Redes" },
    { en: "port", es: "puerto", pron: "port", cat: "Redes" },
    { en: "request / response", es: "petición / respuesta", pron: "rikuést / rispóns", cat: "Redes" },
    { en: "firewall", es: "cortafuegos", pron: "fáiaruol", cat: "Seguridad" },
    { en: "vulnerability", es: "vulnerabilidad", pron: "vulnerabíliti", cat: "Seguridad" },
    { en: "threat", es: "amenaza", pron: "zret", cat: "Seguridad" },
    { en: "to encrypt", es: "cifrar", pron: "tu inkrípt", cat: "Seguridad" },
    { en: "password", es: "contraseña", pron: "pásuord", cat: "Seguridad" },
    { en: "backup", es: "copia de seguridad", pron: "bákap", cat: "Seguridad" }
  ],
  // Frases y expresiones técnicas frecuentes
  frases: [
    { en: "Run the following command as root.", es: "Ejecuta el siguiente comando como administrador (root)." },
    { en: "You don't have permission to access this file.", es: "No tienes permiso para acceder a este archivo." },
    { en: "Make sure the service is up and running.", es: "Asegúrate de que el servicio está activo y funcionando." },
    { en: "Check the logs for more details.", es: "Revisa los registros (logs) para más detalles." },
    { en: "The connection timed out.", es: "La conexión expiró / agotó el tiempo de espera." },
    { en: "Grant read and write permissions to the user.", es: "Concede permisos de lectura y escritura al usuario." },
    { en: "Never expose this port to the internet.", es: "Nunca expongas este puerto a internet." },
    { en: "Always test in a safe lab environment.", es: "Practica siempre en un entorno de laboratorio seguro." }
  ],
  // Lectura técnica con explicación
  lectura: {
    titulo: "Reading: File Permissions",
    textoEn:
      "In Linux, every file and directory has an owner and a set of permissions. "
      + "Permissions control who can read, write, or execute a file. "
      + "You can change them with the 'chmod' command. "
      + "For security reasons, you should grant only the permissions that are strictly necessary. "
      + "Giving full permissions to everyone is considered a serious security risk.",
    explicacion:
      "Traducción y notas: En Linux, cada archivo y directorio tiene un propietario (owner) y un conjunto de permisos. "
      + "Los permisos controlan quién puede leer (read), escribir (write) o ejecutar (execute) un archivo. Puedes cambiarlos "
      + "con el comando «chmod». Por seguridad, concede solo los permisos estrictamente necesarios. Dar permisos totales a "
      + "todos (everyone) se considera un riesgo de seguridad grave.\n\n"
      + "Vocabulario del texto: owner = propietario · grant = conceder · strictly necessary = estrictamente necesario · "
      + "security risk = riesgo de seguridad."
  },
  // Ejercicios interactivos
  ejercicios: {
    // Emparejar término inglés con su traducción
    emparejar: [
      { en: "file", es: "archivo" },
      { en: "network", es: "red" },
      { en: "password", es: "contraseña" },
      { en: "firewall", es: "cortafuegos" },
      { en: "backup", es: "copia de seguridad" }
    ],
    // Completar la frase eligiendo la opción correcta
    completar: [
      { frase: "You don't have ______ to access this file.", opciones: ["permission", "network", "backup"], correcta: 0 },
      { frase: "Check the ______ for more details.", opciones: ["logs", "ports", "threats"], correcta: 0 },
      { frase: "Never expose this ______ to the internet.", opciones: ["owner", "port", "command"], correcta: 1 }
    ],
    // Traducir (autoevaluación: se muestra la solución)
    traducir: [
      { en: "Run the command as root.", es: "Ejecuta el comando como administrador (root)." },
      { en: "The connection timed out.", es: "La conexión expiró." },
      { en: "Grant read permissions to the user.", es: "Concede permisos de lectura al usuario." }
    ]
  }
};

/* ---------------- HACKING: LECCIONES AMPLIADAS ----------------
   Basadas en "LINUX-FOR-HACKERS... (Kali Linux)". Enfoque
   profesional, laboral, ético y defensivo. El campo "comandos"
   enlaza con el diccionario de comandos.
   -------------------------------------------------------------- */
LECCIONES["hacking"].push(
  {
    id: "hk-7", titulo: "Reconocimiento y enumeración (recon)",
    comandos: ["nmap", "dig", "wget", "netcat"],
    concepto:
      "Fuente: «Linux for Hackers» (cap. Kali Linux y herramientas de red). El reconocimiento es la primera fase real de un "
      + "encargo: reunir toda la información posible del objetivo AUTORIZADO antes de tocar nada. Se divide en pasivo (sin interactuar "
      + "con el objetivo: OSINT, DNS, registros públicos) y activo (interactuar: ping, escaneo de puertos). La enumeración va un paso "
      + "más allá: una vez sabes qué servicios hay, extraes detalles (versiones, usuarios, recursos compartidos) que guiarán el resto.",
    ejemplos:
      "• Pasivo: <code>dig</code> y registros públicos para mapear dominios y servidores de correo.\n"
      + "• Activo: <code>nmap -sn</code> para descubrir hosts vivos y <code>nmap -sV</code> para versiones de servicios.\n"
      + "• Banner grabbing: <code>curl -I</code> o <code>netcat</code> para ver qué software responde.",
    codigo:
      "# Reconocimiento en TU laboratorio (red propia 192.168.1.0/24)\n"
      + "nmap -sn 192.168.1.0/24            # ¿qué equipos están vivos?\n"
      + "nmap -sV -p- 192.168.1.50 -oN recon.txt   # servicios y versiones, guardado\n"
      + "dig +short objetivo-autorizado.com        # recon pasivo de DNS\n"
      + "curl -I http://192.168.1.50               # banner del servidor web",
    erroresComunes: [
      "Saltarse el reconocimiento y lanzarse a explotar: se pierde tiempo y se hace ruido innecesario.",
      "Hacer recon activo sobre objetivos fuera del alcance autorizado: eso ya es intrusión ilegal."
    ],
    tips: [
      "Documenta cada hallazgo con marca de tiempo: será la base de tu informe.",
      "Más información en la fase de recon = explotación más precisa y menos ruidosa."
    ],
    resumen:
      "El recon (pasivo y activo) y la enumeración construyen el mapa del objetivo autorizado. nmap y dig son tus herramientas base. Sin recon no hay pentest profesional.",
    preguntas: [
      "¿Qué diferencia hay entre reconocimiento pasivo y activo?",
      "¿Qué herramienta usarías para descubrir hosts vivos en una red?",
      "¿Por qué es clave documentar los hallazgos del recon?"
    ],
    defensa:
      "Blue team: limita la información pública (banners, versiones), segmenta la red y monitoriza escaneos con un IDS. Cuanta menos información expongas, más difícil se lo pones a un atacante."
  },
  {
    id: "hk-8", titulo: "Escaneo de puertos con Nmap a fondo",
    comandos: ["nmap", "netcat", "shebang"],
    concepto:
      "Fuente: «Linux for Hackers» (sección Nmap y scripting en Bash). Nmap automatiza el envío de paquetes para descubrir puertos "
      + "abiertos y servicios. Sin él, tendrías que probar puerto por puerto a mano. Existen varios tipos de escaneo: TCP connect "
      + "(<code>-sT</code>, completo y ruidoso), SYN (<code>-sS</code>, sigiloso, requiere privilegios) y detección de versiones "
      + "(<code>-sV</code>). El libro muestra incluso cómo crear tu propio escáner en Bash que invoca nmap y filtra los puertos abiertos.",
    ejemplos:
      "• <code>nmap -sT 192.168.1.50 -p 22,80,443</code>: comprueba puertos concretos.\n"
      + "• <code>nmap -sV -p- 192.168.1.50</code>: todos los puertos + versiones.\n"
      + "• Script Bash del libro: lanza nmap, guarda con <code>-oG</code> y filtra con <code>grep open</code>.",
    codigo:
      "#!/bin/bash\n"
      + "# Mini escáner basado en el ejemplo del libro (uso en laboratorio propio)\n"
      + "objetivo=\"192.168.1.50\"\n"
      + "nmap -sT \"$objetivo\" -p 1-1000 -oG resultado.txt   # escaneo + salida grepeable\n"
      + "grep open resultado.txt                              # solo puertos abiertos\n"
      + "echo \"Escaneo de $objetivo completado.\"",
    erroresComunes: [
      "Usar -sS (SYN) sin privilegios: nmap caerá a otro tipo de escaneo o fallará.",
      "Escanear rangos enormes a máxima velocidad en redes ajenas: ilegal y muy ruidoso."
    ],
    tips: [
      "Guarda siempre la salida (-oN/-oG): la necesitarás para el informe y para comparar en el tiempo.",
      "Aprender a leer un escaneo te hace mejor defensor: sabrás qué expone tu propia red."
    ],
    resumen:
      "Nmap es el estándar del escaneo. Domina -sT, -sV y -p, guarda resultados y entiende el tipo de escaneo. Puedes automatizarlo con un script Bash sencillo.",
    preguntas: [
      "¿Qué hace la opción -sV de nmap?",
      "¿Por qué guardar la salida del escaneo?",
      "¿Qué ventaja defensiva tiene saber usar nmap?"
    ],
    defensa:
      "Blue team: cierra puertos y servicios innecesarios (reduce superficie de ataque), usa firewall (UFW) y detecta escaneos con fail2ban o un IDS como Snort/Suricata."
  },
  {
    id: "hk-9", titulo: "Análisis de tráfico: tcpdump y Wireshark",
    comandos: ["tcpdump", "wireshark", "lsof"],
    concepto:
      "Fuente: «Linux for Hackers» (herramientas de red). El análisis de tráfico (sniffing) consiste en capturar e inspeccionar los "
      + "paquetes que circulan por la red. <code>tcpdump</code> es el capturador clásico de línea de comandos; Wireshark es su "
      + "equivalente gráfico, más fácil de analizar. Sirve para entender protocolos, depurar y, en defensa, detectar tráfico anómalo "
      + "o credenciales viajando sin cifrar.",
    ejemplos:
      "• <code>tcpdump -i any port 80</code>: ver tráfico HTTP (sin cifrar) en vivo.\n"
      + "• <code>tcpdump -w captura.pcap</code>: guardar para analizar luego en Wireshark.\n"
      + "• Wireshark con filtro <code>http.request</code> o <code>tcp.port==443</code>.",
    codigo:
      "# Captura en TU red/laboratorio y análisis posterior\n"
      + "sudo tcpdump -i any -w captura.pcap   # capturar (Ctrl+C para parar)\n"
      + "sudo tcpdump -r captura.pcap port 80  # releer filtrando por puerto 80\n"
      + "# Luego abrir captura.pcap en Wireshark y filtrar: http.request",
    erroresComunes: [
      "Capturar tráfico de redes ajenas: vulnera la privacidad y la ley.",
      "Olvidar filtrar: una captura sin filtros genera miles de paquetes difíciles de leer."
    ],
    tips: [
      "Si ves credenciales en texto plano (HTTP), es señal de que ese servicio debería usar HTTPS.",
      "tcpdump para capturar en servidores sin entorno gráfico; Wireshark para analizar con calma."
    ],
    resumen:
      "tcpdump (CLI) y Wireshark (GUI) capturan y analizan tráfico. Filtra siempre y úsalo solo en redes propias. Es clave tanto para entender ataques como para detectarlos.",
    preguntas: [
      "¿Cuál es la diferencia entre tcpdump y Wireshark?",
      "¿Qué indica ver credenciales en texto plano en una captura?",
      "¿Por qué hay que filtrar las capturas?"
    ],
    defensa:
      "Blue team: cifra todo el tráfico (TLS/HTTPS, SSH), usa el análisis de tráfico para detectar conexiones a destinos sospechosos y segmenta la red para limitar el sniffing."
  },
  {
    id: "hk-10", titulo: "Seguridad de aplicaciones web con Burp Suite (lab)",
    comandos: ["burpsuite", "wget"],
    concepto:
      "Fuente: «Linux for Hackers» (cap. Burp Suite). Burp Suite es un proxy que se sitúa entre tu navegador y la aplicación web "
      + "para inspeccionar y modificar peticiones. Es la herramienta de referencia para auditar aplicaciones web y comprobar los "
      + "riesgos del OWASP Top 10 (inyección, control de acceso roto, XSS...). Siempre sobre aplicaciones propias o de laboratorio.",
    ejemplos:
      "• Proxy → Intercept: capturar la petición de un formulario de login.\n"
      + "• Repeater: reenviar la misma petición cambiando un parámetro y ver la respuesta.\n"
      + "• Comprobar si un campo es vulnerable a inyección probando entradas en un laboratorio controlado.",
    codigo:
      "# Flujo conceptual (en PortSwigger Web Academy o tu app de laboratorio):\n"
      + "1) Configura el navegador para usar Burp como proxy (127.0.0.1:8080)\n"
      + "2) Proxy > Intercept: captura una peticion de login\n"
      + "3) Envia la peticion a Repeater y modifica un parametro\n"
      + "4) Observa como responde el servidor y documenta el hallazgo",
    erroresComunes: [
      "Probar Burp contra sitios reales ajenos: es un delito. Usa PortSwigger Academy o tus apps.",
      "Automatizar ataques (Intruder) contra producción: puede causar denegación de servicio."
    ],
    tips: [
      "PortSwigger Web Security Academy es gratis, legal y el mejor sitio para aprender web hacking.",
      "Cada vulnerabilidad que encuentres, apúntala con su impacto y su mitigación para el informe."
    ],
    resumen:
      "Burp Suite audita aplicaciones web interceptando y modificando peticiones. Úsalo solo en laboratorios o apps autorizadas. Es la puerta de entrada al OWASP Top 10 práctico.",
    preguntas: [
      "¿Qué función cumple Burp Suite como proxy?",
      "¿Dónde puedes practicar web hacking de forma legal?",
      "¿Para qué sirve el módulo Repeater?"
    ],
    defensa:
      "Blue team / desarrollo seguro: valida la entrada en el servidor, usa consultas parametrizadas, aplica control de acceso por rol y escapa la salida para frenar XSS."
  },
  {
    id: "hk-11", titulo: "Un encargo real de pentesting y su reporte",
    comandos: ["nmap"],
    concepto:
      "Esto es lo que de verdad pasa en un trabajo. Un «engagement» (encargo) de pentesting no empieza con herramientas, sino con "
      + "PAPELES: se define el alcance (qué sistemas, fechas, ventana horaria), las reglas de enrolamiento (qué está permitido) y se "
      + "firma la autorización. Luego se ejecutan las fases (reconocimiento → escaneo → enumeración → explotación en lab → "
      + "post-explotación) documentándolo todo. El producto final que paga el cliente NO son los hallazgos, sino el INFORME.",
    ejemplos:
      "• Reunión inicial (kick-off): se acuerda alcance y contactos de emergencia.\n"
      + "• Ejecución: pruebas dentro del alcance, registrando evidencias (capturas, comandos, horas).\n"
      + "• Entrega: informe ejecutivo (para dirección) + informe técnico (para el equipo IT).",
    codigo:
      "# Estructura típica de un INFORME de pentesting profesional:\n"
      + "1. Resumen ejecutivo      -> riesgo global, en lenguaje de negocio\n"
      + "2. Alcance y metodologia  -> que se probo y como\n"
      + "3. Hallazgos              -> cada uno con: descripcion, evidencia,\n"
      + "                             severidad (CVSS), impacto y REMEDIACION\n"
      + "4. Recomendaciones        -> priorizadas por riesgo\n"
      + "5. Anexos                 -> comandos, capturas, registros",
    erroresComunes: [
      "Entregar una lista de vulnerabilidades sin explicar el impacto ni cómo arreglarlas.",
      "Salirse del alcance o del horario acordado: rompe el contrato y la confianza (y la ley)."
    ],
    tips: [
      "Prioriza los hallazgos por riesgo real para el negocio, no por lo 'llamativo' del fallo.",
      "Comunícate durante el encargo: si encuentras algo crítico, avisa de inmediato, no esperes al informe."
    ],
    resumen:
      "Un pentest real es autorización + alcance + ejecución documentada + informe con remediaciones. El informe claro y accionable es lo que aporta valor al cliente.",
    preguntas: [
      "¿Qué se acuerda antes de empezar un encargo de pentesting?",
      "¿Por qué el informe es el entregable más importante?",
      "¿Qué debe incluir cada hallazgo en el informe?"
    ],
    defensa:
      "Para la empresa cliente: el valor del pentest está en aplicar las remediaciones y re-testear. La seguridad es un ciclo continuo, no un examen que se aprueba una vez."
  },
  {
    id: "hk-12", titulo: "Roles del sector y ética profesional",
    comandos: [],
    concepto:
      "La ciberseguridad es un sector amplio con muchas salidas profesionales. Conocer los roles te ayuda a orientar tu carrera. "
      + "Más allá de la técnica, lo que distingue a un profesional es la ÉTICA: confidencialidad, respeto al alcance, comunicación "
      + "honesta y responsabilidad. Sin ética, la técnica es un peligro; con ética, es una profesión respetada y muy demandada.",
    ejemplos:
      "• Pentester / Red Team: simula ataques autorizados para encontrar fallos.\n"
      + "• Analista SOC / Blue Team: vigila, detecta y responde a incidentes en tiempo real.\n"
      + "• Bug Bounty Hunter: reporta fallos en programas públicos a cambio de recompensa (con reglas claras).\n"
      + "• GRC / Auditor: gobierno, riesgo y cumplimiento (normativas, políticas).",
    codigo:
      "# Mentalidad RED + BLUE = PURPLE\n"
      + "Red team   -> piensa como atacante (autorizado) para hallar debilidades\n"
      + "Blue team  -> defiende, detecta y responde\n"
      + "Purple team-> ambos colaboran para mejorar la seguridad de forma continua\n"
      + "# Codigo etico: confidencialidad, alcance, no danar, divulgacion responsable.",
    erroresComunes: [
      "Creer que solo existe el rol de 'hacker ofensivo': la defensa (blue team) tiene enorme demanda.",
      "Participar en bug bounty sin leer las reglas del programa: puedes salirte del alcance."
    ],
    tips: [
      "Construye un portfolio: writeups de TryHackMe/HTB y laboratorios propios documentados.",
      "Las certificaciones (eJPT, CEH, OSCP) ordenan el aprendizaje y abren puertas laborales."
    ],
    resumen:
      "Hay muchos roles: pentester, SOC/blue team, bug bounty, GRC. La ética profesional (confidencialidad, alcance, no dañar) es la base de toda la carrera.",
    preguntas: [
      "Nombra tres roles del sector de la ciberseguridad.",
      "¿Qué es un equipo 'purple'?",
      "¿Por qué la ética es tan importante como la técnica?"
    ],
    defensa:
      "La comunicación y la documentación son habilidades tan valiosas como las técnicas: un buen profesional explica el riesgo y la solución a personas no técnicas."
  }
);
