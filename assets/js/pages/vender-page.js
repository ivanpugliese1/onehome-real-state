// vender-page.js — lógica de la página Vender / Alquilar
// Maneja validación del formulario de tasación gratuita

import { initTheme } from '../utils/theme.js';
import { initScroll } from '../utils/scroll.js';
import { initAnimations } from '../utils/animations.js';
import { initNav } from '../utils/nav.js';

// Inicializar utilidades compartidas (igual que otras páginas)
initTheme();
initScroll();
initAnimations();
initNav();

// ── Formulario de tasación ────────────────────────────────────────────────────

const form = document.getElementById('form-tasacion');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarErrores();

    if (validarForm()) {
      mostrarExito();
    }
  });

  // Limpiar error al modificar un campo
  form.querySelectorAll('.tasacion__input, .tasacion__select, .tasacion__textarea').forEach((campo) => {
    campo.addEventListener('input', () => limpiarErrorCampo(campo));
  });
}

// ── Validación ────────────────────────────────────────────────────────────────

function validarForm() {
  let valido = true;

  // Nombre
  const nombre = document.getElementById('tasacion-nombre');
  if (!nombre.value.trim()) {
    mostrarError(nombre, 'tasacion-nombre-error', 'El nombre es obligatorio.');
    valido = false;
  }

  // Email
  const email = document.getElementById('tasacion-email');
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    mostrarError(email, 'tasacion-email-error', 'El email es obligatorio.');
    valido = false;
  } else if (!regexEmail.test(email.value.trim())) {
    mostrarError(email, 'tasacion-email-error', 'Ingresá un email válido.');
    valido = false;
  }

  // Teléfono (acepta formatos argentinos: 11 5678-1234, +54 9 11 etc.)
  const telefono = document.getElementById('tasacion-telefono');
  const regexTel = /^[\d\s\+\-\(\)]{7,20}$/;
  if (!telefono.value.trim()) {
    mostrarError(telefono, 'tasacion-telefono-error', 'El teléfono es obligatorio.');
    valido = false;
  } else if (!regexTel.test(telefono.value.trim())) {
    mostrarError(telefono, 'tasacion-telefono-error', 'Ingresá un teléfono válido (ej: 11 5678-1234).');
    valido = false;
  }

  // Tipo de propiedad
  const tipo = document.getElementById('tasacion-tipo');
  if (!tipo.value) {
    mostrarError(tipo, 'tasacion-tipo-error', 'Seleccioná el tipo de propiedad.');
    valido = false;
  }

  // Dirección
  const direccion = document.getElementById('tasacion-direccion');
  if (!direccion.value.trim()) {
    mostrarError(direccion, 'tasacion-direccion-error', 'La dirección es obligatoria.');
    valido = false;
  }

  // Operación (radio buttons)
  const operacion = form.querySelector('input[name="operacion"]:checked');
  if (!operacion) {
    const errorEl = document.getElementById('tasacion-operacion-error');
    if (errorEl) {
      errorEl.textContent = 'Seleccioná el tipo de operación.';
      errorEl.hidden = false;
    }
    valido = false;
  }

  return valido;
}

// ── Helpers de UI ─────────────────────────────────────────────────────────────

function mostrarError(campo, idError, mensaje) {
  campo.classList.add('tasacion__input--error');
  const errorEl = document.getElementById(idError);
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.hidden = false;
  }
}

function limpiarErrorCampo(campo) {
  campo.classList.remove('tasacion__input--error', 'tasacion__select--error');
  const idError = campo.getAttribute('aria-describedby');
  if (idError) {
    const errorEl = document.getElementById(idError);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }
}

function limpiarErrores() {
  form.querySelectorAll('.tasacion__campo-error').forEach((el) => {
    el.textContent = '';
    el.hidden = true;
  });
  form.querySelectorAll('.tasacion__input--error, .tasacion__select--error').forEach((el) => {
    el.classList.remove('tasacion__input--error', 'tasacion__select--error');
  });
}

function mostrarExito() {
  const exitoEl = document.getElementById('tasacion-exito');
  const btnEnviar = form.querySelector('.tasacion__btn-enviar');

  if (exitoEl) {
    exitoEl.hidden = false;
    exitoEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (btnEnviar) {
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Consulta enviada ✓';
  }
}
