-- Migración v1.1: ejecutar manualmente en Supabase SQL Editor.
-- No se aplica sola y no modifica la rama/producción hasta que se ejecute.

ALTER TABLE public.fotos
  ADD COLUMN IF NOT EXISTS album text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS etiquetas text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ubicacion text,
  ADD COLUMN IF NOT EXISTS latitud double precision,
  ADD COLUMN IF NOT EXISTS longitud double precision;

CREATE TABLE IF NOT EXISTS public.fechas_especiales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 120),
  fecha date NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  se_repite_anualmente boolean NOT NULL DEFAULT false,
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.diario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 160),
  contenido text NOT NULL CHECK (char_length(contenido) BETWEEN 1 AND 12000),
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comentarios_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foto_id uuid NOT NULL REFERENCES public.fotos(id) ON DELETE CASCADE,
  contenido text NOT NULL CHECK (char_length(contenido) BETWEEN 1 AND 2000),
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reacciones_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foto_id uuid NOT NULL REFERENCES public.fotos(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (emoji IN ('❤️', '😍', '🥰', '😂', '✨')),
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (foto_id, creado_por)
);

CREATE TABLE IF NOT EXISTS public.mensajes_privados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contenido text NOT NULL DEFAULT '' CHECK (char_length(contenido) <= 4000),
  audio_path text,
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mensaje_tiene_contenido CHECK (contenido <> '' OR audio_path IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.visitas_privadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitado_en timestamptz NOT NULL DEFAULT now()
);

-- Cambios aditivos para fotos: conserva las políticas anon de la versión de producción,
-- y agrega acceso autenticado para que v1.1 funcione sin interrumpir la versión anterior.
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotos TO authenticated;
DROP POLICY IF EXISTS "fotos_members_all" ON public.fotos;
CREATE POLICY "fotos_members_all" ON public.fotos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Todas las tablas nuevas solo están disponibles con sesión autenticada.
DO $$
DECLARE tabla text;
BEGIN
  FOREACH tabla IN ARRAY ARRAY[
    'fechas_especiales', 'diario', 'comentarios_fotos',
    'reacciones_fotos', 'mensajes_privados', 'visitas_privadas'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tabla);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', tabla);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tabla);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "fechas_members_all" ON public.fechas_especiales;
CREATE POLICY "fechas_members_all" ON public.fechas_especiales
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "diario_members_read" ON public.diario;
DROP POLICY IF EXISTS "diario_members_insert" ON public.diario;
DROP POLICY IF EXISTS "diario_author_update_delete" ON public.diario;
DROP POLICY IF EXISTS "diario_author_delete" ON public.diario;
CREATE POLICY "diario_members_read" ON public.diario
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "diario_members_insert" ON public.diario
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "diario_author_update_delete" ON public.diario
  FOR UPDATE TO authenticated USING (creado_por = auth.uid()) WITH CHECK (creado_por = auth.uid());
CREATE POLICY "diario_author_delete" ON public.diario
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

DROP POLICY IF EXISTS "comentarios_members_read" ON public.comentarios_fotos;
DROP POLICY IF EXISTS "comentarios_auth_insert" ON public.comentarios_fotos;
DROP POLICY IF EXISTS "comentarios_author_delete" ON public.comentarios_fotos;
CREATE POLICY "comentarios_members_read" ON public.comentarios_fotos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "comentarios_auth_insert" ON public.comentarios_fotos
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "comentarios_author_delete" ON public.comentarios_fotos
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

DROP POLICY IF EXISTS "reacciones_members_read" ON public.reacciones_fotos;
DROP POLICY IF EXISTS "reacciones_auth_insert" ON public.reacciones_fotos;
DROP POLICY IF EXISTS "reacciones_author_update_delete" ON public.reacciones_fotos;
DROP POLICY IF EXISTS "reacciones_author_delete" ON public.reacciones_fotos;
CREATE POLICY "reacciones_members_read" ON public.reacciones_fotos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "reacciones_auth_insert" ON public.reacciones_fotos
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "reacciones_author_update_delete" ON public.reacciones_fotos
  FOR UPDATE TO authenticated USING (creado_por = auth.uid()) WITH CHECK (creado_por = auth.uid());
CREATE POLICY "reacciones_author_delete" ON public.reacciones_fotos
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

DROP POLICY IF EXISTS "mensajes_members_read" ON public.mensajes_privados;
DROP POLICY IF EXISTS "mensajes_auth_insert" ON public.mensajes_privados;
DROP POLICY IF EXISTS "mensajes_author_delete" ON public.mensajes_privados;
CREATE POLICY "mensajes_members_read" ON public.mensajes_privados
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "mensajes_auth_insert" ON public.mensajes_privados
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "mensajes_author_delete" ON public.mensajes_privados
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

DROP POLICY IF EXISTS "visitas_members_read" ON public.visitas_privadas;
DROP POLICY IF EXISTS "visitas_auth_insert" ON public.visitas_privadas;
CREATE POLICY "visitas_members_read" ON public.visitas_privadas
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "visitas_auth_insert" ON public.visitas_privadas
  FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

-- La versión anterior sigue funcionando con anon; v1.1 también necesita el rol autenticado.
DROP POLICY IF EXISTS "fotos_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "fotos_auth_delete" ON storage.objects;
CREATE POLICY "fotos_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fotos');
CREATE POLICY "fotos_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'fotos');

-- Notas de voz privadas: no se usa un bucket público.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('mensajes-voz', 'mensajes-voz', false, 10485760, ARRAY['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg'])
ON CONFLICT (id) DO UPDATE SET public = false;
DROP POLICY IF EXISTS "mensajes_voz_members_read" ON storage.objects;
DROP POLICY IF EXISTS "mensajes_voz_auth_insert" ON storage.objects;
CREATE POLICY "mensajes_voz_members_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'mensajes-voz');
CREATE POLICY "mensajes_voz_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'mensajes-voz');


-- Actualización instantánea del chat. Si ya estaba añadido a la publicación, no hace nada.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.mensajes_privados;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
