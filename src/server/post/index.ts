import { nanoid } from 'nanoid'
import { withUser } from 'server/auth/user'

import { ListOptionsRequest, withListOptions } from 'server/helpers/request'
import { createdResponse, jsonCreatedResponse, jsonOkResponse, notFoundResponse, okResponse } from 'server/helpers/response'
import { withKV } from 'server/kvprefixes'
import { Post } from 'server/kvprefixes/posts'

export const addPost = [
  withKV,
  withUser(),
  async (request: Request, env: EnvInterface) => {
    const { auth } = request
    const formData = await request.json()
    const { title, content } = formData

    const key = nanoid(10)
    const unix = new Date().getTime() / 1000

    const post = { title, content, createdAt: unix, createdBy: auth.user.key } as Post
    await env.kv.POSTS.putData(key, post)
    return jsonCreatedResponse(key)
  }
]

export const delPost = [
  withKV,
  withUser(),
  async (request: Request, env: EnvInterface) => {
    const { params } = request
    const { key } = params

    const deleted = await env.kv.POSTS.deleteData(key)
    if (!deleted) return notFoundResponse()
    return okResponse()
  }
]

export const getPost = [
  withKV,
  async (request: Request, env: EnvInterface) => {
    const { params } = request
    const { key } = params

    const post = await env.kv.POSTS.getData(key)
    if (!post) return notFoundResponse()
    return jsonOkResponse(post)
  }
]

export const getPosts = [
  withKV,
  withListOptions,
  async (request: ListOptionsRequest, env: EnvInterface) => {
    const { listOptions } = request
    const result = await env.kv.POSTS.listData(listOptions)
    return jsonOkResponse(result)
  }
]