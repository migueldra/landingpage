# 🔐 Cómo Verificar un Dominio en Resend

## El Problema
Resend solo permite enviar emails de prueba a tu propia dirección cuando usas `onboarding@resend.dev`. Para enviar a cualquier destinatario, necesitas verificar un dominio.

## Solución: Verificar un Dominio

### Paso 1: Obtener un Dominio
Si no tienes uno, puedes usar:
- **Cloudflare** (gratis): https://www.cloudflare.com/products/registrar/
- **Freenom** (gratis): https://www.freenom.com/
- O comprar uno económico (~$10-15/año)

### Paso 2: Verificar en Resend

1. **Ve a Resend Domains:**
   - https://resend.com/domains
   - Inicia sesión con tu cuenta

2. **Agrega tu dominio:**
   - Haz clic en "Add Domain"
   - Ingresa tu dominio (ej: `tudominio.com`)
   - Haz clic en "Add"

3. **Configura los registros DNS:**
   Resend te dará registros DNS que debes agregar:
   
   - **SPF Record** (TXT)
   - **DKIM Records** (CNAME o TXT)
   - **DMARC Record** (TXT) - opcional pero recomendado

4. **Agrega los registros en tu proveedor DNS:**
   - Si usas Cloudflare: Ve a DNS → Records → Add record
   - Si usas otro proveedor: Ve al panel de DNS de tu dominio
   - Agrega cada registro exactamente como Resend te lo indica

5. **Verifica en Resend:**
   - Vuelve a Resend
   - Haz clic en "Verify" junto a tu dominio
   - Espera la verificación (puede tardar minutos a horas)

### Paso 3: Actualizar tu .env

Una vez verificado, actualiza tu `.env`:

```env
RESEND_FROM_EMAIL=noreply@tudominio.com
```

O cualquier email usando tu dominio verificado.

## Alternativa Temporal

Si solo quieres probar, puedes:
- Enviar emails de prueba a `miguelargus05@gmail.com` (tu email)
- Para producción, definitivamente necesitas verificar un dominio

## Nota Importante

Una vez que verifiques un dominio, podrás:
- ✅ Enviar a cualquier destinatario
- ✅ Usar cualquier email de tu dominio como remitente
- ✅ Mejorar la entregabilidad de tus emails
- ✅ Parecer más profesional
