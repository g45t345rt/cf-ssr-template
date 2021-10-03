import React from 'react'
import axios from 'axios'

import useServerData from 'hooks/useServerData'

const apiAddPost = async (data) => {
  return await axios.post('/api/posts', data, { headers: { 'Content-Type': 'application/json' } })
}

const apiDelPost = async (key) => {
  return await axios.delete(`/api/posts/${key}`, { headers: { 'Content-Type': 'application/json' } })
}

const getPosts = async () => {
  return await axios.get('/api/posts', { headers: { 'Content-Type': 'application/json' } })
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
  const postList = useServerData('post_list', async () => {
    const latestPosts = await POSTS_LATEST.list({ limit: 5 })
    latestPosts['data'] = []

    for (let i = 0; i < latestPosts.keys.length; i++) {
      const key = latestPosts.keys[i]
      const extractId = new RegExp(/@(.*)/) // key definition = {timestamp}@{postId}
      const id = extractId.exec(key.name)[1]
      const post = await POSTS.get(id, 'json')
      latestPosts.data.push({ key: id, ...post })
    }

    return latestPosts
  }, { data: [] })

  const [posts, setPosts] = React.useState(postList.data)

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