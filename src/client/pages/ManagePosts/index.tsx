import React from 'react'
import { KVPrefix } from 'cf-kvprefix'

import useServerData, { isServerDataLoaded } from 'hooks/useServerData'

import posts from 'server/kvprefixes/posts'
import useUser from 'hooks/useUser'
import Unauthorized from '../Unauthorized'
import useServer from 'hooks/useServer'
import useLocalStorage from 'hooks/useLocalStorage'
import useMemState from 'hooks/useMemState'

const apiAddPost = async (data) => {
  return await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

const apiDelPost = async (key) => {
  return await fetch(`/api/posts/${key}`, {
    method: 'DELETE'
  })
}

const getPosts = async (indexKey: string) => {
  return await fetch(`/api/posts?indexKey=${indexKey}`)
}

const AddPost = (props): JSX.Element => {
  const { posts, setPosts } = props
  const inputTitle = React.useRef<HTMLInputElement>()
  const inputContent = React.useRef<HTMLTextAreaElement>()
  const buttonAdd = React.useRef<HTMLButtonElement>()

  const [addLoading, setAddLoading] = React.useState(false)
  const [addError, setAddError] = React.useState(null)

  const clearAddInputs = () => {
    inputTitle.current.value = ''
    inputContent.current.value = ''
  }

  const addPost = React.useCallback(() => {
    const { value: title } = inputTitle.current
    const { value: content } = inputContent.current
    const newPost = { title, content }

    buttonAdd.current.disabled = true
    setAddLoading(true)
    const add = async () => {
      await apiAddPost(newPost).catch(err => setAddError(err))
      setAddLoading(false)
      setPosts([newPost, ...posts])
      clearAddInputs()
      buttonAdd.current.disabled = false
    }

    setTimeout(add, 500) // simulate latency
  }, [posts])

  return <div>
    <div>Title</div>
    <input ref={inputTitle} type="text" />
    <div>Content</div>
    <textarea ref={inputContent} />
    <div>
      <button ref={buttonAdd} type="button" onClick={addPost}>Add post</button>
      {addLoading && <div>adding...</div>}
      {addError && <div>{addError.message}</div>}
    </div>
  </div>
}

const DelPost = (props): JSX.Element => {
  const { posts, setPosts } = props
  const inputDel = React.useRef<HTMLInputElement>()
  const buttonDel = React.useRef<HTMLButtonElement>()

  const [delLoading, setDelLoading] = React.useState(false)
  const [delError, setDelError] = React.useState(null)

  const enableDelInputs = (enable: boolean) => {
    inputDel.current.disabled = !enable
    buttonDel.current.disabled = !enable
  }

  const delPost = React.useCallback(() => {
    const { value: key } = inputDel.current
    setDelLoading(true)
    enableDelInputs(false)

    const del = async () => {
      await apiDelPost(key).catch((err) => setDelError(err))
      setDelLoading(false)
      setPosts(posts.filter(p => p.key !== key))
      inputDel.current.value = ''
      enableDelInputs(true)
    }

    setTimeout(del, 500) // simulate latency
  }, [posts])

  return <div>
    <div>
      <input placeholder="Post key" ref={inputDel} type="text" />
      <button ref={buttonDel} type="button" onClick={delPost}>Delete</button>
      {delLoading && <div>deleting...</div>}
      {delError && <div>{delError.message}</div>}
    </div>
  </div>
}

export default (): JSX.Element => {
  const [user] = useUser()
  const list = useServerData('post_list', async ({ env }) => {
    return await env.kv.POSTS.listData({ indexKey: 'createdAt_desc' })
  }, { data: [] })

  const [indexKey, setIndexKey] = React.useState('createdAt_desc')
  const [loading, setLoading] = React.useState(false)

  const [posts, setPosts] = useMemState('posts', list.data)

  // Client side post request
  React.useEffect(() => {
    setLoading(true);

    (async () => {
      const res = await getPosts(indexKey)
      if (res.ok) {
        const list = await res.json()
        setPosts(list.data)
      }
      setLoading(false)
    })()
  }, [indexKey])

  if (!user) return <Unauthorized />

  return <div>
    <h1>Manage posts</h1>
    <AddPost posts={posts} setPosts={setPosts} />
    <DelPost posts={posts} setPosts={setPosts} />
    <div>Posts</div>
    <div>
      {posts.map((post, index) => {
        return <div key={index}>{JSON.stringify(post)}</div>
      })}
    </div>
  </div>
}