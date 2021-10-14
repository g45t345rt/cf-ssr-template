import { badResponse } from './response'
import { ListOptions } from 'cf-kvprefix/dist/KVPrefix'

export interface ListOptionsRequest extends Request {
  listOptions: ListOptions
}

export const withListOptions = (request: ListOptionsRequest) => {
  const { query } = request
  const { limit, cursor, indexKey } = query

  const listOptions = {} as ListOptions
  if (limit) {
    const limitAsNumber = Number(limit)

    if (limitAsNumber !== limitAsNumber) {
      return badResponse(new Error('[limit] query must be a number.'))
    }

    if (limitAsNumber > 1000 || limitAsNumber < 1) {
      return badResponse(new Error('[limit] query must be between 1 and 1000.'))
    }

    listOptions.limit = limitAsNumber
  }

  if (cursor) listOptions.cursor = cursor
  if (indexKey) listOptions.indexKey = indexKey

  request.listOptions = listOptions
}
