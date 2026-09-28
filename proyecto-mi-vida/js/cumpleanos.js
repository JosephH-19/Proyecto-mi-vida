import { supabase } from './supabase-config.js';
import { obtenerSesionObligatoria, etiquetaUsuario } from './auth.js';

// Fechas ya configuradas en la página original; meses en formato 1–12.
const CUMPLEANOS = [
  { nombre: 'Joseph', dia: 11, mes: 1 },
  { nombre: 'Ohanna', dia: 7, mes: 10 }
];
const LIMITE_RECUERDOS = 60;
const porId = (id) => document.getElementById(id);
const normalizar = (valor) => String(valor || '').trim().toLocaleLowerCase('es');

function fechaLocalISO(fecha = new Date()) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function proximoCumple(persona, hoy = new Date()) {
  const fecha = new Date(hoy.getFullYear(), persona.mes - 1, persona.dia);
  fecha.setHours(0, 0, 0, 0);
  const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  hoyLocal.setHours(0, 0, 0, 0);
  if (fecha < hoyLocal) fecha.setFullYear(fecha.getFullYear() + 1);
  const dias = Math.round((Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) - Date.UTC(hoyLocal.getFullYear(), hoyLocal.getMonth(), hoyLocal.getDate())) / 86400000);
  return { ...persona, fecha, dias };
}

function mostrarCumpleanos() {
  const hoy = new Date();
  const cumplenHoy = CUMPLEANOS.filter((p) => p.dia === hoy.getDate() && p.mes === hoy.getMonth() + 1);
  const titulo = porId('titulo-cumple');
  const estado = porId('estado-cumple');
  const contador = porId('contador-cumple');
  if (cumplenHoy.length) {
    const nombres = cumplenHoy.map((p) => p.nombre);
    titulo.textContent = nombres.length === 2 ? '¡Hoy celebramos a los dos! 🎉' : `¡Feliz cumpleaños, ${nombres[0]}! 🎂`;
    estado.textContent = nombres.length === 2 ? 'Hoy celebramos la vida y la historia que compartimos.' : `Hoy celebramos tu vida, ${nombres[0]}. Este recuerdo lo hicimos con todo nuestro amor.`;
    contador.textContent = 'Que este nuevo año nos regale más momentos juntos. 💖';
    document.body.classList.add('es-cumpleanos-hoy');
    return nombres[0] || '';
  }
  const siguientes = CUMPLEANOS.map((p) => proximoCumple(p, hoy)).sort((a, b) => a.dias - b.dias);
  const siguiente = siguientes[0];
  const opciones = { day: 'numeric', month: 'long' };
  titulo.textContent = 'Nuestros cumpleaños 🎂';
  estado.textContent = 'Cada cumpleaños es una oportunidad para celebrar todo lo que somos.';
  contador.textContent = siguiente.dias === 0
    ? `¡Mañana comienza la celebración de ${siguiente.nombre}!`
    : `Faltan ${siguiente.dias} ${siguiente.dias === 1 ? 'día' : 'días'} para el cumpleaños de ${siguiente.nombre} (${siguiente.fecha.toLocaleDateString('es-PE', opciones)}).`;
  return '';
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

function montarCollage(nombreCumple) {
  const fotos = Array.isArray(window.FOTOS) ? window.FOTOS : [];
  const zona = porId('collage-cumple');
  if (!fotos.length) {
    zona.textContent = 'Aún no encontramos las fotos locales del proyecto.';
    return;
  }
  const persona = nombreCumple || 'Joseph y Ohanna';
  const ano = new Date().getFullYear();
  porId('etiqueta-collage').textContent = nombreCumple ? `Edición ${ano} · ${nombreCumple}` : `Edición ${ano} · nuestros recuerdos`;
  const dialogo = porId('visor-foto-cumple');
  const imagenGrande = dialogo.querySelector('img');
  const pieGrande = dialogo.querySelector('p');
  const fragmento = document.createDocumentFragment();
  mezclaDeterminista(fotos, `${normalizar(persona)}-${ano}`).forEach((foto, indice) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = `foto-cumple foto-cumple-${indice % 6}`;
    const abrir = document.createElement('button');
    abrir.type = 'button';
    abrir.className = 'foto-cumple-abrir';
    abrir.setAttribute('aria-label', `Ver foto: ${foto.alt || foto.descripcion || 'recuerdo'}`);
    const imagen = document.createElement('img');
    imagen.src = foto.src;
    imagen.alt = foto.alt || 'Recuerdo de Joseph y Ohanna';
    imagen.loading = indice < 6 ? 'eager' : 'lazy';
    imagen.decoding = 'async';
    imagen.addEventListener('error', () => tarjeta.remove(), { once: true });
    abrir.append(imagen);
    abrir.addEventListener('click', () => {
      imagenGrande.src = foto.src;
      imagenGrande.alt = imagen.alt;
      pieGrande.textContent = foto.descripcion || foto.frase || '';
      dialogo.showModal();
    });
    const texto = document.createElement('p');
    texto.textContent = foto.descripcion || foto.frase || '';
    tarjeta.append(abrir, texto);
    fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

function mostrarEstado(elemento, texto, tipo = '') {
  elemento.textContent = texto;
  elemento.dataset.tipo = tipo;
}

function fechaBonita(fecha) {
  const [ano, mes, dia] = String(fecha || '').slice(0, 10).split('-').map(Number);
  if (!ano || !mes || !dia) return '';
  return new Date(ano, mes - 1, dia).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function otraPersona(nombre) {
  const limpio = normalizar(nombre);
  if (limpio.includes('joseph')) return 'Ohanna';
  if (limpio.includes('ohanna')) return 'Joseph';
  return 'Ohanna';
}

function prepararOpciones(selectores, predeterminado) {
  selectores.forEach((select) => { if (select) select.value = predeterminado; });
}

function opcionPersona(select, nombre) {
  const option = document.createElement('option');
  option.value = nombre;
  option.textContent = nombre;
  select.append(option);
}

function prepararSelectores(user) {
  const nombre = etiquetaUsuario(user);
  const persona = normalizar(nombre).includes('joseph') ? 'Joseph' : normalizar(nombre).includes('ohanna') ? 'Ohanna' : '';
  const pareja = otraPersona(nombre);
  const regalarPor = document.querySelector('[name="regalado_por"]');
  const recibidoPor = document.querySelector('[name="recibido_por"]');
  const destinatario = document.querySelector('[name="destinatario"]');
  if (persona) {
    prepararOpciones([regalarPor], persona);
    prepararOpciones([recibidoPor, destinatario], pareja);
  } else {
    [regalarPor, recibidoPor, destinatario].forEach((select) => {
      select.replaceChildren();
      opcionPersona(select, 'Joseph');
      opcionPersona(select, 'Ohanna');
    });
    recibidoPor.value = 'Ohanna';
    destinatario.value = 'Ohanna';
  }
}

function tarjetaConBoton(texto, accion, etiqueta) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'cumple-eliminar';
  boton.textContent = texto;
  boton.setAttribute('aria-label', etiqueta);
  boton.addEventListener('click', accion);
  return boton;
}

async function cargarRegalos(user) {
  const zona = porId('lista-regalos');
  const { data, error } = await supabase.from('regalos').select('id,nombre,fecha,descripcion,regalado_por,recibido_por,creado_por').order('fecha', { ascending: false }).limit(LIMITE_RECUERDOS);
  if (error) {
    zona.innerHTML = '<p class="cumple-vacio">Para activar el registro, ejecuten <code>database/version1.2-cumpleanos.sql</code> en Supabase.</p>';
    return;
  }
  if (!data?.length) {
    zona.innerHTML = '<p class="cumple-vacio">Todavía no hay regalos anotados. Guarden aquí el primero. 💝</p>';
    return;
  }
  const fragmento = document.createDocumentFragment();
  data.forEach((regalo) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'regalo-tarjeta';
    const cabecera = document.createElement('div');
    cabecera.className = 'regalo-cabecera';
    const titulo = document.createElement('h3');
    titulo.textContent = regalo.nombre;
    const fecha = document.createElement('time');
    fecha.dateTime = regalo.fecha;
    fecha.textContent = fechaBonita(regalo.fecha);
    cabecera.append(titulo, fecha);
    const ruta = document.createElement('p');
    ruta.className = 'regalo-ruta';
    ruta.textContent = `${regalo.regalado_por} → ${regalo.recibido_por}`;
    tarjeta.append(cabecera, ruta);
    if (regalo.descripcion) { const descripcion = document.createElement('p'); descripcion.textContent = regalo.descripcion; tarjeta.append(descripcion); }
    if (regalo.creado_por === user.id) tarjeta.append(tarjetaConBoton('Eliminar', async () => {
      const { error: borrarError } = await supabase.from('regalos').delete().eq('id', regalo.id);
      if (borrarError) mostrarEstado(porId('estado-regalo'), 'No se pudo eliminar este registro.', 'error');
      else await cargarRegalos(user);
    }, `Eliminar el registro ${regalo.nombre}`));
    fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

async function cargarMensajes() {
  const zona = porId('lista-mensajes-cumple');
  const { data, error } = await supabase.from('mensajes_cumpleanos').select('id,destinatario,contenido,creado_en').order('creado_en', { ascending: false }).limit(LIMITE_RECUERDOS);
  if (error) {
    zona.innerHTML = '<p class="cumple-vacio">Para activar los mensajes, ejecuten <code>database/version1.2-cumpleanos.sql</code> en Supabase.</p>';
    return;
  }
  if (!data?.length) {
    zona.innerHTML = '<p class="cumple-vacio">Aún no hay mensajes. Prepara unas palabras para el próximo cumpleaños. 💌</p>';
    return;
  }
  const fragmento = document.createDocumentFragment();
  data.forEach((mensaje) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'mensaje-cumple-tarjeta';
    const destino = document.createElement('p');
    destino.className = 'mensaje-cumple-destino';
    destino.textContent = `Para ${mensaje.destinatario} · ${fechaBonita(mensaje.creado_en)}`;
    const contenido = document.createElement('p');
    contenido.className = 'mensaje-cumple-texto manuscrita';
    contenido.textContent = mensaje.contenido;
    tarjeta.append(destino, contenido);
    fragmento.append(tarjeta);
  });
  zona.replaceChildren(fragmento);
}

async function iniciar() {
  try {
    const session = await obtenerSesionObligatoria();
    if (!session) return;
    const user = session.user;
    prepararSelectores(user);
    const cumpleHoy = mostrarCumpleanos();
    montarCollage(cumpleHoy);
    const fechaInput = document.querySelector('#form-regalo [name="fecha"]');
    fechaInput.value = fechaLocalISO();
    await Promise.all([cargarRegalos(user), cargarMensajes()]);

    porId('form-regalo').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const boton = form.querySelector('[type="submit"]');
      const estado = porId('estado-regalo');
      boton.disabled = true;
      mostrarEstado(estado, 'Guardando el recuerdo…');
      const valores = new FormData(form);
      const registro = {
        nombre: String(valores.get('nombre')).trim(),
        fecha: valores.get('fecha'),
        descripcion: String(valores.get('descripcion') || '').trim(),
        regalado_por: valores.get('regalado_por'),
        recibido_por: valores.get('recibido_por'),
        creado_por: user.id
      };
      if (registro.regalado_por === registro.recibido_por) {
        mostrarEstado(estado, 'Elige a dos personas distintas: quien lo regaló y quien lo recibió.', 'error');
        boton.disabled = false;
        return;
      }
      const { error } = await supabase.from('regalos').insert(registro);
      boton.disabled = false;
      if (error) mostrarEstado(estado, 'No se guardó. Comprueba que esté aplicada la migración v1.2 de Supabase.', 'error');
      else { form.reset(); fechaInput.value = fechaLocalISO(); prepararSelectores(user); mostrarEstado(estado, '¡Regalo guardado en nuestros recuerdos! 💝', 'exito'); await cargarRegalos(user); }
    });

    porId('form-mensaje-cumple').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const boton = form.querySelector('[type="submit"]');
      const estado = porId('estado-mensaje');
      boton.disabled = true;
      mostrarEstado(estado, 'Guardando tu mensaje…');
      const valores = new FormData(form);
      const { error } = await supabase.from('mensajes_cumpleanos').insert({
        destinatario: valores.get('destinatario'),
        contenido: String(valores.get('contenido')).trim(),
        creado_por: user.id
      });
      boton.disabled = false;
      if (error) mostrarEstado(estado, 'No se guardó. Comprueba que esté aplicada la migración v1.2 de Supabase.', 'error');
      else { form.reset(); prepararSelectores(user); mostrarEstado(estado, 'Tu mensaje quedó guardado para compartirlo en nuestro espacio. 💌', 'exito'); await cargarMensajes(); }
    });
  } catch (error) {
    console.error('No se pudo cargar la página de cumpleaños:', error);
    mostrarEstado(porId('estado-cumple'), 'No pudimos cargar los recuerdos. Comprueba tu conexión y vuelve a iniciar sesión.');
  }
}

iniciar();
