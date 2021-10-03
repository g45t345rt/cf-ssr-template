import React, { ReactNode } from 'react'

export type ServerContext = {
  req: Request
  res: ResponseInit
  event: FetchEvent
}

const Context = React.createContext<ServerContext>(null)

export default (): ServerContext => React.useContext<ServerContext>(Context)

type ServerProviderProps = {
  children: ReactNode
  context: ServerContext
}

export const ServerProvider = (props: ServerProviderProps) => {
  const { context, children } = props
  //context.res.status(200) // set to 200 by default... important when we render app multiple times based on authentication

  return <Context.Provider value={context}>
    {children}
  </Context.Provider>
}
