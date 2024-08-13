import { SenderInfo } from "./component-types/OrderFormData"

export interface Credentials {
  email: string,
  password: string
}

export interface User {
  role: "admin" | "user" | "guest" | null
  senderInfo?: SenderInfo
}

export interface UserContextType {
  user: User | undefined,
  setUser: React.Dispatch<React.SetStateAction<User>>
}