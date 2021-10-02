import React from 'react'
import { StaticRouter } from 'react-router-dom'

import { ServerContext, ServerProvider } from 'hooks/useServer'
import { ServerDataContext, ServerDataProvider } from 'hooks/useServerData'

import App from './app'

type SsrProps = {
  serverContext: ServerContext
  serverDataContext: ServerDataContext
}

export default (props: SsrProps): JSX.Element => {
  const { serverContext, serverDataContext } = props
  const { req } = serverContext
  const url = new URL(req.url)
  return <ServerDataProvider context={serverDataContext}>
    <ServerProvider context={serverContext}>
      <StaticRouter location={url.pathname}>
        <App />
      </StaticRouter>
    </ServerProvider>
  </ServerDataProvider>
}
