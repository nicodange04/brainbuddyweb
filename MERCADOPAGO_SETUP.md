# 🚀 Guía de Configuración de Mercado Pago

## ✅ Pasos Completados

1. ✅ Instalación del SDK de Mercado Pago
2. ✅ Creación de tipos TypeScript
3. ✅ Servicio de pagos implementado
4. ✅ API routes creadas (preference y webhook)
5. ✅ Componentes UI actualizados
6. ✅ Páginas de resultado del pago creadas

## 📋 Pasos Pendientes

### 1. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_produccion
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_produccion
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret

# URL de tu aplicación (para callbacks)
NEXT_PUBLIC_APP_URL=https://brainbuddyweb.vercel.app
```

**Para desarrollo local:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Actualizar Base de Datos

Ejecuta el script SQL en tu base de datos de Supabase:

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `supabase/add-mercadopago-fields.sql`
4. Ejecuta el script

### 3. Configurar Webhook en Mercado Pago

1. Ve a tu aplicación en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel/app)
2. Ve a **Webhooks**
3. Agrega la URL: `https://brainbuddyweb.vercel.app/api/mercadopago/webhook`
4. Selecciona los eventos:
   - `payment.created`
   - `payment.updated`
   - `payment.approved`
   - `payment.rejected`

### 4. Configurar Variables en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega las mismas variables que en `.env.local`:
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - `MERCADOPAGO_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL`

### 5. Probar la Integración

#### Modo Test (Sandbox)

1. Usa las credenciales de **test** de Mercado Pago
2. Usa tarjetas de prueba:
   - **Aprobada**: `5031 7557 3453 0604` (CVV: 123)
   - **Rechazada**: `5031 4332 1540 6351` (CVV: 123)
3. Fecha de vencimiento: cualquier fecha futura

#### Modo Producción

1. Usa las credenciales de **producción**
2. Los pagos reales se procesarán normalmente

## 🔧 Archivos Creados

```
lib/
├── mercadopago/
│   ├── client.ts          # Cliente de Mercado Pago
│   └── pagos.ts            # Servicio de pagos
├── types/
│   └── mercadopago.ts      # Tipos TypeScript

app/
├── api/
│   └── mercadopago/
│       ├── preference/
│       │   └── route.ts    # Crear preferencia de pago
│       └── webhook/
│           └── route.ts    # Webhook de notificaciones
├── components/
│   └── CheckoutButton.tsx  # Botón de checkout
└── pago/
    ├── exito/
    │   └── page.tsx        # Página de pago exitoso
    ├── error/
    │   └── page.tsx        # Página de error
    └── pendiente/
        └── page.tsx        # Página de pago pendiente

supabase/
└── add-mercadopago-fields.sql  # Script SQL para actualizar BD
```

## 📝 Notas Importantes

1. **Seguridad**: Nunca expongas tu `ACCESS_TOKEN` en el frontend
2. **Webhooks**: Asegúrate de verificar la firma del webhook en producción
3. **Testing**: Siempre prueba primero en modo sandbox
4. **Moneda**: Actualmente configurado para USD, puedes cambiarlo en `CheckoutButton.tsx`

## 🐛 Troubleshooting

### Error: "MERCADOPAGO_ACCESS_TOKEN no está configurado"
- Verifica que las variables de entorno estén configuradas correctamente
- Reinicia el servidor de desarrollo después de agregar variables

### Webhook no recibe notificaciones
- Verifica que la URL del webhook sea accesible públicamente
- Asegúrate de que la URL sea HTTPS en producción
- Revisa los logs en Mercado Pago para ver si hay errores

### El pago se crea pero no se actualiza la suscripción
- Verifica que el webhook esté configurado correctamente
- Revisa los logs del servidor para ver si hay errores
- Verifica que la base de datos tenga los campos de Mercado Pago

## 📚 Recursos

- [Documentación de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [SDK de Mercado Pago para Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)

