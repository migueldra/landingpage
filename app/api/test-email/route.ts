import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body ?? {}

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'El correo electrónico es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'El formato del correo electrónico no es válido' },
        { status: 400 }
      )
    }

    // Verificar que resend esté instalado
    let Resend
    try {
      Resend = require('resend').Resend
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'El paquete "resend" no está instalado. Ejecuta: npm install resend',
        },
        { status: 500 }
      )
    }

    // Verificar que RESEND_API_KEY esté configurada
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_API_KEY no está configurada. Agrega tu API key en el archivo .env',
        },
        { status: 500 }
      )
    }

    if (!process.env.RESEND_API_KEY.startsWith('re_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_API_KEY no tiene el formato correcto (debe empezar con "re_")',
        },
        { status: 500 }
      )
    }

    // Verificar que lib/email.ts exista
    const fs = require('fs')
    const path = require('path')
    const emailFileExists = fs.existsSync(path.join(process.cwd(), 'lib', 'email.ts'))

    if (!emailFileExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo lib/email.ts no existe. Necesitas crear la función de envío de emails primero.',
        },
        { status: 500 }
      )
    }

    // Intentar importar y usar la función de envío
    try {
      const { sendOrderConfirmationEmail } = require('@/lib/email')
      
      await sendOrderConfirmationEmail({
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: email,
        telefono: '3001234567',
        departamento: 'Cundinamarca',
        ciudad: 'Bogotá',
        direccion: 'Calle 123 #45-67',
        complementos: 'Apartamento 301',
        fragancia: 'Lavanda Relajante',
        orderId: 'TEST-' + Date.now().toString().slice(-8),
      })

      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
      })
    } catch (emailError: any) {
      console.error('Error al enviar email:', emailError)
      return NextResponse.json(
        {
          success: false,
          error: emailError?.message || 'Error al enviar el email. Revisa la consola del servidor para más detalles.',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error en test-email:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Error desconocido' },
      { status: 500 }
    )
  }
}
