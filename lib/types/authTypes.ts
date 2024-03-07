import type { ObjectId } from "mongodb"

export interface Credentials {
  email: string,
  password: string
}

export interface User {
  id: ObjectId,
  email: string,
  isAdmin: boolean
}