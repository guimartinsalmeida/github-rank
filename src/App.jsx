import { useEffect, useState } from 'react'
import { getConnectedUsers, getContributions } from './api'
import Heatmap from './Heatmap'
import DailyGoalProgress from './DailyGoalProgress'

function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600/20 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
        </div>
        <p className="text-slate-200 text-base font-medium mb-1">Carregando dados...</p>
        <p className="text-slate-400 text-sm">Isso pode levar alguns segundos</p>
      </div>
    </div>
  )
}

function App() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCommits: 0,
    averageCommits: 0,
    mostActiveUser: null
  })

  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
  const REDIRECT_URI = 'http://localhost:5173/callback'

  const handleConnectNewAccount = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user repo`
    window.location.href = authUrl
  }

  function getStatus(total) {
    if (total === 0) return { text: 'Inativo', class: 'status-inactive', icon: '🧊' }
    if (total < 10) return { text: 'Quase parado', class: 'status-warning', icon: '⚠️' }
    if (total < 30) return { text: 'Engrenando', class: 'status-engaging', icon: '🔥' }
    return { text: 'On Fire', class: 'status-onfire', icon: '🚀' }
  }

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true)
        const users = await getConnectedUsers()

        const results = await Promise.all(
          users.map(async ({ user, access_token }) => {
            const contributions = await getContributions(user.login, access_token)

            const total = contributions.weeks
              .flatMap((week) => week.contributionDays)
              .reduce((sum, day) => sum + day.contributionCount, 0)

            return { user, contributions, total }
          })
        )

        results.sort((a, b) => b.total - a.total)
        setBoards(results)

        // Calculate stats
        const totalCommits = results.reduce((sum, { total }) => sum + total, 0)
        const averageCommits = results.length > 0 ? Math.round(totalCommits / results.length) : 0
        const mostActiveUser = results.length > 0 ? results[0] : null

        setStats({
          totalUsers: results.length,
          totalCommits,
          averageCommits,
          mostActiveUser
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoards()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="h-full flex flex-col">
        {/* Header Compact */}
        <div className="flex-shrink-0 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1">GitHub Heatmap Admira Squad</h1>
                <p className="text-slate-300 text-sm">
                  Acompanhe a atividade dos desenvolvedores
                </p>
              </div>
              
              <button
                onClick={handleConnectNewAccount}
                className="bg-slate-700/50 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2 text-sm border border-slate-600/30"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Conectar
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto px-4">
            {boards.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="stats-card p-8 max-w-md text-center">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">Nenhum desenvolvedor conectado</h3>
                  <p className="text-slate-400 mb-6 text-sm">
                    Conecte contas do GitHub para começar a acompanhar a atividade da equipe
                  </p>
                  <button
                    onClick={handleConnectNewAccount}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-400/30"
                  >
                    Conectar Primeira Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Stats Row */}
                <div className="flex-shrink-0 mb-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="stats-card p-3 text-center">
                      <div className="text-xl font-bold text-slate-200">{stats.totalUsers}</div>
                      <div className="text-slate-400 text-xs">Devs</div>
                    </div>
                    <div className="stats-card p-3 text-center">
                      <div className="text-xl font-bold text-slate-200">{stats.totalCommits}</div>
                      <div className="text-slate-400 text-xs">Commits</div>
                    </div>
                    <div className="stats-card p-3 text-center">
                      <div className="text-xl font-bold text-slate-200">{stats.averageCommits}</div>
                      <div className="text-slate-400 text-xs">Média</div>
                    </div>
                    <div className="stats-card p-3 text-center">
                      <div className="text-lg font-bold text-slate-200 truncate">
                        {stats.mostActiveUser ? `@${stats.mostActiveUser.user.login}` : '-'}
                      </div>
                      <div className="text-slate-400 text-xs">Top</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 mb-4">
                  <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700/50">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'overview'
                          ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-400/30'
                          : 'text-slate-300 hover:text-slate-200'
                      }`}
                    >
                      Visão Geral
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'details'
                          ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-400/30'
                          : 'text-slate-300 hover:text-slate-200'
                      }`}
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => setActiveTab('daily-goals')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'daily-goals'
                          ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-400/30'
                          : 'text-slate-300 hover:text-slate-200'
                      }`}
                    >
                      Metas Diárias
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'overview' ? (
                    <div className="h-full overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {boards.map(({ user, contributions, total }, index) => {
                          const status = getStatus(total)
                          return (
                            <div key={user.login} className="stats-card p-4 card-hover">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                  <img
                                    src={user.avatar_url}
                                    alt={user.login}
                                    className="w-12 h-12 rounded-full border-2 border-slate-600 shadow-md"
                                  />
                                  {index === 0 && (
                                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-900 text-xs font-bold px-1 py-0.5 rounded-full">
                                      🏆
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-bold text-slate-200 truncate">@{user.login}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`status-badge text-xs px-2 py-1 ${status.class}`}>
                                      {status.icon} {status.text}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mb-3 text-sm text-slate-400">
                                <span className="font-semibold text-slate-200">{total} commits</span>
                                <div className="flex gap-3">
                                  <span>{user.public_repos || 0} repos</span>
                                  <span>{user.followers || 0} seg</span>
                                </div>
                              </div>

                              {/* Mini Heatmap */}
                              <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 mb-3">
                                <Heatmap contributions={contributions} compact={true} />
                              </div>

                              {/* Mini Daily Goals */}
                              <DailyGoalProgress contributions={contributions} compact={true} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : activeTab === 'details' ? (
                    <div className="h-full overflow-y-auto">
                      <div className="space-y-4 pb-4">
                        {boards.map(({ user, contributions, total }, index) => {
                          const status = getStatus(total)
                          return (
                            <div key={user.login} className="stats-card p-6 card-hover">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={user.avatar_url}
                                      alt={user.login}
                                      className="w-16 h-16 rounded-full border-4 border-slate-600 shadow-lg"
                                    />
                                    {index === 0 && (
                                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                        🏆
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">@{user.login}</h2>
                                    <div className="flex items-center gap-3">
                                      <span className={`status-badge ${status.class}`}>
                                        {status.icon} {status.text}
                                      </span>
                                      <span className="text-slate-400 font-medium">
                                        {total} commit{total !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-4 text-sm text-slate-400">
                                  <div className="text-center">
                                    <div className="font-bold text-slate-200">{user.public_repos || 0}</div>
                                    <div>Repositórios</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-slate-200">{user.followers || 0}</div>
                                    <div>Seguidores</div>
                                  </div>
                                </div>
                              </div>

                              <Heatmap contributions={contributions} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="space-y-6 pb-4">
                        {boards.map(({ user, contributions, total }, index) => {
                          const status = getStatus(total)
                          return (
                            <div key={user.login} className="stats-card p-6 card-hover">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={user.avatar_url}
                                      alt={user.login}
                                      className="w-16 h-16 rounded-full border-4 border-slate-600 shadow-lg"
                                    />
                                    {index === 0 && (
                                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                        🏆
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">@{user.login}</h2>
                                    <div className="flex items-center gap-3">
                                      <span className={`status-badge ${status.class}`}>
                                        {status.icon} {status.text}
                                      </span>
                                      <span className="text-slate-400 font-medium">
                                        {total} commit{total !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-4 text-sm text-slate-400">
                                  <div className="text-center">
                                    <div className="font-bold text-slate-200">{user.public_repos || 0}</div>
                                    <div>Repositórios</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-slate-200">{user.followers || 0}</div>
                                    <div>Seguidores</div>
                                  </div>
                                </div>
                              </div>

                              <DailyGoalProgress contributions={contributions} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
