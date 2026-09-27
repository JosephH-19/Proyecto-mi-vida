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

## 📁 Paso 6: Configurar CORS (IMPORTANTE para Vercel)

1. En tu proyecto Supabase, ve a **Settings** > **API**
2. Busca la sección **CORS**
3. Añade estos dominios:
   - `http://localhost:3000` (para desarrollo local)
   - `https://*.vercel.app` (para Vercel)
   - `*` (para cualquier dominio, solo para desarrollo)
4. Haz clic en "Save"

## 🎯 Paso 7: Probar la Conexión

1. Abre el archivo `subir-foto.html` en tu navegador
2. Intenta subir una foto de prueba
3. Verifica que aparezca en el colage

## 🔐 Configuración de Seguridad (Recomendado para Producción)

### Reglas de Storage (Row Level Security - RLS)

Por defecto, con "Public Access" activado en el bucket, no necesitas configurar RLS. 

Pero si quieres más seguridad, puedes desactivar "Public Access" y configurar políticas:

1. Ve a **Storage** > **Policies**
2. Crea una nueva política para el bucket `fotos`:

```sql
-- Permitir lectura pública
CREATE POLICY "Enable public read access for fotos"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos');

-- Permitir escritura pública (para subir fotos)
CREATE POLICY "Enable public insert for fotos"
ON storage.objects FOR INSERT
USING (bucket_id = 'fotos');
```

3. Ejecuta las políticas

### Reglas de la Tabla

Para la tabla `fotos`, puedes configurar políticas:

```sql
-- Permitir lectura pública
CREATE POLICY "Enable public read access for fotos table"
ON fotos FOR SELECT USING (true);

-- Permitir inserción pública
CREATE POLICY "Enable public insert for fotos table"
ON fotos FOR INSERT USING (true);
```

## 🛠 Solución de Problemas

### Error: "Invalid supabase URL"
- Verifica que la URL no tenga espacios
- Asegúrate de que sea la URL completa (ej: `https://tuproyecto.supabase.co`)

### Error: "Invalid supabase key"
- Verifica que la clave sea la "anon (public)"
- No uses la clave "service_role"

### Error: "Storage bucket not found"
- Verifica que el bucket se llame exactamente `fotos`
- Verifica que el nombre no tenga mayúsculas

### Error: "Relation 'fotos' does not exist"
- Verifica que la tabla se llame exactamente `fotos`
- Verifica que las columnas tengan los nombres correctos

### Las fotos no aparecen en el colage
- Verifica que el bucket y la tabla tengan el mismo nombre
- Revisa la consola del navegador (F12 > Console) para ver errores
- Asegúrate de que el CORS esté configurado correctamente

### Error de CORS
- Verifica que el dominio de tu aplicación esté en la lista de CORS
- Para desarrollo local, añade `http://localhost:3000`
- Para Vercel, añade `https://*.vercel.app`

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
