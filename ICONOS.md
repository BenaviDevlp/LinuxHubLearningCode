# 🎨 Inventario de iconos (emoji → SVG)

Guía para sustituir los emojis de la interfaz por **iconos SVG**, que se ven igual en todos los navegadores y sistemas (los emojis cambian de estilo según el SO y a veces no cargan).

## Recomendación de set
Usar **[Lucide](https://lucide.dev)** (licencia MIT, SVG puro, sin dependencias). Alternativas equivalentes: **Tabler Icons** o **Feather**. Todos son gratis y se pueden copiar como SVG.

### Cómo implementarlo (compatible con todos los navegadores)
1. Crear **un sprite** `assets/icons.svg` con cada icono como `<symbol id="ic-...">`.
2. Insertarlos así (heredan el color del texto con `currentColor`, así sirven en tema claro/oscuro):
   ```html
   <svg class="ic" width="20" height="20" aria-hidden="true"><use href="assets/icons.svg#ic-user"></use></svg>
   ```
   ```css
   .ic { display:inline-block; vertical-align:-0.15em; fill:none; stroke:currentColor; stroke-width:2; }
   ```
3. Para máxima compatibilidad (incluido Safari antiguo) o si abres el archivo con `file://`, **inserta el SVG en línea** en vez del sprite externo (mismo resultado).

> Nota: las viñetas `•` (x254) y las flechas `← → ↔` son **texto**, no iconos; pueden quedarse o cambiarse por `arrow-left/arrow-right` si quieres consistencia total.

---

## Marca / logo
| Emoji | Uso | Icono propuesto |
|------|-----|-----------------|
| 🐧 | Logo de la marca | **Logo propio** ya creado en `assets/logo.svg` (marca de terminal `>_`) |

## Cabecera (botones de acción)
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 👤 | Mi cuenta | `user` |
| 💻 | Terminal de práctica | `square-terminal` |
| 🏆 | Logros | `trophy` |
| 🌙 / ☀ | Cambiar tema | `moon` / `sun` |
| ☰ | Menú móvil | `menu` |
| 🔍 / 🔎 | Buscadores | `search` |

## Niveles y módulos de la Academia
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 🌱 | Nivel/Módulo Principiante | `sprout` |
| ⚙ | Nivel/Módulo Intermedio | `settings` |
| 🚀 | Nivel/Módulo Avanzado | `rocket` |
| 📜 | Bash Scripting | `scroll-text` |
| 🐍 | Python | `file-code` (o `braces`) |
| 🛡 | Hacking Ético / Defensa | `shield` |
| 🌐 | Inglés Técnico | `languages` (o `globe`) |
| 📡 | Redes para Hacking | `radio` (o `network`) |

## Bloques de una lección
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 📘 | Concepto | `book-open` |
| 🔧 | Ejemplos prácticos | `wrench` |
| 💻 | Código de ejemplo | `code` |
| ⚠ | Errores comunes | `alert-triangle` |
| 🎓 | Tips del profesor | `graduation-cap` |
| 🛡 | Contraparte defensiva | `shield-check` |
| 🔗 | Comandos relacionados | `link` |
| 📝 | Mini resumen | `file-text` |
| ❓ | Preguntas de repaso | `help-circle` |
| ✅ | Lección completada | `check-circle-2` |
| ⭕ | Lección pendiente | `circle` |

## Pestañas (notas por nivel)
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 📝 | Mis notas | `notebook-pen` |
| 📚 | Guía | `book` |
| 🎯 | Quiz | `target` |

## Acciones de notas y formularios
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| ＋ | Nueva nota | `plus` |
| 💾 | Guardar | `save` |
| 🗑 | Eliminar | `trash-2` |
| ✏ | Editar | `pencil` |
| 📋 | Resumen / copiar | `clipboard-list` |
| ✕ | Cerrar modal | `x` |
| ⬇ | Descargar (.md/.txt) | `download` |
| 📄 | Texto / página | `file` |

## Quiz y sala de preparación
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| ✅ / ✔ | Corregir / marcar | `check` |
| 🔄 | Reintentar | `rotate-ccw` |
| 🌟 / ✨ | Resultado perfecto / crear | `sparkles` |
| 📊 | Intentos anteriores | `bar-chart-3` |
| ⏱ | Temporizador | `timer` |

## Certificados
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 📜 | Certificado | `award` |
| 🖼 | Descargar imagen (PNG) | `image` |
| 🖨 | Imprimir / PDF | `printer` |
| 🔒 | Bloqueado | `lock` |

## Reto diario, misiones y proyectos
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 📅 | Reto diario | `calendar-days` |
| 🧭 | Misiones / tutorial | `compass` |
| 🏗 | Proyecto / manos a la obra | `hammer` |
| ⚡ | Atajo "publicar en 1 comando" | `zap` |
| 💡 | Consejo | `lightbulb` |
| 🛑 | Detener | `octagon-x` |

## Diccionario de comandos
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 🧰 | Diccionario / herramientas | `wrench` (o `toolbox` en Tabler) |
| ★ / ☆ | Favorito (activo/inactivo) | `star` (relleno / contorno) |
| 💼 | "En un trabajo real" | `briefcase` |

## Logros / insignias (catálogo)
| Emoji | Logro | Icono (Lucide) |
|------|-------|----------------|
| 📝 | Primer paso | `file-pen` |
| ✍ | Tomador de notas | `pen-line` |
| 🏷 | Organizado | `tag` |
| 🧭 | Explorador | `compass` |
| 💻 | Maestro de la terminal | `square-terminal` |
| 🎯 | Autoevaluado | `target` |
| 🌟 | Puntuación perfecta | `sparkles` |
| 🏅 | Nivel dominado | `medal` |
| 📖 | Estudiante | `book-open` |
| ✅ | Tema completado | `check-circle-2` |
| 📚 | Devorador de cursos | `library` |
| 🎓 | Módulo dominado | `graduation-cap` |
| 📜 | Certificado | `award` |
| 🐍 | Hola Mundo en Python | `file-code` |
| ⚖ | Ética primero | `scale` |
| 🛡 | Nmap / Pentester | `shield` |
| 🌐 | 100 palabras en inglés | `languages` |
| 🔥 | En racha | `flame` |
| ⭐ | Nivel 5 | `star` |
| 🧰 | Caja de herramientas | `wrench` |
| 🧪 | Metodólogo | `flask-conical` |

## Otros (toasts, misc)
| Emoji | Uso | Icono (Lucide) |
|------|-----|----------------|
| 👋 | Bienvenida / sesión | `hand` |
| 👍 | Confirmación | `thumbs-up` |
| 🎉 | Cuenta creada | `party-popper` |
| 🔥 | Racha | `flame` |
| 🌍 / 🌐 | Publica tu web | `globe` |
| 📓 | Cuaderno | `notebook` |
| 📭 | Estado vacío | `inbox` |
| 💬 | Frases (inglés) | `message-circle` |
| 📰 | Lectura (inglés) | `newspaper` |
| 🃏 | Flashcards | `gallery-horizontal` (o `layers`) |
| ← → ↔ | Navegación | `arrow-left` / `arrow-right` / `move-horizontal` |

---

## Resumen
- **Total de emojis distintos a sustituir:** ~70 (sin contar viñetas `•` y flechas, que son texto).
- **Iconos únicos reales necesarios:** unos **45** (muchos emojis se repiten o comparten icono, p. ej. 🛡, 🧰, 🎯).
- **Set sugerido:** Lucide (MIT). Descargas cada SVG desde lucide.dev o el paquete completo y armas el sprite `assets/icons.svg`.

> Sugerencia de orden de trabajo: empieza por los más visibles (cabecera, niveles, bloques de lección y pestañas); esos ~20 iconos cubren el 80% de lo que ve el usuario.
