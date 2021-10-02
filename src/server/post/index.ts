import { Request } from 'itty-router'
import { nanoid } from 'nanoid'

export interface Post {
  title: string
  content: string
  createAt: Date
}

export const addPost = async (request: Request) => {
  const formData = await request.json()

  const key = nanoid(10)
  const unix = new Date().getTime() / 1000
  await POSTS.put(key, JSON.stringify(formData))
  const init = { headers: { 'Content-Type': 'application/json' } } as ResponseInit
  return new Response(key, init)
}

export const delPost = async (request: Request) => {
  const { params } = request
  const { key } = params

  const post = await POSTS.get(key, 'json')
  if (!post) return new Response(`The post does not exists.`, { status: 404 })

  await POSTS.delete(key)
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

export const getPosts = async (request: Request) => {
  const posts = await POSTS.list()

  const init = { headers: { 'Content-Type': 'application/json' } } as ResponseInit
  return new Response(JSON.stringify(posts), init)
}