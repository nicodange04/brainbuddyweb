# 🔧 Solución: Botón Deshabilitado en Sandbox de Mercado Pago

## 🔍 Problema Identificado

Estás en el **sandbox de Mercado Pago** (correcto ✅), pero el botón "Pagar" está **deshabilitado**.

## 🎯 Causas Posibles

### 1. **URLs de Retorno No Accesibles**

El sandbox necesita que las URLs de retorno sean accesibles desde internet. Si estás probando localmente, las URLs apuntan a Vercel pero el sandbox puede tener problemas validándolas.

### 2. **Email del Payer**

El email `test@example.com` puede no ser válido para el sandbox.

### 3. **Configuración de la Preferencia**

Puede faltar algún campo requerido para el sandbox.

## ✅ Soluciones

### Solución 1: Usar URLs de Localhost (Para Pruebas Locales)

**Actualiza tu `.env.local`:**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Reinicia el servidor:**
```bash
npm run dev
```

**Nota:** Esto puede no funcionar completamente porque el sandbox necesita URLs accesibles desde internet.

### Solución 2: Usar ngrok (Recomendado para Pruebas Locales)

**Instala ngrok:**
```bash
npm install -g ngrok
# O descarga desde https://ngrok.com
```

**Inicia ngrok:**
```bash
ngrok http 3000
```

**Copia la URL HTTPS** (algo como `https://abc123.ngrok.io`)

**Actualiza tu `.env.local`:**
```env
NEXT_PUBLIC_APP_URL=https://tu-url-de-ngrok.ngrok.io
```

**Reinicia el servidor y prueba de nuevo.**

### Solución 3: Probar Directamente en Vercel

**Haz deploy a Vercel:**
```bash
git add .
git commit -m "Fix Mercado Pago sandbox"
git push origin main
```

**Espera el deployment y prueba en:**
`https://brainbuddyweb.vercel.app`

**Las URLs de Vercel son accesibles desde internet, así que el sandbox debería funcionar.**

### Solución 4: Verificar Email del Payer

**En el código, el email se está enviando como `test@example.com`.**

**Prueba cambiando a un email más válido:**
- `test_user@testuser.com`
- O cualquier email válido

## 🧪 Prueba Rápida

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña Network**
3. **Intenta hacer clic en el botón**
4. **Busca errores en la consola o en Network**

## 💡 Recomendación

**Para desarrollo local:**
- Usa **ngrok** para hacer que localhost sea accesible
- O prueba directamente en **Vercel**

**Para producción:**
- Usa las credenciales de producción
- Asegúrate de que las URLs apunten a tu dominio real

## 🔍 Verificar en los Logs

Después de hacer los cambios, revisa los logs:

```bash
# Deberías ver:
🌐 URL base configurada: http://localhost:3000
# O
🌐 URL base configurada: https://tu-url.ngrok.io
```

Si ves que las URLs están correctas pero el botón sigue deshabilitado, puede ser un problema del sandbox de Mercado Pago. En ese caso, prueba directamente en Vercel.

