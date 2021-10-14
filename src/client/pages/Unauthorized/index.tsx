import React from 'react'
import useServer from 'hooks/useServer'

export default (): JSX.Element => {
  const server = useServer()
  if (server) server.res.status = 401

  return <div>
    <h1>401 - Unauthorized</h1>
  </div>
}