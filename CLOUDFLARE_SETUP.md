# Configuración para Cloudflare Pages

## Problema: Dependencias no se instalan

Si las dependencias no se instalan en Cloudflare Pages, sigue estos pasos:

## Solución 1: Configurar Variables de Entorno en Cloudflare

1. Ve a tu proyecto en Cloudflare Pages
2. Settings > Environment variables
3. Agrega estas variables:

### Build Settings
- **Build command:** `npm ci --legacy-peer-deps && npm run build`
- **Build output directory:** `.next`
- **Root directory:** `/` (dejar vacío o `/`)

**Nota:** Se usa `--legacy-peer-deps` porque `@typescript-eslint` v6 requiere ESLint 7-8, pero el proyecto usa ESLint 9. Esto permite que el build continúe sin errores.

### Environment Variables
```
NODE_VERSION = 20.x
```

## Solución 2: Verificar Gestor de Paquetes

El proyecto usa **npm** (tiene `package-lock.json`). Cloudflare debería detectarlo automáticamente.

Si tienes problemas:
- Asegúrate de que `package-lock.json` esté en el repositorio
- No uses `yarn.lock` o `pnpm-lock.yaml` al mismo tiempo

## Solución 3: Script de Build Personalizado

Si necesitas ejecutar comandos adicionales antes del build, puedes usar:

**Build command en Cloudflare:**
```bash
npm ci && npx prisma generate && npm run build
```

O simplemente:
```bash
npm run build
```

(El script `build` ya incluye `prisma generate`)

## Solución 4: Verificar Archivos en Repositorio

Asegúrate de que estos archivos estén en tu repositorio:
- ✅ `package.json` (en la raíz)
- ✅ `package-lock.json` (en la raíz)
- ✅ `next.config.js` (en la raíz)
- ✅ `tsconfig.json` (en la raíz)
- ✅ `prisma/schema.prisma`

## Solución 5: Re-conectar Repositorio

Si el problema persiste:
1. Ve a Settings > Git en Cloudflare Pages
2. Desconecta el repositorio
3. Vuelve a conectarlo
4. Asegúrate de que la aplicación de Cloudflare tenga permisos en GitHub

## Solución 6: Verificar Logs de Build

1. Ve a Deployments en Cloudflare Pages
2. Abre el último deployment fallido
3. Revisa los logs para ver el error específico
4. Busca mensajes como:
   - "npm ERR!"
   - "Cannot find module"
   - "Command failed"

## Configuración Recomendada

### Build Settings:
```
Build command: npm run build
Build output directory: .next
Root directory: (vacío)
```

### Environment Variables:
```
NODE_VERSION = 20.x
DATABASE_URL = (tu URL de base de datos)
```

## Notas Importantes

1. **Prisma**: El script `postinstall` genera automáticamente el cliente de Prisma después de `npm install`
2. **Next.js**: Ya está configurado con `images: { unoptimized: true }` para Cloudflare
3. **Node.js**: Usa Node 20.x (configurado en package.json con @types/node 20.6.2)

## Si el problema persiste

1. Verifica que no haya errores de sintaxis en `package.json`
2. Asegúrate de que todas las dependencias estén en `dependencies` o `devDependencies`
3. Revisa que `.gitignore` no esté ignorando archivos necesarios
4. Intenta hacer un build local: `npm ci && npm run build`
