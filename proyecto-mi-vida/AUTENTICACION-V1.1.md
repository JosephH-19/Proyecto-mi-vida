# Preparar autenticación v1.1

La rama `version1.1` usa cuentas reales de Supabase. Las páginas privadas no aceptan el PIN antiguo.

## Antes de probar la rama

1. En Supabase, crea dos usuarios desde **Authentication → Users → Add user**, uno por cada integrante. Confirma ambos correos y asigna contraseñas.
2. En **Authentication → Settings**, desactiva los registros públicos (new user signups). La política permite acceso a usuarios autenticados; si se dejan los registros abiertos, cualquier persona podría crear una cuenta.
3. Ejecuta `database/version1.1.sql` en el SQL Editor. La migración añade columnas y tablas; conserva las políticas públicas de fotos existentes para que la versión desplegada en `main` siga funcionando durante la revisión.
4. Despliega `version1.1` como Preview en Vercel y prueba con las dos cuentas antes de promoverla a producción.

No se necesita una clave secreta de Supabase en el navegador. El archivo cliente sigue usando la clave pública (`anon`), con RLS para tablas privadas. El bucket existente `fotos` conserva sus URLs públicas durante esta transición; esta migración no hace privados los archivos.

## Funciones incluidas

- Galería ampliable, filtros, álbumes, etiquetas, reacciones, comentarios y compartir por WhatsApp.
- Compresión de imagen en el navegador y lugares mediante OpenStreetMap.
- Tema oscuro, fondos de temporada, transiciones, frases y contador de días.
- Diario privado, fechas con recordatorios mientras se visita la página y archivo `.ics` importable en Google Calendar.
- Chat privado con notas de voz en un bucket privado y estadísticas por cuenta.
- Música de YouTube con playlist local, volumen, pausa y siguiente/anterior.

Google Calendar no requiere OAuth para importar el `.ics`; no es sincronización en vivo. OpenStreetMap usa las coordenadas que se añaden al subir cada foto.
