# 📋 Cómo Verificar que las Suscripciones se Guardan Correctamente

## 🎯 Objetivo
Verificar que cuando un usuario completa un pago en Mercado Pago, la suscripción se guarda en la base de datos y aparece en los reportes.

---

## ✅ Paso 1: Ejecutar el Script SQL en Supabase

**IMPORTANTE:** Primero necesitas agregar los campos de Mercado Pago a tu tabla de suscripciones.

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Abre el **SQL Editor**
3. Ejecuta el script `supabase/add-mercadopago-fields.sql`:

```sql
-- Agregar campos de Mercado Pago a la tabla de suscripciones
ALTER TABLE suscripcion
ADD COLUMN IF NOT EXISTS mp_payment_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_subscription_id VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS mp_payment_status VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS mp_external_reference VARCHAR(255) NULL;

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_payment_id ON suscripcion(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_preference_id ON suscripcion(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_suscripcion_mp_external_reference ON suscripcion(mp_external_reference);
```

---

## 🧪 Paso 2: Realizar un Pago de Prueba

### Opción A: Pago Real (Sandbox/Test)
1. Ve a tu aplicación en Vercel
2. Navega a la sección de precios
3. Haz clic en "Suscribirse - Anual" o "Suscribirse - Mensual"
4. Completa el pago con una tarjeta de prueba de Mercado Pago:
   - **Tarjeta de prueba:** `5031 7557 3453 0604`
   - **CVV:** `123`
   - **Fecha:** Cualquier fecha futura
   - **Nombre:** Cualquier nombre

### Opción B: Simular Webhook (Para desarrollo)
Si quieres probar sin hacer un pago real, puedes simular el webhook manualmente.

---

## 🔍 Paso 3: Verificar en Supabase

### 3.1 Verificar en la Tabla `suscripcion`

1. Ve a **Supabase Dashboard** → **Table Editor**
2. Selecciona la tabla `suscripcion`
3. Deberías ver una nueva fila con:
   - `mp_payment_id`: ID del pago de Mercado Pago
   - `mp_payment_status`: `approved` (si el pago fue exitoso)
   - `estado`: `activo` (si el pago fue aprobado)
   - `plan`: El nombre del plan seleccionado
   - `usuario_id`: ID del usuario que realizó el pago

### 3.2 Consulta SQL para Verificar

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT 
  suscripcion_id,
  usuario_id,
  plan,
  estado,
  mp_payment_id,
  mp_payment_status,
  fecha_inicio,
  fecha_fin,
  created_at
FROM suscripcion
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📊 Paso 4: Verificar en los Reportes

1. Ve a tu aplicación → **Admin** → **Reportes**
2. Deberías ver:
   - **Métricas de Suscripciones:**
     - Suscripciones activas incrementadas
     - Nuevas suscripciones del mes
     - Distribución de planes actualizada
   - **Métricas Financieras:**
     - Ingresos actualizados
     - Tasa de conversión actualizada

---

## 🐛 Paso 5: Verificar Logs (Si algo falla)

### En Vercel:
1. Ve a tu proyecto en Vercel
2. Abre **Deployments** → Selecciona el último deployment
3. Abre **Functions** → Busca `/api/mercadopago/webhook`
4. Revisa los logs para ver si hay errores

### En el Código:
Los logs importantes están en:
- `app/api/mercadopago/webhook/route.ts` - Logs del webhook
- `lib/supabase/suscripciones.ts` - Logs de creación/actualización

Busca mensajes como:
- `✅ Nueva suscripción creada para usuario:`
- `✅ Suscripción actualizada:`
- `❌ Error al crear suscripción:`

---

## 🔧 Solución de Problemas

### Problema: No se crea la suscripción

**Posibles causas:**
1. **Campos no agregados:** Asegúrate de ejecutar el script SQL primero
2. **Webhook no configurado:** Verifica que el webhook esté configurado en Mercado Pago
3. **Error en el webhook:** Revisa los logs en Vercel

**Solución:**
- Verifica que el webhook URL sea: `https://tu-dominio.vercel.app/api/mercadopago/webhook`
- Revisa los logs del webhook en Vercel
- Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado en Vercel

### Problema: La suscripción se crea pero no aparece en reportes

**Posible causa:** Los reportes no están leyendo correctamente de la tabla

**Solución:**
- Verifica que el estado de la suscripción sea `activo`
- Verifica que `fecha_inicio` esté en el rango correcto
- Revisa `lib/supabase/reportes.ts` para ver cómo se filtran las suscripciones

---

## 📝 Checklist de Verificación

- [ ] Script SQL ejecutado en Supabase
- [ ] Pago de prueba realizado
- [ ] Nueva fila visible en tabla `suscripcion`
- [ ] `mp_payment_id` tiene un valor
- [ ] `estado` es `activo` (si el pago fue aprobado)
- [ ] Reportes muestran la nueva suscripción
- [ ] Métricas actualizadas correctamente

---

## 🎉 ¡Listo!

Si todos los pasos funcionan, tu integración está completa y funcionando correctamente. Las suscripciones se guardarán automáticamente cada vez que un usuario complete un pago.

