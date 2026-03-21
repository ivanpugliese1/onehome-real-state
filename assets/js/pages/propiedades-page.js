// propiedades-page.js — lógica de la página de listado de propiedades
// Maneja filtros, paginación y renderizado dinámico de cards

import { propiedades } from '../data/propiedades.js';
import { initTheme } from '../utils/theme.js';
import { initScroll } from '../utils/scroll.js';
import { initAnimations } from '../utils/animations.js';
import { initNav } from '../utils/nav.js';
import { cardHTML } from '../components/state-card.js';

// Inicializar utilidades compartidas (igual que main.js)
initTheme();
initScroll();
initAnimations();
initNav();

// ── Constantes ───────────────────────────────────────────────────────────────
const POR_PAGINA = 6;

// ── Estado de la app ─────────────────────────────────────────────────────────
let filtros = {
  tipo: 'todos',
  dormitorios: 'todos',
  precio: 'todos',
};
let paginaActual = 1;
let esPrimerRender = true;

// ── Referencias DOM ───────────────────────────────────────────────────────────
const gridEl = document.getElementById('grid-propiedades');
const contadorEl = document.getElementById('contador-propiedades');
const paginacionEl = document.getElementById('paginacion');
const sinResultadosEl = document.getElementById('sin-resultados');

// ── Filtrado ──────────────────────────────────────────────────────────────────

function propiedadesFiltradas() {
  return propiedades.filter((p) => {
    // Tipo (Venta / Alquiler)
    if (filtros.tipo !== 'todos' && p.tipo !== filtros.tipo) return false;

    // Dormitorios (4 = "4 o más")
    if (filtros.dormitorios !== 'todos') {
      const dorms = parseInt(filtros.dormitorios, 10);
      if (filtros.dormitorios === '4') {
        if (p.dormitorios < 4) return false;
      } else {
        if (p.dormitorios !== dorms) return false;
      }
    }

    // Precio — solo filtra propiedades en USD (ventas);
    // las de alquiler en ARS pasan este filtro siempre
    if (filtros.precio !== 'todos' && p.moneda === 'USD') {
      const [min, max] = rangoPrecio(filtros.precio);
      if (p.precioNum < min || p.precioNum > max) return false;
    }

    return true;
  });
}

function rangoPrecio(opcion) {
  switch (opcion) {
    case 'hasta-200': return [0, 200000];
    case '200-400': return [200001, 400000];
    case 'mas-400': return [400001, Infinity];
    default: return [0, Infinity];
  }
}

// ── Renderizado principal ─────────────────────────────────────────────────────

function renderizar() {
  const lista = propiedadesFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));

  // Si la página actual quedó fuera de rango (ej: al filtrar), ir a la 1
  if (paginaActual > totalPaginas) paginaActual = 1;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const fin = inicio + POR_PAGINA;
  const slice = lista.slice(inicio, fin);

  // Grid de cards
  if (lista.length === 0) {
    gridEl.innerHTML = '';
    gridEl.hidden = true;
    sinResultadosEl.hidden = false;
  } else {
    gridEl.hidden = false;
    sinResultadosEl.hidden = true;
    gridEl.innerHTML = slice.map(cardHTML).join('');
  }

  // Texto informativo del contador
  if (lista.length > 0) {
    const desde = inicio + 1;
    const hasta = Math.min(fin, lista.length);
    const total = lista.length;
    const palabra = total === 1 ? 'propiedad' : 'propiedades';
    contadorEl.textContent = `Mostrando ${desde}–${hasta} de ${total} ${palabra}`;
  } else {
    contadorEl.textContent = '';
  }

  // Paginación
  renderPaginacion(totalPaginas);

  // Actualizar URL (replaceState en el primer render para no romper el historial)
  actualizarURL(esPrimerRender);
  esPrimerRender = false;
}


// ── Paginación ────────────────────────────────────────────────────────────────

function renderPaginacion(totalPaginas) {
  if (totalPaginas <= 1) {
    paginacionEl.innerHTML = '';
    paginacionEl.hidden = true;
    return;
  }
  paginacionEl.hidden = false;

  // Ventana deslizante: siempre incluye primera, última y ±2 alrededor de la actual
  const paginasVisibles = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === 1 ||
      i === totalPaginas ||
      (i >= paginaActual - 2 && i <= paginaActual + 2)
    ) {
      paginasVisibles.push(i);
    }
  }

  // Construir botones insertando "…" donde haya saltos
  const items = [];
  for (let j = 0; j < paginasVisibles.length; j++) {
    if (j > 0 && paginasVisibles[j] - paginasVisibles[j - 1] > 1) {
      items.push(`<span class="paginacion__ellipsis" aria-hidden="true">…</span>`);
    }
    const esActivo = paginasVisibles[j] === paginaActual;
    items.push(`
      <button
        class="paginacion__btn${esActivo ? ' paginacion__btn--activo' : ''}"
        data-pagina="${paginasVisibles[j]}"
        aria-label="Ir a página ${paginasVisibles[j]}"
        ${esActivo ? 'aria-current="page"' : ''}
      >${paginasVisibles[j]}</button>
    `);
  }

  paginacionEl.innerHTML = `
    <button class="paginacion__btn paginacion__btn--nav"
      data-pagina="${paginaActual - 1}"
      ${paginaActual === 1 ? 'disabled' : ''}
      aria-label="Página anterior">
      ‹ Anterior
    </button>
    <div class="paginacion__nums" role="list" aria-label="Páginas">
      ${items.join('')}
    </div>
    <button class="paginacion__btn paginacion__btn--nav"
      data-pagina="${paginaActual + 1}"
      ${paginaActual === totalPaginas ? 'disabled' : ''}
      aria-label="Página siguiente">
      Siguiente ›
    </button>
  `;

  // Delegación de eventos en el contenedor de paginación
  paginacionEl.querySelectorAll('[data-pagina]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nueva = parseInt(btn.dataset.pagina, 10);
      if (!isNaN(nueva) && nueva >= 1 && nueva <= totalPaginas) {
        paginaActual = nueva;
        renderizar();
        // Scroll suave al inicio de la sección de listado
        document.getElementById('listado').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── URL y navegación con historial ────────────────────────────────────────────

function actualizarURL(reemplazar = false) {
  const params = new URLSearchParams();
  if (paginaActual > 1) params.set('pagina', paginaActual);
  if (filtros.tipo !== 'todos') params.set('tipo', filtros.tipo);
  if (filtros.dormitorios !== 'todos') params.set('dorm', filtros.dormitorios);
  if (filtros.precio !== 'todos') params.set('precio', filtros.precio);

  const nuevaURL = params.toString()
    ? `${window.location.pathname}?${params}`
    : window.location.pathname;

  const estado = { paginaActual, filtros: { ...filtros } };

  if (reemplazar) {
    history.replaceState(estado, '', nuevaURL);
  } else {
    history.pushState(estado, '', nuevaURL);
  }
}

function leerURLParams() {
  const params = new URLSearchParams(window.location.search);
  paginaActual = parseInt(params.get('pagina') || '1', 10);
  filtros.tipo = params.get('tipo') || 'todos';
  filtros.dormitorios = params.get('dorm') || 'todos';
  filtros.precio = params.get('precio') || 'todos';
}

// Soporte para botón atrás/adelante del navegador
window.addEventListener('popstate', (e) => {
  if (e.state) {
    paginaActual = e.state.paginaActual;
    filtros = { ...e.state.filtros };
    sincronizarDOM();
    renderizar();
  }
});

// ── Filtros: event listeners ──────────────────────────────────────────────────

function sincronizarDOM() {
  document.getElementById('filtro-tipo').value = filtros.tipo;
  document.getElementById('filtro-dormitorios').value = filtros.dormitorios;
  document.getElementById('filtro-precio').value = filtros.precio;
}

function initFiltros() {
  const selectTipo = document.getElementById('filtro-tipo');
  const selectDorm = document.getElementById('filtro-dormitorios');
  const selectPrecio = document.getElementById('filtro-precio');
  const btnLimpiar = document.getElementById('btn-limpiar');

  // Sincronizar valores del DOM con el estado (cargado desde URL)
  sincronizarDOM();

  const alCambiar = () => {
    filtros.tipo = selectTipo.value;
    filtros.dormitorios = selectDorm.value;
    filtros.precio = selectPrecio.value;
    paginaActual = 1; // los filtros siempre resetean a la primera página
    renderizar();
  };

  selectTipo.addEventListener('change', alCambiar);
  selectDorm.addEventListener('change', alCambiar);
  selectPrecio.addEventListener('change', alCambiar);

  btnLimpiar.addEventListener('click', () => {
    filtros = { tipo: 'todos', dormitorios: 'todos', precio: 'todos' };
    paginaActual = 1;
    sincronizarDOM();
    renderizar();
  });
}

// ── Arranque ──────────────────────────────────────────────────────────────────
leerURLParams();   // lee estado desde la URL actual
initFiltros();     // registra listeners y sincroniza DOM con el estado
renderizar();      // primer render (usa replaceState para no romper historial)
