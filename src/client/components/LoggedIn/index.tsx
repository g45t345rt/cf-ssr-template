import React from 'react'

import useUser from 'hooks/useUser'
import axios from 'axios'

const apiLogout = async () => {
  await axios.post('/api/auth/logout')
}

export default (): JSX.Element => {
  const [loading, setLoading] = React.useState(false)
  const [user, setUser] = useUser()

  const onLogout = React.useCallback(async () => {
    setLoading(true)
    const logout = async () => {
      try {
        await apiLogout()
        setUser(null)
      } catch (err) {
        console.log(err)
      }

      setLoading(false)
    }

    setTimeout(logout, 500)
  }, [])

  if (!user) return null

  return <div>
    <div>You are logged in as {user.username}</div>
    <button type="button" onClick={onLogout}>Logout</button>
    {loading && <div>Logging out...</div>}
  </div>
}