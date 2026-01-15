#!/bin/bash
# Script de build para Cloudflare Pages

# Instalar dependencias (usar install porque Cloudflare ya ejecuta npm ci antes)
npm install --legacy-peer-deps

# Build de Next.js con adaptador de Cloudflare
npm run build:cf
