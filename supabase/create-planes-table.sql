-- Crear tabla de planes de suscripción
CREATE TABLE IF NOT EXISTS planes (
    plan_id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10, 2) NOT NULL,
    precio_anual DECIMAL(10, 2),
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    activo BOOLEAN DEFAULT true,
    limite_usuarios INTEGER,
    limite_proyectos INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar planes iniciales
INSERT INTO planes (plan_id, nombre, descripcion, precio_mensual, precio_anual, caracteristicas, activo, limite_usuarios)
VALUES 
    ('estudiante', 'Plan Estudiante', 'Ideal para estudiantes individuales', 100.00, 1000.00, 
     '["Hasta 5 exámenes simultáneos", "Sesiones de estudio ilimitadas", "Generación de contenido con IA", "Gamificación completa", "1 padre puede vincularse", "Reportes de progreso", "Soporte prioritario"]'::jsonb, 
     true, 1),
    ('familiar', 'Plan Familiar', 'Perfecto para familias múltiples', 250.00, 2500.00,
     '["Todo lo del Plan Estudiante", "Hasta 3 alumnos por cuenta", "Exámenes ilimitados", "Múltiples padres pueden vincularse", "Reportes comparativos entre hermanos", "Dashboard familiar", "Soporte prioritario"]'::jsonb,
     true, 3)
ON CONFLICT (plan_id) DO NOTHING;

-- Habilitar RLS
ALTER TABLE planes ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer planes activos
CREATE POLICY "Todos pueden leer planes activos" ON planes
    FOR SELECT USING (activo = true);

-- Política: Solo admins pueden modificar planes
CREATE POLICY "Admins pueden modificar planes" ON planes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u 
            WHERE u.usuario_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
            AND u.rol = 'admin'
        )
    );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_planes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planes_updated_at
    BEFORE UPDATE ON planes
    FOR EACH ROW
    EXECUTE FUNCTION update_planes_updated_at();

