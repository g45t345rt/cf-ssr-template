import useUser from 'hooks/useUser'
import React from 'react'
import Unauthorized from '../Unauthorized'

const postChangeUsername = (newUsername: string) => {
  return fetch('/api/auth/changeUsername', {
    method: 'POST',
    body: JSON.stringify({ newUsername })
  })
}

export default () => {
  const [loading, setLoading] = React.useState(false)
  const [user, setUser] = useUser()
  const [postErr, setPostErr] = React.useState()
  const usernameInput = React.useRef<HTMLInputElement>()

  const changeUsername = React.useCallback(() => {
    setLoading(true)
    setPostErr(null)
    setTimeout(async () => {
      const newUsername = usernameInput.current.value

      try {
        const res = await postChangeUsername(newUsername)
        const data = await res.json()
        if (res.ok) {
          setUser({ ...user, username: newUsername })
        } else {
          setPostErr(data)
        }
      } catch (err) {
        setPostErr(err)
      }

      setLoading(false)
    }, 500)
  }, [])

  if (!user) return <Unauthorized />

  return <div>
    <h1>Change username</h1>
    <input ref={usernameInput} type="text" />
    <button type="button" onClick={changeUsername}>Update</button>
    {loading && <div>Loading...</div>}
    {postErr && <div>{JSON.stringify(postErr)}</div>}
  </div>
}