# Historial de cambios

La descripción histórica de abajo corresponde a la versión anterior. La rama `version1.1` añade nuevas funciones y reemplaza el acceso de clave compartida con Supabase Auth. Para las instrucciones vigentes consulta `README.md` y `AUTENTICACION-V1.1.md`.

# Cambios Realizados en Proyecto Mi Vida 📋

## 🎯 Resumen General

El proyecto ha sido completamente mejorado manteniendo su esencia romántica y añadiendo funcionalidades profesionales para GitHub y Vercel. 

**IMPORTANTE**: Ahora usa **Supabase** en lugar de Firebase y **YouTube API** para la música.

## 📂 Estructura de Archivos

### Nuevos Archivos Creados:

```
proyecto-mi-vida/
├── aniversario.html          # Página de aniversario (1 octubre)
├── cumpleanos.html           # Página de cumpleaños (11 enero y 7 octubre)
├── subir-foto.html           # Formulario para subir fotos
├── css/
│   ├── celebraciones.css     # Estilos para cumpleaños/aniversario
│   └── subir-foto.css        # Estilos del formulario
├── js/
│   ├── supabase-config.js    # Configuración de Supabase (REEMPLAZA firebase-config.js)
│   └── musica.js             # Módulo de música de YouTube (actualizado)
├── package.json              # Dependencias para Vercel (actualizado)
├── vercel.json               # Configuración de Vercel
├── .gitignore                # Archivos ignorados
└── EJEMPLO-SUPABASE.md       # Guía de configuración de Supabase (NUEVO)
```

### Archivos Modificados:

1. **index.html**
   - Eliminado el botón de música (ahora es automática desde YouTube)
   - Integración con módulo de música

2. **colage.html**
   - Añadida navegación a nuevas páginas
   - Integración con **Supabase** para cargar fotos (antes Firebase)
   - Spinner de carga
   - Respaldo con datos locales

3. **carta.html**
   - Añadida navegación a nuevas páginas
   - Integración con música de fondo
   - Texto de la carta mejorado

4. **style.css**
   - Añadidos estilos para spinner
   - Añadidos estilos para mensajes
   - Mejoras menores en responsive

5. **subir-foto.html**
   - Cambiado de Firebase a **Supabase**
   - Manejo de errores mejorado
   - Mensajes de error específicos para Supabase

6. **package.json**
   - Eliminada dependencia de Firebase
   - Añadida dependencia de @supabase/supabase-js

7. **README.md**
   - Completamente reescrito con instrucciones para Supabase y YouTube

### Archivos Eliminados:

- `js/firebase-config.js` (reemplazado por `js/supabase-config.js`)
- `EJEMPLO-FIREBASE.md` (reemplazado por `EJEMPLO-SUPABASE.md`)

## ✨ Nuevas Funcionalidades

### 1. Música de Fondo desde YouTube 🎵
- **Archivo**: `js/musica.js`
- **Tecnología**: API de YouTube IFrame Player
- **Video por defecto**: https://youtu.be/p_1Osm5xE5Y
- **Alternativa**: https://youtu.be/QAItMep0GiA (el que mencionaste originalmente)
- Se reproduce automáticamente en todas las páginas
- **Volumen**: 50% (controlable)
- Loop infinito
- Si el navegador bloquea el autoplay, muestra un botón para iniciar manualmente
- **NO requiere archivo MP3 local**

**Para cambiar el video:**
```javascript
// En js/musica.js
const YOUTUBE_VIDEO_ID = 'NUEVO_VIDEO_ID';
```

### 2. Página de Cumpleaños 🎂
- **Archivo**: `cumpleanos.html`
- Se activa automáticamente:
  - **11 de enero**: Cumpleaños de Joseph (00:00h)
  - **7 de octubre**: Cumpleaños de Ohanna (00:00h)
- Contenido especial para cada cumpleaños:
  - Animaciones de globos y pastel con velas para Joseph
  - Animación de confeti y regalo para Ohanna
- Contador de días hasta el próximo cumpleaños
- Recuerdos del año en curso
- **Estilos**: `css/celebraciones.css`

### 3. Página de Aniversario 💖
- **Archivo**: `aniversario.html`
- Se activa automáticamente el **1 de octubre** (00:00h)
- Contenido especial para el primer aniversario:
  - Reloj de amor con el número "1"
  - Línea de tiempo con 12 momentos importantes
  - Promesa de amor para el próximo año
  - Animación de corazones flotantes
- Contador de tiempo hasta el próximo aniversario (días, horas, minutos, segundos)
- Árbol de amor con anillos por cada año
- **Estilos**: `css/celebraciones.css`

### 4. Sistema de Subida de Fotos con Supabase 📸
- **Archivo**: `subir-foto.html`
- **Backend**: Supabase Storage + Supabase Database
- Formulario completo con:
  - Título (obligatorio)
  - Descripción (obligatorio)
  - Foto (obligatorio, máximo 5MB)
  - Frase de amor (opcional)
  - Fecha (opcional)
- Preview de la imagen antes de subir
- Arrastra y suelta (drag & drop)
- Barra de progreso de subida
- Mensajes de éxito/error
- **Archivo de configuración**: `js/supabase-config.js`

### 5. Base de Datos Supabase 🔥
- **Archivo**: `js/supabase-config.js`
- **Servicio**: [Supabase](https://supabase.com/) (alternativa a Firebase)
- Funciones exportadas:
  - `agregarFoto(file, titulo, descripcion, frase)`: Sube foto a Storage y guarda en Database
  - `obtenerFotos()`: Obtiene todas las fotos ordenadas por fecha
  - `obtenerFotosParaColage()`: Adapta fotos para el colage
  - `eliminarFoto(id, url)`: Elimina foto de Storage y Database
- **Requisitos en Supabase**:
  - Bucket: `fotos` (con acceso público)
  - Tabla: `fotos` (con columnas: id, titulo, descripcion, url, alt, frase, fecha_subida)

### 6. Configuración para Vercel ⚡
- **package.json**: Dependencias y scripts
- **vercel.json**: Configuración de rutas y cache
- **Optimizaciones**:
  - Cache de 1 hora para recursos estáticos
  - Redirección de `/` a `index.html`
  - Configuración de builds para HTML, CSS, JS y assets

## 🔄 Mejoras en la Navegación

Todas las páginas ahora tienen navegación completa:
- Nuestro colage
- Una carta para ti
- Cumpleaños
- Aniversario
- Añadir Foto

## 🎨 Mejoras de Estilo

- Spinner de carga para el colage
- Mensajes de información con estilos consistentes
- Animaciones suaves para las páginas de celebración
- Diseño responsive mejorado
- Estilos específicos para cada tipo de página

## 📊 Cambios Técnicos

### De Firebase a Supabase

| Firebase | Supabase |
|---------|----------|
| `initializeApp` | `createClient` |
| `getFirestore` | `supabase.from('tabla')` |
| `getStorage` | `supabase.storage.from('bucket')` |
| `addDoc` | `supabase.from('tabla').insert()` |
| `getDocs` | `supabase.from('tabla').select()` |
| Firestore | PostgreSQL |
| Storage | Storage (compatible) |

### Ventajas de Supabase:
✅ PostgreSQL (base de datos relacional)
✅ Más fácil de configurar
✅ API más simple
✅ Integración nativa con Next.js/Vercel
✅ Plan free más generoso

### De MP3 a YouTube API

| Antes | Ahora |
|-------|-------|
| Archivo MP3 local | Video de YouTube |
| Requiere descargar el MP3 | No requiere archivos locales |
| Volumen controlado por audio | Volumen controlado por YouTube API |
| Funciona offline (si el MP3 está cacheado) | Requiere conexión a internet |

### Ventajas de YouTube API:
✅ No necesitas descargar el MP3
✅ Cambiar la música es tan fácil como cambiar el ID del video
✅ No consume almacenamiento en tu proyecto
✅ siempre disponible

## 🚀 Pasos para Usar

### 1. Configurar Supabase
1. Ve a [Supabase](https://supabase.com/) y crea un proyecto
2. Crea un bucket llamado `fotos` en Storage (con acceso público)
3. Crea una tabla llamada `fotos` con las columnas necesarias
4. Copia las credenciales en `js/supabase-config.js`

**Guía detallada:** Ver `EJEMPLO-SUPABASE.md`

### 2. Desplegar en Vercel
```bash
# Instala Vercel CLI
npm install -g vercel

# Despliega (elige "Yes" a todo)
vercel
```

### 3. Probar localmente
```bash
# Usa un servidor local
npx serve
# o
python -m http.server 8000
```
Luego abre: `http://localhost:3000` o `http://localhost:8000`

### 4. Subir Fotos
- Ve a `subir-foto.html`
- Completa el formulario
- Las fotos aparecerán automáticamente en el colage

## ⚠️ Notas Importantes

1. **El login sigue siendo decorativo** (nombres: Ohanna, Joseph o josephohanna)
2. **Supabase en plan free** es suficiente para uso personal
3. **La música** requiere conexión a internet (usa YouTube)
4. **Para producción**, configura políticas de seguridad (RLS) en Supabase
5. **Las fotos** se cargan primero de Supabase, si falla usa los datos locales

## 📈 Estadísticas

- **Páginas HTML**: 5 (antes 3)
- **Archivos CSS**: 5 (antes 3)
- **Archivos JS**: 6 (antes 4)
- **Archivos de configuración**: 4
- **Total de archivos creados/modificados**: 18

## 💡 Consejos para el Uso

1. **Prueba localmente** antes de desplegar
2. **Verifica la consola del navegador** (F12) para ver errores
3. **Sube fotos de buena calidad** (mínimo 800x600px)
4. **Usa nombres descriptivos** para las fotos
5. **Configura CORS en Supabase** para evitar errores
6. **Para la música**, elige videos que sean principalmente música sin voces

## 🎁 Bonus

- Animación de corazones flotantes en el aniversario
- Animación de confeti en el cumpleaños de Ohanna
- Animación de velas encendidas en el pastel de cumpleaños
- Efectos visuales en todas las páginas
- Diseño consistente y profesional

---

**Fecha de actualización**: 27 de septiembre de 2026
**Versión**: 2.0
**Backend**: Supabase (antes Firebase)
**Música**: YouTube API (antes MP3 local)
