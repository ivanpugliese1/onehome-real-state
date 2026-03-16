# Estructura completa de carpetas

onehome-inmobiliaria/
├── index.html                → página principal
├── pages/                    → HTMLs de cada página
│   ├── propiedades.html
│   ├── vender.html
│   └── nosotros.html
├── assets/
│   ├── components/           → generan HTML dinámico y manejan eventos del DOM
│   │   ├── header.js
│   │   ├── footer.js
│   │   └── card-propiedad.js
│   ├── services/             → lógica de negocio pura, sin tocar el DOM
│   │   └── propiedades.js
│   ├── utils/                → funciones genéricas reutilizables
│   │   ├── formatear.js
│   │   └── validaciones.js
│   ├── styles/               → CSS organizado por capas
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   └── variables.css
│   │   ├── components/       → estilos por componente
│   │   └── pages/            → estilos por página
│   └── images/               → imágenes optimizadas
│       ├── propiedades/
│       └── icons/
├── .claude/
│   └── estructura.md         → este archivo
└── CLAUDE.md
