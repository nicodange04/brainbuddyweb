# 🔄 Cambiar a Credenciales de TEST de Mercado Pago

## ✅ Por qué usar TEST

Las credenciales de **TEST** son más permisivas y están diseñadas para desarrollo:
- ✅ No requieren verificación completa de cuenta
- ✅ Permiten montos más bajos
- ✅ No tienen restricciones de producción
- ✅ Perfectas para pruebas locales

## 📝 Pasos para cambiar a TEST

### Paso 1: Obtener credenciales de TEST

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta
3. Ve a **Tus integraciones** → Selecciona tu aplicación
4. Ve a la pestaña **Credenciales de prueba**
5. Copia tu **Access Token** (empieza con `TEST-`)

### Paso 2: Actualizar variables de entorno

**Si estás en local (`.env.local`):**

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-token-de-test-aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Si estás en Vercel:**

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Edita `MERCADOPAGO_ACCESS_TOKEN`
4. Cambia el valor a tu token de TEST (empieza con `TEST-`)
5. Guarda los cambios
6. Haz un nuevo deployment

### Paso 3: Reiniciar el servidor

**Local:**
```bash
# Detén el servidor (Ctrl+C)
# Reinicia
npm run dev
```

**Vercel:**
- Los cambios se aplican automáticamente en el próximo deployment
- O puedes hacer un redeploy manual

## 🧪 Probar con tarjetas de prueba

Con credenciales de TEST, puedes usar estas tarjetas:

### Tarjeta aprobada:
- **Número:** `5031 7557 3453 0604`
- **CVV:** `123`
- **Fecha:** Cualquier fecha futura
- **Nombre:** Cualquier nombre

### Tarjeta rechazada (para probar errores):
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Fecha:** Cualquier fecha futura

## ✅ Verificar que funciona

1. Reinicia tu servidor
2. Intenta hacer un pago
3. Deberías ver que ahora funciona correctamente
4. Usa las tarjetas de prueba para completar el pago

## 🔄 Volver a producción

Cuando estés listo para producción:

1. Obtén tus credenciales de **producción** (empiezan con `APP_USR-`)
2. Actualiza las variables de entorno
3. Asegúrate de que tu cuenta esté completamente verificada
4. Prueba con montos reales

## ⚠️ Importante

- Las credenciales de TEST solo funcionan en el ambiente de sandbox
- Los pagos de TEST no son reales (no se cobra dinero)
- Usa TEST para desarrollo y pruebas
- Usa producción solo cuando estés listo para recibir pagos reales

