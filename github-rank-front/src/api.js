const API = 'http://localhost:4000'

export async function connectUser(user, access_token) {
  await fetch(`${API}/connect-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, access_token }),
  })
}

export async function getConnectedUsers() {
  const res = await fetch(`${API}/connected-users`)
  return res.json()
}

export async function getContributions(username, access_token) {
  const res = await fetch(`${API}/github/contributions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, access_token }),
  })
  return res.json()
}
