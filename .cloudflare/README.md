# Configuración para Cloudflare Pages con OpenNext

## ⚠️ IMPORTANTE: Deshabilitar Detección Automática

Cloudflare Pages detecta automáticamente proyectos Next.js y ejecuta `@cloudflare/next-on-pages` (incompatible con Next.js 15).

**SOLUCIÓN:**
1. Ve a **Cloudflare Pa ges Dashboard** → Tu proyecto
2. **Settings** → **Builds & deployments**
3. En **Framework preset**, selecciona **"None"** o **"No preset"** (NO uses "Next.js")
4. Configura manualmente los siguientes valores:

### Build Settings
- **Framework preset:** `None` (o "No preset")
- **Build command:** `npm run build:worker`
- **Build output directory:** `.opennext`
- **Root directory:** `/` (raíz del proyecto) o déjalo vacío
- **Deploy command:** `npx wrangler deploy` (o déjalo vacío si usas Pages automático)

### Environment Variables
- `NODE_VERSION`: `20.x` (o la versión que uses)

## Comandos de Build

El proyecto ahora usa `@opennextjs/cloudflare` que es compatible con Next.js 15.

**IMPORTANTE:** 
- El comando de build debe ser: `npm run build:worker`
- El output directory debe ser: `.opennext`
- El archivo `wrangler.jsonc` está configurado para apuntar a `.opennext/worker.js` y `.opennext/assets`
- NO uses `@cloudflare/next-on-pages` (está deprecado y no compatible con Next.js 15)

## Notas Importantes

1. **OpenNext**: El adaptador oficial para Next.js 15 en Cloudflare
2. **Next.js**: El proyecto está configurado con `images: { unoptimized: true }` para Cloudflare
3. **API Routes**: Funcionan con Cloudflare Pages usando el adaptador OpenNext

## Si tienes problemas

1. Verifica que `package.json` tenga `@opennextjs/cloudflare` instalado
2. Asegúrate de que el build command sea `npm run build:worker`
3. Verifica que el output directory sea `.opennext`
4. Verifica que `wrangler.jsonc` esté en la raíz del proyecto
5. Asegúrate de que el Root directory en Cloudflare apunte a `/` (donde está `wrangler.jsonc`)
6. Revisa los logs de build en Cloudflare para ver el error específico
