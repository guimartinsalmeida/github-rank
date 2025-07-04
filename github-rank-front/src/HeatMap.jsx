import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

function Heatmap({ contributions, compact = false }) {
  // Achatar todos os dias das semanas em um único array
  const flattenedDays = contributions.weeks.flatMap(week => week.contributionDays)

  // Transformar os dados no formato aceito pelo heatmap
  const values = flattenedDays.map(day => ({
    date: day.date,
    count: day.contributionCount,
  }))

  // Calcular estatísticas
  const totalContributions = values.reduce((sum, day) => sum + day.count, 0)
  const activeDays = values.filter(day => day.count > 0).length
  const maxContributions = Math.max(...values.map(day => day.count))
  const averageContributions = totalContributions > 0 ? Math.round(totalContributions / activeDays) : 0

  // Encontrar o dia mais ativo
  const mostActiveDay = values.reduce((max, day) => 
    day.count > max.count ? day : max, { count: 0, date: '' }
  )

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Compact Stats */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-semibold text-slate-200">{totalContributions} total</span>
          <span>{activeDays} dias ativos</span>
        </div>

        {/* Compact Heatmap */}
        <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
          <CalendarHeatmap
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={values}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty'
              }
              if (value.count <= 2) return 'color-scale-1'
              if (value.count <= 5) return 'color-scale-2'
              if (value.count <= 10) return 'color-scale-3'
              return 'color-scale-4'
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return null
              return {
                'data-tip': `${value.date}: ${value.count} commit${value.count !== 1 ? 's' : ''}`,
              }
            }}
            showWeekdayLabels={false}
            showMonthLabels={false}
            gutterSize={1}
            square
          />
        </div>

        {/* Compact Legend */}
        <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
          <span>Menos</span>
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-sm color-empty"></div>
            <div className="w-2 h-2 rounded-sm color-scale-1"></div>
            <div className="w-2 h-2 rounded-sm color-scale-2"></div>
            <div className="w-2 h-2 rounded-sm color-scale-3"></div>
            <div className="w-2 h-2 rounded-sm color-scale-4"></div>
          </div>
          <span>Mais</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">Mapa de Atividade</h3>
          <p className="text-slate-400 text-sm">Contribuições dos últimos 365 dias</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="font-semibold text-slate-200">{totalContributions}</div>
            <div className="text-slate-400">Total</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="font-semibold text-slate-200">{activeDays}</div>
            <div className="text-slate-400">Dias ativos</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="font-semibold text-slate-200">{averageContributions}</div>
            <div className="text-slate-400">Média/dia</div>
          </div>
          {maxContributions > 0 && (
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="font-semibold text-slate-200">{maxContributions}</div>
              <div className="text-slate-400">Máximo</div>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-slate-800/30 rounded-xl p-6 shadow-sm border border-slate-700/50">
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={values}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return 'color-empty'
            }
            if (value.count <= 2) return 'color-scale-1'
            if (value.count <= 5) return 'color-scale-2'
            if (value.count <= 10) return 'color-scale-3'
            return 'color-scale-4'
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return null
            return {
              'data-tip': `${value.date}: ${value.count} commit${value.count !== 1 ? 's' : ''}`,
            }
          }}
          showWeekdayLabels
          weekdayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
          monthLabels={[
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
          ]}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
        <span>Menos</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm color-empty"></div>
          <div className="w-3 h-3 rounded-sm color-scale-1"></div>
          <div className="w-3 h-3 rounded-sm color-scale-2"></div>
          <div className="w-3 h-3 rounded-sm color-scale-3"></div>
          <div className="w-3 h-3 rounded-sm color-scale-4"></div>
        </div>
        <span>Mais</span>
      </div>

      {/* Most Active Day Info */}
      {mostActiveDay.count > 0 && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔥</span>
            </div>
            <div>
              <div className="font-semibold text-slate-200">
                Dia mais ativo: {mostActiveDay.date}
              </div>
              <div className="text-slate-400 text-sm">
                {mostActiveDay.count} commit{mostActiveDay.count !== 1 ? 's' : ''} neste dia
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Heatmap
