// nav.js — marca el link activo en la barra de navegación mobile

export function initNav() {
  const links = document.querySelectorAll('.nav-mobile__link');
  const rutaActual = window.location.pathname;

  links.forEach(link => {
    const rutaLink = new URL(link.href).pathname;

    if (rutaLink === rutaActual) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('nav-mobile__link--activo');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('nav-mobile__link--activo');
    }
  });
}
