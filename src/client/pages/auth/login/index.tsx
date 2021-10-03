import axios from 'axios'
import React from 'react'

const apiLogin = async (data) => {
  return await axios.post('/api/auth/login', data)
}

export default (): JSX.Element => {
  const [loading, setLoading] = React.useState(false)
  const [postErr, setPostErr] = React.useState()
  const onSubmit = React.useCallback((e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())
    setLoading(true)
    setPostErr(null)

    const login = async () => {
      await apiLogin(values).catch((err) => setPostErr(err))
      setLoading(false)
    }

    setTimeout(login, 500)
  }, [])

  return <div>
    <h1>Login</h1>
    <form onSubmit={onSubmit} method="post">
      <div>Username</div>
      <input name="username" type="text" />
      <div>Password</div>
      <input name="password" type="password" />
      <div>
        <button>Submit</button>
      </div>
    </form>
    {loading && <div>Logging in...</div>}
    {postErr && <div>{JSON.stringify(postErr)}</div>}
  </div>
}