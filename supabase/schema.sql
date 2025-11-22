-- Brain Buddy Database Schema
-- Este script implementa el esquema de base de datos según el diseño proporcionado

-- 1. Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Configurar política de fila de seguridad (RLS)

-- 3. Crear tabla de usuarios (tabla principal)
CREATE TABLE usuarios (
    usuario_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'alumno', 'padre')),
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear tabla de administradores
CREATE TABLE admin (
    admin_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crear tabla de alumnos
CREATE TABLE alumno (
    alumno_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ranking_id INT8 NULL,
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Crear tabla de padres
CREATE TABLE padre (
    padre_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Crear tabla de suscripciones
CREATE TABLE suscripcion (
    suscripcion_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    plan VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_fin TIMESTAMPTZ NULL,
    stripe_customer_id VARCHAR(255) NULL,
    stripe_subscription_id VARCHAR(255) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Crear relaciones entre tablas especializadas y usuarios
-- Relación admin -> usuarios
ALTER TABLE admin ADD CONSTRAINT fk_admin_usuario 
    FOREIGN KEY (admin_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE;

-- Relación alumno -> usuarios  
ALTER TABLE alumno ADD CONSTRAINT fk_alumno_usuario 
    FOREIGN KEY (alumno_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE;

-- Relación padre -> usuarios
ALTER TABLE padre ADD CONSTRAINT fk_padre_usuario 
    FOREIGN KEY (padre_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE;

-- 9. Crear índices para mejorar rendimiento
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_suscripcion_usuario_id ON suscripcion(usuario_id);
CREATE INDEX idx_suscripcion_estado ON suscripcion(estado);
CREATE INDEX idx_alumno_ranking_id ON alumno(ranking_id);

-- 10. Habilitar RLS (Row Level Security) en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumno ENABLE ROW LEVEL SECURITY;
ALTER TABLE padre ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripcion ENABLE ROW LEVEL SECURITY;

-- 11. Crear políticas RLS básicas
-- Los usuarios pueden leer sus propios datos
CREATE POLICY "Los usuarios pueden leer sus propios datos" ON usuarios
    FOR SELECT USING (auth.uid()::text = usuario_id::text);

-- Los admins pueden ver todos los usuarios
CREATE POLICY "Los admins pueden leer todos los usuarios" ON usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios u 
            WHERE u.usuario_id = auth.uid()::text 
            AND u.rol = 'admin'
        )
    );

-- Los usuarios pueden actualizar sus propios datos
CREATE POLICY "Los usuarios pueden actualizar sus propios datos" ON usuarios
    FOR UPDATE USING (auth.uid()::text = usuario_id::text);

-- 12. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Crear triggers para updated_at en todas las tablas
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumno_updated_at BEFORE UPDATE ON alumno
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_padre_updated_at BEFORE UPDATE ON padre
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suscripcion_updated_at BEFORE UPDATE ON suscripcion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Crear usuario admin inicial (opcional - solo para desarrollo)
-- NOTA: Cambia la contraseña después de la primera conexión
INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol) VALUES 
('Admin', 'Brain Buddy', 'admin@brainbuddy.com', '$2a$10$dummy.hash.for.development', 'admin')
ON CONFLICT (correo) DO NOTHING;

-- Conectar el admin a la tabla admin
INSERT INTO admin (admin_id) 
SELECT usuario_id FROM usuarios WHERE correo = 'admin@brainbuddy.com'
ON CONFLICT (admin_id) DO NOTHING;

-- 15. Crear vistas para dashboard de admin
-- Vista completa de usuarios con información de sus tablas especializadas
CREATE VIEW v_usuarios_completos AS
SELECT 
    u.usuario_id,
    u.nombre,
    u.apellido,
    u.nombre || ' ' || u.apellido as nombre_completo,
    u.correo,
    u.rol,
    u.created_at,
    u.updated_at,
    u.deleted_at,
    CASE 
        WHEN u.rol = 'admin' THEN 'Activo'
        WHEN u.rol = 'alumno' THEN 
            CASE WHEN a.deleted_at IS NULL THEN 'Activo' ELSE 'Inactivo' END
        WHEN u.rol = 'padre' THEN 'Activo'
        ELSE 'No definido'
    END as estado_usuario,
    sl.plan,
    sl.estado as estado_suscripcion,
    sl.fecha_inicio,
    sl.fecha_fin,
    CASE 
        WHEN sl.fecha_fin IS NULL OR sl.fecha_fin > NOW() THEN 'Vigente'
        ELSE 'Expirada'
    END as suscripcion_vigente
FROM usuarios u
LEFT JOIN admin a ON a.admin_id = u.usuario_id
LEFT JOIN alumno al ON al.alumno_id = u.usuario_id  
LEFT JOIN padre p ON p.padre_id = u.usuario_id
    LEFT JOIN LATERAL (
        SELECT plan, estado, fecha_inicio, fecha_fin
        FROM suscripcion s
        WHERE s.usuario_id = u.usuario_id 
        ORDER BY s.created_at DESC
        LIMIT 1
    ) sl ON true;

-- Vista de métricas generales para dashboard
CREATE VIEW v_metricas_dashboard AS
SELECT 
    COUNT(CASE WHEN u.rol = 'alumno' AND al.deleted_at IS NULL THEN 1 END) as alumnos_activos,
    COUNT(CASE WHEN u.rol = 'padre' THEN 1 END) as padres_registrados,
    COUNT(CASE WHEN u.rol = 'admin' THEN 1 END) as admins_registrados,
    COUNT(CASE WHEN sl.estado = 'activo' THEN 1 END) as suscripciones_activas,
    COUNT(CASE WHEN sl.plan = 'Plan Estudiante' THEN 1 END) as suscriptores_estudiante,
    COUNT(CASE WHEN sl.plan = 'Plan Familiar' THEN 1 END) as suscriptores_familiar,
    COUNT(CASE WHEN u.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as usuarios_mes_actual,
    COUNT(CASE WHEN sl.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as suscripciones_mes_actual,
    ROUND(
        (COUNT(CASE WHEN sl.plan = 'Plan Familiar' THEN 1 END) * 250 +
         COUNT(CASE WHEN sl.plan = 'Plan Estudiante' THEN 1 END) * 100), 2
    ) as mrr_estimado
FROM usuarios u
LEFT JOIN admin a ON a.admin_id = u.usuario_id
LEFT JOIN alumno al ON al.alumno_id = u.usuario_id
LEFT JOIN padre p ON p.padre_id = u.usuario_id
LEFT JOIN suscripcion sl ON sl.usuario_id = u.usuario_id;

-- Vista de métricas de suscripciones
CREATE VIEW v_metricas_suscripciones AS
SELECT 
    plan,
    COUNT(*) as cantidad,
    COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activas,
    COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as canceladas,
    COUNT(CASE WHEN estado = 'suspendida' THEN 1 END) as suspendidas,
    ROUND(AVG(CASE 
        WHEN fecha_fin IS NOT NULL 
        THEN EXTRACT(DAYS FROM fecha_fin - fecha_inicio)
        ELSE EXTRACT(DAYS FROM NOW() - fecha_inicio)
    END), 0) as dias_promedio_suscripcion,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as nuevas_semana,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as nuevas_mes
FROM suscripcion
GROUP BY plan
ORDER BY cantidad DESC;

-- 16. Configurar seguridad de vistas (security_invoker = true)
ALTER VIEW v_usuarios_completos SET (security_invoker = true);
ALTER VIEW v_metricas_dashboard SET (security_invoker = true);  
ALTER VIEW v_metricas_suscripciones SET (security_invoker = true);

-- 17. Habilitar RLS en las vistas (opcional, pero recomendado)
-- Las vistas heredan políticas RLS de las tablas subyacentes
