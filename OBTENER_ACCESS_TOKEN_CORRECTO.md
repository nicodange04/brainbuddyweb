# 🔑 Cómo Obtener el Access Token Correcto de Cuentas de Prueba

## ❌ Problema

El token `TESTUSER4198945132332273817` que usaste es un **ID de usuario**, no un **Access Token**.

## ✅ Solución: Obtener el Access Token Correcto

### Paso 1: Ir al Panel de Desarrolladores

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Inicia sesión

### Paso 2: Ir a Cuentas de Prueba

1. Ve a **Tus integraciones** → Tu aplicación
2. Ve a la pestaña **"Cuentas de prueba"**
3. Deberías ver las cuentas que creaste:
   - Cuenta de Vendedor (TESTUSER4198945132332273817)
   - Cuenta de Comprador (TESTUSER3381982195785189501)

### Paso 3: Obtener el Access Token del Vendedor

1. Haz clic en la cuenta de **VENDEDOR** (TESTUSER4198945132332273817)
2. Busca la sección **"Credenciales"** o **"Access Token"**
3. **Copia el Access Token** (NO el ID de usuario)
   - El Access Token es más largo
   - Generalmente empieza con `TEST-` o tiene un formato diferente
   - Es diferente al ID `TESTUSER4198945132332273817`

### Paso 4: Actualizar en Vercel

1. Ve a Vercel → Settings → Environment Variables
2. Edita `MERCADOPAGO_ACCESS_TOKEN`
3. **Pega el Access Token completo** (no el ID de usuario)
4. Guarda los cambios
5. Espera el redeploy

## 🔍 Cómo Identificar el Access Token Correcto

**❌ NO es esto:**
- `TESTUSER4198945132332273817` (ID de usuario)

**✅ SÍ es esto:**
- Un token más largo (generalmente 50+ caracteres)
- Puede empezar con `TEST-` o tener otro formato
- Se encuentra en la sección "Credenciales" o "Access Token" de la cuenta de prueba

## 📝 Alternativa: Usar Credenciales de TEST Generales

Si no encuentras el Access Token de la cuenta de prueba, puedes usar las **credenciales de TEST generales**:

1. Ve a **Tus integraciones** → Tu aplicación
2. Ve a la pestaña **"Credenciales de prueba"** (no "Cuentas de prueba")
3. Copia el **Access Token** (empieza con `TEST-`)
4. Úsalo en Vercel

## ✅ Verificación

Después de actualizar con el Access Token correcto:

1. Espera el redeploy en Vercel (1-2 minutos)
2. Intenta hacer un pago
3. Debería funcionar correctamente ✅

## 🆘 Si No Encuentras el Access Token

1. **Crea una nueva cuenta de prueba de vendedor**
2. Al crearla, Mercado Pago te mostrará el Access Token
3. **Cópialo inmediatamente** (a veces no se puede ver después)
4. Úsalo en Vercel

