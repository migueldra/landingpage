'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [configStatus, setConfigStatus] = useState<{ 
    status: string
    message: string
    issues: string[]
    details: any
  } | null>(null)

  // Verificar configuración al cargar la página
  useEffect(() => {
    fetch('/api/check-email-config')
      .then(res => res.json())
      .then(data => {
        setConfigStatus({
          status: data.status,
          message: data.message,
          issues: data.issues || [],
          details: data.details || {},
        })
      })
      .catch(() => {
        setConfigStatus({
          status: 'error',
          message: 'No se pudo verificar la configuración',
          issues: ['No se pudo conectar al servidor'],
          details: {},
        })
      })
  }, [])

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor' }))
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: `¡Email enviado exitosamente! Revisa la bandeja de entrada de ${email}. Si no lo ves, revisa la carpeta de spam.`,
        })
        setEmail('')
      } else {
        setResult({
          success: false,
          message: data.error || 'Error al enviar el email',
        })
      }
    } catch (error: any) {
      console.error('Error:', error)
      let errorMessage = 'Error de conexión. Verifica que el servidor esté corriendo.'
      
      if (error?.message) {
        errorMessage = error.message
      }
      
      setResult({
        success: false,
        message: errorMessage,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1a] text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Prueba de Email</h1>
            <p className="text-gray-400">
              Verifica la configuración y envía un correo de prueba
            </p>
          </div>

          {/* Estado de Configuración */}
          {configStatus && (
            <div
              className={`mb-6 p-5 rounded-xl border-2 ${
                configStatus.status === 'ok'
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-red-500/20 border-red-500/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {configStatus.status === 'ok' ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-1 ${
                    configStatus.status === 'ok' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    Estado de Configuración
                  </h3>
                  <p className={`text-sm ${
                    configStatus.status === 'ok' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {configStatus.message}
                  </p>
                </div>
              </div>

              {/* Lista de Problemas */}
              {configStatus.issues && configStatus.issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-red-300 mb-2">❌ Problemas Encontrados:</h4>
                  <ul className="space-y-2">
                    {configStatus.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-300">
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detalles de Configuración */}
              {configStatus.details && Object.keys(configStatus.details).length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Detalles:</h4>
                  <div className="space-y-1 text-xs text-gray-400">
                    {Object.entries(configStatus.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className={typeof value === 'boolean' && value ? 'text-green-400' : typeof value === 'boolean' ? 'text-red-400' : 'text-gray-300'}>
                          {typeof value === 'boolean' ? (value ? '✓ Sí' : '✗ No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleTestEmail} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Correo electrónico de prueba
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="miguelargus05@gmail.com"
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-gold focus:outline-none transition-colors text-white placeholder-gray-500"
                disabled={isSending || (configStatus?.status !== 'ok')}
              />
              <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-300 mb-1">
                  ⚠️ <strong>Limitación del dominio de prueba:</strong>
                </p>
                <p className="text-xs text-yellow-400">
                  Con <code className="bg-black/30 px-1 rounded">onboarding@resend.dev</code> solo puedes enviar a tu email de cuenta de Resend: <strong>miguelargus05@gmail.com</strong>
                </p>
                <p className="text-xs text-yellow-400 mt-1">
                  Para enviar a otros correos, verifica un dominio en <a href="https://resend.com/domains" target="_blank" rel="noopener" className="underline">resend.com/domains</a>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending || !email || (configStatus?.status !== 'ok')}
              className="w-full gradient-gold text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Email de Prueba
                </>
              )}
            </button>
          </form>

          {result && (
            <div
              className={`mt-6 p-4 rounded-xl border ${
                result.success
                  ? 'bg-green-500/20 border-green-500/30'
                  : 'bg-red-500/20 border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                  {result.message}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold mb-2 text-gold">ℹ️ Información</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Verifica que todas las configuraciones estén correctas antes de enviar</li>
              <li>• Si hay errores, corrige los problemas marcados arriba</li>
              <li>• Reinicia el servidor después de cambiar variables de entorno</li>
              <li>• Revisa la carpeta de spam si no ves el correo</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-gold hover:underline"
            >
              ← Volver a la página principal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
