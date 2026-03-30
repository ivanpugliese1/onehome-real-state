import { propiedades } from '../data/propiedades.js';
import { initTheme } from '../utils/theme.js';
import { initScroll } from '../utils/scroll.js';
import { initAnimations } from '../utils/animations.js';
import { initNav } from '../utils/nav.js';

initTheme();
initScroll();
initAnimations();
initNav();

const WA_NUMERO = '5491100000000';
const SITE_URL  = 'https://onehome.com.ar';

const params    = new URLSearchParams(window.location.search);
const idParam   = parseInt(params.get('id'), 10);
const propiedad = propiedades.find((p) => p.id === idParam);

if (!propiedad) {
  window.location.href = '/pages/propiedades.html';
}

function getDescripcion(p) {
  const intro = p.dormitorios > 0
    ? `Excelente ${p.titulo.toLowerCase()} disponible en ${p.ubicacion}.`
    : `Excelente espacio comercial en ${p.ubicacion}.`;

  const detalle = p.dormitorios > 0
    ? `Cuenta con ${p.dormitorios} ambiente${p.dormitorios > 1 ? 's' : ''}, ` +
      `${p.banos} baño${p.banos > 1 ? 's' : ''} y ${p.superficie} m² de superficie total.`
    : `Con ${p.superficie} m² de superficie ideal para tu negocio.`;

  const cierre = p.tipo === 'Venta'
    ? 'Una oportunidad única para invertir en una de las zonas más cotizadas del país.'
    : 'Alquiler disponible de inmediato. Consultá nuestras condiciones y reservá tu visita.';

  return `${intro} ${detalle} ${cierre}`;
}

function getImagenes(p) {
  return [
    { src: p.imagen, alt: p.alt },
    { src: `https://picsum.photos/seed/${p.slug}-2/800/600`, alt: `${p.titulo} — vista interior` },
    { src: `https://picsum.photos/seed/${p.slug}-3/800/600`, alt: `${p.titulo} — detalle` },
    { src: `https://picsum.photos/seed/${p.slug}-4/800/600`, alt: `${p.titulo} — ambiente` },
  ];
}

function getCaracteristicas(p) {
  const lista = [
    { icono: '📐', valor: `${p.superficie} m²`, etiqueta: 'Superficie total' },
  ];
  if (p.dormitorios > 0) {
    lista.push({ icono: '🛏️', valor: `${p.dormitorios}`, etiqueta: `Ambiente${p.dormitorios > 1 ? 's' : ''}` });
  }
  lista.push({ icono: '🚿', valor: `${p.banos}`, etiqueta: `Baño${p.banos > 1 ? 's' : ''}` });

  if (p.superficie >= 150) {
    lista.push({ icono: '🚗', valor: 'Sí', etiqueta: 'Cochera' });
  }
  if (p.superficie >= 200) {
    lista.push({ icono: '🌊', valor: 'Sí', etiqueta: 'Pileta' });
  }
  lista.push({ icono: '📅', valor: 'A estrenar', etiqueta: 'Estado' });
  if (p.tipo === 'Alquiler') {
    lista.push({ icono: '🐾', valor: 'Consultar', etiqueta: 'Mascotas' });
  }

  return lista;
}

function getFeatures(p) {
  const base = [
    'Luminoso',
    'Calefacción central',
    'Agua caliente',
    'Portero eléctrico',
  ];
  if (p.superficie >= 100) base.push('Lavadero');
  if (p.superficie >= 150) base.push('Jardín');
  if (p.superficie >= 200) base.push('Quincho');
  if (p.dormitorios >= 3)  base.push('Vestidor');
  if (p.tipo === 'Alquiler') base.push('Expensas incluidas');
  return base;
}

function actualizarSEO(p) {
  const titulo = `${p.titulo} | One Home`;
  const desc   = getDescripcion(p);
  const url    = `${SITE_URL}/pages/ficha.html?id=${p.id}`;
  const imagen = p.imagen;

  document.title = titulo;
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);

  document.querySelector('meta[property="og:title"]')?.setAttribute('content', titulo);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', imagen);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': p.titulo,
    'description': desc,
    'url': url,
    'image': imagen,
    'offers': {
      '@type': 'Offer',
      'price': p.precioNum,
      'priceCurrency': p.moneda,
      'availability': 'https://schema.org/InStock',
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': p.ubicacion,
      'addressCountry': 'AR',
    },
    'floorSize': {
      '@type': 'QuantitativeValue',
      'value': p.superficie,
      'unitCode': 'MTK',
    },
    'numberOfRooms': p.dormitorios > 0 ? p.dormitorios : undefined,
    'numberOfBathroomsTotal': p.banos,
  };

  const scriptLd = document.getElementById('json-ld');
  if (scriptLd) scriptLd.textContent = JSON.stringify(jsonLd, null, 2);
}

const SVG_UBICACION = `M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z`;
const SVG_WA        = `M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z`;
const SVG_CHECK     = `M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z`;
const SVG_COPY      = `M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z`;
const SVG_HEART     = `M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z`;

function crearElemento(tag, clases = [], atributos = {}) {
  const el = document.createElement(tag);
  if (clases.length) el.className = clases.join(' ');
  Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function crearSVG(path, ancho = 24, alto = 24) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  svg.setAttribute('aria-hidden', 'true');
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', path);
  svg.appendChild(pathEl);
  return svg;
}

function renderGaleria(p) {
  const imagenes = getImagenes(p);
  const section = crearElemento('section', ['ficha__galeria'], { 'aria-label': 'Galería de imágenes' });

  const principal = crearElemento('div', ['ficha__galeria-principal']);
  const imgPrincipal = crearElemento('img', [], {
    src: imagenes[0].src,
    alt: imagenes[0].alt,
    width: '800',
    height: '600',
  });
  principal.appendChild(imgPrincipal);
  section.appendChild(principal);

  if (imagenes.length > 1) {
    const miniaturas = crearElemento('div', ['ficha__miniaturas'], { role: 'list', 'aria-label': 'Miniaturas de galería' });

    imagenes.forEach((img, i) => {
      const thumb = crearElemento('button', ['ficha__miniatura', ...(i === 0 ? ['ficha__miniatura--activa'] : [])], {
        'aria-label': `Ver imagen ${i + 1}: ${img.alt}`,
        role: 'listitem',
        type: 'button',
      });
      const imgThumb = crearElemento('img', [], {
        src: img.src,
        alt: img.alt,
        width: '100',
        height: '72',
        loading: 'lazy',
      });
      thumb.appendChild(imgThumb);

      thumb.addEventListener('click', () => {
        miniaturas.querySelectorAll('.ficha__miniatura').forEach((t) => t.classList.remove('ficha__miniatura--activa'));
        thumb.classList.add('ficha__miniatura--activa');

        imgPrincipal.classList.add('transicionando');
        setTimeout(() => {
          imgPrincipal.src = img.src;
          imgPrincipal.alt = img.alt;
          imgPrincipal.classList.remove('transicionando');
        }, 200);
      });

      miniaturas.appendChild(thumb);
    });

    section.appendChild(miniaturas);
  }

  return section;
}

function renderInfoPrincipal(p) {
  const article = crearElemento('article', ['ficha__contenido']);

  const badge = crearElemento('span', ['ficha__badge']);
  badge.textContent = p.tipo;
  article.appendChild(badge);

  const h1 = crearElemento('h1', ['ficha__titulo']);
  h1.textContent = p.titulo;
  article.appendChild(h1);

  const ubicDiv = crearElemento('div', ['ficha__ubicacion']);
  const iconoUbic = crearSVG(SVG_UBICACION);
  iconoUbic.classList.add('ficha__ubicacion-icono');
  const ubicTexto = document.createElement('span');
  ubicTexto.textContent = p.ubicacion;
  ubicDiv.appendChild(iconoUbic);
  ubicDiv.appendChild(ubicTexto);
  article.appendChild(ubicDiv);

  const desc = crearElemento('p', ['ficha__descripcion']);
  desc.textContent = getDescripcion(p);
  article.appendChild(desc);

  article.appendChild(crearElemento('hr', ['ficha__divisor']));

  const subtitCaract = crearElemento('h2', ['ficha__subtitulo']);
  subtitCaract.textContent = 'Características';
  article.appendChild(subtitCaract);

  const gridCaract = crearElemento('div', ['ficha__caracteristicas']);
  getCaracteristicas(p).forEach((c) => {
    const item = crearElemento('div', ['ficha__caracteristica']);
    const icono = crearElemento('span', ['ficha__caracteristica-icono']);
    icono.textContent = c.icono;
    icono.setAttribute('aria-hidden', 'true');
    const info = crearElemento('div', ['ficha__caracteristica-info']);
    const valor = crearElemento('span', ['ficha__caracteristica-valor']);
    valor.textContent = c.valor;
    const etiq = crearElemento('span', ['ficha__caracteristica-etiqueta']);
    etiq.textContent = c.etiqueta;
    info.appendChild(valor);
    info.appendChild(etiq);
    item.appendChild(icono);
    item.appendChild(info);
    gridCaract.appendChild(item);
  });
  article.appendChild(gridCaract);

  article.appendChild(crearElemento('hr', ['ficha__divisor']));

  const subtitFeatures = crearElemento('h2', ['ficha__subtitulo']);
  subtitFeatures.textContent = 'Lo que incluye';
  article.appendChild(subtitFeatures);

  const listaFeatures = crearElemento('ul', ['ficha__features-lista'], { role: 'list' });
  getFeatures(p).forEach((feat) => {
    const li = crearElemento('li', ['ficha__feature-item']);
    const iconoCheck = crearSVG(SVG_CHECK, 24, 24);
    iconoCheck.classList.add('ficha__feature-icono');
    const texto = document.createElement('span');
    texto.textContent = feat;
    li.appendChild(iconoCheck);
    li.appendChild(texto);
    listaFeatures.appendChild(li);
  });
  article.appendChild(listaFeatures);

  return article;
}

function renderSidebar(p) {
  const aside = crearElemento('aside', ['ficha__sidebar'], { 'aria-label': 'Datos y acciones de la propiedad' });
  const card = crearElemento('div', ['ficha__sidebar-card']);

  const precioEl = crearElemento('div', ['ficha__precio-wrapper']);
  const precio = crearElemento('p', ['ficha__precio']);
  precio.textContent = p.precio;
  precioEl.appendChild(precio);
  if (p.tipo === 'Alquiler') {
    const expensas = crearElemento('p', ['ficha__expensas']);
    expensas.textContent = '+ expensas (consultar)';
    precioEl.appendChild(expensas);
  }
  card.appendChild(precioEl);

  const datosGrid = crearElemento('div', ['ficha__datos-clave']);
  const datosItems = [];

  if (p.dormitorios > 0) {
    datosItems.push({ icono: '🛏️', valor: p.dormitorios, etiqueta: p.dormitorios === 1 ? 'Dormitorio' : 'Dormitorios' });
  } else {
    datosItems.push({ icono: '🏬', valor: '—', etiqueta: 'Comercial' });
  }
  datosItems.push(
    { icono: '🚿', valor: p.banos, etiqueta: p.banos === 1 ? 'Baño' : 'Baños' },
    { icono: '📐', valor: `${p.superficie} m²`, etiqueta: 'Superficie' },
    { icono: '📍', valor: p.ubicacion.split(',')[0], etiqueta: 'Barrio' },
  );

  datosItems.forEach((d) => {
    const dato = crearElemento('div', ['ficha__dato']);
    const icono = crearElemento('span', ['ficha__dato-icono']);
    icono.textContent = d.icono;
    icono.setAttribute('aria-hidden', 'true');
    const valor = crearElemento('span', ['ficha__dato-valor']);
    valor.textContent = d.valor;
    const etiq = crearElemento('span', ['ficha__dato-etiqueta']);
    etiq.textContent = d.etiqueta;
    dato.appendChild(icono);
    dato.appendChild(valor);
    dato.appendChild(etiq);
    datosGrid.appendChild(dato);
  });
  card.appendChild(datosGrid);

  const msgWA = encodeURIComponent(
    `Hola, me interesa la propiedad: ${p.titulo}, en ${p.ubicacion}, precio ${p.precio}. ¿Podría darme más información?`
  );

  const btnWA = crearElemento('a', ['ficha__btn-whatsapp'], {
    href: `https://wa.me/${WA_NUMERO}?text=${msgWA}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Consultar por WhatsApp sobre ${p.titulo}`,
  });
  const iconoWA = crearSVG(SVG_WA);
  const textoWA = document.createElement('span');
  textoWA.textContent = 'Consultar por WhatsApp';
  btnWA.appendChild(iconoWA);
  btnWA.appendChild(textoWA);
  card.appendChild(btnWA);

  const compartir = crearElemento('div', ['ficha__compartir']);
  const compartirTitulo = crearElemento('p', ['ficha__compartir-titulo']);
  compartirTitulo.textContent = 'Compartir';
  compartir.appendChild(compartirTitulo);

  const compartirBotones = crearElemento('div', ['ficha__compartir-botones']);

  const btnCopiar = crearElemento('button', ['ficha__btn-compartir'], { type: 'button', 'aria-label': 'Copiar enlace de la propiedad' });
  const iconoCopy = crearSVG(SVG_COPY);
  const textoCopy = document.createElement('span');
  textoCopy.textContent = 'Copiar link';
  btnCopiar.appendChild(iconoCopy);
  btnCopiar.appendChild(textoCopy);
  btnCopiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      textoCopy.textContent = '¡Copiado!';
      btnCopiar.classList.add('ficha__btn-compartir--copiado');
      setTimeout(() => {
        textoCopy.textContent = 'Copiar link';
        btnCopiar.classList.remove('ficha__btn-compartir--copiado');
      }, 2000);
    } catch (_) {
      textoCopy.textContent = 'No disponible';
    }
  });
  compartirBotones.appendChild(btnCopiar);

  const shareMsg = encodeURIComponent(`Te comparto esta propiedad: ${p.titulo} en ${p.ubicacion} — ${window.location.href}`);
  const btnShareWA = crearElemento('a', ['ficha__btn-compartir'], {
    href: `https://wa.me/?text=${shareMsg}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': 'Compartir por WhatsApp',
  });
  const iconoShareWA = crearSVG(SVG_WA);
  const textoShareWA = document.createElement('span');
  textoShareWA.textContent = 'WhatsApp';
  btnShareWA.appendChild(iconoShareWA);
  btnShareWA.appendChild(textoShareWA);
  compartirBotones.appendChild(btnShareWA);

  compartir.appendChild(compartirBotones);
  card.appendChild(compartir);

  aside.appendChild(card);
  return aside;
}

function renderRelacionadas(p) {
  const relacionadas = propiedades
    .filter((r) => r.tipo === p.tipo && r.id !== p.id)
    .slice(0, 3);

  if (relacionadas.length === 0) return null;

  const section = crearElemento('section', ['ficha__relacionadas'], { 'aria-labelledby': 'relacionadas-titulo' });

  const titulo = crearElemento('h2', ['ficha__relacionadas-titulo'], { id: 'relacionadas-titulo' });
  titulo.textContent = `Más propiedades en ${p.tipo.toLowerCase()}`;
  section.appendChild(titulo);

  const grid = crearElemento('ul', ['ficha__relacionadas-grid', 'propiedades-grid'], {
    role: 'list',
    'aria-label': 'Propiedades relacionadas',
  });

  const SVG_WA_PATH = SVG_WA;
  const SVG_HEART_PATH = SVG_HEART;

  relacionadas.forEach((rel) => {
    const datoDorm = rel.dormitorios > 0
      ? `<li class="card-propiedad__dato">🏠 ${rel.dormitorios} amb.</li>`
      : `<li class="card-propiedad__dato">🏬 Comercial</li>`;
    const sufijoBano = rel.banos === 1 ? 'baño' : 'baños';
    const waMsg = encodeURIComponent(`Hola, me interesa la propiedad: ${rel.titulo}, en ${rel.ubicacion}, precio ${rel.precio}. ¿Podría darme más información?`);

    const li = document.createElement('li');
    li.innerHTML = `
      <article class="card-propiedad">
        <div class="card-propiedad__imagen">
          <img src="${rel.imagen}" alt="${rel.alt}" width="400" height="300" loading="lazy" />
          <span class="card-propiedad__tipo">${rel.tipo}</span>
          <button class="card-propiedad__favorito" aria-label="Guardar en favoritos" type="button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="${SVG_HEART_PATH}" />
            </svg>
          </button>
        </div>
        <div class="card-propiedad__info">
          <p class="card-propiedad__ubicacion">📍 ${rel.ubicacion}</p>
          <h3 class="card-propiedad__titulo">${rel.titulo}</h3>
          <p class="card-propiedad__precio">${rel.precio}</p>
          <ul class="card-propiedad__datos" role="list" aria-label="Características">
            ${datoDorm}
            <li class="card-propiedad__dato">🛁 ${rel.banos} ${sufijoBano}</li>
            <li class="card-propiedad__dato">📐 ${rel.superficie} m²</li>
          </ul>
          <div class="card-propiedad__acciones">
            <a href="ficha.html?id=${rel.id}" class="card-propiedad__btn-ficha">Ver ficha</a>
            <a href="https://wa.me/${WA_NUMERO}?text=${waMsg}"
              class="card-propiedad__btn-wa" target="_blank" rel="noopener noreferrer"
              aria-label="Consultar por WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="${SVG_WA_PATH}" />
              </svg>
            </a>
          </div>
        </div>
      </article>
    `.trim();
    grid.appendChild(li);
  });

  section.appendChild(grid);
  return section;
}

function montarFicha(p) {
  const main = document.getElementById('ficha-main');
  if (!main) return;

  const topRow = crearElemento('div', ['ficha__top-row']);
  topRow.appendChild(renderGaleria(p));
  topRow.appendChild(renderSidebar(p));
  main.appendChild(topRow);

  main.appendChild(renderInfoPrincipal(p));

  const relacionadas = renderRelacionadas(p);
  if (relacionadas) main.appendChild(relacionadas);
}

actualizarSEO(propiedad);
montarFicha(propiedad);
