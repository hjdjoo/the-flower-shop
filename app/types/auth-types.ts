import { SenderInfo } from "./component-types/OrderFormData"

export interface Recipient {
  id: number
  firstName: string
  lastName: string
  street1: string
  street2: string
  townCity: string
  state: string
  zip: string
  phone: string
}

export interface Credentials {
  email: string,
  password: string
}

export interface User {
  id?: number
  role: "admin" | "user" | "guest" | null
  senderInfo?: SenderInfo,
  recipients?: Recipient[]
}

export interface UserContextType {
  user: User | undefined,
  setUser: React.Dispatch<React.SetStateAction<User>>
}