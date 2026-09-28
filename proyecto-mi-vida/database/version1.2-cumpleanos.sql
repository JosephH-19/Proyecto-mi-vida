-- v1.2: recuerdos de cumpleaños, regalos y mensajes.
-- Ejecutar una vez en Supabase > SQL Editor, con los registros públicos desactivados.

CREATE TABLE IF NOT EXISTS public.regalos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL CHECK (char_length(btrim(nombre)) BETWEEN 1 AND 120),
  fecha date NOT NULL,
  descripcion text NOT NULL DEFAULT '' CHECK (char_length(descripcion) <= 2000),
  regalado_por text NOT NULL CHECK (regalado_por IN ('Joseph', 'Ohanna')),
  recibido_por text NOT NULL CHECK (recibido_por IN ('Joseph', 'Ohanna')),
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT regalo_personas_distintas CHECK (regalado_por <> recibido_por)
);

CREATE TABLE IF NOT EXISTS public.mensajes_cumpleanos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destinatario text NOT NULL CHECK (destinatario IN ('Joseph', 'Ohanna')),
  contenido text NOT NULL CHECK (char_length(btrim(contenido)) BETWEEN 1 AND 3000),
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.regalos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_cumpleanos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.regalos FROM anon;
REVOKE ALL ON public.mensajes_cumpleanos FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.regalos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mensajes_cumpleanos TO authenticated;

DROP POLICY IF EXISTS "regalos_pareja_select" ON public.regalos;
DROP POLICY IF EXISTS "regalos_autor_insert" ON public.regalos;
DROP POLICY IF EXISTS "regalos_autor_update" ON public.regalos;
DROP POLICY IF EXISTS "regalos_autor_delete" ON public.regalos;
CREATE POLICY "regalos_pareja_select" ON public.regalos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "regalos_autor_insert" ON public.regalos
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "regalos_autor_update" ON public.regalos
  FOR UPDATE TO authenticated USING (creado_por = auth.uid()) WITH CHECK (creado_por = auth.uid());
CREATE POLICY "regalos_autor_delete" ON public.regalos
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

DROP POLICY IF EXISTS "mensajes_cumple_pareja_select" ON public.mensajes_cumpleanos;
DROP POLICY IF EXISTS "mensajes_cumple_autor_insert" ON public.mensajes_cumpleanos;
DROP POLICY IF EXISTS "mensajes_cumple_autor_delete" ON public.mensajes_cumpleanos;
CREATE POLICY "mensajes_cumple_pareja_select" ON public.mensajes_cumpleanos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "mensajes_cumple_autor_insert" ON public.mensajes_cumpleanos
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "mensajes_cumple_autor_delete" ON public.mensajes_cumpleanos
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

CREATE INDEX IF NOT EXISTS regalos_fecha_idx ON public.regalos (fecha DESC);
CREATE INDEX IF NOT EXISTS mensajes_cumpleanos_creado_idx ON public.mensajes_cumpleanos (creado_en DESC);
