const formatErr = (type: string, code: number, err: Error) => {
  return JSON.stringify({
    "error": {
      "message": err.message,
      "type": type,
      "code": code
    }
  }, null, 2)
}

export const notFoundResponse = (err?: Error, headers?) => {
  const newErr = err || new Error('Resource not found')
  const init = { status: 404, statusText: newErr.message, headers } as ResponseInit
  const body = formatErr('NotFound', 404, newErr)
  return new Response(body, init)
}

export const badResponse = (err: Error, headers?) => {
  return new Response(formatErr('BadRequest', 400, err), { status: 400, statusText: err.message, headers })
}

export const jsonOkResponse = (data, headers?) => {
  return okResponse(JSON.stringify(data, null, 2), headers)
}

export const jsonCreatedResponse = (data, headers?) => {
  return createdResponse(JSON.stringify(data), headers)
}

export const okResponse = (data?, headers?) => {
  return new Response(data || '{}', { status: 200, statusText: 'OK', headers })
}

export const createdResponse = (data?, headers?) => {
  return new Response(data, { status: 201, statusText: 'Created', headers })
}

export const unauthorizedResponse = (data?, headers?) => {
  return new Response(data, { status: 401, statusText: 'Unauthorized', headers })
}