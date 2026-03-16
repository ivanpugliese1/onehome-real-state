// scroll.js — maneja el scroll del sitio:
// 1. Agrega clase .scrolled al header cuando el usuario baja
// 2. Smooth scroll para links de ancla (#seccion)

export function initScroll() {
  const header = document.querySelector('.header');

  // Clase .scrolled cuando se baja más de 50px
  // { passive: true } mejora performance: le dice al browser que no vamos a hacer preventDefault
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Smooth scroll para cualquier link que apunte a un ancla (#id)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const selector = link.getAttribute('href');
      const destino = document.querySelector(selector);

      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
