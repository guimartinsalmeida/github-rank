import { useState, useEffect } from 'react'

function DailyGoalProgress({ contributions, compact = false }) {
  const [currentWeekDays, setCurrentWeekDays] = useState([])

  useEffect(() => {
    // Gerar os dias da semana atual (segunda a domingo)
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0 = domingo, 1 = segunda, etc.
    
    // Calcular o início da semana (segunda-feira)
    const startOfWeek = new Date(today)
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1
    startOfWeek.setDate(today.getDate() - daysToSubtract)
    
    // Gerar array com os 7 dias da semana
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }
    
    setCurrentWeekDays(weekDays)
  }, [])

  // Função para obter contribuições de um dia específico
  const getContributionsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    const flattenedDays = contributions.weeks.flatMap(week => week.contributionDays)
    const dayData = flattenedDays.find(day => day.date === dateString)
    return dayData ? dayData.contributionCount : 0
  }

  // Função para verificar se o dia já passou
  const isDayPassed = (date) => {
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Fim do dia atual
    return date <= today
  }

  // Função para verificar se é hoje
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Função para obter o status do dia
  const getDayStatus = (date) => {
    if (!isDayPassed(date)) {
      return 'future' // Dia futuro
    }
    
    const contributions = getContributionsForDate(date)
    if (contributions >= 1) {
      return 'completed' // Meta atingida
    } else {
      return 'failed' // Meta não atingida
    }
  }

  // Função para obter a cor da barra
  const getBarColor = (status, isToday) => {
    if (isToday) {
      return 'bg-gradient-to-r from-yellow-400 to-orange-400'
    }
    
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-emerald-500'
      case 'failed':
        return 'bg-gradient-to-r from-red-400 to-pink-500'
      case 'future':
        return 'bg-slate-600/30'
      default:
        return 'bg-slate-600/30'
    }
  }

  // Função para obter o ícone
  const getDayIcon = (status, isToday) => {
    if (isToday) return '🎯'
    
    switch (status) {
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      case 'future':
        return '⏳'
      default:
        return '⏳'
    }
  }

  // Calcular estatísticas da semana
  const weekStats = {
    completed: currentWeekDays.filter(date => getDayStatus(date) === 'completed').length,
    failed: currentWeekDays.filter(date => getDayStatus(date) === 'failed').length,
    future: currentWeekDays.filter(date => getDayStatus(date) === 'future').length,
    total: currentWeekDays.length
  }

  const weekProgress = weekStats.total > 0 ? Math.round((weekStats.completed / (weekStats.completed + weekStats.failed)) * 100) : 0

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Header compacto */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200">Meta Diária</h4>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">{weekStats.completed}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-200">{weekStats.completed + weekStats.failed}</span>
          </div>
        </div>

        {/* Barras de progresso compactas */}
        <div className="flex gap-1">
          {currentWeekDays.map((date, index) => {
            const status = getDayStatus(date)
            const isTodayDate = isToday(date)
            const contributions = getContributionsForDate(date)
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-slate-400 mb-1">
                  {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className="w-full h-8 rounded-lg overflow-hidden relative">
                  <div className={`w-full h-full ${getBarColor(status, isTodayDate)} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">
                      {getDayIcon(status, isTodayDate)}
                    </span>
                  </div>
                  {isTodayDate && (
                    <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {contributions}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progresso semanal */}
        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Progresso da semana</span>
            <span className="text-slate-200 font-semibold">{weekProgress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${weekProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">Meta Diária de Commits</h3>
          <p className="text-slate-400 text-sm">Acompanhe se cada desenvolvedor atingiu a meta de 1 commit por dia</p>
        </div>
        
        {/* Estatísticas da semana */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="bg-green-900/30 rounded-lg px-3 py-2 border border-green-700/30">
            <div className="font-semibold text-green-400">{weekStats.completed}</div>
            <div className="text-green-300">Concluídas</div>
          </div>
          <div className="bg-red-900/30 rounded-lg px-3 py-2 border border-red-700/30">
            <div className="font-semibold text-red-400">{weekStats.failed}</div>
            <div className="text-red-300">Falhadas</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="font-semibold text-slate-200">{weekProgress}%</div>
            <div className="text-slate-400">Taxa de sucesso</div>
          </div>
        </div>
      </div>

      {/* Barras de progresso principais */}
      <div className="bg-slate-800/30 rounded-xl p-6 shadow-sm border border-slate-700/50">
        <div className="grid grid-cols-7 gap-4">
          {currentWeekDays.map((date, index) => {
            const status = getDayStatus(date)
            const isTodayDate = isToday(date)
            const contributions = getContributionsForDate(date)
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dayShort = date.toLocaleDateString('pt-BR', { weekday: 'short' })
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-center mb-3">
                  <div className="text-sm font-semibold text-slate-200">{dayShort}</div>
                  <div className="text-xs text-slate-400">{dateStr}</div>
                </div>
                
                <div className="w-full h-16 rounded-lg overflow-hidden relative mb-2">
                  <div className={`w-full h-full ${getBarColor(status, isTodayDate)} flex items-center justify-center`}>
                    <span className="text-lg font-bold text-white">
                      {getDayIcon(status, isTodayDate)}
                    </span>
                  </div>
                  {isTodayDate && (
                    <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-pulse"></div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-200">
                    {contributions} commit{contributions !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-slate-400">
                    {status === 'completed' ? 'Meta atingida!' : 
                     status === 'failed' ? 'Meta não atingida' : 
                     'Dia futuro'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progresso semanal detalhado */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-700/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">📊</span>
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              Progresso da Semana Atual
            </div>
            <div className="text-slate-400 text-sm">
              {weekStats.completed} de {weekStats.completed + weekStats.failed} dias com meta atingida
            </div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700/50 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${weekProgress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0%</span>
          <span className="font-semibold text-slate-200">{weekProgress}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded"></div>
          <span>Meta atingida</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded"></div>
          <span>Meta não atingida</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded"></div>
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-600/30 rounded"></div>
          <span>Dia futuro</span>
        </div>
      </div>
    </div>
  )
}

export default DailyGoalProgress 