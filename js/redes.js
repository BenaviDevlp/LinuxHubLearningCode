/* ============================================================
   CURSO: REDES PARA HACKING (redes.js)
   Basado en el material de la carpeta /redes (redes.txt,
   Clase IPv4, VLSM y presentaciones). Cada lección relaciona
   los fundamentos de redes con la seguridad ofensiva/defensiva.
   Se engancha al sistema de Academia añadiéndose a MODULOS y
   LECCIONES (definidos en contenido.js).
   ============================================================ */
"use strict";

LECCIONES.redes = [

  /* ---------------- 1. INTRODUCCIÓN Y TIPOS DE RED ---------------- */
  {
    id: "rd-1", titulo: "Qué es una red y por qué importa al hacking",
    concepto:
      "Una red de computadoras es un sistema que interconecta múltiples dispositivos para compartir información, "
      + "recursos y servicios, tanto local como globalmente. Esa interconexión se logra con hardware (routers, switches, "
      + "cables) y protocolos que regulan la comunicación. Las redes evolucionaron desde simples LAN hasta Internet.\n\n"
      + "Por tamaño y alcance se clasifican en: PAN (personal), LAN (local, IEEE 802.3 Ethernet), CAN (campus), "
      + "MAN (metropolitana) y WAN (amplia, como Internet); también existen sus variantes inalámbricas (WPAN, WLAN, etc.).\n\n"
      + "Desde la óptica del hacking ético, la red ES la superficie de ataque: antes de tocar nada, un pentester estudia "
      + "qué tipo de red es, su alcance y qué dispositivos la forman. Entender la red es el primer paso del reconocimiento.",
    ejemplos:
      "• LAN: una universidad conecta oficinas, aulas y biblioteca para compartir sistemas académicos.\n"
      + "• WAN: una multinacional une sus sedes por enlaces privados y cifrados.\n"
      + "• En hacking: lo primero en una auditoría autorizada es mapear el alcance (qué redes/segmentos entran) y "
      + "dibujar la topología antes de escanear nada.",
    codigo:
      "# Ver tu equipo y tu red local (reconocimiento básico autorizado)\n"
      + "ip a                 # interfaces e IPs\n"
      + "ip route             # puerta de enlace (gateway)\n"
      + "hostname -I          # tu IP local rápida",
    errores: [
      "Confundir <code>Internet</code> (la red de redes) con <code>la Web</code> (un servicio que corre sobre ella).",
      "Creer que una LAN doméstica no es objetivo: toda red conectada es superficie de ataque.",
      "Escanear sin conocer el alcance autorizado: hacerlo fuera de él es ilegal."
    ],
    tips: [
      "Dibuja siempre la topología antes de actuar: te ahorra horas de confusión.",
      "Documenta cada dispositivo y su rol; el inventario es oro tanto para atacar (lab) como para defender."
    ],
    defensa:
      "Como defensor (blue team): mantén un inventario de activos actualizado y segmenta la red. No puedes proteger "
      + "lo que no sabes que existe; un activo olvidado suele ser la puerta de entrada.",
    comandos: ["ip", "ping"],
    preguntas: [
      "¿Qué diferencia hay entre una LAN y una WAN?",
      "¿Por qué el reconocimiento de la red es el primer paso de un pentest?"
    ]
  },

  /* ---------------- 2. MODELO OSI ---------------- */
  {
    id: "rd-2", titulo: "Modelo OSI: 7 capas y dónde ocurren los ataques",
    concepto:
      "El modelo OSI (Open Systems Interconnection) estandariza las funciones de una red en siete capas para facilitar "
      + "la interoperabilidad entre sistemas distintos:\n\n"
      + "7. Aplicación — interfaz con el usuario (HTTP, DNS).\n"
      + "6. Presentación — traducción/cifrado de datos.\n"
      + "5. Sesión — gestiona las sesiones entre aplicaciones.\n"
      + "4. Transporte — control de flujo y errores (TCP/UDP, puertos).\n"
      + "3. Red — direccionamiento lógico y enrutamiento (IP).\n"
      + "2. Enlace de datos — tramas entre nodos conectados (MAC).\n"
      + "1. Física — transmisión de bits por el medio.\n\n"
      + "En seguridad, el modelo OSI es un mapa mental: cada capa tiene sus propios ataques. Saber «en qué capa ocurre» "
      + "un problema te dice qué herramienta usar y cómo defenderte.",
    ejemplos:
      "• Navegar una web recorre las 7 capas en el emisor y se invierte en el receptor.\n"
      + "• Ataques por capa (en laboratorio autorizado): capa 2 → ARP spoofing; capa 3 → IP spoofing; "
      + "capa 4 → SYN flood (DoS); capa 7 → inyección SQL, XSS.\n"
      + "• Wireshark te deja ver cada capa de un paquete capturado, capa por capa.",
    codigo:
      "# Capturar tráfico para ver las capas en acción (solo en TU red/lab)\n"
      + "sudo tcpdump -i any -c 5\n"
      + "# En Wireshark, un filtro por capa de aplicación:\n"
      + "#   http        (capa 7)\n"
      + "#   tcp.port==443 (capa 4)\n"
      + "#   ip.addr==192.168.1.10 (capa 3)",
    errores: [
      "Memorizar las capas sin entender su función: el orden importa, pero el «por qué» más.",
      "Pensar que un ataque vive en una sola capa: muchos combinan varias (ej. MITM toca capas 2 y 3)."
    ],
    tips: [
      "Mnemotecnia de arriba a abajo: «Apliques Para Sesionar Tras Redes En Físico».",
      "Ante cualquier incidente pregúntate: ¿en qué capa OSI está ocurriendo esto?"
    ],
    defensa:
      "La «defensa en profundidad» aplica controles en varias capas: cifrado (6/7), firewall y segmentación (3/4), "
      + "port-security (2) y seguridad física (1). Si una capa falla, otra contiene el ataque.",
    comandos: ["wireshark", "tcpdump"],
    preguntas: [
      "¿En qué capa OSI trabaja un router? ¿Y un switch?",
      "Asocia un ataque a cada una de las capas 2, 3, 4 y 7."
    ]
  },

  /* ---------------- 3. MODELO TCP/IP Y PROTOCOLOS ---------------- */
  {
    id: "rd-3", titulo: "Modelo TCP/IP, protocolos y puertos",
    concepto:
      "El modelo TCP/IP es la arquitectura práctica de Internet, con cuatro capas: Acceso a red, Internet, Transporte "
      + "y Aplicación. Es más simple que OSI pero es el dominante en redes reales.\n\n"
      + "Los protocolos son las reglas que regulan cómo se transmiten los datos: IP (direccionamiento), TCP (fiable, "
      + "con conexión), UDP (rápido, sin conexión), HTTP, FTP, DNS, etc. Cada servicio escucha en un puerto.\n\n"
      + "En hacking, identificar puertos y servicios es el corazón de la fase de escaneo: un puerto abierto es un "
      + "servicio expuesto, y cada servicio es una posible vía de entrada.",
    ejemplos:
      "• Puertos típicos: 22 SSH, 80 HTTP, 443 HTTPS, 21 FTP, 53 DNS, 3306 MySQL.\n"
      + "• TCP vs UDP: una descarga usa TCP (fiable); una videollamada usa UDP (rápida, tolera pérdidas).\n"
      + "• En un pentest autorizado, <code>nmap -sV</code> revela qué servicios y versiones corren para planear la enumeración.",
    codigo:
      "# Servicios y versiones de TU equipo o de un objetivo autorizado\n"
      + "nmap -sV localhost\n"
      + "# Puertos abiertos en tu propia máquina y quién los usa\n"
      + "sudo ss -tulnp",
    errores: [
      "Confundir TCP (con conexión, fiable) con UDP (sin conexión, rápido).",
      "Olvidar que un puerto abierto = un servicio = una superficie de ataque.",
      "Asumir que el puerto estándar es el real: un servicio puede correr en un puerto no habitual."
    ],
    tips: [
      "Aprende de memoria los puertos comunes: agiliza muchísimo el análisis.",
      "Relaciona OSI con TCP/IP: la capa Internet de TCP/IP ≈ capa de Red (3) de OSI."
    ],
    defensa:
      "Reduce la superficie de ataque: cierra puertos y desactiva servicios que no uses, pon un firewall (ufw) y "
      + "expón hacia fuera solo lo imprescindible. Menos puertos abiertos, menos puertas que vigilar.",
    comandos: ["nmap", "netstat", "netcat"],
    preguntas: [
      "¿Cuántas capas tiene TCP/IP y cómo se comparan con OSI?",
      "¿Por qué un puerto abierto es relevante para un atacante y para un defensor?"
    ]
  }
];

/* ---------------- 4. CAPA FÍSICA, MEDIOS Y TOPOLOGÍAS ---------------- */
LECCIONES.redes.push({
  id: "rd-4", titulo: "Capa Física: medios de transmisión y topologías",
  concepto:
    "La Capa Física (capa 1 de OSI) establece, mantiene y desactiva la conexión física, transmitiendo bits sin "
    + "interpretarlos (impulsos eléctricos, ondas o pulsos de luz). Define voltajes, conectores, sincronización y "
    + "tasas de transferencia. Sus dispositivos: repetidores (regeneran señal) y hubs (reparten señal sin filtrar).\n\n"
    + "Medios de transmisión:\n"
    + "• Guiados: UTP (par trenzado sin blindaje), STP/FTP (con blindaje), coaxial y fibra óptica (pulsos de luz, "
    + "alta velocidad y alcance).\n"
    + "• No guiados (inalámbricos): radiofrecuencia/Wi-Fi (IEEE 802.11, bandas 2.4 y 5 GHz), microondas e infrarrojos.\n\n"
    + "Topologías: bus (un canal compartido), anillo (circuito cerrado), estrella (nodo central, switch/hub), "
    + "malla (todos con todos, redundante) e híbridas. Y el sentido de transmisión: Simplex, Half-Duplex y Full-Duplex.\n\n"
    + "En seguridad, el medio importa: una señal Wi-Fi viaja por el aire, así que cualquiera cerca puede capturarla; "
    + "el cobre puede pincharse físicamente (tapping). La capa física también incluye la seguridad física del cableado.",
  ejemplos:
    "• Red empresarial con UTP cat 6 a un switch central; campus con fibra entre edificios para baja latencia.\n"
    + "• Oficina con Wi-Fi 802.11ac (estrella en el cableado).\n"
    + "• En hacking (lab/propio): captura de tráfico Wi-Fi, detección de redes, o un «rogue AP» (punto de acceso "
    + "falso) para engañar a clientes. Solo en entornos autorizados.",
  codigo:
    "# Ver tus interfaces físicas y su estado\n"
    + "ip link show\n"
    + "# Ver interfaces inalámbricas (si hay)\n"
    + "iw dev 2>/dev/null || iwconfig 2>/dev/null",
  errores: [
    "Elegir el medio sin pensar en el entorno (longitud, interferencias, presupuesto).",
    "Usar topología en bus o anillo donde se necesita escalar: no crecen bien.",
    "Olvidar la seguridad física: un cable accesible o un puerto libre es un riesgo real."
  ],
  tips: [
    "En estrella, si falla un equipo no cae la red; pero si cae el nodo central, cae todo.",
    "La fibra no irradia señal eléctrica: es más difícil de «pinchar» que el cobre."
  ],
  defensa:
    "Protege la capa física: cifra el Wi-Fi (WPA2/WPA3), usa control de acceso por puerto (802.1X), desactiva los "
    + "puertos de switch sin uso y resguarda el cableado y los racks. La mejor captura es la que el atacante no puede hacer.",
  comandos: ["tcpdump", "wireshark"],
  preguntas: [
    "¿Qué ventaja de seguridad tiene la fibra frente al cobre?",
    "¿Por qué una red Wi-Fi es más fácil de espiar que una cableada?"
  ]
});

/* ---------------- 5. CAPA DE ENLACE, MAC Y VLAN ---------------- */
LECCIONES.redes.push({
  id: "rd-5", titulo: "Capa de Enlace: MAC, switches, VLAN y sus ataques",
  concepto:
    "La Capa de Enlace de Datos (capa 2) garantiza comunicación libre de errores entre dos nodos directamente "
    + "conectados. Empaqueta los datos en tramas, controla el acceso al medio y detecta errores. Se divide en dos "
    + "subniveles: MAC (Media Access Control: direccionamiento físico y acceso al medio) y LLC (Logical Link Control: "
    + "enlaces lógicos y control de errores).\n\n"
    + "Sus dispositivos: switches (reenvían tramas según la dirección MAC de destino) y bridges (segmentan LAN). "
    + "En redes conmutadas modernas cada puerto del switch es full-duplex y evita colisiones. Las VLAN permiten "
    + "segmentar lógicamente una misma infraestructura física.\n\n"
    + "La capa 2 es terreno fértil para ataques en LAN: la dirección MAC se puede falsificar con facilidad.",
  ejemplos:
    "• Un switch recibe una trama y la reenvía solo al puerto del MAC destino, optimizando la red.\n"
    + "• Ataques de capa 2 (solo en laboratorio autorizado): MAC spoofing (suplantar una MAC), ARP spoofing/poisoning "
    + "para hacer Man-in-the-Middle, CAM table overflow (MAC flooding) para forzar al switch a comportarse como hub, "
    + "y VLAN hopping para saltar entre VLAN.",
  codigo:
    "# Ver tu dirección MAC\n"
    + "ip link show\n"
    + "# Ver la tabla ARP (MAC ↔ IP de tu segmento)\n"
    + "ip neigh        # equivalente moderno de 'arp -a'",
  errores: [
    "Creer que un switch impide el espionaje: el ARP spoofing rompe esa suposición.",
    "Confiar en la MAC como identidad segura: se cambia en segundos.",
    "Dejar todos los puertos en la misma VLAN cuando deberían estar segmentados."
  ],
  tips: [
    "ARP no tiene autenticación: por eso el ARP spoofing funciona tan bien en LAN.",
    "Segmentar con VLAN reduce el «ruido» y limita hasta dónde llega un atacante."
  ],
  defensa:
    "Endurece la capa 2: activa port-security (limita MACs por puerto), DHCP snooping y Dynamic ARP Inspection (DAI), "
    + "y diseña bien las VLAN. Estas medidas frenan MAC flooding, ARP spoofing y VLAN hopping.",
  comandos: ["tcpdump", "wireshark", "netcat"],
  preguntas: [
    "¿Qué hace un switch con una trama según la dirección MAC?",
    "¿Por qué el ARP spoofing permite un ataque Man-in-the-Middle?"
  ]
});

/* ---------------- 6. ETHERNET ---------------- */
LECCIONES.redes.push({
  id: "rd-6", titulo: "Ethernet, dominios de colisión y CSMA/CD",
  concepto:
    "Ethernet (IEEE 802.3) es la familia de tecnologías dominante en redes LAN. Define el formato de las tramas, el "
    + "direccionamiento MAC y los métodos de acceso al medio. Opera en las capas física y de enlace, y ha evolucionado "
    + "de 10 Mbps a más de 400 Gbps.\n\n"
    + "Conceptos clave:\n"
    + "• Dominio de colisión: región donde los paquetes pueden colisionar. Con hubs el dominio era amplio; con switches, "
    + "cada puerto es su propio dominio de colisión.\n"
    + "• Dominio de difusión: área donde las tramas de broadcast llegan a todos; se controla con routers o VLAN.\n"
    + "• CSMA/CD: técnica para gestionar colisiones en half-duplex (escuchar antes de transmitir y reintentar tras una "
    + "colisión). En full-duplex moderno ya no es necesaria.\n\n"
    + "Para un atacante, la diferencia hub/switch es enorme: en un hub todo el tráfico es visible para todos.",
  ejemplos:
    "• Cambiar hubs por switches elimina dominios de colisión amplios y mejora el rendimiento.\n"
    + "• En seguridad: en una red con hub, capturar tráfico ajeno es trivial; en una con switch, el atacante recurre a "
    + "MAC flooding o ARP spoofing para volver a «ver» el tráfico (siempre en entornos autorizados).",
  codigo:
    "# Capturar tramas en tu interfaz (solo en TU red/lab)\n"
    + "sudo tcpdump -e -i any -c 10   # -e muestra las direcciones MAC",
  errores: [
    "Confundir dominio de colisión con dominio de difusión.",
    "Pensar que CSMA/CD sigue activo en redes full-duplex modernas."
  ],
  tips: [
    "Regla rápida: switch = un dominio de colisión por puerto; router/VLAN = separa dominios de difusión.",
    "Si capturas y ves tráfico que no es tuyo sin esfuerzo, probablemente hay un hub o un puerto espejo."
  ],
  defensa:
    "Usa switches gestionados, evita hubs y controla los puertos espejo (SPAN). Monitorea picos de tráfico de broadcast: "
    + "pueden indicar un MAC flooding en curso.",
  comandos: ["tcpdump", "wireshark"],
  preguntas: [
    "¿Por qué un switch reduce las colisiones frente a un hub?",
    "¿Qué separa los dominios de difusión?"
  ]
});

/* ---------------- 7. CAPA DE RED E IP ---------------- */
LECCIONES.redes.push({
  id: "rd-7", titulo: "Capa de Red: IP, routers y enrutamiento",
  concepto:
    "La Capa de Red (capa 3) se encarga del direccionamiento lógico y del enrutamiento de paquetes entre redes "
    + "distintas, aunque estén separadas por múltiples saltos. Asigna direcciones IP, determina rutas óptimas y "
    + "fragmenta/reensambla paquetes.\n\n"
    + "Direccionamiento IP:\n"
    + "• IPv4: 32 bits en notación decimal con puntos (ej. 192.168.0.1).\n"
    + "• IPv6: 128 bits en hexadecimal, creado por la escasez de IPv4 (ofrece ~3.4×10^38 direcciones, autoconfiguración "
    + "y elimina la necesidad de NAT).\n"
    + "Tipos de direcciones: unicast (un destino), broadcast (todos, solo IPv4) y multicast (un grupo).\n\n"
    + "Los routers encaminan paquetes entre redes usando tablas de enrutamiento y protocolos como RIP, OSPF o EIGRP. "
    + "En hacking, esta capa es donde se descubren hosts vivos y se define el alcance del ataque.",
  ejemplos:
    "• Una empresa conecta Bogotá, Medellín y Cali con routers; cada sede es una subred (192.168.1.0, 192.168.2.0...).\n"
    + "• En reconocimiento autorizado: un «ping sweep» (<code>nmap -sn</code>) descubre qué IPs están activas en un rango.\n"
    + "• IP spoofing: falsificar la IP de origen de un paquete (usado en ciertos DoS y evasiones, solo en lab).",
  codigo:
    "# Tu IP, tu red y tu gateway\n"
    + "ip a\n"
    + "ip route\n"
    + "# Descubrir hosts vivos en TU red local (autorizado)\n"
    + "nmap -sn 192.168.1.0/24",
  errores: [
    "Confundir IP privada (192.168.x, 10.x, 172.16-31.x) con IP pública.",
    "Olvidar que el broadcast solo existe en IPv4, no en IPv6.",
    "Escanear rangos que no están dentro del alcance autorizado."
  ],
  tips: [
    "El gateway es tu salida al resto de redes: identifícalo siempre primero.",
    "IPv6 elimina NAT: cambia la forma de pensar el direccionamiento y la exposición."
  ],
  defensa:
    "Aplica filtrado de rutas y anti-spoofing (uRPF), separa redes con el router/firewall y vigila barridos de ping "
    + "(un IDS puede detectar escaneos masivos de la capa 3).",
  comandos: ["ip", "ping", "nmap", "traceroute"],
  preguntas: [
    "¿Qué diferencia a IPv4 de IPv6 además del tamaño de dirección?",
    "¿Qué es un ping sweep y para qué sirve en reconocimiento?"
  ]
});

/* ---------------- 8. DIRECCIONAMIENTO IPv4 A FONDO ---------------- */
LECCIONES.redes.push({
  id: "rd-8", titulo: "Direccionamiento IPv4: clases, máscaras y operación AND",
  concepto:
    "Una dirección IPv4 tiene 4 octetos (32 bits). Cada octeto va de 0 a 255: en binario, 00000000 = 0 y 11111111 = 255 "
    + "(8 bits = 1 byte).\n\n"
    + "Clases de direcciones (con su máscara y prefijo):\n"
    + "• Clase A: 0.0.0.0 – 127.255.255.255 · máscara 255.0.0.0 · N.H.H.H · /8\n"
    + "• Clase B: 128.0.0.0 – 191.255.255.255 · máscara 255.255.0.0 · N.N.H.H · /16\n"
    + "• Clase C: 192.0.0.0 – 223.255.255.255 · máscara 255.255.255.0 · N.N.N.H · /24\n"
    + "• Clase D: 224.0.0.0 – 239.255.255.255 (multicast)\n"
    + "• Clase E: 240.0.0.0 – 255.255.255.255 (experimental)\n\n"
    + "Fórmulas: Cantidad de redes C.N = 2^N (N = nº de bits a 1) y Cantidad de hosts C.H = 2^N − 2 "
    + "(se restan la dirección de red y la de broadcast).\n\n"
    + "Operación lógica AND: para hallar la red a la que pertenece una IP se hace un AND binario entre la IP y la "
    + "máscara. En hacking, esto define el CIDR exacto que vas a escanear (ni más, ni menos).",
  ejemplos:
    "• 192.168.1.130 AND 255.255.255.0 → red 192.168.1.0. El host está en esa subred.\n"
    + "• Clase A: C.N = 2^7 = 128 redes; C.H = 2^24 − 2 = 16.777.214 hosts.\n"
    + "• En recon: si tu objetivo autorizado es 192.168.1.0/24, escaneas <code>nmap -sn 192.168.1.0/24</code> "
    + "(254 hosts útiles), sin salirte del rango permitido.",
  codigo:
    "# Escanear una red /24 entera (autorizada)\n"
    + "nmap -sn 192.168.1.0/24\n"
    + "# Pensar en binario: 255.255.255.0 = /24 = 24 bits de red\n"
    + "# Hosts útiles en /24 = 2^8 - 2 = 254",
  errores: [
    "Olvidar restar 2 (red y broadcast) al contar hosts útiles.",
    "Confundir la dirección de red (primera) con la de broadcast (última).",
    "Mezclar la clase con la máscara real: hoy se usa CIDR, no solo clases."
  ],
  tips: [
    "Memoriza las potencias de 2 (2,4,8,16,32,64,128,256): aceleran todo el subnetting.",
    "Conocer tu propio rango te ayuda a detectar IPs intrusas que no encajan."
  ],
  defensa:
    "Documenta tu plan de direccionamiento. Saber exactamente qué IPs/rango deberían existir permite detectar "
    + "dispositivos no autorizados (rogue) que aparezcan fuera del esquema.",
  comandos: ["nmap", "ip"],
  preguntas: [
    "¿Cuántos hosts útiles tiene una red /24? ¿Y cómo se calcula?",
    "Haz el AND de 10.0.5.77 con 255.255.255.0: ¿cuál es la red?"
  ]
});

/* ---------------- 9. SUBNETTING CON VLSM ---------------- */
LECCIONES.redes.push({
  id: "rd-9", titulo: "Subnetting con VLSM (ejemplo paso a paso)",
  concepto:
    "VLSM (Máscaras de Subred de Longitud Variable) es la técnica para diseñar un direccionamiento usando varias "
    + "máscaras distintas según la cantidad de hosts de cada subred: el número de hosts determina la longitud del "
    + "prefijo. Se usa para dividir una red en subredes de distinto tamaño aprovechando al máximo las direcciones, "
    + "con cuidado de NO solapar subredes.\n\n"
    + "Fórmulas: Cantidad de subredes = 2^n (bits a 1 prestados) y Cantidad de hosts = 2^n − 2 (bits a 0).\n\n"
    + "En un pentest, entender el subnetting te permite reconstruir el mapa de segmentos de una organización y "
    + "planear el movimiento lateral; para el defensor, segmentar bien limita hasta dónde puede llegar un intruso.",
  ejemplos:
    "EJEMPLO COMPLETO (clase C 192.168.2.0). Dependencias: Técnica 20 PC, Directiva 10 PC, Gerencia 1 PC.\n\n"
    + "Paso 1 — Ordenar de mayor a menor: Técnica (20), Directiva (10), Gerencia (1).\n"
    + "Paso 2 — Elegir la máscara más ajustada a cada una:\n"
    + "  • Técnica 20 PC → /27 (255.255.255.224) → 30 hosts útiles.\n"
    + "  • Directiva 10 PC → /28 (255.255.255.240) → 14 hosts útiles.\n"
    + "  • Gerencia 1 PC → /29 (255.255.255.248) → 6 hosts útiles.\n\n"
    + "Paso 3 — Diseño:\n"
    + "  • Técnica: red 192.168.2.0/27 · primer host 192.168.2.1 · broadcast 192.168.2.31 · "
    + "config 192.168.2.2–.21 · crecimiento .22–.30.\n"
    + "  • Directiva: red 192.168.2.32/28 · primer host .33 · broadcast .47 · config .34–.43 · crecimiento .44–.46.\n"
    + "  • Gerencia: red 192.168.2.48/29 · primer host .49 · broadcast .55 · config .50 · crecimiento .51–.54.\n"
    + "  • Siguiente subred libre: 192.168.2.56.",
  codigo:
    "# Plan VLSM del ejemplo (192.168.2.0)\n"
    + "# Técnica   192.168.2.0/27   mask 255.255.255.224   broadcast .31\n"
    + "# Directiva 192.168.2.32/28  mask 255.255.255.240   broadcast .47\n"
    + "# Gerencia  192.168.2.48/29  mask 255.255.255.248   broadcast .55\n"
    + "# Escanear una subred concreta del plan:\n"
    + "nmap -sn 192.168.2.32/28",
  errores: [
    "No ordenar las subredes de mayor a menor antes de asignar: lleva a solapamientos.",
    "Solapar rangos de subredes (la causa nº 1 de fallos en VLSM).",
    "Olvidar que la primera dirección es la de red y la última la de broadcast."
  ],
  tips: [
    "Asigna siempre primero la subred que necesita MÁS hosts.",
    "Deja un «rango de crecimiento»: las áreas crecen y agradecerás el margen."
  ],
  defensa:
    "Segmentar con VLSM no es solo eficiencia: aísla departamentos. Si un atacante compromete la subred de invitados, "
    + "una buena segmentación le impide saltar a la de servidores. La segmentación frena el movimiento lateral.",
  comandos: ["nmap"],
  preguntas: [
    "¿Por qué se asignan las subredes de mayor a menor en VLSM?",
    "En el ejemplo, ¿cuál es la dirección de broadcast de la subred de Directiva?"
  ]
});

/* ---------------- 10. ENCAPSULACIÓN DE DATOS ---------------- */
LECCIONES.redes.push({
  id: "rd-10", titulo: "Encapsulación de datos y análisis de paquetes",
  concepto:
    "La encapsulación es la adición progresiva de encabezados (y a veces pies/trailers) a los datos a medida que "
    + "bajan por las capas, desde Aplicación (7) hasta Física (1). Cada capa trata los datos como una PDU que se "
    + "transforma: datos → segmento (4) → paquete (3) → trama (2) → bits (1). En el receptor se invierte (desencapsulación).\n\n"
    + "Una trama Ethernet contiene: encabezado (MAC origen, MAC destino, tipo), datos (la carga útil, p. ej. un paquete IP) "
    + "y el FCS (Frame Check Sequence) para detectar errores.\n\n"
    + "Para un hacker/analista, entender la encapsulación es clave para leer paquetes capturados: cada capa deja sus "
    + "huellas (MAC, IP, puertos) que se inspeccionan con Wireshark o tcpdump.",
  ejemplos:
    "• Una solicitud HTTP baja por las 7 capas agregando información hasta convertirse en bits; el servidor la "
    + "desencapsula capa por capa para reconstruir el HTTP.\n"
    + "• En análisis (lab/propio): con Wireshark abres una trama y ves la MAC (capa 2), la IP (capa 3), el puerto "
    + "TCP (capa 4) y el contenido HTTP (capa 7), todo en el mismo paquete.",
  codigo:
    "# Capturar y guardar para analizar en Wireshark (solo TU red/lab)\n"
    + "sudo tcpdump -i any -w captura.pcap\n"
    + "# Ver tráfico HTTP en vivo con cabeceras\n"
    + "sudo tcpdump -A -i any port 80",
  errores: [
    "Confundir los nombres de la PDU por capa: segmento, paquete, trama y bits no son lo mismo.",
    "Creer que el contenido capturado siempre es legible: si va cifrado (TLS), el payload no se ve."
  ],
  tips: [
    "Regla mnemotécnica de la PDU: Datos→Segmento→Paquete→Trama→Bits (de capa 7 a 1).",
    "El FCS solo detecta errores; no los corrige: de eso se encargan capas superiores."
  ],
  defensa:
    "Cifra el tráfico (TLS/HTTPS, VPN): aunque un atacante capture los paquetes, el payload será inútil sin la clave. "
    + "El cifrado convierte un sniffing exitoso en datos basura.",
  comandos: ["tcpdump", "wireshark"],
  preguntas: [
    "Ordena las PDU desde la capa de aplicación hasta la física.",
    "¿Qué campos lleva el encabezado de una trama Ethernet?"
  ]
});

/* ---------------- 11. TROUBLESHOOTING Y RECONOCIMIENTO ---------------- */
LECCIONES.redes.push({
  id: "rd-11", titulo: "Troubleshooting y recon: las mismas herramientas",
  concepto:
    "El troubleshooting de redes es el proceso sistemático de identificar, diagnosticar y resolver problemas de "
    + "conectividad, con un enfoque jerárquico: de lo físico hacia lo lógico. Se apoya en herramientas de diagnóstico "
    + "y en pruebas de conectividad TCP/IP.\n\n"
    + "Herramientas clave: ping (ICMP, ¿hay conexión?), traceroute/tracert (ruta de saltos), ipconfig (Windows) / "
    + "ifconfig o ip (Linux) (config local), netstat/ss (conexiones y puertos) y nslookup/dig (resolución DNS).\n\n"
    + "El giro de hacking: estas MISMAS herramientas son la base del reconocimiento (recon). Diagnosticar y «mapear» "
    + "una red usan exactamente los mismos comandos; cambia la intención, no la herramienta.",
  ejemplos:
    "• Sin Internet: <code>ip a</code> muestra que no hay IP; revisas el cable (RJ45 mal) y se restablece.\n"
    + "• DNS caído: <code>dig</code>/<code>nslookup</code> revela una IP de servidor mal configurada.\n"
    + "• Orden de pruebas: <code>ping 127.0.0.1</code> (pila TCP/IP local) → ping al gateway (salida local) → "
    + "ping a un DNS/servidor remoto (salida a Internet).\n"
    + "• En recon autorizado: el mismo ping/traceroute/dig sirve para descubrir hosts, rutas y dominios del objetivo.",
  codigo:
    "# Diagnóstico = reconocimiento, escalando de lo local a lo remoto\n"
    + "ping -c 3 127.0.0.1            # ¿funciona mi pila TCP/IP?\n"
    + "ping -c 3 $(ip route | awk '/default/{print $3}')   # ¿llego al gateway?\n"
    + "traceroute -n 8.8.8.8          # ¿qué ruta sigo a Internet?\n"
    + "dig +short ejemplo.com         # ¿qué IP resuelve un dominio?\n"
    + "ss -tuln                       # ¿qué puertos tengo abiertos?",
  errores: [
    "No seguir el orden físico → lógico: saltarse pasos hace perder tiempo.",
    "Ignorar la pérdida de paquetes o los tiempos altos en ping: son pistas clave.",
    "Usar estas herramientas contra objetivos sin autorización: eso ya es ilegal."
  ],
  tips: [
    "Empieza siempre por lo físico: el 80% de los problemas son cable, puerto o IP mal puesta.",
    "ping al loopback (127.0.0.1) aísla si el problema es tu equipo o la red."
  ],
  defensa:
    "Monitorea y registra: un IDS/IPS puede detectar barridos de ping, traceroutes masivos o consultas DNS anómalas "
    + "que delaten una fase de reconocimiento en curso. Detectar el recon temprano frena el ataque.",
  comandos: ["ping", "traceroute", "ip", "netstat", "dig", "nmap"],
  preguntas: [
    "¿Cuál es el orden recomendado de pruebas de conectividad TCP/IP?",
    "¿Por qué las herramientas de troubleshooting son también herramientas de recon?"
  ]
});

/* ============================================================
   REGISTRO DEL MÓDULO EN LA ACADEMIA
   ============================================================ */
(function registrarModuloRedes() {
  if (typeof MODULOS === "undefined") return;
  if (MODULOS.some(m => m.id === "redes")) return;
  const mod = {
    id: "redes", nombre: "Redes para Hacking", icono: "📡",
    desc: "Fundamentos de redes (OSI, TCP/IP, IPv4, VLSM, Ethernet) explicados desde la seguridad ofensiva y defensiva.",
    cert: "Redes para Hacking Ético"
  };
  // Insertar justo después del módulo de Hacking Ético si existe
  const i = MODULOS.findIndex(m => m.id === "hacking");
  if (i >= 0) MODULOS.splice(i + 1, 0, mod);
  else MODULOS.push(mod);
})();
