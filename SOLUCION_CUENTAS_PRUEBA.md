# 🔧 Solución: Botón Deshabilitado en Sandbox - Cuentas de Prueba

## 🔍 Problema Identificado

El botón de pago está deshabilitado en el sandbox de Mercado Pago porque **necesitas crear cuentas de prueba** en el Panel de Desarrolladores.

## ✅ Solución: Crear Cuentas de Prueba

### Paso 1: Crear Cuenta de Prueba de Vendedor

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Inicia sesión
3. Ve a **Tus integraciones** → Tu aplicación
4. Ve a la pestaña **"Cuentas de prueba"**
5. Haz clic en **"Crear cuenta de prueba"**
6. Selecciona:
   - **Tipo:** Vendedor
   - **País:** Argentina
   - **Descripción:** "Cuenta vendedor para pruebas"
7. Haz clic en **"Crear"**
8. **IMPORTANTE:** Copia el **Access Token** de esta cuenta de prueba

### Paso 2: Crear Cuenta de Prueba de Comprador

1. En la misma sección **"Cuentas de prueba"**
2. Haz clic en **"Crear cuenta de prueba"** de nuevo
3. Selecciona:
   - **Tipo:** Comprador
   - **País:** Argentina
   - **Descripción:** "Cuenta comprador para pruebas"
   - **Saldo ficticio:** $10,000 ARS (para pruebas)
4. Haz clic en **"Crear"**
5. **IMPORTANTE:** Anota el **email** de esta cuenta de comprador

### Paso 3: Actualizar Credenciales en Vercel

1. Ve a Vercel → Settings → Environment Variables
2. Actualiza `MERCADOPAGO_ACCESS_TOKEN` con el **Access Token de la cuenta de VENDEDOR** que acabas de crear
3. Guarda los cambios
4. Espera el redeploy (1-2 minutos)

### Paso 4: Usar Email de Cuenta de Comprador

Cuando pruebes el pago, usa el **email de la cuenta de COMPRADOR** que creaste.

## 🎯 Por qué esto funciona

- Las **cuentas de prueba** están diseñadas específicamente para el sandbox
- Tienen todas las validaciones y permisos necesarios
- El botón se habilita correctamente con cuentas de prueba
- Puedes simular pagos completos sin problemas

## 📝 Alternativa: Usar Email de Cuenta de Prueba en el Código

Si quieres que siempre use un email de cuenta de prueba, puedes actualizar el código para usar el email de tu cuenta de comprador de prueba.

## ✅ Verificación

Después de crear las cuentas de prueba:

1. ✅ El botón debería habilitarse
2. ✅ Podrás seleccionar métodos de pago
3. ✅ Podrás completar el pago de prueba
4. ✅ Recibirás notificaciones en el webhook

## 🔗 Recursos

- [Documentación de Cuentas de Prueba](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/test/accounts)
- [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel)

