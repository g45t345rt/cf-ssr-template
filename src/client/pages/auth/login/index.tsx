import React from 'react'

import useUser from 'hooks/useUser'

const apiLogin = async (data: Object) => {
  return await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export default (): JSX.Element => {
  const [loading, setLoading] = React.useState(false)
  const [postErr, setPostErr] = React.useState()
  const [_, setUser] = useUser()

  const onSubmit = React.useCallback((e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())
    setLoading(true)
    setPostErr(null)

    const login = async () => {
      try {
        const res = await apiLogin(values)
        const data = await res.json()
        if (res.ok) setUser(data)
        else setPostErr(data)

      } catch (err) {
        console.log(err)
        setPostErr(err)
      }

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