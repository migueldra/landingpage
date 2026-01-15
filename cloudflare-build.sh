#!/bin/bash
# Script de build para Cloudflare Pages

# Instalar dependencias
npm ci

# Generar Prisma Client
npx prisma generate

# Build de Next.js
npm run build
