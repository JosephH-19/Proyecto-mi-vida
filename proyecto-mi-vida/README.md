# Proyecto Mi Vida 🤍

Sitio privado de recuerdos para Joseph y Ohanna: galería Supabase, música de YouTube y páginas para celebrar su historia.

> **Versión 1.1:** se trabaja en la rama `version1.1`. `main` y el despliegue actual no cambian hasta que revises y promociones la rama. Las funciones de Supabase nuevas requieren los pasos de [AUTENTICACION-V1.1.md](AUTENTICACION-V1.1.md).

## Funciones

- Galería con ampliación, zoom, filtros por año/álbum/etiqueta y compartir por WhatsApp.
- Álbumes personalizados, etiquetas, coordenadas y compresión de imágenes al subir.
- Comentarios y reacciones en fotos para usuarios autenticados.
- Reproductor de YouTube con playlist, pausa, volumen y canción siguiente/anterior.
- Tema claro/oscuro, fondos de temporada, frases aleatorias, contador de días y transiciones.
- Diario compartido, fechas especiales, recordatorios al visitar la página y exportación `.ics` compatible con Google Calendar.
- Mapa OpenStreetMap configurable sin clave de Google.
- Chat con notas de voz privadas y estadísticas de visitas por cuenta.

## Requisitos de la rama v1.1

1. Crea dos cuentas para la pareja desde Supabase **Authentication → Users** y desactiva los registros públicos.
2. Ejecuta `database/version1.1.sql` en el SQL Editor de Supabase. La migración añade las tablas y políticas para las nuevas funciones; conserva las políticas de fotos anónimas de la versión actual para que `main` siga funcionando durante la revisión.
3. Publica la rama para generar un despliegue Preview:

   ```bash
   git push -u origin version1.1
   ```

4. Prueba el Preview con ambas cuentas antes de fusionar la rama a `main`.

El login anterior era una clave visual; v1.1 requiere correo y contraseña de Supabase. Nunca pongas una clave `service_role` o `secret` en el navegador. Las cuentas se crean en el panel y la opción de registro público debe permanecer desactivada porque las tablas privadas permiten acceso a usuarios autenticados.

El bucket actual `fotos` mantiene sus URLs públicas para no romper la galería existente; el inicio de sesión no vuelve privados esos archivos. Los comentarios, el chat, el diario y las estadísticas sí usan tablas protegidas por RLS.

La migración afecta al proyecto Supabase donde la ejecutes, aunque es aditiva y conserva el acceso anónimo de fotos existente. Si tienes un proyecto de pruebas, úsalo primero.

## Calendario y mapa

La página de fechas descarga un archivo `.ics` que se puede importar en Google Calendar; no hay sincronización OAuth en vivo. Incluye recordatorios de un día antes. Las notificaciones del navegador aparecen cuando se visita la página de fechas y el navegador concede permiso.

Para mostrar una ubicación en el mapa, al subir una foto indica el lugar y sus coordenadas. OpenStreetMap se abre sin API key.

## Desarrollo local

Sirve la carpeta del proyecto con un servidor local (no abras HTML directamente como `file://` porque se usan módulos ES):

```bash
python -m http.server 8000 --directory proyecto-mi-vida
```

Luego abre `http://localhost:8000` y usa una de las dos cuentas de Supabase.

## Despliegue

Vercel está configurado para publicar los HTML, CSS, JavaScript y recursos estáticos. El proyecto debe tener como Root Directory la carpeta `proyecto-mi-vida`. Los pushes a `version1.1` generan Preview; el dominio de producción se actualiza al promover los cambios a la rama configurada para Production.

## Estructura relevante

- `index.html`: acceso con Supabase Auth.
- `colage.html`: galería, filtros, lightbox, comentarios y reacciones.
- `subir-foto.html`: subida, álbumes, etiquetas y ubicación.
- `espacio.html`, `diario.html`, `fechas.html`, `mapa.html`, `chat.html`, `estadisticas.html`: módulos de la relación.
- `js/supabase-config.js`: cliente público de Supabase.
- `database/version1.1.sql`: migración manual y políticas RLS.
- `AUTENTICACION-V1.1.md`: preparación de las dos cuentas.

Hecho con ❤️ por Joseph para Ohanna.
