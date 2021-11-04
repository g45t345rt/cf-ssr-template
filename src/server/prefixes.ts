import { KVPrefix, Prefix } from 'cf-kvprefix'
import posts from './post/prefix'
import users from './auth/prefix'

export const withKV = async (request: Request, env: EnvInterface, ctx) => {
  const tokens = new Prefix<string>('tokens')

  env.kv = {
    POSTS: new KVPrefix(env.DATA, posts, ctx),
    USERS: new KVPrefix(env.DATA, users, ctx),
    TOKENS: new KVPrefix(env.DATA, tokens, ctx)
  }
}
