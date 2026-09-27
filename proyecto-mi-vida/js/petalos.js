// Genera flores/pétalos que caen suavemente por la pantalla.
// Todo dibujado en SVG, sin emojis ni imágenes externas.

function crearPetalo(contenedor) {
  const tipos = ['petalo-rosa', 'margarita', 'lirio-mini'];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];

  const el = document.createElement('div');
  el.className = 'petalo';

  const size = 14 + Math.random() * 18;
  const izquierda = Math.random() * 100;
  const duracion = 7 + Math.random() * 8;
  const deriva = (Math.random() * 140 - 70) + 'px';
  const giro = (Math.random() * 360 - 180) + 'deg';

  el.style.left = izquierda + 'vw';
  el.style.setProperty('--deriva', deriva);
  el.style.setProperty('--giro', giro);
  el.style.animationDuration = duracion + 's';

  el.innerHTML = dibujarFlor(tipo, size);
  contenedor.appendChild(el);

  setTimeout(() => el.remove(), duracion * 1000 + 200);
}

function dibujarFlor(tipo, size) {
  if (tipo === 'margarita') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFFFFF" stroke="#F6C9D0" stroke-width="1">
        <ellipse cx="20" cy="8"  rx="5" ry="8"/>
        <ellipse cx="20" cy="32" rx="5" ry="8"/>
        <ellipse cx="8"  cy="20" rx="8" ry="5"/>
        <ellipse cx="32" cy="20" rx="8" ry="5"/>
      </g>
      <circle cx="20" cy="20" r="6" fill="#F6D374"/>
    </svg>`;
  }
  if (tipo === 'lirio-mini') {
    return svgLirio(size, '#C9A8DC');
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20 C20 8, 8 6, 6 16 C6 24, 14 26, 20 20 Z" fill="#F6C9D0"/>
  </svg>`;
}

function iniciarLluviaDeFlores(idContenedor = 'lluvia-petalos', intervaloMs = 550) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  const reducida = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducida) return;
  setInterval(() => crearPetalo(contenedor), intervaloMs);
}
