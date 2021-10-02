export { }

interface Window {
  initialData: []
}

interface Request {
  user: User
}

declare global {
  const POSTS: KVNamespace
  const USERS: KVNamespace
  const TOKENS: KVNamespace
  const USERNAMES: KVNamespace
}
