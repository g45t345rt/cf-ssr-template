import React, { ReactElement, ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { ServerContext } from './useServer'

export type ServerDataContext = {
  data: unknown
  funcs: { [key: string]: () => unknown }
}

const Context = React.createContext<ServerDataContext>({ data: {}, funcs: {} })

export const useServerDataContext = (): ServerDataContext => React.useContext(Context)

export const getServerDataClientContext = (): ServerDataContext => {
  const data = window.initialData
  Reflect.deleteProperty(window, 'initialData')
  return { data, funcs: {} }
}

type ServerDataProviderProps = {
  children: ReactNode,
  context: ServerDataContext
}

export const ServerDataProvider = ({ children, context }: ServerDataProviderProps): JSX.Element => {
  return <Context.Provider value={context}>
    {children}
  </Context.Provider>
}

export type ServerData = (serverContext: ServerContext) => Promise<unknown> | void

export const renderApp = async (element: ReactElement, context: ServerDataContext): Promise<string> => {
  await Promise.all(Object.keys(context.funcs).map(async (key) => {
    const func = context.funcs[key]
    context.data[key] = await func()
  }))

  const preCount = Object.keys(context.funcs).length
  const body = renderToString(element)
  const postCount = Object.keys(context.funcs).length
  if (postCount > preCount) return renderApp(element, context)
  Reflect.deleteProperty(context, 'funcs')
  return body
}

export default function useServerData<T>(key: string, func: () => unknown, initialValue?: T): T {
  const context = React.useContext(Context)
  const { funcs } = context
  if (funcs && !funcs[key]) funcs[key] = func

  return context.data[key] || initialValue
}
