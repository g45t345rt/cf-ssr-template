import { KVPrefix, Prefix } from 'cf-kvprefix'

import posts from './posts'
import users from './users'

const tokens = new Prefix<string>('tokens')

export const withKV = async (request: Request, event: FetchEvent) => {
  request.kv = {
    POSTS: new KVPrefix(DATA, posts),
    USERS: new KVPrefix(DATA, users),
    TOKENS: new KVPrefix(DATA, tokens)
  }
}
