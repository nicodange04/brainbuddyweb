-- Función RPC para crear registros de usuario
-- Esta función se ejecuta con permisos de servidor y evita problemas de RLS

CREATE OR REPLACE FUNCTION create_user_record(
    p_usuario_id UUID,
    p_nombre VARCHAR(255),
    p_apellido VARCHAR(255),
    p_correo VARCHAR(255),
    p_rol VARCHAR(50)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con permisos del propietario de la función
AS $$
DECLARE
    result JSON;
BEGIN
    -- Insertar en tabla usuarios
    INSERT INTO usuarios (
        usuario_id,
        nombre,
        apellido,
        correo,
        password_hash,
        rol
    ) VALUES (
        p_usuario_id,
        p_nombre,
        p_apellido,
        p_correo,
        '', -- Supabase Auth se encarga de la contraseña
        p_rol
    );

    -- Crear registro en tabla especializada según el rol
    IF p_rol = 'admin' THEN
        INSERT INTO admin (admin_id) VALUES (p_usuario_id);
    ELSIF p_rol = 'alumno' THEN
        INSERT INTO alumno (alumno_id) VALUES (p_usuario_id);
    ELSIF p_rol = 'padre' THEN
        INSERT INTO padre (padre_id) VALUES (p_usuario_id);
    END IF;

    -- Retornar resultado exitoso
    result := json_build_object(
        'success', true,
        'usuario_id', p_usuario_id,
        'message', 'Usuario creado exitosamente'
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, retornar información del error
        result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'usuario_id', p_usuario_id
        );
        RETURN result;
END;
$$;

-- Otorgar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION create_user_record(UUID, VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(50)) TO authenticated;
