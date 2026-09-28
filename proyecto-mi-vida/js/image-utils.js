/** Comprime imágenes grandes en el navegador antes de enviarlas al bucket. */
export async function comprimirImagen(file, { ladoMaximo = 1920, calidad = 0.82 } = {}) {
  if (!file?.type?.startsWith('image/') || file.size < 450 * 1024) return file;
  if (!('createImageBitmap' in window)) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    const contexto = canvas.getContext('2d', { alpha: true });
    contexto.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', calidad));
    if (!blob || blob.size >= file.size) return file;
    const nombre = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], nombre, { type: 'image/webp', lastModified: file.lastModified });
  } catch (error) {
    console.warn('No se pudo comprimir la imagen; se usará el archivo original.', error);
    return file;
  } finally {
    bitmap?.close();
  }
}
