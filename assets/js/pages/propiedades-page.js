import { propiedades } from '../data/propiedades.js';
import { initTheme } from '../utils/theme.js';
import { initScroll } from '../utils/scroll.js';
import { initAnimations } from '../utils/animations.js';
import { initNav } from '../utils/nav.js';
import { cardHTML } from '../components/state-card.js';

initTheme();
initScroll();
initAnimations();
initNav();

const POR_PAGINA = 6;

let filtros = {
  tipo: 'todos',
  dormitorios: 'todos',
  precio: 'todos',
};
let paginaActual = 1;
let esPrimerRender = true;

const gridEl = document.getElementById('grid-propiedades');
const contadorEl = document.getElementById('contador-propiedades');
const paginacionEl = document.getElementById('paginacion');
const sinResultadosEl = document.getElementById('sin-resultados');

function propiedadesFiltradas() {
  return propiedades.filter((p) => {
    if (filtros.tipo !== 'todos' && p.tipo !== filtros.tipo) return false;

    if (filtros.dormitorios !== 'todos') {
      const dorms = parseInt(filtros.dormitorios, 10);
      if (filtros.dormitorios === '4') {
        if (p.dormitorios < 4) return false;
      } else {
        if (p.dormitorios !== dorms) return false;
      }
    }

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

function renderizar() {
  const lista = propiedadesFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));

  if (paginaActual > totalPaginas) paginaActual = 1;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const fin = inicio + POR_PAGINA;
  const slice = lista.slice(inicio, fin);

  if (lista.length === 0) {
    gridEl.innerHTML = '';
    gridEl.hidden = true;
    sinResultadosEl.hidden = false;
  } else {
    gridEl.hidden = false;
    sinResultadosEl.hidden = true;
    gridEl.innerHTML = slice.map(p => cardHTML(p, 'ficha.html')).join('');
  }

  if (lista.length > 0) {
    const desde = inicio + 1;
    const hasta = Math.min(fin, lista.length);
    const total = lista.length;
    const palabra = total === 1 ? 'propiedad' : 'propiedades';
    contadorEl.textContent = `Mostrando ${desde}–${hasta} de ${total} ${palabra}`;
  } else {
    contadorEl.textContent = '';
  }

  renderPaginacion(totalPaginas);

  actualizarURL(esPrimerRender);
  esPrimerRender = false;
}

function renderPaginacion(totalPaginas) {
  if (totalPaginas <= 1) {
    paginacionEl.innerHTML = '';
    paginacionEl.hidden = true;
    return;
  }
  paginacionEl.hidden = false;

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

  paginacionEl.querySelectorAll('[data-pagina]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nueva = parseInt(btn.dataset.pagina, 10);
      if (!isNaN(nueva) && nueva >= 1 && nueva <= totalPaginas) {
        paginaActual = nueva;
        renderizar();
        document.getElementById('listado').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

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

window.addEventListener('popstate', (e) => {
  if (e.state) {
    paginaActual = e.state.paginaActual;
    filtros = { ...e.state.filtros };
    sincronizarDOM();
    renderizar();
  }
});

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

  sincronizarDOM();

  const alCambiar = () => {
    filtros.tipo = selectTipo.value;
    filtros.dormitorios = selectDorm.value;
    filtros.precio = selectPrecio.value;
    paginaActual = 1;
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

leerURLParams();
initFiltros();
renderizar();
