import { supabase } from './supabase-config.js';
import { obtenerSesionObligatoria, etiquetaUsuario } from './auth.js';

// Inicio guardado en la página original. La hora se interpreta en America/Lima.
const INICIO = { ano: 2025, mes: 10, dia: 1 };
const ZONA = 'America/Lima';
const LIMITE = 60;
const formatoLima = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
});
const el = (id) => document.getElementById(id);
const normalizar = (valor) => String(valor || '').trim().toLocaleLowerCase('es');
let usuarioActual = null;
let celebracionActiva = false;

function ahoraEnLima(instante = new Date()) {
  const partes = Object.fromEntries(formatoLima.formatToParts(instante).map((p) => [p.type, p.value]));
  return { ano: Number(partes.year), mes: Number(partes.month), dia: Number(partes.day), hora: Number(partes.hour), minuto: Number(partes.minute), segundo: Number(partes.second) };
}

function inicioLocalLimaUTC(ano, mes, dia, hora = 0) {
  const objetivo = Date.UTC(ano, mes - 1, dia, hora);
  let aproximacion = objetivo + 5 * 60 * 60 * 1000;
  // Calcula el instante correspondiente a esa hora de Lima usando Intl y su zona horaria.
  for (let i = 0; i < 3; i++) {
    const local = ahoraEnLima(new Date(aproximacion));
    const representado = Date.UTC(local.ano, local.mes - 1, local.dia, local.hora, local.minuto, local.segundo);
    aproximacion += objetivo - representado;
  }
  return aproximacion;
}

function aniversarioSiguiente(ahora = new Date()) {
  const lima = ahoraEnLima(ahora);
  let ano = lima.ano;
  let objetivo = inicioLocalLimaUTC(ano, INICIO.mes, INICIO.dia, 0);
  if (objetivo <= ahora.getTime()) {
    ano += 1;
    objetivo = inicioLocalLimaUTC(ano, INICIO.mes, INICIO.dia, 0);
  }
  return { ano, instante: objetivo };
}

function esDiaDeAniversario(instante = new Date()) {
  const lima = ahoraEnLima(instante);
  return lima.mes === INICIO.mes && lima.dia === INICIO.dia && lima.ano >= INICIO.ano + 1;
}

function calcularAnios(anoLima) {
  return anoLima - INICIO.ano;
}

function actualizarVista() {
  const activo = esDiaDeAniversario();
  const lima = ahoraEnLima();
  const titulo = el('titulo-aniversario');
  const estado = el('estado-aniversario');
  const cuenta = el('contador-aniversario');
  const anios = Math.max(1, calcularAnios(lima.ano));

  if (activo) {
    if (!celebracionActiva) montarCollage(anios);
    celebracionActiva = true;
    document.body.classList.add('es-aniversario-hoy');
    titulo.textContent = `¡Feliz ${anios}° aniversario, Joseph y Ohanna! 💖`;
    estado.textContent = 'Hoy, desde las 00:00 en Perú, celebramos un año más de nuestra historia.';
    cuenta.hidden = true;
    el('zona-horaria-aniversario').textContent = '¡Llegó nuestro día! Que empiece la celebración. 🎉';
    el('aniversario-anios').textContent = `${anios} ${anios === 1 ? 'año' : 'años'} de amor, complicidad y recuerdos.`;
    return;
  }

  celebracionActiva = false;
  document.body.classList.remove('es-aniversario-hoy');
  titulo.textContent = 'Cuenta regresiva para nuestro aniversario 💖';
  estado.textContent = 'Cada día contigo merece celebrarse.';
  const siguiente = aniversarioSiguiente();
  let faltante = Math.max(0, siguiente.instante - Date.now());
  const dias = Math.floor(faltante / 86400000); faltante %= 86400000;
  const horas = Math.floor(faltante / 3600000); faltante %= 3600000;
  const minutos = Math.floor(faltante / 60000); const segundos = Math.floor((faltante % 60000) / 1000);
  el('dias-aniversario').textContent = String(dias);
  el('horas-aniversario').textContent = String(horas).padStart(2, '0');
  el('minutos-aniversario').textContent = String(minutos).padStart(2, '0');
  el('segundos-aniversario').textContent = String(segundos).padStart(2, '0');
  cuenta.hidden = false;
  el('zona-horaria-aniversario').textContent = 'La celebración comienza a las 00:00, hora de Perú.';
  el('aniversario-anios').textContent = '';
}

function mezclaDeterminista(items, semilla) {
  let estado = 2166136261;
  for (const caracter of semilla) estado = Math.imul(estado ^ caracter.charCodeAt(0), 16777619) >>> 0;
  const aleatorio = () => {
    estado += 0x6D2B79F5;
    let n = estado;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
  const salida = [...items];
  for (let i = salida.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [salida[i], salida[j]] = [salida[j], salida[i]];
  }
  return salida;
}

function montarCollage(anios = Math.max(1, calcularAnios(ahoraEnLima().ano))) {
  const zona = el('collage-aniversario');
  const fotos = Array.isArray(window.FOTOS) ? window.FOTOS : [];
  if (!fotos.length) { zona.textContent = 'No encontramos las fotos locales del proyecto.'; return; }
  el('edicion-aniversario').textContent = `${anios}° aniversario · ${ahoraEnLima().ano}`;
  const dialogo = el('visor-foto-aniversario');
  const imagenGrande = dialogo.querySelector('img');
  const descripcionGrande = dialogo.querySelector('p');
  const fragmento = document.createDocumentFragment();
  mezclaDeterminista(fotos, `aniversario-${anios}-${INICIO.ano}`).forEach((foto, indice) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = `foto-cumple foto-cumple-${indice % 6}`;
    const abrir = document.createElement('button');
    abrir.type = 'button'; abrir.className = 'foto-cumple-abrir';
    abrir.setAttribute('aria-label', `Ver recuerdo: ${foto.alt || foto.descripcion || 'foto'}`);
    const imagen = document.createElement('img');
    imagen.src = foto.src; imagen.alt = foto.alt || 'Recuerdo de Joseph y Ohanna';
    imagen.loading = indice < 6 ? 'eager' : 'lazy'; imagen.decoding = 'async';
    imagen.addEventListener('error', () => tarjeta.remove(), { once: true });
    abrir.append(imagen);
    abrir.addEventListener('click', () => {
      imagenGrande.src = foto.src; imagenGrande.alt = imagen.alt;
      descripcionGrande.textContent = foto.descripcion || foto.frase || '';
      dialogo.showModal();
    });
    const texto = document.createElement('p'); texto.textContent = foto.descripcion || foto.frase || '';
    tarjeta.append(abrir, texto); fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

function usuarioLegible(userId) {
  if (userId === usuarioActual?.id) return etiquetaUsuario(usuarioActual);
  return 'Tu pareja';
}

function fechaBonita(valor) {
  const [ano, mes, dia] = String(valor || '').slice(0, 10).split('-').map(Number);
  if (!ano || !mes || !dia) return '';
  return new Date(ano, mes - 1, dia).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function estado(id, texto, tipo = '') { const item = el(id); item.textContent = texto; item.dataset.tipo = tipo; }

function prepararSelectores(user) {
  const cuenta = normalizar(etiquetaUsuario(user));
  const propio = cuenta.includes('joseph') ? 'Joseph' : cuenta.includes('ohanna') ? 'Ohanna' : '';
  const pareja = propio === 'Joseph' ? 'Ohanna' : 'Joseph';
  const por = document.querySelector('#form-regalo-aniversario [name="regalado_por"]');
  const para = document.querySelector('#form-regalo-aniversario [name="recibido_por"]');
  const destino = document.querySelector('#form-mensaje-aniversario [name="destinatario"]');
  if (propio) { por.value = propio; para.value = pareja; destino.value = pareja; }
}

async function cargarRegalos() {
  const zona = el('lista-regalos-aniversario');
  const { data, error } = await supabase.from('regalos')
    .select('id,nombre,fecha,descripcion,regalado_por,recibido_por,creado_por')
    .eq('ocasion', 'Aniversario').order('fecha', { ascending: false }).limit(LIMITE);
  if (error) { zona.innerHTML = '<p class="cumple-vacio">Ejecuta primero <code>database/version1.3-aniversario.sql</code> en Supabase para activar los regalos de aniversario.</p>'; return; }
  if (!data?.length) { zona.innerHTML = '<p class="cumple-vacio">Todavía no hemos guardado regalos de aniversario. 💝</p>'; return; }
  const fragmento = document.createDocumentFragment();
  data.forEach((regalo) => {
    const tarjeta = document.createElement('article'); tarjeta.className = 'regalo-tarjeta';
    const cabecera = document.createElement('div'); cabecera.className = 'regalo-cabecera';
    const titulo = document.createElement('h3'); titulo.textContent = regalo.nombre;
    const fecha = document.createElement('time'); fecha.dateTime = regalo.fecha; fecha.textContent = fechaBonita(regalo.fecha);
    cabecera.append(titulo, fecha);
    const ruta = document.createElement('p'); ruta.className = 'regalo-ruta'; ruta.textContent = `${regalo.regalado_por} → ${regalo.recibido_por}`;
    tarjeta.append(cabecera, ruta);
    if (regalo.descripcion) { const descripcion = document.createElement('p'); descripcion.textContent = regalo.descripcion; tarjeta.append(descripcion); }
    if (regalo.creado_por === usuarioActual.id) {
      const borrar = document.createElement('button'); borrar.type = 'button'; borrar.className = 'cumple-eliminar'; borrar.textContent = 'Eliminar';
      borrar.addEventListener('click', async () => {
        const { error: errorBorrar } = await supabase.from('regalos').delete().eq('id', regalo.id);
        if (errorBorrar) estado('estado-regalo-aniversario', 'No se pudo eliminar el registro.', 'error'); else await cargarRegalos();
      }); tarjeta.append(borrar);
    }
    fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

async function cargarMensajes() {
  const zona = el('lista-mensajes-aniversario');
  const { data, error } = await supabase.from('mensajes_aniversario').select('id,destinatario,contenido,creado_por,creado_en').order('creado_en', { ascending: false }).limit(LIMITE);
  if (error) { zona.innerHTML = '<p class="cumple-vacio">Ejecuta <code>database/version1.3-aniversario.sql</code> en Supabase para activar los mensajes.</p>'; return; }
  if (!data?.length) { zona.innerHTML = '<p class="cumple-vacio">Aún no hay mensajes. Guarda aquí unas palabras para volver a leerlas juntos. 💌</p>'; return; }
  const fragmento = document.createDocumentFragment();
  data.forEach((mensaje) => {
    const tarjeta = document.createElement('article'); tarjeta.className = 'mensaje-cumple-tarjeta';
    const destino = document.createElement('p'); destino.className = 'mensaje-cumple-destino';
    destino.textContent = `Para ${mensaje.destinatario} · De ${usuarioLegible(mensaje.creado_por)} · ${fechaBonita(mensaje.creado_en)}`;
    const contenido = document.createElement('p'); contenido.className = 'mensaje-cumple-texto manuscrita'; contenido.textContent = mensaje.contenido;
    tarjeta.append(destino, contenido); fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

async function iniciar() {
  try {
    const session = await obtenerSesionObligatoria();
    if (!session) return;
    usuarioActual = session.user;
    prepararSelectores(usuarioActual);
    const fecha = document.querySelector('#form-regalo-aniversario [name="fecha"]');
    fecha.value = `${ahoraEnLima().ano}-${String(ahoraEnLima().mes).padStart(2, '0')}-${String(ahoraEnLima().dia).padStart(2, '0')}`;
    montarCollage();
    actualizarVista();
    await Promise.all([cargarRegalos(), cargarMensajes()]);
    // Revisa cada segundo: la página abierta también cambia exactamente al llegar las 00:00 en Lima.
    window.setInterval(actualizarVista, 1000);

    el('form-regalo-aniversario').addEventListener('submit', async (event) => {
      event.preventDefault(); const form = event.currentTarget; const boton = form.querySelector('[type="submit"]');
      boton.disabled = true; estado('estado-regalo-aniversario', 'Guardando el regalo…');
      const values = new FormData(form); const regaladoPor = values.get('regalado_por'); const recibidoPor = values.get('recibido_por');
      if (regaladoPor === recibidoPor) { estado('estado-regalo-aniversario', 'Elige a dos personas distintas.', 'error'); boton.disabled = false; return; }
      const { error } = await supabase.from('regalos').insert({
        nombre: String(values.get('nombre')).trim(), fecha: values.get('fecha'),
        descripcion: String(values.get('descripcion') || '').trim(), regalado_por: regaladoPor,
        recibido_por: recibidoPor, creado_por: usuarioActual.id, ocasion: 'Aniversario'
      });
      boton.disabled = false;
      if (error) estado('estado-regalo-aniversario', 'No se guardó. Revisa que aplicaste la migración v1.3 de Supabase.', 'error');
      else { form.reset(); prepararSelectores(usuarioActual); fecha.value = `${ahoraEnLima().ano}-${String(ahoraEnLima().mes).padStart(2, '0')}-${String(ahoraEnLima().dia).padStart(2, '0')}`; estado('estado-regalo-aniversario', 'El regalo quedó guardado en nuestros recuerdos. 💝', 'exito'); await cargarRegalos(); }
    });

    el('form-mensaje-aniversario').addEventListener('submit', async (event) => {
      event.preventDefault(); const form = event.currentTarget; const boton = form.querySelector('[type="submit"]');
      boton.disabled = true; estado('estado-mensaje-aniversario', 'Guardando tu mensaje…'); const values = new FormData(form);
      const { error } = await supabase.from('mensajes_aniversario').insert({
        destinatario: values.get('destinatario'), contenido: String(values.get('contenido')).trim(), creado_por: usuarioActual.id
      });
      boton.disabled = false;
      if (error) estado('estado-mensaje-aniversario', 'No se guardó. Revisa que aplicaste la migración v1.3 de Supabase.', 'error');
      else { form.reset(); prepararSelectores(usuarioActual); estado('estado-mensaje-aniversario', 'Tu mensaje quedó guardado para que lo volvamos a leer. 💌', 'exito'); await cargarMensajes(); }
    });
  } catch (error) { console.error('No se pudo cargar el aniversario:', error); estado('estado-aniversario', 'No pudimos cargar los recuerdos. Comprueba tu conexión y vuelve a iniciar sesión.'); }
}

iniciar();
