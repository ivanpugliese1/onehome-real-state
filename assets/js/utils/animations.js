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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('js-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => {
    el.classList.add('js-animar');
    observer.observe(el);
  });
}
