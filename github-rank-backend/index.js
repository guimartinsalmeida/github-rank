import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// Trocar código pelo token E buscar dados do usuário autenticado
app.post('/auth/github/callback', async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Code is missing' })
  }

  try {
    // Obter token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    const { access_token } = tokenResponse.data

    // Buscar dados do usuário autenticado
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    })

    const user = userResponse.data

res.json({
  access_token,
  user: {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
  }
})
  } catch (err) {
    console.error('Erro ao autenticar:', err.message)
    res.status(500).json({ error: 'Erro ao autenticar com GitHub' })
  }
})

app.post('/github/contributions', async (req, res) => {
  const { access_token, username } = req.body

  if (!access_token || !username) {
    return res.status(400).json({ error: 'Token ou username ausente' })
  }

  try {
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = response.data.data.user.contributionsCollection.contributionCalendar
    res.json(data)
  } catch (err) {
    console.error('Erro ao buscar contribuições:', err.response?.data || err.message)
    res.status(500).json({ error: 'Erro ao buscar contribuições do GitHub' })
  }
})
let connectedUsers = []

app.post('/connect-user', (req, res) => {
  const { user, access_token } = req.body

  if (!user || !access_token) return res.status(400).json({ error: 'Invalid data' })

  const alreadyExists = connectedUsers.find(u => u.user.login === user.login)

  if (!alreadyExists) {
    connectedUsers.push({ user, access_token })
    console.log(`Usuário conectado: ${user.login}`)
  }

  res.json({ success: true })
})

app.get('/connected-users', (req, res) => {
  res.json(connectedUsers)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
