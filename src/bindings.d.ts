export { }

interface Window {
  initialData: []
}

declare global {
  const POSTS: KVNamespace
  const USERS: KVNamespace
}
