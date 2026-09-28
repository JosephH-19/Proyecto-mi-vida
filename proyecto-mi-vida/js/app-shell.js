import { supabase } from './supabase-config.js';
import { protegerPagina } from './auth.js';

const FRASES = [
  'Eres mi lugar favorito.',
  'Contigo, cada día se vuelve un recuerdo bonito.',
  'Te elegiría en todas mis vidas.',
  'Mi parte favorita del día es compartirlo contigo.',
  'Nuestro amor también vive en las cosas pequeñas.',
  'Gracias por hacer que lo cotidiano sea especial.'
];
const FECHA_INICIO = new Date(2025, 9, 1);

function montarPersonalizacion() {
  const nav = document.querySelector('.nav-hojas');
  if (!nav) return;

  const controles = document.createElement('div');
  controles.className = 'controles-personalizacion';
  const tema = document.createElement('button');
  tema.type = 'button';
  tema.className = 'boton-herramienta';
  tema.setAttribute('aria-label', 'Cambiar tema claro u oscuro');
  tema.textContent = oscuro ? '☀️ Tema' : '🌙 Tema';
  const oscuro = localStorage.getItem('mi-vida-tema') === 'oscuro';
  document.documentElement.dataset.tema = oscuro ? 'oscuro' : 'claro';
  tema.setAttribute('aria-pressed', String(oscuro));
  tema.addEventListener('click', () => {
    const activar = document.documentElement.dataset.tema !== 'oscuro';
    document.documentElement.dataset.tema = activar ? 'oscuro' : 'claro';
    localStorage.setItem('mi-vida-tema', activar ? 'oscuro' : 'claro');
    tema.setAttribute('aria-pressed', String(activar));
    tema.textContent = activar ? '☀️ Tema' : '🌙 Tema';
  });

  const fondo = document.createElement('label');
  fondo.className = 'selector-temporada';
  fondo.append(document.createTextNode('🌷 Fondo '));
  const selector = document.createElement('select');
  selector.setAttribute('aria-label', 'Cambiar fondo de temporada');
  [['suave', 'Suave'], ['primavera', 'Primavera'], ['noche', 'Noche'], ['atardecer', 'Atardecer']].forEach(([valor, texto]) => {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    selector.append(opcion);
  });
  selector.value = localStorage.getItem('mi-vida-fondo') || 'suave';
  document.documentElement.dataset.fondo = selector.value;
  selector.addEventListener('change', () => {
    document.documentElement.dataset.fondo = selector.value;
    localStorage.setItem('mi-vida-fondo', selector.value);
  });
  fondo.append(selector);
  controles.append(tema, fondo);
  nav.append(controles);
}

function montarFraseAleatoria() {
  const frase = document.createElement('p');
  frase.className = 'frase-aleatoria manuscrita';
  frase.textContent = FRASES[Math.floor(Math.random() * FRASES.length)];
  const cabecera = document.querySelector('.colage-header, .carta-papel, .celebracion-contenido, .subir-envoltorio');
  if (cabecera) cabecera.append(frase);
}

function montarContadorAmor() {
  const lugar = document.querySelector('.colage-header');
  if (!lugar) return;
  const contador = document.createElement('p');
  contador.className = 'contador-amor';
  const dias = Math.max(0, Math.floor((Date.now() - FECHA_INICIO.getTime()) / 86400000));
  contador.textContent = `Joseph & Ohanna · ${dias} días juntos`;
  lugar.append(contador);
}

async function registrarVisita(user) {
  const { error } = await supabase.from('visitas_privadas').insert({ usuario_id: user.id });
  if (error) console.warn('No se pudo guardar esta visita:', error.message);
}

function prepararTransiciones() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', (event) => {
    const enlace = event.target.closest('a[href]');
    if (!enlace || enlace.target || enlace.origin !== location.origin || !enlace.pathname.endsWith('.html')) return;
    event.preventDefault();
    document.body.classList.add('transicion-salida');
    setTimeout(() => location.href = enlace.href, 140);
  });
}

try {
  const user = await protegerPagina();
  if (user) {
    document.documentElement.classList.remove('sesion-pendiente');
    montarPersonalizacion();
    montarFraseAleatoria();
    montarContadorAmor();
    registrarVisita(user);
    const nav = document.querySelector('.nav-hojas');
    if (nav && !nav.querySelector('[href="espacio.html"]')) {
      const espacio = document.createElement('a');
      espacio.href = 'espacio.html';
      espacio.textContent = 'Nuestro espacio';
      nav.append(espacio);
    }
    prepararTransiciones();
  }
} catch (error) {
  console.error('No se pudo verificar la sesión:', error);
  document.documentElement.classList.remove('sesion-pendiente');
  location.replace('index.html?error=session');
}
