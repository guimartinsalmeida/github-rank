import { useEffect } from 'react'
import { connectUser } from './api'

function Callback() {
  useEffect(() => {
    const fetchData = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) return

      try {
        const res = await fetch('http://localhost:4000/auth/github/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })

        const data = await res.json()
        const { access_token, user } = data

        // salvar no localStorage
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(user))

        // enviar para o backend
        await connectUser(user, access_token)

        // redirecionar para home
        window.location.href = '/'
      } catch (err) {
        console.error('Erro:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600/20 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
        </div>
        <p className="text-slate-200 text-base font-medium mb-1">Conectando com GitHub...</p>
        <p className="text-slate-400 text-sm">Aguarde um momento</p>
      </div>
    </div>
  )
}

export default Callback
