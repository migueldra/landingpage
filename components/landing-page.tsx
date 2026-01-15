'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Sparkles, Shield, Clock, Battery, Zap, Heart, Award, 
  Star, ChevronDown, MessageCircle, Package, Truck, CheckCircle,
  Droplets, Wind, Leaf, Waves, Phone, Mail, MapPin, ArrowRight,
  Timer, RefreshCcw, Palette, Volume2, AlertCircle, HelpCircle,
  Sun, Moon, X
} from 'lucide-react'
import { departamentos, ciudadesPorDepartamento, fragancias } from '@/lib/colombian-data'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const CountUpNumber = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return <span>{count}</span>
}

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', telefono: '', departamento: '',
    ciudad: '', direccion: '', complementos: '', email: '', fragancia: 'Lavanda Relajante'
  })
  const [ciudades, setCiudades] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedFragrance, setSelectedFragrance] = useState<number | null>(null)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Helper functions for theme classes
  const bgClass = (dark: string, light: string) => isDarkMode ? dark : light
  const textClass = (dark: string, light: string) => isDarkMode ? dark : light
  const borderClass = (dark: string, light: string) => isDarkMode ? dark : light
  
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3])
  
  const images = [
    '/images/product-1.jpg', '/images/product-2.jpg', '/images/product-3.jpg',
    '/images/product-4.jpg', '/images/product-5.jpg', '/images/product-6.jpg',
    '/images/product-7.jpg'
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % (images?.length ?? 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    if (formData?.departamento) {
      setCiudades(ciudadesPorDepartamento?.[formData.departamento] ?? [])
      setFormData(prev => ({ ...(prev ?? {}), ciudad: '' }))
    }
  }, [formData?.departamento])

  // Detectar móvil para optimizar rendimiento
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Validación de teléfono colombiano
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 && cleaned.startsWith('3')
  }

  // Formatear teléfono con máscara
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }

  // Validar campo en tiempo real
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...(prev ?? {}), [field]: value }))
    setTouchedFields(prev => new Set([...prev, field]))
    
    // Validación en tiempo real
    let error = ''
    if (field === 'email' && value && !validateEmail(value)) {
      error = 'Ingresa un email válido'
    } else if (field === 'telefono' && value && !validatePhone(value)) {
      error = 'Ingresa un teléfono válido (10 dígitos, empezando con 3)'
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleBlur = (field: string) => {
    setTouchedFields(prev => new Set([...prev, field]))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault?.()
    
    // Validar todos los campos con mensajes específicos
    const errors: Record<string, string> = {}
    
    if (!formData?.nombre || formData.nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio'
    }
    
    if (!formData?.apellidos || formData.apellidos.trim() === '') {
      errors.apellidos = 'Los apellidos son obligatorios'
    }
    
    if (!formData?.telefono || formData.telefono.trim() === '') {
      errors.telefono = 'El teléfono es obligatorio'
    } else if (!validatePhone(formData.telefono)) {
      errors.telefono = 'Ingresa un teléfono válido (10 dígitos, empezando con 3). Ejemplo: 300 123 4567'
    }
    
    if (!formData?.email || formData.email.trim() === '') {
      errors.email = 'El correo electrónico es obligatorio'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido. Ejemplo: tu@email.com'
    }
    
    if (!formData?.departamento || formData.departamento === '') {
      errors.departamento = 'Debes seleccionar un departamento'
    }
    
    if (!formData?.ciudad || formData.ciudad === '') {
      errors.ciudad = 'Debes seleccionar una ciudad'
    }
    
    if (!formData?.direccion || formData.direccion.trim() === '') {
      errors.direccion = 'La dirección es obligatoria'
    }
    
    setFieldErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      // Marcar todos los campos con error como tocados
      setTouchedFields(new Set(Object.keys(errors)))
      
      // Hacer scroll al primer campo con error
      const firstErrorField = Object.keys(errors)[0]
      setTimeout(() => {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          if (errorElement instanceof HTMLElement) {
            errorElement.focus()
          }
        }
      }, 100)
      
      return
    }
    
    setIsSubmitting(true)
    setSubmitSuccess(true)
    
    // Generar mensaje de WhatsApp con toda la información del pedido
    const whatsappMessage = `*NUEVO PEDIDO AURA DRIVE*

*Cliente:*
• Nombre: ${formData?.nombre ?? ''} ${formData?.apellidos ?? ''}
• Teléfono: ${formData?.telefono ?? ''}
• Email: ${formData?.email ?? ''}

*Dirección de Envío:*
• Departamento: ${formData?.departamento ?? ''}
• Ciudad: ${formData?.ciudad ?? ''}
• Dirección: ${formData?.direccion ?? ''}${formData?.complementos ? `\n• Complementos: ${formData.complementos}` : ''}

*Producto:*
• Fragancia: ${formData?.fragancia ?? 'Lavanda Relajante'}
• Precio: $119.900 COP

*Método de Pago:* Contra Entrega`

    // Codificar el mensaje para URL y abrir WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/573144773378?text=${encodedMessage}`
    
    // Abrir WhatsApp después de un breve momento
    setTimeout(() => {
      window.location.href = whatsappUrl
    }, 500)
  }
  
  const benefits = [
    { icon: Sparkles, title: 'Aromaterapia Inteligente', desc: 'Tecnología de atomización ultrafina 360° que distribuye la fragancia uniformemente' },
    { icon: Zap, title: 'Activación Automática', desc: 'Se enciende con el movimiento del vehículo y se apaga al estacionarse' },
    { icon: Battery, title: '30 Días de Batería', desc: 'Batería de 2000 mAh recargable vía USB-C de larga duración' },
    { icon: Clock, title: '4 Meses de Fragancia', desc: 'Cada cartucho de bálsamo sólido dura hasta 4 meses completos' },
  ]
  
  const features = [
    { icon: Wind, title: 'Atomización 5μm', desc: 'Partículas microscópicas que permanecen suspendidas más tiempo' },
    { icon: Palette, title: '4 Colores LED', desc: 'Iluminación ambiental personalizable: azul, verde, morado y blanco' },
    { icon: Volume2, title: '3 Niveles de Intensidad', desc: 'Ajusta la concentración según tus preferencias' },
    { icon: RefreshCcw, title: 'Recargable USB-C', desc: 'Carga rápida compatible con cualquier cargador estándar' },
    { icon: Timer, title: 'Apagado Inteligente', desc: 'Se desactiva 10 minutos después de estacionarte' },
    { icon: Shield, title: 'Aleación de Aluminio', desc: 'Materiales premium resistentes a golpes y vibraciones' },
  ]
  
  const testimonials = [
    { name: 'Carlos M.', role: 'Conductor Uber, 35 años', rating: 5, text: 'Desde que instalé el AURA DRIVE, mis clientes siempre comentan lo agradable que huele. Ha mejorado significativamente mis calificaciones. ¡Totalmente recomendado!', image: '/images/gay.jpg' },
    { name: 'Marcela L.', role: 'Madre de familia, 42 años', text: 'Transporto a mis hijos a la escuela y siempre había olores de comida. Probé 6 ambientadores antes del AURA DRIVE. La diferencia es increíble.', rating: 5, image: '/images/marcela.jpg' },
    { name: 'Alejandro R.', role: 'Ejecutivo de ventas, 38 años', text: 'Mi auto es prácticamente mi oficina móvil. Un cliente cerró un contrato importante comentando que "una empresa que cuida los detalles merece mi confianza".', rating: 5, image: '/images/alejandro.jpg' },
    { name: 'Gabriela T.', role: 'Contadora, 29 años', text: 'Lo compré escéptica por el precio, pero después de 3 meses sigue con la misma intensidad. He ahorrado lo que habría gastado en 9 ambientadores.', rating: 5, image: '/images/gabriela.jpg' },
  ]
  
  const faqs = [
    { q: '¿Cómo funciona el pago contra entrega?', a: 'Realizas tu pedido llenando el formulario, enviamos el producto a tu dirección y pagas cuando lo recibas en la puerta de tu casa. Sin riesgos, sin pagos anticipados.' },
    { q: '¿Cuánto tiempo tarda el envío?', a: 'Enviamos a toda Colombia en 3-5 días hábiles. Recibirás un mensaje de confirmación con el seguimiento de tu pedido.' },
    { q: '¿Qué incluye el paquete?', a: 'Incluye: 1 Difusor AURA DRIVE, 1 cartucho de bálsamo sólido (fragancia a elección), 1 cable USB-C, 1 clip para rejilla y manual de instrucciones.' },
    { q: '¿Cómo se instala?', a: 'Es muy sencillo: carga el dispositivo, inserta el cartucho de fragancia, y colócalo en la rejilla de ventilación con el clip incluido. ¡Listo!' },
    { q: '¿Cuánto dura cada cartucho de fragancia?', a: 'Cada cartucho de bálsamo sólido dura hasta 4 meses con uso normal, equivalente a más de 1400 pulverizaciones automáticas.' },
    { q: '¿Tiene garantía?', a: 'Sí, ofrecemos 30 días de garantía de satisfacción. Si no estás satisfecho, te devolvemos el 100% de tu dinero.' },
  ]
  
  const stats = [
    { value: 98, label: 'Clientes satisfechos', suffix: '%' },
    { value: 4, label: 'Meses de duración', suffix: '' },
    { value: 30, label: 'Días de batería', suffix: '' },
    { value: 360, label: 'Difusión grados', suffix: '°' },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1a] text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Efecto de humo azul tranquilo - Optimizado */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ willChange: 'transform' }}>
        {/* Partículas grandes - Reducidas en móvil para mejor rendimiento */}
        {(isMobile ? [
          { left: '20%', top: '30%', size: 350, delay: 0, duration: 20 },
          { left: '70%', top: '20%', size: 320, delay: 3, duration: 22 },
          { left: '40%', top: '60%', size: 380, delay: 6, duration: 18 },
        ] : [
          { left: '10%', top: '20%', size: 450, delay: 0, duration: 20 },
          { left: '60%', top: '10%', size: 400, delay: 2, duration: 25 },
          { left: '30%', top: '50%', size: 500, delay: 4, duration: 18 },
          { left: '80%', top: '40%', size: 420, delay: 1, duration: 22 },
          { left: '15%', top: '70%', size: 460, delay: 3, duration: 24 },
        ]).map((particle, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              willChange: 'transform, opacity',
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.5) 30%, rgba(29, 78, 216, 0.3) 60%, transparent 100%)'
                : 'radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(96, 165, 250, 0.4) 30%, rgba(59, 130, 246, 0.3) 60%, transparent 100%)',
            }}
            animate={{
              x: [0, 100, -80, 0],
              y: [0, -120, 90, 0],
              scale: [1, 1.3, 1.1, 1],
              opacity: isDarkMode ? [0.4, 0.6, 0.5, 0.4] : [0.25, 0.4, 0.3, 0.25],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
        {/* Partículas medianas - Solo en desktop */}
        {!isMobile && [
          { left: '5%', top: '15%', size: 180, delay: 0.5, duration: 15 },
          { left: '90%', top: '25%', size: 200, delay: 1.5, duration: 17 },
          { left: '20%', top: '60%', size: 190, delay: 2.5, duration: 16 },
          { left: '75%', top: '55%', size: 195, delay: 3, duration: 18 },
        ].map((particle, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              willChange: 'transform, opacity',
              background: isDarkMode
                ? 'radial-gradient(circle, rgba(96, 165, 250, 0.6) 0%, rgba(59, 130, 246, 0.45) 40%, transparent 80%)'
                : 'radial-gradient(circle, rgba(191, 219, 254, 0.5) 0%, rgba(147, 197, 253, 0.4) 40%, transparent 80%)',
            }}
            animate={{
              x: [0, 60, -50, 0],
              y: [0, -70, 50, 0],
              scale: [1, 1.4, 1.2, 1],
              opacity: isDarkMode ? [0.3, 0.5, 0.4, 0.3] : [0.2, 0.35, 0.25, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
        {/* Partículas pequeñas */}
        {(isMobile ? [
          { left: '15%', top: '50%', size: 100, delay: 1, duration: 12 },
          { left: '80%', top: '60%', size: 110, delay: 4, duration: 13 },
        ] : [
          { left: '8%', top: '30%', size: 100, delay: 0.3, duration: 12 },
          { left: '92%', top: '40%', size: 110, delay: 1.8, duration: 13 },
          { left: '35%', top: '25%', size: 95, delay: 0.7, duration: 11 },
          { left: '65%', top: '70%', size: 105, delay: 2.2, duration: 14 },
        ]).map((particle, i) => (
          <motion.div
            key={`small-${i}`}
            className={`absolute rounded-full ${isMobile ? 'blur-lg' : 'blur-xl'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              willChange: 'transform, opacity',
              background: isDarkMode
                ? 'radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%)'
                : 'radial-gradient(circle, rgba(219, 234, 254, 0.4) 0%, rgba(191, 219, 254, 0.3) 50%, transparent 100%)',
            }}
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 35, 0],
              scale: [1, 1.5, 1.3, 1],
              opacity: isDarkMode ? [0.25, 0.45, 0.35, 0.25] : [0.15, 0.3, 0.2, 0.15],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>
      
      {/* Contenido principal con z-index para estar sobre el humo */}
      <div className="relative z-10">
      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#0a0a0f]/80 border-gold/20' 
            : 'bg-white/80 border-gold/30 shadow-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-gold" />
            <span className="text-xl font-bold text-gold">AURA DRIVE</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}>Beneficios</a>
            <a href="#galeria" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}>Galería</a>
            <a href="#testimonios" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}>Opiniones</a>
            <a href="#faq" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}>FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-yellow-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a 
              href="#pedido" 
              className="gradient-gold text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              ¡Pedir Ahora!
            </a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center pt-20"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full text-gold text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                ¡Oferta Limitada - Envío a toda Colombia!
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transforma tu Auto en un 
                <span className="text-gold text-shadow-gold"> Santuario Aromático</span>
              </h1>
              
              <p className={`text-lg md:text-xl mb-8 ${textClass('text-gray-300', 'text-gray-700')}`}>
                Tecnología inteligente que elimina olores automáticamente y crea un ambiente premium con hasta <strong className="text-gold">4 meses</strong> de fragancia constante.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {benefits?.slice(0, 2)?.map((b, i) => (
                  <div key={i} className={`flex items-center gap-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                    <b.icon className="w-5 h-5 text-gold" />
                    <span>{b?.title ?? ''}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#pedido"
                  className="gradient-gold text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg glow-gold flex items-center justify-center gap-2"
                >
                  ¡Quiero el Mío!
                  <ArrowRight className="w-5 h-5" />
                </a>
                <div className={`flex items-center gap-3 px-6 py-4 rounded-full ${bgClass('bg-white/5', 'bg-gray-100')}`}>
                  <span className="text-2xl font-bold text-gold">{formatPrice(119900)}</span>
                  <span className={`line-through text-sm ${textClass('text-gray-400', 'text-gray-500')}`}>{formatPrice(199900)}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-full h-full rounded-2xl overflow-hidden glow-gold">
                  <Image
                    src={images?.[activeImage] ?? '/images/product-1.jpg'}
                    alt="AURA DRIVE Difusor de Aromas Premium"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {images?.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeImage ? 'bg-gold w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-gold animate-bounce" />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className={`py-12 transition-colors duration-300 ${bgClass('bg-[#16213e]/50', 'bg-gray-100')}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats?.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                  <CountUpNumber end={stat?.value ?? 0} />{stat?.suffix ?? ''}
                </div>
                <div className={`text-sm ${textClass('text-gray-400', 'text-gray-600')}`}>{stat?.label ?? ''}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Beneficios Exclusivos</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Una Experiencia de Conducción <span className="text-gold">Transformadora</span>
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${textClass('text-gray-400', 'text-gray-600')}`}>
              AURA DRIVE no es solo un ambientador. Es tecnología inteligente diseñada para tu bienestar diario.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits?.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)' }}
                className={`p-6 rounded-2xl backdrop-blur-sm border transition-all hover:border-gold/30 ${bgClass('bg-white/5 border-white/10', 'bg-white border-gray-200 shadow-sm')}`}
              >
                <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit?.title ?? ''}</h3>
                <p className={textClass('text-gray-400', 'text-gray-600')}>{benefit?.desc ?? ''}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Benefits */}
      <section className="py-20 bg-[#16213e]/30">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold uppercase tracking-widest text-sm">Bienestar al Volante</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                Di Adiós al <span className="text-gold">Estrés</span> del Tráfico
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Heart, text: 'Reduce hasta 67% la ansiedad durante el tráfico con aromaterapia' },
                  { icon: Award, text: 'Proyecta profesionalismo cuando transportas clientes o colegas' },
                  { icon: Shield, text: 'Elimina olores de comida, tabaco y mascotas instantáneamente' },
                  { icon: Sparkles, text: 'Crea un espacio de lujo sin esfuerzo, solo disfruta conducir' },
                ]?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-xl ${bgClass('bg-white/5', 'bg-white border border-gray-200 shadow-sm')}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className={textClass('text-gray-300', 'text-gray-700')}>{item?.text ?? ''}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden glow-gold">
                <Image
                  src="/images/product-3.jpg"
                  alt="AURA DRIVE en uso"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Especificaciones Técnicas</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Tecnología <span className="text-gold">Premium</span> en Cada Detalle
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features?.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10"
              >
                <feature.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature?.title ?? ''}</h3>
                <p className="text-gray-400 text-sm">{feature?.desc ?? ''}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gold/10 rounded-2xl border border-gold/30"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gold">6.6 × 6.6 × 12.2 cm</div>
                <div className="text-gray-400 text-sm">Dimensiones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">Aleación de Aluminio</div>
                <div className="text-gray-400 text-sm">Material Premium</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">2000 mAh</div>
                <div className="text-gray-400 text-sm">Capacidad de Batería</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">1400+</div>
                <div className="text-gray-400 text-sm">Pulverizaciones por Cartucho</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galeria" className={`py-20 transition-colors duration-300 ${bgClass('bg-[#16213e]/30', 'bg-gray-50')}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Galería Premium</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Conoce <span className="text-gold">AURA DRIVE</span> en Detalle
            </h2>
            <p className={`mt-4 text-sm ${textClass('text-gray-400', 'text-gray-600')}`}>
              3 aromas • Intensidad ajustable • Diseño premium
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {images?.slice(0, 6)?.map((img, i) => {
              // Etiquetas cortas para cada imagen
              const labels = [
                'Difusión Inteligente',
                'Diversidad De Olores',
                'Lavanda Relajante',
                'Bosque Fresco',
                'Diseño Premium',
                'Tecnología 360°'
              ]
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="aspect-[4/5] relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10"
                  onClick={() => setSelectedGalleryImage(i)}
                >
                  <Image
                    src={img ?? '/images/product-1.jpg'}
                    alt={`AURA DRIVE ${labels[i] ?? ''}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Etiqueta corta siempre visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <p className="text-white text-sm font-medium">{labels[i] ?? `Imagen ${i + 1}`}</p>
                    </div>
                  </div>
                  
                  {/* Botón Ver en hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="gradient-gold text-black px-6 py-3 rounded-full font-semibold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalle
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Botón Ver Más si hay más de 6 imágenes */}
          {images?.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button
                onClick={() => setSelectedGalleryImage(6)}
                className="px-8 py-3 rounded-full border-2 border-gold/50 text-gold hover:bg-gold/10 transition-all duration-300 font-semibold"
              >
                Ver Más Imágenes ({images.length - 6})
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Fragrances */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Fragancias Disponibles</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Elige tu <span className="text-gold">Aroma Favorito</span>
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${textClass('text-gray-400', 'text-gray-600')}`}>
              Haz clic en cualquier fragancia para conocer más detalles
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {fragancias?.map((fragancia, i) => {
              // Mapear imágenes según la fragancia
              const imageMap: Record<string, string> = {
                'lavanda': '/images/morado.png',
                'bosque': '/images/verde.png',
                'marina': '/images/azul.png'
              }
              const imageSrc = imageMap[fragancia?.id ?? ''] ?? '/images/product-1.jpg'
              
              return (
                <motion.div
                  key={fragancia?.id ?? i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedFragrance(i)}
                  className="p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all relative overflow-hidden cursor-pointer group"
                  style={{ background: `linear-gradient(135deg, ${fragancia?.color ?? '#D4AF37'}20, transparent)` }}
                >
                  <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={fragancia?.name ?? ''}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div 
                      className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${fragancia?.color ?? '#D4AF37'}30` }}
                    >
                      {i === 0 && <Leaf className="w-8 h-8" style={{ color: fragancia?.color ?? '#D4AF37' }} />}
                      {i === 1 && <Wind className="w-8 h-8" style={{ color: fragancia?.color ?? '#D4AF37' }} />}
                      {i === 2 && <Waves className="w-8 h-8" style={{ color: fragancia?.color ?? '#D4AF37' }} />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-sm font-medium">Toca para más información</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{fragancia?.name ?? ''}</h3>
                  <p className="text-gray-400">{fragancia?.description ?? ''}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal de Información de Fragancia */}
      <AnimatePresence>
        {selectedFragrance !== null && fragancias?.[selectedFragrance] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFragrance(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-2xl w-full rounded-2xl overflow-hidden ${bgClass('bg-[#1a1a2e]', 'bg-white')} border ${borderClass('border-white/20', 'border-gray-200')} shadow-2xl`}
            >
              <div 
                className="relative h-64 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${fragancias[selectedFragrance]?.color ?? '#D4AF37'}40, ${fragancias[selectedFragrance]?.color ?? '#D4AF37'}10)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    <Image
                      src={{
                        'lavanda': '/images/morado.png',
                        'bosque': '/images/verde.png',
                        'marina': '/images/azul.png'
                      }[fragancias[selectedFragrance]?.id ?? ''] ?? '/images/product-1.jpg'}
                      alt={fragancias[selectedFragrance]?.name ?? ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFragrance(null)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${bgClass('bg-white/10 hover:bg-white/20', 'bg-gray-100 hover:bg-gray-200')} transition-colors`}
                >
                  <X className={`w-5 h-5 ${textClass('text-white', 'text-gray-900')}`} />
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  {selectedFragrance === 0 && <Leaf className="w-6 h-6" style={{ color: fragancias[selectedFragrance]?.color }} />}
                  {selectedFragrance === 1 && <Wind className="w-6 h-6" style={{ color: fragancias[selectedFragrance]?.color }} />}
                  {selectedFragrance === 2 && <Waves className="w-6 h-6" style={{ color: fragancias[selectedFragrance]?.color }} />}
                  <h2 className="text-2xl md:text-3xl font-bold">{fragancias[selectedFragrance]?.name ?? ''}</h2>
                </div>
                
                <p className={`text-lg mb-6 ${textClass('text-gray-300', 'text-gray-700')}`}>
                  {fragancias[selectedFragrance]?.description ?? ''}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gold" />
                      ¿Qué incluye?
                    </h3>
                    <ul className={`space-y-2 ${textClass('text-gray-300', 'text-gray-600')}`}>
                      {({
                        'lavanda': ['1 Cartucho de Bálsamo Sólido de Lavanda', 'Duración: 4 meses', 'Aromaterapia relajante'],
                        'bosque': ['1 Cartucho de Bálsamo Sólido de Bosque Fresco', 'Duración: 4 meses', 'Aromaterapia revitalizante'],
                        'marina': ['1 Cartucho de Bálsamo Sólido de Brisa Marina', 'Duración: 4 meses', 'Aromaterapia refrescante']
                      }[fragancias[selectedFragrance]?.id ?? ''] ?? []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      Beneficios
                    </h3>
                    <ul className={`space-y-2 ${textClass('text-gray-300', 'text-gray-600')}`}>
                      {({
                        'lavanda': ['Reduce el estrés y la ansiedad', 'Mejora la concentración', 'Crea un ambiente calmante'],
                        'bosque': ['Energiza y revitaliza', 'Elimina olores fuertes', 'Sensación de frescura natural'],
                        'marina': ['Sensación de libertad y espacio', 'Aire fresco y limpio', 'Ambiente relajante y energizante']
                      }[fragancias[selectedFragrance]?.id ?? ''] ?? []).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Star className="w-5 h-5 text-gold flex-shrink-0 mt-0.5 fill-gold" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${textClass('text-gray-400', 'text-gray-600')}`}>Duración del cartucho</p>
                      <p className="text-xl font-bold text-gold">4 meses</p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, fragancia: fragancias[selectedFragrance]?.name ?? 'Lavanda Relajante' }))
                        setSelectedFragrance(null)
                        setTimeout(() => {
                          document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' })
                        }, 300)
                      }}
                      className="gradient-gold text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      Elegir esta fragancia
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalles de Imagen de Galería */}
      <AnimatePresence>
        {selectedGalleryImage !== null && images?.[selectedGalleryImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${bgClass('bg-[#1a1a2e]', 'bg-white')} border ${borderClass('border-white/20', 'border-gray-200')} shadow-2xl`}
            >
              <button
                onClick={() => setSelectedGalleryImage(null)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center ${bgClass('bg-white/10 hover:bg-white/20', 'bg-gray-100 hover:bg-gray-200')} transition-colors`}
              >
                <X className={`w-5 h-5 ${textClass('text-white', 'text-gray-900')}`} />
              </button>
              
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                <Image
                  src={images[selectedGalleryImage] ?? '/images/product-1.jpg'}
                  alt={`AURA DRIVE imagen ${selectedGalleryImage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {[
                      'Difusión Inteligente',
                      'Diversidad De Olores',
                      'Lavanda Relajante',
                      'Bosque Fresco',
                      'Diseño Premium',
                      'Tecnología 360°',
                      'Vista Detallada'
                    ][selectedGalleryImage] ?? `Imagen ${selectedGalleryImage + 1}`}
                  </h2>
                  <p className={`text-lg ${textClass('text-gray-300', 'text-gray-700')}`}>
                    {[
                      'Sistema de atomización 360° que distribuye la fragancia uniformemente por todo el vehículo, creando un ambiente aromático perfecto.',
                      'Experimenta una amplia gama de olores frescos y naturales que transforman tu experiencia de conducción.',
                      'Fragancia relajante de lavanda que reduce el estrés y crea un ambiente calmante durante tus viajes.',
                      'Aroma fresco de bosque que energiza y revitaliza, eliminando olores desagradables instantáneamente.',
                      'Diseño elegante y premium con materiales de alta calidad que complementan cualquier interior de vehículo.',
                      'Tecnología avanzada de difusión que garantiza una distribución uniforme de la fragancia en todos los ángulos.',
                      'Vista detallada del producto AURA DRIVE mostrando sus características y diseño premium.'
                    ][selectedGalleryImage] ?? 'Detalle del producto AURA DRIVE'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    {selectedGalleryImage > 0 && (
                      <button
                        onClick={() => setSelectedGalleryImage(selectedGalleryImage - 1)}
                        className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                      >
                        ← Anterior
                      </button>
                    )}
                    {selectedGalleryImage < (images.length - 1) && (
                      <button
                        onClick={() => setSelectedGalleryImage(selectedGalleryImage + 1)}
                        className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                      >
                        Siguiente →
                      </button>
                    )}
                  </div>
                  <span className={`text-sm ${textClass('text-gray-400', 'text-gray-600')}`}>
                    {selectedGalleryImage + 1} de {images.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <section id="testimonios" className={`py-20 transition-colors duration-300 ${bgClass('bg-[#16213e]/30', 'bg-gray-50')}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Testimonios</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Lo Que Dicen Nuestros <span className="text-gold">Clientes</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials?.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${bgClass('bg-white/5 border-white/10', 'bg-white border-gray-200 shadow-sm')}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {t?.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold/30">
                      <Image
                        src={t.image}
                        alt={t?.name ?? 'Cliente'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/30">
                      <span className="text-gold font-bold text-lg">
                        {(t?.name ?? 'C')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1 mb-2">
                      {Array(t?.rating ?? 5)?.fill(0)?.map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-gold fill-gold flex-shrink-0" />
                      ))}
                    </div>
                    <div className="font-semibold text-sm">{t?.name ?? ''}</div>
                    <div className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>{t?.role ?? ''}</div>
                  </div>
                </div>
                <p className={`italic ${textClass('text-gray-300', 'text-gray-700')}`}>"{t?.text ?? ''}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 md:p-12 bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-3xl border border-gold/30 glow-gold"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4" />
              ¡Últimas unidades disponibles!
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Oferta <span className="text-gold">Especial</span> de Lanzamiento
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-gray-400 line-through text-2xl">{formatPrice(199900)}</span>
              <span className="text-5xl md:text-6xl font-bold text-gold">{formatPrice(119900)}</span>
            </div>
            
            <div className="inline-block px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm mb-8">
              Ahorras {formatPrice(80000)} – 40% de descuento
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-sm">Envío a toda Colombia</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl">
                <Package className="w-5 h-5 text-gold" />
                <span className="text-sm">Pago contra entrega</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl">
                <Shield className="w-5 h-5 text-gold" />
                <span className="text-sm">Garantía 30 días</span>
              </div>
            </div>
            
            <a 
              href="#pedido"
              className="inline-flex items-center gap-2 gradient-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              ¡Pedir Ahora!
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`py-20 transition-colors duration-300 ${bgClass('bg-[#16213e]/30', 'bg-gray-50')}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-widest text-sm">Preguntas Frecuentes</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Resolvemos tus <span className="text-gold">Dudas</span>
            </h2>
          </motion.div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs?.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl overflow-hidden border transition-colors duration-300 ${bgClass('bg-white/5 border-white/10', 'bg-white border-gray-200 shadow-sm')}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gold" />
                    {faq?.q ?? ''}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gold transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className={`px-5 pb-5 ${textClass('text-gray-400', 'text-gray-600')}`}
                  >
                    {faq?.a ?? ''}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="pedido" className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold uppercase tracking-widest text-sm">¡Haz tu Pedido!</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Recibe tu <span className="text-gold">AURA DRIVE</span> en Casa
            </h2>
            <p className={`mt-4 max-w-xl mx-auto ${textClass('text-gray-400', 'text-gray-600')}`}>
              Completa el formulario y recibe tu difusor con pago contra entrega. ¡Sin riesgos!
            </p>
          </motion.div>
          
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center p-8 bg-green-500/20 rounded-2xl border border-green-500/30"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">¡Redirigiendo a WhatsApp!</h3>
              <p className={`mb-4 ${textClass('text-gray-300', 'text-gray-700')}`}>
                Se está abriendo WhatsApp con los detalles de tu pedido...
              </p>
              <p className="text-gold">Gracias por confiar en AURA DRIVE</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className={`max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border transition-colors duration-300 ${bgClass('bg-white/5 border-white/10', 'bg-white border-gray-200 shadow-lg')}`}
            >
              {/* Nota de campos obligatorios */}
              <div className="mb-6 pb-4 border-b border-white/10">
                <p className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>
                  Los campos con <span className="text-gold">*</span> son obligatorios
                </p>
              </div>

              {/* Sección: Datos de contacto */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${textClass('text-gray-200', 'text-gray-800')}`}>
                  Datos de contacto
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Nombre <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      autoComplete="given-name"
                      value={formData?.nombre ?? ''}
                      onChange={(e) => handleFieldChange('nombre', e.target.value)}
                      onBlur={() => handleBlur('nombre')}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                        touchedFields.has('nombre') && fieldErrors.nombre
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                      placeholder="Tu nombre"
                    />
                    {touchedFields.has('nombre') && fieldErrors.nombre && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Apellidos <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      required
                      autoComplete="family-name"
                      value={formData?.apellidos ?? ''}
                      onChange={(e) => handleFieldChange('apellidos', e.target.value)}
                      onBlur={() => handleBlur('apellidos')}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                        touchedFields.has('apellidos') && fieldErrors.apellidos
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                      placeholder="Tus apellidos"
                    />
                    {touchedFields.has('apellidos') && fieldErrors.apellidos && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.apellidos}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Teléfono <span className="text-gold">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      value={formData?.telefono ?? ''}
                      onChange={(e) => handleFieldChange('telefono', formatPhone(e.target.value))}
                      onBlur={() => handleBlur('telefono')}
                      maxLength={12}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                        touchedFields.has('telefono') && fieldErrors.telefono
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                      placeholder="300 123 4567"
                    />
                    {touchedFields.has('telefono') && fieldErrors.telefono && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.telefono}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Correo electrónico <span className="text-gold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData?.email ?? ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                        touchedFields.has('email') && fieldErrors.email
                          ? 'border-red-500 focus:border-red-500'
                          : touchedFields.has('email') && !fieldErrors.email && formData.email
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                      placeholder="tu@email.com"
                    />
                    {touchedFields.has('email') && fieldErrors.email && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                    {touchedFields.has('email') && !fieldErrors.email && formData.email && (
                      <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Email válido
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sección: Dirección de entrega */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h3 className={`text-lg font-semibold mb-4 ${textClass('text-gray-200', 'text-gray-800')}`}>
                  Dirección de entrega
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Departamento <span className="text-gold">*</span>
                    </label>
                    <select
                      name="departamento"
                      required
                      autoComplete="address-level1"
                      value={formData?.departamento ?? ''}
                      onChange={(e) => handleFieldChange('departamento', e.target.value)}
                      onBlur={() => handleBlur('departamento')}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                        touchedFields.has('departamento') && fieldErrors.departamento
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white', 'bg-gray-50 text-gray-900')}`}
                    >
                      <option value="" className={bgClass('bg-[#1a1a2e]', 'bg-white')}>Selecciona...</option>
                      {departamentos?.map((dep) => (
                        <option key={dep} value={dep} className={bgClass('bg-[#1a1a2e]', 'bg-white')}>{dep}</option>
                      ))}
                    </select>
                    {touchedFields.has('departamento') && fieldErrors.departamento && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.departamento}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                      Ciudad <span className="text-gold">*</span>
                    </label>
                    <select
                      name="ciudad"
                      required
                      autoComplete="address-level2"
                      value={formData?.ciudad ?? ''}
                      onChange={(e) => handleFieldChange('ciudad', e.target.value)}
                      onBlur={() => handleBlur('ciudad')}
                      disabled={!formData?.departamento}
                      className={`w-full px-4 py-3 text-base rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        touchedFields.has('ciudad') && fieldErrors.ciudad
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/20 focus:border-gold'
                      } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white', 'bg-gray-50 text-gray-900')}`}
                    >
                      <option value="" className={bgClass('bg-[#1a1a2e]', 'bg-white')}>
                        {formData?.departamento ? 'Selecciona una ciudad...' : 'Elige un departamento para ver ciudades'}
                      </option>
                      {ciudades?.map((ciudad) => (
                        <option key={ciudad} value={ciudad} className={bgClass('bg-[#1a1a2e]', 'bg-white')}>{ciudad}</option>
                      ))}
                    </select>
                    {!formData?.departamento && (
                      <p className={`text-xs mt-1 ${textClass('text-gray-500', 'text-gray-500')}`}>
                        Elige un departamento para ver ciudades
                      </p>
                    )}
                    {touchedFields.has('ciudad') && fieldErrors.ciudad && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.ciudad}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                    Dirección <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    required
                    autoComplete="street-address"
                    value={formData?.direccion ?? ''}
                    onChange={(e) => handleFieldChange('direccion', e.target.value)}
                    onBlur={() => handleBlur('direccion')}
                    className={`w-full px-4 py-3 text-base rounded-xl border transition-all ${
                      touchedFields.has('direccion') && fieldErrors.direccion
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/20 focus:border-gold'
                    } focus:outline-none focus:ring-2 focus:ring-gold/20 ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                    placeholder="Calle, carrera, número..."
                  />
                  {touchedFields.has('direccion') && fieldErrors.direccion && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.direccion}</p>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textClass('text-gray-300', 'text-gray-700')}`}>
                    Complementos <span className={`text-xs ${textClass('text-gray-500', 'text-gray-500')}`}>(opcional)</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="address-line2"
                    value={formData?.complementos ?? ''}
                    onChange={(e) => handleFieldChange('complementos', e.target.value)}
                    className={`w-full px-4 py-3 text-base rounded-xl border border-white/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all ${bgClass('bg-white/10 text-white placeholder-gray-400', 'bg-gray-50 text-gray-900 placeholder-gray-500')}`}
                    placeholder="Apartamento, edificio, barrio..."
                  />
                </div>
              </div>
              
              {/* Sección: Elige tu fragancia */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h3 className={`text-lg font-semibold mb-4 ${textClass('text-gray-200', 'text-gray-800')}`}>
                  Elige tu fragancia <span className="text-gold">*</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {fragancias?.map((f) => {
                    const isSelected = formData?.fragancia === f?.name
                    const descriptions: Record<string, string> = {
                      'Lavanda Relajante': 'Relajante',
                      'Bosque Fresco': 'Fresco',
                      'Brisa Marina': 'Limpio-marino'
                    }
                    
                    return (
                      <button
                        key={f?.id ?? ''}
                        type="button"
                        onClick={() => setFormData({ ...(formData ?? {}), fragancia: f?.name ?? '' })}
                        className={`p-4 rounded-xl border-2 transition-all text-center relative group ${
                          isSelected
                            ? 'border-gold bg-gold/20 shadow-lg shadow-gold/20'
                            : isDarkMode 
                            ? 'border-white/20 hover:border-white/40 hover:bg-white/5' 
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-black" />
                          </div>
                        )}
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mb-3 shadow-md"
                          style={{ backgroundColor: f?.color ?? '#D4AF37' }}
                        />
                        <div className="font-semibold text-sm mb-1">{f?.name ?? ''}</div>
                        <div className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>
                          {descriptions[f?.name ?? ''] ?? ''}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Sección: Total y pago */}
              <div className="mb-6 pt-6 border-t border-white/10">
                <div className={`p-5 rounded-xl ${bgClass('bg-white/5 border border-white/10', 'bg-gray-50 border-gray-200')}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={textClass('text-gray-300', 'text-gray-700')}>Total:</span>
                      <span className="text-2xl font-bold text-gold">{formatPrice(119900)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={textClass('text-gray-400', 'text-gray-600')}>Envío:</span>
                      <span className="text-green-400 font-semibold">Gratis</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={textClass('text-gray-400', 'text-gray-600')}>Pago:</span>
                      <span className={textClass('text-gray-300', 'text-gray-700')}>Contra entrega</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-gold text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <span>Procesando...</span>
                ) : (
                  'Confirmar pedido'
                )}
              </button>
              
              <p className={`text-center text-xs mt-3 ${textClass('text-gray-500', 'text-gray-600')}`}>
                Pago contra entrega • Confirmación por WhatsApp
              </p>
              
              {/* Badges de confianza */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold" />
                  <span className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>Datos seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold" />
                  <span className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>Entrega 3-5 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <span className={`text-xs ${textClass('text-gray-400', 'text-gray-600')}`}>Garantía 30 días</span>
                </div>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-300 ${bgClass('bg-[#0a0a0f] border-white/10', 'bg-white border-gray-200')}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-gold" />
              <span className="text-xl font-bold text-gold">AURA DRIVE</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <a 
                href="https://wa.me/573144773378?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20AURA%20DRIVE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp: 314 477 3378
              </a>
            </div>
          </div>
          
          <div className={`mt-8 pt-6 border-t transition-colors duration-300 ${borderClass('border-white/10', 'border-gray-200')}`}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center text-sm">
              <p className={textClass('text-gray-500', 'text-gray-600')}>© 2026 AURA DRIVE Colombia. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/573144773378?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20AURA%20DRIVE"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
      </div>
    </div>
  )
}
