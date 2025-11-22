# 🐛 Guía de Depuración - Problema con Pagos

## 🔍 Pasos para Identificar el Problema

### 1. Abrir la Consola del Navegador

1. Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Ve a la pestaña **Console**
3. Intenta hacer clic en el botón de pago
4. Busca mensajes que empiecen con:
   - `💰 Precio calculado:`
   - `📤 Enviando request a Mercado Pago:`
   - `❌ Error:`

### 2. Verificar los Logs del Servidor

Si estás en **Vercel**:
1. Ve a tu proyecto en Vercel
2. Abre **Deployments** → Último deployment
3. Abre **Functions** → `/api/mercadopago/preference`
4. Revisa los logs cuando intentas pagar

Si estás en **local**:
- Revisa la terminal donde corre `npm run dev`
- Busca mensajes que empiecen con:
  - `📦 Datos del pago:`
  - `💰 Precio validado:`
  - `📤 Enviando preferencia a Mercado Pago...`
  - `❌ Error:`

### 3. Verificar el Precio que se Envía

En la consola del navegador, deberías ver algo como:

```javascript
💰 Precio calculado: {
  frequency: "monthly",
  precio_mensual: 100,
  precio_anual: 1000,
  amount: 100,
  planName: "Plan Estudiante"
}
```

**Verifica que:**
- ✅ `amount` sea **100** o más (no 20, no 50)
- ✅ `precio_mensual` sea **100** o más
- ✅ `precio_anual` sea **1000** o más

### 4. Verificar la Respuesta de Mercado Pago

En los logs del servidor, deberías ver:

```
📥 Respuesta de Mercado Pago: {
  id: "1234567890-...",
  hasInitPoint: true,
  hasSandboxInitPoint: true
}
```

**Si `hasInitPoint` es `false`:**
- El problema está en la creación de la preferencia
- Revisa los logs anteriores para ver el error

### 5. Verificar en la Página de Mercado Pago

Cuando te redirige a Mercado Pago:

1. **¿Ves el precio correcto?**
   - Debería mostrar **$100** o más
   - Si muestra **$20** o **$50**, el precio no se actualizó

2. **¿El botón "Pagar" está deshabilitado?**
   - Si está deshabilitado, puede ser:
     - Monto muy bajo (menor a $100 ARS)
     - Problema con las credenciales de test
     - Error en la configuración de Mercado Pago

3. **¿Hay algún mensaje de error?**
   - Anota el mensaje exacto
   - Toma una captura de pantalla

### 6. Verificar Credenciales

**En Vercel:**
1. Ve a **Settings** → **Environment Variables**
2. Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado
3. Verifica que empiece con:
   - `TEST-` (para test/sandbox)
   - `APP_USR-` (para producción)

**Si usas credenciales de TEST:**
- Asegúrate de estar en el ambiente de sandbox de Mercado Pago
- Los pagos de test pueden tener restricciones adicionales

### 7. Probar con un Precio Más Alto

Si el problema persiste, prueba temporalmente con un precio más alto:

1. Cambia en `PricingSection.tsx`:
   ```typescript
   price: '$500 ARS',  // En lugar de $100 ARS
   ```

2. Cambia en `configuracion.ts`:
   ```typescript
   precio_mensual: 500,  // En lugar de 100
   ```

3. Prueba si funciona con $500 ARS

## 🔧 Soluciones Comunes

### Problema: El precio sigue siendo $20 o $50

**Solución:**
1. Verifica que hayas hecho `git push` y el redeploy en Vercel
2. Limpia la caché del navegador (`Ctrl+Shift+Delete`)
3. Verifica que los cambios estén en el código

### Problema: Error "Monto mínimo es $100"

**Solución:**
- El precio que se está enviando es menor a $100
- Revisa los logs para ver qué precio se está calculando
- Asegúrate de que `precio_mensual` sea 100 o más

### Problema: El botón está deshabilitado en Mercado Pago

**Posibles causas:**
1. **Credenciales de test con restricciones**
   - Prueba con credenciales de producción
   - O verifica las restricciones de tu cuenta de test

2. **Monto aún muy bajo**
   - Aunque sea $100, algunos métodos de pago requieren más
   - Prueba con $200 o $500

3. **Problema con la cuenta de Mercado Pago**
   - Verifica que tu cuenta esté activa
   - Verifica que tengas permisos para recibir pagos

### Problema: Error 401 (Unauthorized)

**Solución:**
- El `MERCADOPAGO_ACCESS_TOKEN` es inválido o expiró
- Genera nuevas credenciales en Mercado Pago
- Actualiza la variable de entorno en Vercel

## 📝 Información a Recopilar

Si el problema persiste, recopila esta información:

1. **Logs de la consola del navegador** (F12 → Console)
2. **Logs del servidor** (Vercel Functions o terminal local)
3. **Captura de pantalla** de la página de Mercado Pago
4. **Precio que se muestra** en Mercado Pago
5. **Mensaje de error** (si hay alguno)
6. **Tipo de credenciales** (TEST- o APP_USR-)

## 🆘 Si Nada Funciona

1. Prueba con un precio mucho más alto ($1000 ARS) para descartar problemas de monto mínimo
2. Verifica que tu cuenta de Mercado Pago esté completamente configurada
3. Contacta al soporte de Mercado Pago con los logs de error

