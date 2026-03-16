// animations.js — anima elementos cuando entran al viewport usando IntersectionObserver
//
// Cómo funciona:
// 1. Selecciona automáticamente los elementos que queremos animar
// 2. Les agrega la clase js-animar (estado inicial: oculto)
// 3. Cuando entran al viewport, les agrega js-visible (estado final: visible)
// 4. Deja de observarlos para no animar dos veces

// Selectores de los elementos que van a animarse al hacer scroll
const SELECTORES_ANIMABLES = [
  '.seccion-header',
  '.card-propiedad',
  '.ventaja',
  '.hero__contenido',
  '.hero__imagen',
  '.contacto-rapido__inner',
].join(', ');

export function initAnimations() {
  const elementos = document.querySelectorAll(SELECTORES_ANIMABLES);

  // threshold: 0.15 = el elemento debe estar 15% visible para disparar la animación
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('js-visible');
        // Una vez animado, dejamos de observarlo (la animación es de entrada, no de salida)
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => {
    el.classList.add('js-animar');
    observer.observe(el);
  });
}
