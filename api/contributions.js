export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { access_token, username } = req.body

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

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const json = await response.json()
  res.json(json.data.user.contributionsCollection.contributionCalendar)
}