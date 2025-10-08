-- Deshabilitar RLS temporalmente para desarrollo
-- Esto permite que todo funcione sin problemas de políticas

ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;
ALTER TABLE alumno DISABLE ROW LEVEL SECURITY;
ALTER TABLE padre DISABLE ROW LEVEL SECURITY;
ALTER TABLE suscripcion DISABLE ROW LEVEL SECURITY;
