

export interface Credentials {
  email: string,
  password: string
}

export interface UserState {
  role: string
}

export interface UserContextType {
  user: UserState | undefined,
  setUser: React.Dispatch<React.SetStateAction<UserState | undefined>>
}