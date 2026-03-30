export function initScroll() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

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
