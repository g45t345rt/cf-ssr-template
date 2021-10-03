export { }

declare global {
  interface Window {
    initialData: []
  }
  
  interface Auth {
    sanitizedUser: string
    user: User
    token: string
  }

  interface User {
    id: string
    username: string
    passwordHash: string
    createdAt: number
  }

  interface Request {
    auth: Auth
  }

  const POSTS: KVNamespace
  const USERS: KVNamespace
  const TOKENS: KVNamespace
  const USERNAMES: KVNamespace
  const POSTS_LATEST: KVNamespace
}
