# 🏠 OneHome — Sitio Web Inmobiliario
 
Sitio web inmobiliario real, actualmente en producción en Don Web, desarrollado con JavaScript vanilla. Pedido de un cliente real y también realizado a modo de proyecto para portfolio e implementar buenas prácticas de fundamentos de Desarrollo Web y trabajo profesional con herramientas de IA.
 
**Demo en vivo:** `[link]` &nbsp;|&nbsp; **GitHub:** [ivanpugliese1/onehome-real-state](https://github.com/ivanpugliese1/onehome-real-state)
 
---
 
## 🧰 Stack tecnológico
 
| Capa | Tecnología |
|---|---|
| Markup | HTML5 semántico con Schema.org JSON-LD |
| Estilos | CSS3 con metodología BEM (custom properties, Flexbox, Grid) |
| Lógica | JavaScript vanilla con ES Modules (un archivo por funcionalidad) |
| SEO | Datos estructurados `RealEstateListing`, Open Graph, sitemap.xml, robots.txt |
| Integraciones | WhatsApp Business API (contacto directo con el agente) |
| Hosting | Don Web |
 
---

## ✨ Funcionalidades
 
- **Arquitectura multipágina** con ES Modules — separación de responsabilidades sin necesidad de un bundler
- **Diseño mobile-first** — responsive para móvil, tablet y escritorio
- **Paginación con estado en la URL** — el número de página persiste en los query params, permitiendo compartir y bookmarkear resultados
- **Captura de leads por WhatsApp** — mensaje pre-completado con los datos de la propiedad, enviado directamente al agente
- **Schema.org JSON-LD** — datos estructurados para listados inmobiliarios (`RealEstateListing`), mejorando la comprensión por motores de búsqueda
- **Open Graph tags** — previsualización al compartir en redes sociales
- **Validación de formularios en frontend** — mensajes de error en español, validación de formato de email y teléfono argentino
- **Performance** — imágenes optimizadas (máx 200kb), carga rápida, compatibilidad con navegadores modernos

---
 
## 🌐 Proyecto real en producción
 
Este no es un proyecto de práctica descartable. Es un sitio real, encargado por un cliente, deployado en Don Web con dominio propio. Eso implicó tomar decisiones que van más allá del código:
 
- Configurar el entorno de desarrollo local antes del deploy
- Pensar en el ciclo de vida del dominio y su renovación
- Coordinar con el cliente los contenidos, las propiedades a publicar y el flujo de contacto
- Adaptar la validación de formularios al contexto argentino (formato de teléfono local)
 
---
 
## 🤖 Desarrollado con Claude Code
 
Este proyecto fue construido usando [Claude Code](https://www.anthropic.com/claude-code), la herramienta de coding agéntico de Anthropic. Más allá del output técnico, lo usé para practicar una forma deliberada y profesional de trabajar con IA, utilizando el contexto adecuado a traves de AGENTS.md
 
### CLAUDE.md — instrucciones de proyecto para la IA
 
Una de las prácticas más importantes en este proyecto fue crear un archivo `CLAUDE.md` en la raíz del repositorio. Este archivo le da contexto permanente a Claude Code sobre cómo trabajar en este proyecto específico: qué convenciones de nombres usar, cómo estructurar el CSS, qué reglas de SEO aplicar, y cuál es el público objetivo del sitio.
 
### Cómo trabajé con Claude Code
 
**Decisiones de arquitectura primero, código después.**
Antes de escribir una sola línea, usé Claude para razonar la estructura: si usar un framework o quedarme en vanilla, cómo organizar los módulos, cómo manejar los datos. Asi moldee la arquitectura.
 
**Prompts con contexto**
En lugar de "haceme un componente de tarjeta de propiedad", daba el panorama completo: la estructura de carpetas, la convención BEM del CSS, la metodología de un archivo JS por funcionalidad. Los prompts específicos producen outputs específicos y utilizables.
 
**Iterando con criterio, no aceptando todo.**
Cuando Claude generaba código que no entendía del todo o con el que no estaba de acuerdo, lo cuestionaba. Le pedía que explicara decisiones, propusiera alternativas y simplificara donde fuera posible. El objetivo siempre fue apropiarme del código, no solo deployarlo.
 
---
 
## 📁 Estructura del proyecto
 
```
onehome-real-state/
├── index.html
├── CLAUDE.md              # Instrucciones de proyecto para Claude Code
├── .claude/
│   └── estructura.md      # Documentación extendida de arquitectura
├── assets/
│   ├── css/               # Estilos con metodología BEM
│   ├── js/                # Un archivo por funcionalidad (ES Modules)
│   └── img/               # Imágenes optimizadas (máx 200kb)
└── pages/                 # Páginas del sitio
```
 
---
 
## 🧠 Qué aprendí

- **Vanilla JS** Fortaleciendo el conocimiento, entendiendo cómo funcionan los módulos, el DOM y el event loop sin una abstracción de framework.
- **El `CLAUDE.md` es una buena práctica real.** Documentar las convenciones del proyecto no solo ayuda a la IA — ayuda a cualquier persona (o a mi mismo en un lapzo de tiempo) a entrar al código sin perderse.
- **Las IA amplifica mis conocimientos.** La calidad del output se correlaciona directamente con la claridad de mis peticiones e intenciones para con el proyecto.
- **Desarrollar para un cliente real** Desarrollé un proyecto para un cliente real, aprendiendo a tomar decisiones con consecuencias concretas y a colaborar activamente entendiendo sus necesidades.

---
 
## 🚀 Correr en local
 
```bash
# Clonar el repositorio
git clone https://github.com/ivanpugliese1/onehome-real-state.git
 
# Abrir con cualquier servidor estático, por ejemplo:
npx serve .
# o simplemente abrir index.html directo en el navegador
```
 
Sin dependencias. Sin instalaciones. Ese es el punto.
 
---
 
## 👤 Autor
 
**Ivan Pugliese**
Asesor Comercial B2B → en transición hacia el Desarrollo de Software

[GitHub](https://github.com/ivanpugliese1) · [LinkedIn](https://linkedin.com/in/ivan-pugliese)
 