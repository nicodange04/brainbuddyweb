# 🔑 Configurar Public Key de Mercado Pago en Vercel

## 📝 Paso a Paso

### Paso 1: Obtener la Public Key

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Inicia sesión
3. Ve a **Tus integraciones** → Tu aplicación
4. Ve a la pestaña **"Credenciales de prueba"** (donde obtuviste el Access Token)
5. Busca **"Public Key"** (empieza con `TEST-`)
6. **Copia** la Public Key completa

### Paso 2: Agregar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `brainbuddyweb`
3. Ve a **Settings** → **Environment Variables**
4. Busca si ya existe `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - **Si existe:** Haz clic en **Edit** y reemplázala con la nueva Public Key
   - **Si NO existe:** Haz clic en **Add New** y crea:
     - **Key:** `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
     - **Value:** Pega la Public Key que copiaste
5. **IMPORTANTE:** Asegúrate de que esté seleccionado para:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
6. Haz clic en **Save**

### Paso 3: Esperar el Redeploy

1. Vercel redeployará automáticamente (1-2 minutos)
2. Puedes ver el progreso en **Deployments**

## ✅ Verificación

Después del redeploy:

1. Ve a: `https://brainbuddyweb.vercel.app`
2. Intenta hacer un pago
3. Debería funcionar correctamente ✅

## 📋 Resumen de Variables en Vercel

Asegúrate de tener estas dos variables configuradas:

1. ✅ `MERCADOPAGO_ACCESS_TOKEN` = `TEST-8472230214758689-112118-6b386fe16bd4ad78770d9f4232b5ef04-299328173`
2. ✅ `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` = `TEST-tu-public-key-aqui` (la que copiaste)

## 🆘 Si No Encuentras la Public Key

1. Ve a **Credenciales de prueba** (misma sección donde está el Access Token)
2. Deberías ver:
   - **Public Key** (empieza con `TEST-`)
   - **Access Token** (ya lo tienes)
3. Copia la **Public Key** completa

