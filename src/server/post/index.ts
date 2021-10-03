import { Request } from 'itty-router'
import { nanoid } from 'nanoid'

const endUnix = 32503680000 // January 1, 3000 12:00:00 AM

export interface Post {
  title: string
  content: string
  createAt: Date
}

export const addPost = async (request: Request) => {
  const formData = await request.json()

  const key = nanoid(10)
  const unix = new Date().getTime() / 1000
  const latestKey = `${endUnix - unix}@${key}`

  await POSTS.put(key, JSON.stringify({ ...formData, createdAt: unix, latestKey }))
  await POSTS_LATEST.put(latestKey, key)
  const init = { headers: { 'Content-Type': 'application/json' } } as ResponseInit
  return new Response(key, init)
}

export const delPost = async (request: Request) => {
  const { params } = request
  const { key } = params

  const post = await POSTS.get(key, 'json')
  if (!post) return new Response(`The post does not exists.`, { status: 404 })

  await POSTS.delete(key)
  await POSTS_LATEST.delete(post.latestKey)
  return new Response(`Post deleted!`)
}

export const getPost = async (request: Request) => {
  const { params } = request
  const { key } = params

  const post = await POSTS.get(key, 'json')
  if (!post) return new Response(`The post does not exists.`, { status: 404 })

  const init = { headers: { 'Content-Type': 'application/json' } } as ResponseInit
  return new Response(JSON.stringify(post), init)
}

export const getLatestPosts = async (request: Request) => {
  const posts = await POSTS_LATEST.list()

  const init = { headers: { 'Content-Type': 'application/json' } } as ResponseInit
  return new Response(JSON.stringify(posts), init)
}