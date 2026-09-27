# Configuración de Supabase - Guía Paso a Paso

## 🚀 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com/](https://supabase.com/)
2. Haz clic en "New Project"
3. Completa los datos:
   - **Project Name**: `proyecto-mi-vida`
   - **Database Password**: Elige una contraseña segura
   - **Region**: Selecciona la más cercana a ti (ej: `South America (Sao Paulo)`)
4. Haz clic en "Create new project"
5. Espera unos minutos a que se cree el proyecto

## 📋 Paso 2: Obtener las Credenciales

1. En tu proyecto, ve a **Settings** (icono de engranaje en el panel izquierdo)
2. Haz clic en **API**
3. Busca estas dos valores:
   - **Project URL**: Copia la URL (ej: `https://tuproyecto.supabase.co`)
   - **anon (public)**: Copia la clave pública (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 🗃 Paso 3: Configurar Storage (para las fotos)

1. En el panel izquierdo, ve a **Storage**
2. Haz clic en "New Bucket"
3. Configura el bucket:
   - **Name**: `fotos` (IMPORTANTE: debe ser exactamente este nombre)
   - **Public Access**: Activa "Enable public access"
4. Haz clic en "Create bucket"

## 🗄 Paso 4: Configurar la Tabla de Fotos

1. En el panel izquierdo, ve a **Table Editor**
2. Haz clic en "New Table"
3. Configura la tabla:
   - **Name**: `fotos` (IMPORTANTE: debe ser exactamente este nombre)
   
4. Añade las siguientes columnas:
   
   | Name | Type | Default Value | Other |
   |------|------|---------------|-------|
   | id | UUID | gen_random_uuid() | Primary Key |
   | titulo | Text | - | - |
   | descripcion | Text | - | - |
   | url | Text | - | - |
   | alt | Text | - | - |
   | frase | Text | - | - |
   | fecha_subida | Timestamp with time zone | now() | - |

5. Haz clic en "Save"

## 🔧 Paso 5: Pegar la Configuración

Abre el archivo `/proyecto-mi-vida/js/supabase-config.js` y reemplaza los valores:

```javascript
const supabaseUrl = 'TU_PROJECT_URL_AQUI';
const supabaseKey = 'TU_ANON_PUBLIC_KEY_AQUI';
```

Ejemplo:
```javascript
const supabaseUrl = 'https://tuproyecto.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 📁 Paso 6: CORS y seguridad

Este sitio usa `supabase-js` desde el navegador para llamar a la Data API y Storage. Para ese flujo no tienes que añadir dominios de Vercel a una lista de CORS. La guía de CORS aplica cuando invocas una **Edge Function** desde el navegador; este proyecto no usa Edge Functions.

La clave `anon` del frontend es pública por diseño. La seguridad debe estar en las políticas RLS y de Storage. El login de `index.html` es solo visual: cualquiera puede abrir directamente `subir-foto.html` y realizar las operaciones que permitan las políticas.

Si decides permitir subidas públicas para este sitio, una política de inserción permite que cualquier persona con acceso al proyecto intente subir archivos. Limita el tamaño y los tipos MIME del bucket desde Supabase. Para que solo Joseph y Ohanna puedan subir, hace falta implementar autenticación real y restringir las políticas a usuarios autenticados.

## 🎯 Paso 7: Probar la Conexión

1. Abre el archivo `subir-foto.html` en tu navegador
2. Intenta subir una foto de prueba
3. Verifica que aparezca en el colage

## 🔐 Políticas de acceso (RLS)

Un bucket público permite descargar archivos sin iniciar sesión; eso **no** concede permiso para subirlos. Las subidas requieren una política de Storage. La tabla también requiere permisos y políticas compatibles con las operaciones de la app.

Ejemplo de acceso público de lectura e inserción (úsalo solo si aceptas que visitantes anónimos puedan subir fotos):

```sql
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de fotos"
ON public.fotos FOR SELECT TO anon
USING (true);

CREATE POLICY "Inserción pública de fotos"
ON public.fotos FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Lectura de objetos del bucket fotos"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'fotos');

CREATE POLICY "Subida pública al bucket fotos"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'fotos');
```

`WITH CHECK` valida filas nuevas en una política `INSERT`; `USING` no corresponde a esa operación. Las políticas no sustituyen los permisos SQL (`GRANT`): si recibes un error de permisos, revisa también los privilegios de `anon` sobre la tabla. No crees políticas públicas de `UPDATE` o `DELETE` salvo que realmente quieras permitirlo. El formulario de acceso del sitio no protege la base de datos ni el bucket.

## 📊 Límites de Supabase

El plan **Free** de Supabase incluye:
- **500 MB** de almacenamiento en Storage
- **50,000** consultas a la base de datos por día
- **2 GB** de ancho de banda por día
- **1 proyecto** en el plan free

Para un proyecto personal con fotos, esto es más que suficiente.

## 💡 Consejos

1. **Prueba localmente** antes de desplegar
2. **Usa nombres consistentes** (bucket: fotos, tabla: fotos)
3. **Verifica la consola del navegador** para errores
4. **Elimina fotos de prueba** después de verificar que todo funciona
5. **Haz backup de tus fotos** periódicamente

---

**Documentación oficial:**
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [RLS (Row Level Security)](https://supabase.com/docs/guides/auth/row-level-security)
