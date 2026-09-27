/**
 * Módulo de música de fondo para Proyecto Mi Vida
 * Reproduce videos de YouTube como música de fondo con control de volumen
 * 
 * Usa la API de YouTube IFrame Player para tener control completo
 */

// URL del video de YouTube (puede ser cualquier URL de YouTube)
const YOUTUBE_VIDEO_ID = 'p_1Osm5xE5Y'; // Video: "Te amo y más" alternativo
// const YOUTUBE_VIDEO_ID = 'QAItMep0GiA'; // Video original que mencionaste

// Configuración del player
let player = null;
let musicaIniciada = false;
let volumenDeseado = 0.5; // Volumen medio (0.0 - 1.0)

// Cargar la API de YouTube IFrame
function cargarAPIYouTube() {
  return new Promise((resolve) => {
    if (window.YT) {
      resolve();
      return;
    }
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

// Crear el contenedor del player
function crearContenedorPlayer() {
  const container = document.createElement('div');
  container.id = 'youtube-player-container';
  container.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -100;
    pointer-events: none;
  `;
  
  const playerDiv = document.createElement('div');
  playerDiv.id = 'youtube-player';
  playerDiv.style.cssText = `
    width: 1px;
    height: 1px;
  `;
  container.appendChild(playerDiv);
  document.body.appendChild(container);
  
  return playerDiv;
}

// Iniciar el player
export async function iniciarMusica() {
  if (musicaIniciada) return;
  
  try {
    // Esperar a que la API de YouTube esté lista
    await cargarAPIYouTube();
    
    // Crear contenedor
    const playerContainer = crearContenedorPlayer();
    
    // Crear player
    player = new YT.Player('youtube-player', {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volumenDeseado * 100);
          event.target.playVideo();
          musicaIniciada = true;
          
          // Ocultar el botón si existe
          const btn = document.getElementById('btn-musica-global');
          if (btn) {
            btn.style.display = 'none';
          }
        },
        onError: (event) => {
          console.error('Error en el player de YouTube:', event.data);
          mostrarBotonMusica();
        },
        onStateChange: (event) => {
          // Si el video termina, vuelve a empezar (por si el loop no funciona)
          if (event.data === YT.PlayerState.ENDED) {
            player.seekTo(0);
            player.playVideo();
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Error al cargar música de YouTube:', error);
    mostrarBotonMusica();
  }
}

// Mostrar botón de música si hay error
function mostrarBotonMusica() {
  const btn = document.createElement('button');
  btn.id = 'btn-musica-global';
  btn.innerHTML = '🎵 Reproducir música';
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 20px;
    background: #E8A2B0;
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Quicksand', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(232, 162, 176, 0.3);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  `;
  
  btn.addEventListener('click', async () => {
    if (!player) {
      await iniciarMusica();
      return;
    }
    
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      btn.innerHTML = '🎵 Reproducir música';
      btn.style.background = '#E8A2B0';
      btn.style.color = 'white';
    } else {
      player.playVideo();
      btn.innerHTML = '⏸ Pausar música';
      btn.style.background = '#F6D374';
      btn.style.color = '#4A3B42';
    }
  });
  
  document.body.appendChild(btn);
}

// Función para alternar música
export function toggleMusica() {
  if (!player) {
    iniciarMusica();
    return;
  }
  
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

// Ajustar volumen
export function setVolumen(volumen) {
  volumenDeseado = Math.min(1, Math.max(0, volumen));
  if (player) {
    player.setVolume(volumenDeseado * 100);
  }
}

// Iniciar música cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(iniciarMusica, 1000);
  });
} else {
  setTimeout(iniciarMusica, 1000);
}
