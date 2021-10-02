import React from 'react'
import useServer from 'hooks/useServer'

export default (): JSX.Element => {
  const server = useServer()
  if (server) server.res.status = 404

  return <div>
    <h1>404 - Page not found</h1>
  </div>
}