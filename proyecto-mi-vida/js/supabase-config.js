/**
 * Configuración de Supabase para Proyecto Mi Vida
 * 
 * 1. Ve a https://supabase.com/
 * 2. Crea un nuevo proyecto
 * 3. Ve a Settings > API (icono de llave)
 * 4. Copia la URL del proyecto y la clave anon (public)
 * 5. Reemplaza los valores abajo
 * 
 * IMPORTANTE: En Supabase, ve a:
 * - Storage > Crear bucket llamado "fotos"
 * - Table Editor > Crear tabla "fotos" con los campos:
 *   id (UUID, primary key, default: gen_random_uuid())
 *   titulo (text)
 *   descripcion (text)
 *   url (text)
 *   alt (text)
 *   frase (text)
 *   fecha_subida (timestamp with time zone, default: now())
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabaseUrl = 'TU_URL_DE_SUPABASE_AQUI';
const supabaseKey = 'TU_CLAVE_PUBLICA_ANON_AQUI';

// Inicializar cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sube una foto a Supabase Storage y guarda los metadatos en la base de datos
 * @param {File} file - Archivo de imagen
 * @param {string} titulo - Título de la foto
 * @param {string} descripcion - Descripción de la foto
 * @param {string} frase - Frase de amor (opcional)
 * @returns {Promise<Object>} - Objeto con la foto subida
 */
export async function agregarFoto(file, titulo, descripcion, frase = '') {
  try {
    // Generar nombre único para el archivo
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `fotos/${fileName}`;
    
    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('fotos')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Obtener URL pública del archivo
    const { data: urlData } = supabase
      .storage
      .from('fotos')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    
    // Guardar metadatos en la base de datos
    const { data: fotoData, error: dbError } = await supabase
      .from('fotos')
      .insert([{
        titulo: titulo,
        descripcion: descripcion,
        url: publicUrl,
        alt: `Foto de ${titulo}`,
        frase: frase || titulo,
        fecha_subida: new Date().toISOString()
      }])
      .select();
    
    if (dbError) {
      throw dbError;
    }
    
    return {
      id: fotoData[0].id,
      url: publicUrl,
      titulo: fotoData[0].titulo,
      descripcion: fotoData[0].descripcion,
      frase: fotoData[0].frase,
      fecha: fotoData[0].fecha_subida
    };
    
  } catch (error) {
    console.error('Error al subir foto:', error);
    throw error;
  }
}

/**
 * Obtiene todas las fotos de la base de datos
 * @returns {Promise<Array>} - Array de fotos ordenadas por fecha
 */
export async function obtenerFotos() {
  try {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .order('fecha_subida', { ascending: false });
    
    if (error) {
      console.error('Error al obtener fotos:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Error al obtener fotos:', error);
    return [];
  }
}

/**
 * Obtiene fotos para el colage
 * @returns {Promise<Array>} - Array de fotos adaptadas para el colage
 */
export async function obtenerFotosParaColage() {
  const fotos = await obtenerFotos();
  return fotos.map(foto => ({
    src: foto.url,
    alt: foto.alt || foto.titulo,
    descripcion: foto.descripcion,
    frase: foto.frase || foto.titulo,
    fecha: new Date(foto.fecha_subida)
  }));
}

/**
 * Elimina una foto de la base de datos y del almacenamiento
 * @param {string} id - ID de la foto
 * @param {string} url - URL de la foto
 * @returns {Promise<boolean>} - True si se eliminó correctamente
 */
export async function eliminarFoto(id, url) {
  try {
    // Extraer el path del bucket de la URL
    const pathParts = url.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('fotos') + 1).join('/');
    
    // Eliminar del Storage
    const { error: storageError } = await supabase
      .storage
      .from('fotos')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error al eliminar del storage:', storageError);
    }
    
    // Eliminar de la base de datos
    const { error: dbError } = await supabase
      .from('fotos')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error('Error al eliminar de la base de datos:', dbError);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    return false;
  }
}

export { supabase };
