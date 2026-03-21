import { propiedades } from '../data/propiedades.js';
import { cardHTML } from '../components/state-card.js';

function getFeaturedProperties() {
  const featuredCardsUl = document.getElementById("lista-propiedades-destacadas");
  const destacadas = propiedades
    .filter(p => p.featured === true)
    .slice(0, 6);

  featuredCardsUl.innerHTML = destacadas.map(p => cardHTML(p)).join("");
}

getFeaturedProperties();