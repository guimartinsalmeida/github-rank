export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const { access_token } = await tokenResponse.json()

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github+json',
      },
    })

    const user = await userResponse.json()

    res.json({
      access_token,
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Auth error' })
  }
}