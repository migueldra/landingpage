import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET() {
  const issues: string[] = []
  const details: any = {}

  // Verificar si resend está instalado
  let resendInstalled = false
  try {
    require('resend')
    resendInstalled = true
    details['Paquete Resend'] = 'Instalado'
  } catch {
    resendInstalled = false
    issues.push('El paquete "resend" no está instalado. Ejecuta: npm install resend')
    details['Paquete Resend'] = 'No instalado'
  }

  // Verificar RESEND_API_KEY
  const hasApiKey = !!process.env.RESEND_API_KEY
  const apiKeyLength = process.env.RESEND_API_KEY?.length || 0
  const apiKeyStartsWith = process.env.RESEND_API_KEY?.startsWith('re_') || false

  details['RESEND_API_KEY configurada'] = hasApiKey
  details['Longitud de API Key'] = apiKeyLength
  details['Formato correcto (re_...)'] = apiKeyStartsWith

  if (!hasApiKey) {
    issues.push('RESEND_API_KEY no está configurada en el archivo .env')
  } else if (!apiKeyStartsWith) {
    issues.push('RESEND_API_KEY no tiene el formato correcto (debe empezar con "re_")')
  } else if (apiKeyLength < 20) {
    issues.push('RESEND_API_KEY parece ser muy corta (debe tener al menos 20 caracteres)')
  }

  // Verificar RESEND_FROM_EMAIL
  const hasFromEmail = !!process.env.RESEND_FROM_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'No configurado'
  
  details['RESEND_FROM_EMAIL configurado'] = hasFromEmail
  details['Email remitente'] = fromEmail

  if (!hasFromEmail) {
    issues.push('RESEND_FROM_EMAIL no está configurado. Usa: onboarding@resend.dev para pruebas')
  } else if (!fromEmail.includes('@')) {
    issues.push('RESEND_FROM_EMAIL no tiene un formato de email válido')
  }

  // Verificar si el archivo lib/email.ts existe
  const fs = require('fs')
  const path = require('path')
  const emailFileExists = fs.existsSync(path.join(process.cwd(), 'lib', 'email.ts'))
  
  details['Archivo lib/email.ts'] = emailFileExists ? 'Existe' : 'No existe'

  if (!emailFileExists) {
    issues.push('El archivo lib/email.ts no existe. Necesitas crear la función de envío de emails')
  }

  // Determinar estado general
  const status = issues.length === 0 && resendInstalled && hasApiKey && apiKeyStartsWith && hasFromEmail ? 'ok' : 'error'
  const message = status === 'ok' 
    ? '✅ Configuración correcta. Puedes enviar emails de prueba.'
    : `❌ Se encontraron ${issues.length} problema(s) que deben corregirse antes de enviar emails.`

  return NextResponse.json({
    status,
    message,
    issues,
    details,
  })
}
