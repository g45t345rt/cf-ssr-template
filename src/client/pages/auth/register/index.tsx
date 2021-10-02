import axios from 'axios'
import React from 'react'

const apiRegister = async (data) => {
  return await axios.post('/api/auth/register', data)
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
      await apiRegister(values).catch((err) => setPostErr(err))
      setLoading(false)
    }

    setTimeout(register, 500)
  }, [])

  return <div>
    <div>Register</div>
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