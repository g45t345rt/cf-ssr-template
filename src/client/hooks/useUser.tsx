import React from 'react'
import useServerData from './useServerData'

const Context = React.createContext(null)

export const UserProvider = (props): JSX.Element => {
  const { children } = props

  const _user = useServerData('user', async (server) => {
    const { auth } = server.req
    if (auth) return JSON.parse(auth.sanitizedUser)
  }, null)

  const [user, setUser] = React.useState(_user)

  return <Context.Provider value={[user, setUser]}>
    {children}
  </Context.Provider>
}

export default () => React.useContext(Context)
