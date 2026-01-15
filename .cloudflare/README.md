# Configuración para Cloudflare Pages con OpenNext

## Variables de Entorno Necesarias

En el panel de Cloudflare Pages (Settings > Environment variables), configura:

### Build Settings
- **Build command:** `npm run build:cf`
- **Build output directory:** `.opennext`
- **Root directory:** `/` (raíz del proyecto)

### Environment Variables
- `NODE_VERSION`: `20.x` (o la versión que uses)

## Comandos de Build

El proyecto ahora usa `@opennextjs/cloudflare` que es compatible con Next.js 15.

**IMPORTANTE:** 
- El comando de build debe ser: `npm run build:cf`
- El output directory debe ser: `.opennext`
- NO uses `@cloudflare/next-on-pages` (está deprecado y no compatible con Next.js 15)

## Notas Importantes

1. **OpenNext**: El adaptador oficial para Next.js 15 en Cloudflare
2. **Next.js**: El proyecto está configurado con `images: { unoptimized: true }` para Cloudflare
3. **API Routes**: Funcionan con Cloudflare Pages usando el adaptador OpenNext

## Si tienes problemas

1. Verifica que `package.json` tenga `@opennextjs/cloudflare` instalado
2. Asegúrate de que el build command sea `npm run build:cf`
3. Verifica que el output directory sea `.opennext`
4. Revisa los logs de build en Cloudflare para ver el error específico
