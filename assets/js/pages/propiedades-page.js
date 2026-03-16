// propiedades-page.js — lógica de la página de listado de propiedades
// Maneja filtros, paginación y renderizado dinámico de cards

import { propiedades } from '../data/propiedades.js';
import { initTheme } from '../utils/theme.js';
import { initScroll } from '../utils/scroll.js';
import { initAnimations } from '../utils/animations.js';
import { initNav } from '../utils/nav.js';

// Inicializar utilidades compartidas (igual que main.js)
initTheme();
initScroll();
initAnimations();
initNav();

// ── Constantes ───────────────────────────────────────────────────────────────
const POR_PAGINA = 6;

// ── Estado de la app ─────────────────────────────────────────────────────────
let filtros = {
  texto: '',
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
    // Búsqueda por texto en título y ubicación
    if (filtros.texto) {
      const haystack = `${p.titulo} ${p.ubicacion}`.toLowerCase();
      if (!haystack.includes(filtros.texto.toLowerCase())) return false;
    }

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
    case '200-400':   return [200001, 400000];
    case 'mas-400':   return [400001, Infinity];
    default:          return [0, Infinity];
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

// ── HTML de una card ──────────────────────────────────────────────────────────

// SVG paths reutilizables (hardcodeados para evitar imports externos)
const SVG_HEART = `M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z`;
const SVG_WA = `M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z`;

function cardHTML(p) {
  // Primer dato: dormitorios o "Comercial" para locales
  const datoDorm = p.dormitorios > 0
    ? `<li class="card-propiedad__dato">🏠 ${p.dormitorios} amb.</li>`
    : `<li class="card-propiedad__dato">🏬 Comercial</li>`;

  const sufijoBano = p.banos === 1 ? 'baño' : 'baños';

  return `
    <li>
      <article class="card-propiedad">
        <div class="card-propiedad__imagen">
          <img src="${p.imagen}" alt="${p.alt}" width="400" height="300" loading="lazy" />
          <span class="card-propiedad__tipo">${p.tipo}</span>
          <button class="card-propiedad__favorito" aria-label="Guardar en favoritos">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="${SVG_HEART}" />
            </svg>
          </button>
        </div>
        <div class="card-propiedad__info">
          <p class="card-propiedad__ubicacion">📍 ${p.ubicacion}</p>
          <h3 class="card-propiedad__titulo">${p.titulo}</h3>
          <p class="card-propiedad__precio">${p.precio}</p>
          <ul class="card-propiedad__datos" role="list" aria-label="Características">
            ${datoDorm}
            <li class="card-propiedad__dato">🛁 ${p.banos} ${sufijoBano}</li>
            <li class="card-propiedad__dato">📐 ${p.superficie} m²</li>
          </ul>
          <div class="card-propiedad__acciones">
            <a href="/pages/ficha.html" class="card-propiedad__btn-ficha">Ver ficha</a>
            <a href="https://wa.me/549xxxxxxxxxx?text=${p.waMsg}"
              class="card-propiedad__btn-wa" target="_blank" rel="noopener noreferrer"
              aria-label="Consultar por WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="${SVG_WA}" />
              </svg>
            </a>
          </div>
        </div>
      </article>
    </li>
  `.trim();
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
  if (paginaActual > 1)              params.set('pagina', paginaActual);
  if (filtros.texto)                 params.set('q', filtros.texto);
  if (filtros.tipo !== 'todos')      params.set('tipo', filtros.tipo);
  if (filtros.dormitorios !== 'todos') params.set('dorm', filtros.dormitorios);
  if (filtros.precio !== 'todos')    params.set('precio', filtros.precio);

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
  filtros.texto       = params.get('q')      || '';
  filtros.tipo        = params.get('tipo')   || 'todos';
  filtros.dormitorios = params.get('dorm')   || 'todos';
  filtros.precio      = params.get('precio') || 'todos';
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
  document.getElementById('filtro-texto').value        = filtros.texto;
  document.getElementById('filtro-tipo').value         = filtros.tipo;
  document.getElementById('filtro-dormitorios').value  = filtros.dormitorios;
  document.getElementById('filtro-precio').value       = filtros.precio;
}

function initFiltros() {
  const inputTexto    = document.getElementById('filtro-texto');
  const selectTipo    = document.getElementById('filtro-tipo');
  const selectDorm    = document.getElementById('filtro-dormitorios');
  const selectPrecio  = document.getElementById('filtro-precio');
  const btnLimpiar    = document.getElementById('btn-limpiar');

  // Sincronizar valores del DOM con el estado (cargado desde URL)
  sincronizarDOM();

  const alCambiar = () => {
    filtros.texto       = inputTexto.value.trim();
    filtros.tipo        = selectTipo.value;
    filtros.dormitorios = selectDorm.value;
    filtros.precio      = selectPrecio.value;
    paginaActual = 1; // los filtros siempre resetean a la primera página
    renderizar();
  };

  inputTexto.addEventListener('input', alCambiar);
  selectTipo.addEventListener('change', alCambiar);
  selectDorm.addEventListener('change', alCambiar);
  selectPrecio.addEventListener('change', alCambiar);

  btnLimpiar.addEventListener('click', () => {
    filtros = { texto: '', tipo: 'todos', dormitorios: 'todos', precio: 'todos' };
    paginaActual = 1;
    sincronizarDOM();
    renderizar();
  });
}

// ── Arranque ──────────────────────────────────────────────────────────────────
leerURLParams();   // lee estado desde la URL actual
initFiltros();     // registra listeners y sincroniza DOM con el estado
renderizar();      // primer render (usa replaceState para no romper historial)
