# Configuración para Cloudflare Pages

## Variables de Entorno Necesarias

En el panel de Cloudflare Pages (Settings > Environment variables), configura:

### Build Settings
- **Build command:** `npm run build`
- **Build output directory:** `.next`
- **Root directory:** `/` (raíz del proyecto)

### Environment Variables
- `NODE_VERSION`: `20.x` (o la versión que uses)
- `DATABASE_URL`: Tu URL de base de datos PostgreSQL
- `RESEND_API_KEY`: (Opcional, si usas emails)
- `RESEND_FROM_EMAIL`: (Opcional, si usas emails)

## Comandos de Build

El proyecto usa npm (tiene package-lock.json), así que Cloudflare detectará automáticamente `npm install`.

## Notas Importantes

1. **Prisma**: Necesitas ejecutar `npx prisma generate` antes del build
2. **Next.js**: El proyecto está configurado con `images: { unoptimized: true }` para Cloudflare
3. **API Routes**: Funcionan con Cloudflare Pages usando el adaptador de Next.js

## Si tienes problemas

1. Verifica que `package.json` esté en la raíz
2. Asegúrate de que `package-lock.json` esté commitado
3. Revisa los logs de build en Cloudflare para ver el error específico
