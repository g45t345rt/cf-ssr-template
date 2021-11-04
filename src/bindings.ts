import { KVPrefix } from 'cf-kvprefix'
import ittyRouter from 'itty-router'
import { Post } from 'server/post/prefix'
import { User } from 'server/auth/prefix'

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
  }

  interface EnvInterface {
    DATA: KVNamespace
    __STATIC_CONTENT: KVNamespace
    __STATIC_CONTENT_MANIFEST: string
    VALUE_LOCK: DurableObjectNamespace
    kv: {
      POSTS: KVPrefix<Post>
      USERS: KVPrefix<User>
      TOKENS: KVPrefix<string>
    }
  }
}
