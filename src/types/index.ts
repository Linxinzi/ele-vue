export interface User {
  id: number
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'disabled'
}