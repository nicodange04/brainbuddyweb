-- Agregar campos de Mercado Pago a la tabla de suscripciones
-- Ejecutar este script en tu base de datos de Supabase

-- Agregar columnas para Mercado Pago
ALTER TABLE suscripcion
ADD COLUMN IF NOT EXISTS mp_payment_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_subscription_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_payment_status VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS mp_external_reference VARCHAR(255) NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_payment_id ON suscripcion(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_preference_id ON suscripcion(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_external_reference ON suscripcion(mp_external_reference);

-- Comentarios para documentación
COMMENT ON COLUMN suscripcion.mp_payment_id IS 'ID del pago en Mercado Pago';
COMMENT ON COLUMN suscripcion.mp_preference_id IS 'ID de la preferencia de pago en Mercado Pago';
COMMENT ON COLUMN suscripcion.mp_subscription_id IS 'ID de la suscripción recurrente en Mercado Pago (si aplica)';
COMMENT ON COLUMN suscripcion.mp_payment_status IS 'Estado del pago en Mercado Pago (pending, approved, rejected, etc.)';
COMMENT ON COLUMN suscripcion.mp_external_reference IS 'Referencia externa usada para identificar el pago';

