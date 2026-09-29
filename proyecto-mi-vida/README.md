# Proyecto Mi Vida 🤍

Sitio privado de recuerdos para Joseph y Ohanna: galería Supabase, música de YouTube y páginas para celebrar su historia.

> **Mejoras de celebraciones:** las mejoras nuevas se preparan en ramas separadas; `main` no cambia hasta que revises y fusiones cada rama. Las funciones de cumpleaños usan la migración v1.2; las de aniversario requieren además v1.3.

## Funciones

- Galería con ampliación, zoom, filtros por año/álbum/etiqueta y compartir por WhatsApp.
- Álbumes personalizados, etiquetas, coordenadas y compresión de imágenes al subir.
- Comentarios y reacciones en fotos para usuarios autenticados.
- Reproductor de YouTube con playlist, pausa, volumen y canción siguiente/anterior.
- Tema claro/oscuro, fondos de temporada, frases aleatorias, contador de días y transiciones.
- Diario compartido, fechas especiales, recordatorios al visitar la página y exportación `.ics` compatible con Google Calendar.
- Mapa OpenStreetMap configurable sin clave de Google.
- Chat con notas de voz privadas y estadísticas de visitas por cuenta.
- Cumpleaños dinámicos, collage anual con las fotos locales, registro compartido de regalos y mensajes.
- Aniversario que se activa a las 00:00 de la fecha anual en hora de Perú, con collage de fotos, regalos y mensajes propios.

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

## Cumpleaños v1.2

La página detecta el cumpleaños según las fechas configuradas en `js/cumpleanos.js` (actualmente Joseph: 11 de enero; Ohanna: 7 de octubre). El collage combina de forma determinista las fotos de `assets/fotos` y abre cada recuerdo ampliado. El registro de regalos y los mensajes compartidos necesitan la migración `database/version1.2-cumpleanos.sql` ejecutada en Supabase SQL Editor. Solo las dos cuentas autenticadas deben tener acceso; mantén desactivados los registros públicos.

## Aniversario v1.3

La fecha de inicio configurada es el 1 de octubre de 2025. La cuenta regresiva llega al comienzo del día en la zona `America/Lima`; si la página permanece abierta, cambia a la vista de celebración al llegar la medianoche. El collage toma las fotos de `assets/fotos` y usa una composición propia para cada aniversario. Para los regalos diferenciados y los mensajes de aniversario, ejecuta `database/version1.3-aniversario.sql` después de la migración v1.2.

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

Vercel está configurado para publicar los HTML, CSS, JavaScript y recursos estáticos. El proyecto debe tener como Root Directory la carpeta `proyecto-mi-vida`. Los pushes a las ramas de mejoras generan Preview; el dominio de producción se actualiza al promover los cambios a la rama configurada para Production.

## Estructura relevante

- `index.html`: acceso con Supabase Auth.
- `colage.html`: galería, filtros, lightbox, comentarios y reacciones.
- `subir-foto.html`: subida, álbumes, etiquetas y ubicación.
- `espacio.html`, `diario.html`, `fechas.html`, `mapa.html`, `chat.html`, `estadisticas.html`: módulos de la relación.
- `cumpleanos.html`, `js/cumpleanos.js`, `css/cumpleanos.css`: cumpleaños y sus recuerdos.
- `aniversario.html`, `js/aniversario.js`, `css/aniversario.css`: aniversario con activación a medianoche de Perú.
- `js/supabase-config.js`: cliente público de Supabase.
- `database/version1.1.sql` y `database/version1.2-cumpleanos.sql` y `database/version1.3-aniversario.sql`: migraciones manuales y políticas RLS.
- `AUTENTICACION-V1.1.md`: preparación de las dos cuentas.

Hecho con ❤️ por Joseph para Ohanna.
