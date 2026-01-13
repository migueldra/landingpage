import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  departamento: string
  ciudad: string
  direccion: string
  complementos?: string
  fragancia: string
  orderId: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const { nombre, apellidos, email, telefono, departamento, ciudad, direccion, complementos, fragancia, orderId } = data

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no está configurada en las variables de entorno')
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - AURA DRIVE</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">
                ✨ AURA DRIVE
              </h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 18px; font-weight: 600;">
                ¡Tu Pedido ha sido Confirmado!
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hola <strong>${nombre} ${apellidos}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                ¡Gracias por tu pedido! Hemos recibido tu solicitud y estamos preparando tu <strong>AURA DRIVE</strong> para enviarlo.
              </p>

              <!-- Order Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #D4AF37;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px 0; color: #D4AF37; font-size: 20px; font-weight: bold;">
                      📦 Detalles de tu Pedido
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                          <strong>Número de Pedido:</strong>
                        </td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                          <strong style="color: #D4AF37;">#${orderId}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                          <strong>Fragancia:</strong>
                        </td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                          ${fragancia}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                          <strong>Precio:</strong>
                        </td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                          <strong style="color: #D4AF37; font-size: 18px;">$119.900 COP</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">
                          <strong>Método de Pago:</strong>
                        </td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; text-align: right;">
                          💵 Pago Contra Entrega
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-weight: bold;">
                  📍 Dirección de Envío
                </h3>
                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.8;">
                  ${direccion}${complementos ? `, ${complementos}` : ''}<br>
                  ${ciudad}, ${departamento}<br>
                  <strong>Teléfono:</strong> ${telefono}
                </p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #4caf50;">
                <h3 style="margin: 0 0 15px 0; color: #2e7d32; font-size: 18px; font-weight: bold;">
                  ⏱️ ¿Qué Sigue?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                  <li>Procesaremos tu pedido en las próximas 24 horas</li>
                  <li>Te contactaremos para confirmar los detalles de envío</li>
                  <li>El envío tarda entre 3-5 días hábiles</li>
                  <li>Pagarás cuando recibas el producto en tu puerta</li>
                </ul>
              </div>

              <!-- Benefits Reminder -->
              <div style="background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #000000; font-size: 18px; font-weight: bold;">
                  🎉 ¡Estás a punto de transformar tu auto!
                </h3>
                <p style="margin: 0; color: #000000; font-size: 14px;">
                  Disfruta de 4 meses de fragancia constante y tecnología inteligente que elimina olores automáticamente.
                </p>
              </div>

              <!-- Support -->
              <p style="margin: 30px 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Si tienes alguna pregunta, no dudes en contactarnos:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 15px; background-color: #25d366; border-radius: 8px; margin: 10px 0;">
                    <a href="https://wa.me/573144773378?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20%23${orderId}" 
                       style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                      💬 WhatsApp: 314 477 3378
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #999999; font-size: 12px; text-align: center; line-height: 1.6;">
                Gracias por confiar en AURA DRIVE.<br>
                Estamos emocionados de que formes parte de nuestra comunidad.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
              <p style="margin: 0; color: #D4AF37; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                AURA DRIVE
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © 2026 AURA DRIVE Colombia. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Usar el dominio de prueba de Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `✅ Confirmación de Pedido #${orderId} - AURA DRIVE`,
      html: htmlContent,
    })

    if (result.error) {
      const errorMsg = result.error.message || 'Error al enviar el email'
      
      // Mensaje más claro para el error de dominio no verificado
      if (errorMsg.includes('testing emails to your own email address') || 
          errorMsg.includes('verify a domain')) {
        throw new Error(
          '⚠️ Solo puedes enviar emails de prueba a tu propia dirección (miguelargus05@gmail.com). ' +
          'Para enviar a otros destinatarios, verifica un dominio en https://resend.com/domains ' +
          'y actualiza RESEND_FROM_EMAIL en tu .env con un email de tu dominio verificado.'
        )
      }
      
      throw new Error(errorMsg)
    }

    return { success: true, messageId: result.data?.id }
  } catch (error: any) {
    console.error('Error sending email:', error)
    throw error
  }
}
