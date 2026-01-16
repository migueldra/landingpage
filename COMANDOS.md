# Comandos para Compilar e Implementar

## 📦 Instalación de Dependencias

### Primera vez o después de clonar el repositorio:
```bash
npm install --legacy-peer-deps
```

### Instalación limpia (recomendado para producción):
```bash
npm ci --legacy-peer-deps
```

## 🔨 Comandos de Compilación

### Desarrollo Local
```bash
# Iniciar servidor de desarrollo (con hot-reload)
npm run dev
```
El servidor se ejecutará en: `http://localhost:3000`

### Compilación para Producción (Local)
```bash
# Compilar Next.js
npm run build
```

### Ejecutar versión de producción localmente
```bash
# Primero compilar
npm run build

# Luego ejecutar
npm start
```

## 🚀 Implementación en Cloudflare Pages

### ⚠️ IMPORTANTE: Configuración Correcta

**NO uses `npx wrangler deploy` como comando de deploy.** Cloudflare Pages automáticamente detecta y despliega el output después del build.

### Configuración en Cloudflare Pages

1. Ve a tu proyecto en **Cloudflare Pages Dashboard**
2. Settings > **Builds & deployments**

#### Build Settings:
- **Build command:**
  ```bash
  npm run build:worker
  ```
  > ⚠️ **IMPORTANTE**: Este comando ejecuta `next build` y luego `npx @opennextjs/cloudflare build` para generar el worker y assets en `.opennext/` usando OpenNext (compatible con Next.js 15).
  
- **Deploy command (opcional):**
  ```bash
  npx wrangler deploy
  ```
  > ⚠️ **NOTA**: Si usas Cloudflare Pages, puedes dejar esto vacío y Pages desplegará automáticamente. Si usas Workers, necesitas este comando.

- **Build output directory:**
  ```
  .opennext
  ```
  > Este es el directorio que genera el adaptador `@opennextjs/cloudflare` (OpenNext).

- **Root directory:**
  ```
  / (vacío o raíz)
  ```

- **Deploy command:**
  ```
  (DEJAR VACÍO - No configurar nada aquí)
  ```
  > ⚠️ **CRÍTICO**: NO pongas `npx wrangler deploy` aquí. Cloudflare Pages automáticamente despliega el output después del build.

#### Environment Variables (Settings > Environment variables):
```
NODE_VERSION = 20.x
NEXT_PUBLIC_SITE_URL = https://tu-dominio.com
```
> ⚠️ **IMPORTANTE**: Reemplaza `tu-dominio.com` con tu dominio real (ej: `https://auradrive.com` o `https://www.auradrive.com`)

### Despliegue Manual (solo para pruebas locales)

```bash
# Instalar Wrangler CLI (solo una vez)
npm install -g wrangler

# Login en Cloudflare
wrangler login

# Build con adaptador
npm run build:cf

# Desplegar manualmente (solo si es necesario)
wrangler pages deploy .vercel/output/static --project-name=tu-proyecto
```

## 📋 Resumen de Comandos

| Acción | Comando |
|--------|---------|
| **Instalar dependencias** | `npm install --legacy-peer-deps` |
| **Instalación limpia** | `npm ci --legacy-peer-deps` |
| **Desarrollo** | `npm run dev` |
| **Compilar producción** | `npm run build` |
| **Ejecutar producción** | `npm start` |
| **Linter** | `npm run lint` |

## 🔧 Comandos Adicionales

### Git (antes de desplegar)
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de cambios"

# Push a GitHub
git push origin main
```

## ⚠️ Notas Importantes

1. **`--legacy-peer-deps`**: Se requiere porque `@typescript-eslint` v6 requiere ESLint 7-8, pero el proyecto usa ESLint 9.

2. **Node.js**: El proyecto requiere Node.js 20.x. Cloudflare Pages debe tener `NODE_VERSION = 20.x` configurado.

## 🐛 Solución de Problemas

### Si falla la instalación:
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Si el build falla en Cloudflare:
1. Verifica que el Build command sea exactamente:
   ```bash
   npm run build:cf
   ```
   > **CRÍTICO**: Cloudflare Pages puede detectar automáticamente `@cloudflare/next-on-pages` y ejecutarlo. Debes configurar manualmente el build command en el dashboard para usar `npm run build:cf`.
2. Verifica que el Build output directory sea:
   ```
   .opennext
   ```
   > Este es el directorio generado por OpenNext, NO `.vercel/output/static`
3. **Asegúrate de que NO haya un "Deploy command" configurado** (debe estar vacío)
4. Verifica que `NODE_VERSION = 20.x` esté configurado
5. Revisa los logs de build en Cloudflare Pages

### Error: "Missing entry-point to Worker script"
**Causa**: Tienes configurado `npx wrangler deploy` como deploy command.

**Solución**: 
- Ve a Settings > Builds & deployments
- **Borra completamente el campo "Deploy command"** (déjalo vacío)
- Cloudflare Pages automáticamente despliega el output después del build
