import { Prefix } from 'cf-kvprefix'

export interface User {
  key: string
  username: string
  passwordHash: string
  createdAt: number
}

const users = new Prefix<User>('users')

users.setIndex('username', {
  keyValue: (data) => data.username
})

export default users