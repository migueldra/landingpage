# AURA DRIVE - Landing Page

Landing page para AURA DRIVE, difusor de aromas premium para autos.

## 🚀 Despliegue

Este proyecto puede desplegarse en:

- **GitHub Pages**: `https://migueldra.github.io/landingpage/`
- **Cloudflare Pages**: Con OpenNext adapter

## 📦 Instalación

```bash
npm install --legacy-peer-deps
```

## 🔨 Desarrollo

```bash
npm run dev
```

## 🌐 Despliegue en GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando haces push a la rama `main`.

### Configuración en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. El workflow `.github/workflows/deploy-gh-pages.yml` se ejecutará automáticamente

### Build Manual

```bash
npm run build:gh
```

Esto generará los archivos estáticos en la carpeta `out/` listos para GitHub Pages.

## ☁️ Despliegue en Cloudflare Pages

Ver `.cloudflare/README.md` para instrucciones detalladas.

## 📝 Notas

- GitHub Pages solo sirve archivos estáticos (no API routes)
- Para funcionalidad dinámica, usa Cloudflare Pages con OpenNext
- El proyecto usa `basePath: '/landingpage'` para GitHub Pages
