export type AuthenticationModel = {
  email: string
  password: string
}

export interface AuthenticationUseCase {
  auth(authenticationModel: AuthenticationModel): Promise<string | null>
}
