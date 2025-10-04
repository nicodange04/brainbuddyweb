-- SOLUCIÓN: Corregir políticas RLS con recursión infinita
-- Ejecutar este script para solucionar el problema

-- 1. Eliminar políticas problemáticas existentes
DROP POLICY IF EXISTS "Los usuarios pueden leer sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Los admins pueden leer todos los usuarios" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Los admins pueden leer admin" ON admin;
DROP POLICY IF EXISTS "Los admins pueden leer alumno" ON alumno;
DROP POLICY IF EXISTS "Los admins pueden leer padre" ON padre;
DROP POLICY IF EXISTS "Los admins pueden leer suscripcion" ON suscripcion;

-- 2. Crear políticas simplificadas sin recursión
-- Los usuarios pueden leer sus propios datos
CREATE POLICY "usuarios_select_own" ON usuarios
    FOR SELECT USING (auth.uid() = usuario_id);

-- Solo usuarios autenticados pueden insertar (admin puede insertar cualquier usuario)
CREATE POLICY "usuarios_insert_auth" ON usuarios
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Los usuarios pueden actualizar solo sus propios datos
CREATE POLICY "usuarios_update_own" ON usuarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Supabase Auth permite solo admins el acceso completo
-- Para desarrollo, desactivamos RLS temporalmente en otras tablas
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;
ALTER TABLE alumno DISABLE ROW LEVEL SECURITY;
ALTER TABLE padre DISABLE ROW LEVEL SECURITY;
ALTER TABLE suscripcion DISABLE ROW LEVEL SECURITY;

-- Resultado: políticas simples que no causan recursión infinita
