import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { nombre, apellidos, telefono, departamento, ciudad, direccion, complementos, email, fragancia } = body ?? {}
    
    if (!nombre || !apellidos || !telefono || !departamento || !ciudad || !direccion || !email) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }
    
    const order = await prisma.order.create({
      data: {
        nombre: nombre ?? '',
        apellidos: apellidos ?? '',
        telefono: telefono ?? '',
        departamento: departamento ?? '',
        ciudad: ciudad ?? '',
        direccion: direccion ?? '',
        complementos: complementos ?? '',
        email: email ?? '',
        fragancia: fragancia ?? 'Lavanda Relajante',
        status: 'pending',
      },
    })
    
    return NextResponse.json({ success: true, orderId: order?.id ?? '' })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders ?? [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}
