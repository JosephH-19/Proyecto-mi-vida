import { supabase } from './supabase-config.js';

export async function obtenerSesionObligatoria() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) {
    const destino = `${location.pathname.split('/').pop()}${location.search}`;
    location.replace(`index.html?return=${encodeURIComponent(destino)}`);
    return null;
  }
  return session;
}

export async function cerrarSesion() {
  await supabase.auth.signOut();
  location.replace('index.html');
}

export function etiquetaUsuario(user) {
  const nombre = user?.user_metadata?.name;
  if (nombre) return nombre;
  const correo = user?.email || '';
  const usuario = correo.split('@')[0].toLowerCase();
  if (usuario.includes('joseph')) return 'Joseph';
  if (usuario.includes('ohanna')) return 'Ohanna';
  return correo || 'Miembro';
}

export async function protegerPagina() {
  const session = await obtenerSesionObligatoria();
  if (!session) return null;
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'boton-sesion';
  boton.textContent = `Salir (${etiquetaUsuario(session.user)})`;
  boton.addEventListener('click', cerrarSesion);
  document.querySelector('.nav-hojas')?.append(boton);
  return session.user;
}
