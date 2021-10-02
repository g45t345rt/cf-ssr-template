import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { getServerDataClientContext, ServerDataProvider } from 'hooks/useServerData'

import App from './app'

const serverFuncContext = getServerDataClientContext()
const rootElement = document.getElementById('root')

const client = (<ServerDataProvider context={serverFuncContext}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</ServerDataProvider>)

if (process.env.NODE_ENV === 'production') {
  ReactDOM.hydrate(client, rootElement) // perserve markup and only attach event handlers (performant first-load)
} else {
  ReactDOM.render(client, rootElement)

  if (process.env.BROWSER_REFRESH_PORT) {
    const evtSource = new EventSource(`http://localhost:${process.env.BROWSER_REFRESH_PORT}`)

    evtSource.addEventListener('reload', () => {
      console.log('reload from server')
      window.location.reload()
    })
  } else console.warn('Missing refresh port. App will not reload after edit!')
}
