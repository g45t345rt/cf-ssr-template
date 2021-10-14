import React from 'react'

import useUser from 'hooks/useUser'
import { Link } from 'react-router-dom'

const apiLogout = async () => {
  return await fetch('/api/auth/logout', {
    method: 'POST'
  })
}

export default (): JSX.Element => {
  const [loading, setLoading] = React.useState(false)
  const [user, setUser] = useUser()

  const onLogout = React.useCallback(async () => {
    setLoading(true)
    const logout = async () => {
      try {
        const res = await apiLogout()
        if (res.ok) setUser(null)
        else console.log(res)
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
    <ul>
      <li>
        <Link to="/manage-posts">Manage posts</Link>
      </li>
    </ul>
    <button type="button" onClick={onLogout}>Logout</button>
    {loading && <div>Logging out...</div>}
  </div>
}