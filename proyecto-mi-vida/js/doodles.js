// Ilustraciones propias, estilo doodle, INSPIRADAS en la ternura de un
// perrito blanco y su amiguito pajarito amarillo — dibujo original,
// no una reproducción del personaje registrado de Peanuts.

function svgPerrito(size = 70) {
  return `
  <svg class="doodle-perrito" width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="62" rx="30" ry="26" fill="#FFFFFF" stroke="#4A3B42" stroke-width="3"/>
    <path class="oreja-perrito oreja-izq" d="M24 40 C10 30, 8 55, 22 58 Z" fill="#2E2A2C"/>
    <path class="oreja-perrito oreja-der" d="M76 40 C90 30, 92 55, 78 58 Z" fill="#2E2A2C"/>
    <ellipse cx="50" cy="55" rx="22" ry="18" fill="#FFFFFF" stroke="#4A3B42" stroke-width="2.5"/>
    <circle cx="42" cy="52" r="2.6" fill="#4A3B42"/>
    <circle cx="58" cy="52" r="2.6" fill="#4A3B42"/>
    <ellipse cx="50" cy="60" rx="4" ry="3" fill="#4A3B42"/>
    <path d="M50 63 Q50 68 45 68" stroke="#4A3B42" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50 63 Q50 68 55 68" stroke="#4A3B42" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M45 65 Q50 70 55 65" stroke="#E8A2B0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="cola-perrito" d="M20 78 Q50 92 80 78" stroke="#4A3B42" stroke-width="2" fill="none" opacity=".3"/>
    <ellipse class="collar-perrito" cx="50" cy="75" rx="28" ry="6" fill="#C9A8DC" stroke="#4A3B42" stroke-width="3"/>
    <circle class="etiqueta-perrito" cx="50" cy="82" r="6" fill="#E8A2B0" stroke="#4A3B42" stroke-width="2"/>
  </svg>`;
}

function svgPajarito(size = 40) {
  return `
  <svg class="doodle-pajarito" width="${size}" height="${size}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="34" rx="18" ry="15" fill="#F6D374" stroke="#4A3B42" stroke-width="2.5"/>
    <circle cx="18" cy="22" r="9" fill="#F6D374" stroke="#4A3B42" stroke-width="2.5"/>
    <path d="M9 22 L2 19 L9 26 Z" fill="#E8A2B0"/>
    <circle cx="16" cy="20" r="1.8" fill="#4A3B42"/>
    <path d="M30 46 L26 52 M34 46 L34 52" stroke="#E8A2B0" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M44 30 Q54 32 46 40 Q40 38 44 30 Z" fill="#F6C9D0"/>
  </svg>`;
}

function svgLirio(size = 46, color = '#C9A8DC') {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="${color}" stroke="#4A3B42" stroke-width="1.2">
      <path d="M30 30 C30 10, 12 8, 10 20 C10 28, 20 32, 30 30 Z"/>
      <path d="M30 30 C30 10, 48 8, 50 20 C50 28, 40 32, 30 30 Z"/>
      <path d="M30 30 C22 34, 18 48, 30 54 C42 48, 38 34, 30 30 Z"/>
    </g>
    <circle cx="30" cy="30" r="4" fill="#F6D374" stroke="#4A3B42" stroke-width="1"/>
  </svg>`;
}
