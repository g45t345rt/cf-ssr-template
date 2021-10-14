import { KVPrefix } from 'cf-kvprefix'
import ittyRouter from 'itty-router'
import { Post } from 'server/kvprefixes/posts'
import { User } from 'server/kvprefixes/users'

export { }

declare global {
  interface Request extends ittyRouter.Request { }

  interface Window {
    initialData: []
  }
  
  interface Auth {
    sanitizedUser: string
    user: User
    token: string
  }

  interface Request {
    auth: Auth
    kv: {
      POSTS: KVPrefix<Post>
      USERS: KVPrefix<User>
      TOKENS: KVPrefix<string>
    }
  }

  const DATA: KVNamespace
}
