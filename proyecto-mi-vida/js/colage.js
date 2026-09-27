function crearTarjetaFoto(foto, indice) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-foto';

  tarjeta.innerHTML = `
    <div class="marco-foto">
      <img src="${foto.src}" alt="${foto.alt}" loading="lazy"
           onerror="this.classList.add('sin-foto'); this.alt='${foto.alt} (aún sin subir)';">
      <span class="doodle-esquina">${svgPajarito(26)}</span>
    </div>
    <p class="descripcion-foto">${foto.descripcion}</p>
    <p class="frase-foto manuscrita">${foto.frase}</p>
  `;
  return tarjeta;
}

function renderizarColage() {
  const contenedor = document.getElementById('grid-colage');
  FOTOS.forEach((foto, i) => {
    contenedor.appendChild(crearTarjetaFoto(foto, i));
  });
}

renderizarColage();
