// main.js — punto de entrada de todo el JavaScript del sitio
// Importa e inicializa cada módulo usando ES Modules

import { initTheme } from './utils/theme.js';
import { initScroll } from './utils/scroll.js';
import { initAnimations } from './utils/animations.js';
import { initNav } from './utils/nav.js';

initTheme();     // primero: aplica el tema antes de renderizar el resto
initScroll();
initAnimations();
initNav();
