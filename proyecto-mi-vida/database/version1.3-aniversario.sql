-- v1.3: registro diferenciado de regalos y mensajes de aniversario.
-- Requiere que database/version1.2-cumpleanos.sql ya se haya ejecutado.

ALTER TABLE public.regalos
  ADD COLUMN IF NOT EXISTS ocasion text NOT NULL DEFAULT 'Cumpleaños';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'regalos_ocasion_valida'
      AND conrelid = 'public.regalos'::regclass
  ) THEN
    ALTER TABLE public.regalos
      ADD CONSTRAINT regalos_ocasion_valida
      CHECK (ocasion IN ('Cumpleaños', 'Aniversario'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.mensajes_aniversario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destinatario text NOT NULL CHECK (destinatario IN ('Joseph', 'Ohanna')),
  contenido text NOT NULL CHECK (char_length(btrim(contenido)) BETWEEN 1 AND 3000),
  creado_por uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mensajes_aniversario ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mensajes_aniversario FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mensajes_aniversario TO authenticated;

DROP POLICY IF EXISTS "mensajes_aniversario_pareja_select" ON public.mensajes_aniversario;
DROP POLICY IF EXISTS "mensajes_aniversario_autor_insert" ON public.mensajes_aniversario;
DROP POLICY IF EXISTS "mensajes_aniversario_autor_delete" ON public.mensajes_aniversario;
CREATE POLICY "mensajes_aniversario_pareja_select" ON public.mensajes_aniversario
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "mensajes_aniversario_autor_insert" ON public.mensajes_aniversario
  FOR INSERT TO authenticated WITH CHECK (creado_por = auth.uid());
CREATE POLICY "mensajes_aniversario_autor_delete" ON public.mensajes_aniversario
  FOR DELETE TO authenticated USING (creado_por = auth.uid());

CREATE INDEX IF NOT EXISTS regalos_ocasion_fecha_idx ON public.regalos (ocasion, fecha DESC);
CREATE INDEX IF NOT EXISTS mensajes_aniversario_creado_idx ON public.mensajes_aniversario (creado_en DESC);
