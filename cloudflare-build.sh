#!/bin/bash
# Script de build para Cloudflare Pages

# Instalar dependencias
npm ci --legacy-peer-deps

# Build de Next.js con adaptador de Cloudflare
npm run build:cf
