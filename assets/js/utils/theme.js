// theme.js — gestiona el dark/light mode del sitio
//
// Prioridad al cargar la página:
//   1. localStorage  → el usuario ya eligió un tema antes
//   2. prefers-color-scheme → preferencia del sistema operativo
//   3. Light mode por defecto (sin atributo = light en nuestro CSS)
//
// Nota: como este script corre al final del <body> (type="module"),
// puede haber un flash breve en modo dark la primera vez. Para evitarlo
// completamente habría que agregar un <script> inline en el <head>.

export function initTheme() {
  const boton = document.getElementById('theme-toggle');
  const html  = document.documentElement;

  // Aplica el tema: pone el atributo en <html> y guarda en localStorage
  function aplicarTema(tema) {
    html.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
    boton.setAttribute(
      'aria-label',
      tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  }

  // Al inicializar: leer preferencia guardada o del sistema
  const guardado = localStorage.getItem('tema');
  if (guardado) {
    aplicarTema(guardado);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  }
  // Sin preferencia → sin atributo → light mode por defecto

  // Toggle al hacer click
  boton.addEventListener('click', () => {
    const actual = html.getAttribute('data-theme') || 'light';
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  });
}
