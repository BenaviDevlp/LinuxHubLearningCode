<div align="center">

# 🐧 BenaviDev · Cuaderno Linux Mint

### Aprende **Linux, Redes y Hacking Ético** de verdad — de la terminal a la nube.

Plataforma de aprendizaje interactiva hecha **100% con HTML, CSS y JavaScript puro** (sin frameworks ni librerías externas). Cursos guiados, terminal de práctica gamificada, quizzes, certificados y mucho más — todo funcionando en el navegador y guardando tu progreso en el propio dispositivo.

<!-- Badges (puedes editarlos o quitarlos) -->
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Sin frameworks](https://img.shields.io/badge/Vanilla-JS-success)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

</div>

---

## 🎬 Demo

> 🌐 **Demo en vivo:** _(añade aquí tu URL de GitHub Pages cuando lo publiques, ej. `https://tu-usuario.github.io/cuaderno-linux-mint/`)_

<!-- ============================================================
     ESPACIO PARA TUS CAPTURAS Y VIDEOS DE PRUEBA
     - Imágenes: arrastra el archivo aquí en el editor de GitHub
       o ponlo en /docs/screenshots/ y referencia la ruta.
     - Videos: arrástralos en la edición del README (GitHub genera
       un enlace) o sube un GIF.
     ============================================================ -->

### 🖼️ Capturas

| Inicio | Curso |
|--------|-------|
| _(imagen aquí)_ | _(imagen aquí)_ |

<!-- Ejemplo:
![Pantalla de inicio](docs/screenshots/inicio.png)
![Vista de curso](docs/screenshots/curso.png)
-->

### 🎥 Videos de prueba

> _Arrastra aquí tus videos/GIFs de demostración (tutorial guiado, terminal de misiones, quiz cronometrado...)._

<!-- Ejemplo:
https://user-images.githubusercontent.com/....mp4
-->

---

## ✨ Características

- 🎓 **Academia con cursos guiados:** Linux (Principiante, Intermedio, Avanzado), Bash, Python, Hacking Ético, Inglés Técnico y **Redes para Hacking**. Cada lección incluye teoría, ejemplos, código comentado, errores comunes, tips y contraparte defensiva (blue team).
- 🌐 **Curso de Redes orientado a seguridad:** OSI, TCP/IP, capa física y medios, enlace/MAC/VLAN, Ethernet, direccionamiento IPv4, **subnetting con VLSM**, encapsulación y troubleshooting — todo relacionado con el hacking ético.
- 💻 **Terminal de práctica gamificada:** comandos reales simulados (`ls`, `cd`, `mkdir`, `echo`, `rm`...) con **misiones por objetivos** verificables.
- 🚀 **Quizzes con sala de preparación** y **modo cronometrado** opcional.
- 📅 **Reto diario:** una pregunta nueva cada día para fomentar la racha.
- 🏁 **Proyectos prácticos** al final de cada curso.
- 📜 **Certificados** generados en SVG, descargables como PNG o PDF.
- 🏆 **Gamificación completa:** XP, nivel global, racha de estudio y logros desbloqueables.
- 👤 **Cuenta local:** perfil para personalizar tus certificados (contraseña guardada como hash con Web Crypto).
- 🧭 **Tutorial guiado** tipo spotlight para nuevos usuarios.
- 🔎 **Buscador global** de comandos, cursos, lecciones y temas.
- 🧰 **Diccionario de comandos** interactivo con favoritos.
- 🌙 **Tema claro / oscuro** y diseño **responsive** (móvil, tablet y escritorio).
- ♿ **Accesibilidad:** navegación por teclado, foco visible, etiquetas ARIA y `prefers-reduced-motion`.

---

## 🛠️ Tecnologías

- **HTML5** semántico.
- **CSS3**: variables, Flexbox, Grid, `clamp()` para tipografía fluida, animaciones y temas.
- **JavaScript (ES6+) vanilla**: sin frameworks ni dependencias.
- **localStorage** para persistencia del progreso.
- **Web Crypto API** (SHA-256) para la cuenta local.
- **SVG** para certificados e iconografía.

> Filosofía del proyecto: **cero dependencias**. Todo carga rápido y funciona offline una vez abierto.

---

## 🚀 Cómo ejecutarlo en local

Necesitas solo **Python 3** (viene de fábrica en la mayoría de distros Linux).

```bash
# 1) Entra en la carpeta del proyecto
cd cuaderno-linux-mint

# 2) Arranca el servidor local
python3 servidor.py            # http://localhost:8000

# (alternativa de una línea)
python3 -m http.server 8000
```

Abre `http://localhost:8000/` en tu navegador. ¡Listo!

### 🌍 Compartirlo por internet (temporal)

El proyecto incluye un script que publica el sitio en una URL pública (usa **cloudflared** si está disponible, o **localhost.run** por SSH como respaldo):

```bash
./publicar-20min.sh 8000 60     # público durante 60 minutos
```

---

## 📦 Estructura del proyecto

```
.
├── index.html              # Estructura principal (SPA)
├── css/
│   └── styles.css          # Estilos, temas y diseño responsive
├── js/
│   ├── datos.js            # Niveles, quizzes y catálogo de logros
│   ├── contenido.js        # Módulos y lecciones de la Academia
│   ├── redes.js            # Curso de Redes para Hacking
│   ├── comandos.js         # Diccionario de comandos
│   ├── app.js              # Lógica principal de la aplicación
│   ├── experiencia.js      # Tutorial, cuenta, sala de quiz y menú móvil
│   └── retos.js            # Reto diario, misiones de terminal y proyectos
├── og-image.svg            # Imagen de previsualización (Open Graph)
├── servidor.py             # Servidor local en Python (sin caché)
├── iniciar-servidor.sh     # Lanzador del servidor
└── publicar-20min.sh       # Publica el sitio con cloudflared / localhost.run
```

---

## 🌐 Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
4. Guarda. En unos minutos tendrás una URL fija tipo `https://tu-usuario.github.io/tu-repo/`.

> Al ser un sitio 100% estático, funciona en GitHub Pages sin configuración adicional.

---

## 🗺️ Roadmap (ideas futuras)

- [ ] Convertirlo en **PWA** instalable y offline.
- [ ] Compartir certificados y logros en redes sociales.
- [ ] Ranking / comunidad (requiere backend).
- [ ] Más cursos y proyectos prácticos.
- [ ] Interfaz multilenguaje (ES / EN).

---

## 🔒 Nota sobre el contenido de hacking

Todas las técnicas y herramientas de seguridad mostradas son con fines **educativos** y deben usarse **únicamente en entornos propios o con autorización explícita**. El uso indebido contra sistemas ajenos es ilegal.

---

## 👤 Autor

**BenaviDev** — _Desarrollo de software y contenido educativo._

> _Añade aquí tus enlaces: GitHub, LinkedIn, portafolio, correo de contacto..._

---

## 📄 Licencia

Distribuido bajo licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

<div align="center">

⭐ Si te gusta el proyecto, ¡no olvides darle una estrella en GitHub!

</div>
