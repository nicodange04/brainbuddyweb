# 🧪 Cómo Probar Pagos en Mercado Pago

## 🔍 Diferencia Importante

Hay **dos cosas diferentes** en Mercado Pago:

### 1. **Credenciales de Prueba** (Lo que ya tienes configurado)
- **Access Token:** `TEST-8472230214758689-...` ✅
- **Public Key:** `TEST-...` (necesitas configurarla)
- **Para qué sirve:** Para que tu aplicación haga llamadas a la API de Mercado Pago
- **Dónde va:** En Vercel (Environment Variables)
- **Ya lo tienes:** ✅ Access Token configurado

### 2. **Cuentas de Prueba** (Usuarios ficticios)
- **User ID:** `TESTUSER4198945132332273817`
- **Usuario:** `TESTUSER4198...`
- **Contraseña:** `mxUGY3sDat`
- **Para qué sirve:** Para iniciar sesión en Mercado Pago como usuario y probar el flujo completo
- **Dónde se usa:** En la página de Mercado Pago cuando te redirige para pagar

## ✅ Cómo Probar Pagos (2 Opciones)

### Opción 1: Probar SIN iniciar sesión (MÁS FÁCIL) ⭐

**Esta es la forma más simple:**

1. Ve a tu app: `https://brainbuddyweb.vercel.app`
2. Haz clic en "Suscribirse"
3. Te redirige a Mercado Pago
4. **NO inicies sesión**, simplemente:
   - Selecciona "Tarjeta de crédito" o "Tarjeta de débito"
   - Usa una **tarjeta de prueba**:
     - **Número:** `5031 7557 3453 0604`
     - **CVV:** `123`
     - **Fecha:** Cualquier fecha futura (ej: 12/25)
     - **Nombre:** Cualquier nombre
5. Completa el pago
6. ✅ **Funciona sin necesidad de iniciar sesión**

### Opción 2: Probar INICIANDO sesión con cuenta de prueba

**Si quieres probar el flujo completo:**

1. Ve a tu app: `https://brainbuddyweb.vercel.app`
2. Haz clic en "Suscribirse"
3. Te redirige a Mercado Pago
4. Haz clic en **"Iniciar sesión"** o **"Ingresar"**
5. Usa las credenciales de la cuenta de **COMPRADOR**:
   - **Usuario:** `TESTUSER3381982195785189501` (o el que te mostró Mercado Pago)
   - **Contraseña:** La contraseña que te dio Mercado Pago
6. Si te pide código de verificación:
   - Usa los **últimos 6 dígitos del User ID** de la cuenta de comprador
   - O los últimos 6 dígitos del Access Token
7. Completa el pago

## 🎯 Recomendación

**Usa la Opción 1** (sin iniciar sesión):
- ✅ Más fácil
- ✅ Más rápido
- ✅ No necesitas recordar credenciales
- ✅ Funciona igual de bien

## 📋 Tarjetas de Prueba

### Tarjeta Aprobada:
- **Número:** `5031 7557 3453 0604`
- **CVV:** `123`
- **Fecha:** Cualquier fecha futura
- **Nombre:** Cualquier nombre

### Tarjeta Rechazada (para probar errores):
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Fecha:** Cualquier fecha futura

## ✅ Verificación

Después de probar:

1. ✅ El pago debería completarse
2. ✅ Te redirige a `/pago/exito`
3. ✅ El webhook debería recibir la notificación
4. ✅ La suscripción debería guardarse en la base de datos

## 🆘 Si el Botón Sigue Deshabilitado

1. **Verifica que el Access Token esté correcto en Vercel:**
   - Debe ser: `TEST-8472230214758689-112118-6b386fe16bd4ad78770d9f4232b5ef04-299328173`

2. **Verifica que la Public Key esté configurada:**
   - Debe estar en Vercel como `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`

3. **Espera el redeploy completo** (puede tardar 2-3 minutos)

4. **Limpia la caché del navegador** (Ctrl+Shift+Delete)

## 📝 Resumen

- **Credenciales de prueba** = Para tu aplicación (ya configurado ✅)
- **Cuentas de prueba** = Para iniciar sesión en Mercado Pago (opcional)
- **Tarjetas de prueba** = Para completar el pago (lo que necesitas usar)

**Para probar:** Usa tarjetas de prueba sin necesidad de iniciar sesión.

