import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      nombre?: string;
      apellidos?: string;
      telefono?: string;
      departamento?: string;
      ciudad?: string;
      direccion?: string;
      complementos?: string;
      email?: string;
      fragancia?: string;
    }
    
    const { nombre, apellidos, telefono, departamento, ciudad, direccion, complementos, email, fragancia } = body ?? {}
    
    if (!nombre || !apellidos || !telefono || !departamento || !ciudad || !direccion || !email) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }
    
    // Orden procesada exitosamente (sin guardar en base de datos)
    // Los datos se envían por WhatsApp según la lógica del frontend
    return NextResponse.json({ success: true, orderId: `order_${Date.now()}` })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Sin base de datos, retornar array vacío
  return NextResponse.json([])
}
