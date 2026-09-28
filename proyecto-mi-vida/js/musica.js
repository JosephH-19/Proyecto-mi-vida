/** Reproductor opcional de YouTube con controles y playlist personalizable. */
const PLAYLIST_PREDETERMINADA = [
  { id: 'p_1Osm5xE5Y', nombre: 'Te amo y más' },
  { id: 'QAItMep0GiA', nombre: 'Nuestra canción' }
];
const STORAGE_KEY = 'mi-vida-playlist';
let player = null;
let apiEnCarga = null;
let playlist = leerPlaylist();
let indice = 0;
let contenedor;

function leerPlaylist() {
  try {
    const guardada = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(guardada) && guardada.length ? guardada : [...PLAYLIST_PREDETERMINADA];
  } catch { return [...PLAYLIST_PREDETERMINADA]; }
}

function guardarPlaylist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist)); }

function montarDock() {
  if (document.getElementById('music-dock')) return;
  const dock = document.createElement('aside');
  dock.id = 'music-dock'; dock.className = 'music-dock';
  dock.innerHTML = '<button class="music-trigger" type="button" aria-expanded="false">🎵 Música</button><section class="music-panel" hidden><div id="youtube-player-container"></div><label class="music-selection">Playlist<select id="music-selection"></select></label><div class="music-controls"><button type="button" data-accion="anterior" aria-label="Canción anterior">⏮</button><button type="button" data-accion="play">▶ Reproducir</button><button type="button" data-accion="siguiente" aria-label="Siguiente canción">⏭</button></div><label class="music-volume">Volumen <input type="range" min="0" max="100" value="45"></label><form class="music-add"><input type="url" placeholder="Pega un enlace de YouTube" aria-label="Enlace de YouTube" required><button>Agregar</button></form><p class="music-status" aria-live="polite">La música empieza cuando pulses reproducir.</p></section>';
  document.body.append(dock); contenedor = dock;
  const trigger=dock.querySelector('.music-trigger'), panel=dock.querySelector('.music-panel');
  trigger.addEventListener('click',()=>{panel.hidden=!panel.hidden;trigger.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)renderPlaylist();});
  dock.querySelector('[data-accion="play"]').addEventListener('click',reproducir);
  dock.querySelector('[data-accion="siguiente"]').addEventListener('click',()=>cambiarCancion(1));
  dock.querySelector('[data-accion="anterior"]').addEventListener('click',()=>cambiarCancion(-1));
  dock.querySelector('.music-volume input').addEventListener('input',e=>player?.setVolume(Number(e.target.value)));
  dock.querySelector('#music-selection').addEventListener('change',e=>{indice=Number(e.target.value)||0;if(player)player.loadVideoById(playlist[indice].id);});
  dock.querySelector('.music-add').addEventListener('submit',e=>{e.preventDefault();const input=e.currentTarget.querySelector('input');const id=extraerVideoId(input.value);if(!id){dock.querySelector('.music-status').textContent='Ese enlace de YouTube no parece válido.';return;}playlist.push({id,nombre:`Canción ${playlist.length+1}`});indice=playlist.length-1;guardarPlaylist();renderPlaylist();input.value='';if(player)player.loadVideoById(id);dock.querySelector('.music-status').textContent='Canción agregada a tu playlist.';});
  renderPlaylist();
}

function renderPlaylist(){
  if(!contenedor)return;
  const select=contenedor.querySelector('#music-selection');select.replaceChildren();
  playlist.forEach((cancion,i)=>{const option=document.createElement('option');option.value=i;option.textContent=cancion.nombre;select.append(option);});select.value=String(indice);
}

function extraerVideoId(valor){
  try{const url=new URL(valor);if(!['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(url.hostname))return null;let id=url.searchParams.get('v');if(url.hostname.endsWith('youtu.be'))id=url.pathname.split('/').filter(Boolean)[0];if(!id){const match=url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);id=match?.[1];}return /^[\w-]{11}$/.test(id||'')?id:null;}catch{return /^[\w-]{11}$/.test(valor)?valor:null;}
}

function cargarAPI(){
  if(window.YT?.Player)return Promise.resolve();
  if(apiEnCarga)return apiEnCarga;
  apiEnCarga=new Promise((resolve,reject)=>{
    const anterior=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{try{anterior?.();}finally{resolve();}};
    const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>reject(new Error('No se pudo cargar YouTube'));document.head.append(script);
    setTimeout(()=>{if(!window.YT?.Player)reject(new Error('YouTube tardó demasiado en cargar'));},12000);
  });
  return apiEnCarga;
}

async function asegurarPlayer(){
  if(player)return;
  await cargarAPI();
  player=new YT.Player('youtube-player-container',{width:'320',height:'180',videoId:playlist[indice].id,playerVars:{autoplay:0,controls:0,rel:0,playsinline:1,origin:location.origin,enablejsapi:1},events:{onReady:event=>{event.target.setVolume(Number(contenedor.querySelector('.music-volume input').value));},onStateChange:event=>{if(event.data===YT.PlayerState.ENDED)cambiarCancion(1);}}});
}

async function reproducir(){
  const status=contenedor.querySelector('.music-status');
  try{await asegurarPlayer();if(player.getPlayerState?.()===YT.PlayerState.PLAYING){player.pauseVideo();contenedor.querySelector('[data-accion="play"]').textContent='▶ Reproducir';return;}player.loadVideoById(playlist[indice].id);contenedor.querySelector('[data-accion="play"]').textContent='⏸ Pausar';status.textContent='Si no comienza, vuelve a pulsar reproducir en el video.';}
  catch(error){console.error('No se pudo iniciar YouTube:',error);status.textContent='No se pudo cargar YouTube. Comprueba la conexión e inténtalo otra vez.';}
}
function cambiarCancion(delta){indice=(indice+delta+playlist.length)%playlist.length;renderPlaylist();if(player)player.loadVideoById(playlist[indice].id);}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montarDock,{once:true});else montarDock();
