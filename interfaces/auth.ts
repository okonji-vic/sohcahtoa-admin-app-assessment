export interface ITokenPayload {
    email: string
    role: 'admin' | 'analyst'
    iat: number
    exp: number
  }
  
  export interface IAuthContext {
    email: string
    role: 'admin' | 'analyst'
    accessToken: string
    refreshToken: string
  }

  