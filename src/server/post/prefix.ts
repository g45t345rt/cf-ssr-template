import { Prefix } from 'cf-kvprefix'

export interface Post {
  title: string
  content: string
  createdAt: number
  createdBy: string
}

const posts = new Prefix<Post>(`posts`)

posts.setIndex(`createdAt_desc`, {
  sortValue: (data) => `${32503680000 - data.createdAt}`
})

posts.setIndex(`createdBy`, {
  sortValue: (data) => data.createdBy
})

export default posts