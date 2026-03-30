export function initTheme() {
  const boton = document.getElementById('theme-toggle');
  const html  = document.documentElement;

  function aplicarTema(tema) {
    html.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
    boton.setAttribute(
      'aria-label',
      tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  }

  const guardado = localStorage.getItem('tema');
  if (guardado) {
    aplicarTema(guardado);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  }

  boton.addEventListener('click', () => {
    const actual = html.getAttribute('data-theme') || 'light';
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  });
}
