import React from 'react'

const apiRegister = async (data) => {
  return await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export default (): JSX.Element => {
  const [loading, setLoading] = React.useState(false)
  const [postErr, setPostErr] = React.useState()
  const onSubmit = React.useCallback((e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())
    setPostErr(null)

    if (values.password !== values.confirmPassword) {
      setPostErr(`Password don't match!`)
      return
    }

    setLoading(true)
    const register = async () => {
      try {
        const res = await apiRegister(values)
        const data = await res.json()
        if (!res.ok) setPostErr(data)
      } catch (err) {
        setPostErr(err)
      }

      setLoading(false)
    }

    setTimeout(register, 500)
  }, [])

  return <div>
    <h1>Register</h1>
    <form onSubmit={onSubmit}>
      <div>Username</div>
      <input name="username" type="text" />
      <div>Password</div>
      <input name="password" type="password" />
      <div>Confirm password</div>
      <input name="confirmPassword" type="password" />
      <div>
        <button>Submit</button>
      </div>
    </form>
    {loading && <div>Registering...</div>}
    {postErr && <div>{JSON.stringify(postErr)}</div>}
  </div>
}