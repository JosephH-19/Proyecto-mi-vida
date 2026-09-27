# Proyecto Mi Vida 🤍

Una página web romántica para celebrar el amor entre Joseph y Ohanna, con fotos, mensajes especiales, fechas importantes y música de fondo de YouTube.

## 🎯 Novedades en esta versión

- **Música de fondo desde YouTube**: Reproduce automáticamente videos de YouTube como música de fondo con volumen medio en todas las páginas
- **Base de datos Supabase**: Almacenamiento profesional de fotos en la nube (alternativa a Firebase)
- **Celebración de cumpleaños**: Apartado especial que se activa el **11 de enero (Joseph)** y **7 de octubre (Ohanna)** a las 00:00h
- **Aniversario**: Apartado especial para celebrar **1 año como enamorados el 1 de octubre** a las 00:00h
- **Sistema de subida de fotos**: Añade nuevas fotos con título, descripción y fecha
- **Estructura optimizada para Vercel**: Configuración lista para despliegue

## 📁 Estructura del Proyecto

```
proyecto-mi-vida/
├── index.html              # Login (Ohanna, Joseph o josephohanna)
├── colage.html             # Galería de fotos con Supabase
├── carta.html              # Carta de amor
├── cumpleanos.html         # Celebra cumpleaños (NUEVO)
├── aniversario.html        # Celebra aniversario (NUEVO)
├── subir-foto.html          # Formulario para subir fotos (NUEVO)
├── css/
│   ├── style.css           # Estilos globales y colores
│   ├── colage.css          # Estilos del colage
│   ├── carta.css           # Estilos de la carta
│   ├── celebraciones.css   # Estilos para cumpleaños/aniversario (NUEVO)
│   └── subir-foto.css       # Estilos del formulario (NUEVO)
├── js/
│   ├── doodles.js          # SVG de perrito y pajarito
│   ├── petalos.js          # Animación de flores cayendo
│   ├── fotos-data.js       # Datos locales de ejemplo (respaldo)
│   ├── colage.js           # Lógica del colage
│   ├── supabase-config.js  # Configuración de Supabase (NUEVO)
│   └── musica.js           # Módulo de música de YouTube (NUEVO)
├── assets/
│   └── fotos/               # Fotos del colage (opcional, para respaldo)
├── package.json            # Dependencias para Vercel
├── vercel.json             # Configuración de Vercel
├── .gitignore              # Archivos ignorados
└── README.md               # Este archivo
```

## 🚀 Cómo Empezar

### Opción 1: Abrir localmente
1. Abre `index.html` en tu navegador (doble clic)
2. Ingresa uno de estos códigos: `Ohanna`, `Joseph` o `josephohanna`

**Nota**: Para que Supabase y la música de YouTube funcionen, necesitas un servidor web. Usa:
```bash
npx serve
# o
python -m http.server 8000
```

### Opción 2: Desplegar en Vercel (Recomendado)

1. **Configura Supabase**:
   - Sigue las instrucciones en `EJEMPLO-SUPABASE.md`
   - Crea un proyecto en [Supabase](https://supabase.com/)
   - Configura el bucket y la tabla

2. **Configura las credenciales:**
   - Copia la URL y la clave anónima en `js/supabase-config.js`

3. **Despliega:**
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Sube fotos:**
   - Ve a `subir-foto.html`
   - Completa el formulario y sube tus imágenes
   - Las fotos aparecerán automáticamente en el colage

## 🔥 Configuración de Supabase

1. Ve a [Supabase](https://supabase.com/) y crea un proyecto
2. Configura Storage:
   - Crea un bucket llamado `fotos`
   - Activa "Public Access"
3. Configura la base de datos:
   - Crea una tabla llamada `fotos` con las columnas:
     - `id` (UUID, primary key, default: gen_random_uuid())
     - `titulo` (Text)
     - `descripcion` (Text)
     - `url` (Text)
     - `alt` (Text)
     - `frase` (Text)
     - `fecha_subida` (Timestamp with time zone, default: now())
4. Copia las credenciales en `js/supabase-config.js`

**Guía detallada:** Ver `EJEMPLO-SUPABASE.md`

## 🎵 Música de Fondo desde YouTube

El proyecto usa la **API de YouTube IFrame Player** para reproducir música de fondo.

**Video configurado por defecto:** https://youtu.be/p_1Osm5xE5Y

**Para cambiar el video:**
1. Abre `js/musica.js`
2. Cambia el valor de `YOUTUBE_VIDEO_ID`:
```javascript
const YOUTUBE_VIDEO_ID = 'TU_VIDEO_ID_AQUI';
```

**Videos recomendados:**
- `p_1Osm5xE5Y` - Video actual (alternativo)
- `QAItMep0GiA` - Video original que mencionaste

**Características:**
- Se reproduce automáticamente
- Volumen medio (50%)
- Loop infinito
- Controles ocultos
- Si falla el autoplay (por políticas del navegador), aparece un botón para iniciar manualmente

## 📅 Fechas Especiales

| Fecha | Evento | Se activa a las |
|-------|--------|----------------|
| 11 de enero | Cumpleaños de Joseph | 00:00h |
| 7 de octubre | Cumpleaños de Ohanna | 00:00h |
| 1 de octubre | Aniversario (1 año) | 00:00h |

Estas páginas muestran contenido especial automáticamente en sus fechas correspondientes.

## 📸 Añadir Fotos

### Método 1: Usando el formulario (Recomendado)
1. Ve a `subir-foto.html`
2. Completa:
   - Título (obligatorio)
   - Descripción (obligatorio)
   - Foto (obligatorio, máximo 5MB)
   - Frase de amor (opcional)
   - Fecha (opcional)
3. Haz clic en "Subir Foto"

**Nota**: las fotos se suben a Supabase Storage y sus datos se guardan en la tabla `fotos`.

**Seguridad**: el acceso de la portada es solo visual. Revisa `EJEMPLO-SUPABASE.md` antes de permitir subidas públicas; las políticas abiertas permiten que cualquier visitante use la API.

### Método 2: Manual (sin Supabase)
Edita `js/fotos-data.js` y añade tus fotos:
```javascript
{
  src: "assets/fotos/tu-foto.jpg",
  alt: "Descripción para accesibilidad",
  descripcion: "Qué pasó en esta foto",
  frase: "Frase de amor"
}
```

## 🎨 Personalización

### Cambiar colores
Edita las variables CSS en `css/style.css`:
```css
:root {
  --crema: #FFF8F3;
  --rosa-suave: #F6C9D0;
  --rosa-profundo: #E8A2B0;
  /* ... */
}
```

### Cambiar textos
- Edita los archivos HTML directamente
- Los mensajes de cumpleaños y aniversario están en sus respectivas páginas

### Añadir más páginas
1. Crea un nuevo archivo HTML (ej: `nuestra-historia.html`)
2. Copia la estructura básica de `carta.html`
3. Añade el enlace en la navegación de todas las páginas

## 🛠 Requisitos para Vercel

- Node.js 16 o superior
- npm o yarn
- Cuenta de Vercel (gratis)

## ⚠️ Notas Importantes

1. **Supabase es gratis** para pequeños proyectos (hasta 500MB de almacenamiento)
2. **La música** usa la API de YouTube, no necesita archivos MP3 locales
3. **Para producción**, configura políticas de seguridad (RLS) en Supabase
4. **El login** es decorativo, no es autenticación real
5. **Las fotos** se cargan primero de Supabase, si falla usa los datos locales

## 🌟 Consejos

- **Para mejores resultados**: Sube fotos con resolución mínima de 800x600px
- **Nombres de archivos**: Usa nombres descriptivos (ej: `conierto-2025.jpg`)
- **Tamaño máximo**: 5MB por foto (configurable en `subir-foto.html`)
- **Formatos soportados**: JPG, PNG, WEBP
- **Para la música**: Usa videos de YouTube que sean principalmente música sin voces

## 🤝 ¿Cómo contribuir?

Este proyecto es personal, pero si quieres ayudar:
- Sugiere mejoras en el diseño
- Añade más animaciones
- Mejora la experiencia de usuario

## 📄 Licencia

MIT - Libre para uso personal. No uso comercial sin permiso.

---

## 📚 Documentación Adicional

- **EJEMPLO-SUPABASE.md**: Guía detallada para configurar Supabase
- **CAMBIOS-REALIZADOS.md**: Resumen de todos los cambios realizados

---

Hecho con ❤️ por Joseph para Ohanna
