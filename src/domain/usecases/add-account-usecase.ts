import { AccountModel } from '../models/account-model'

export type AddAccountModel = {
  name: string
  email: string
  password: string
}

export interface AddAccountUseCase {
  add(accountData: AddAccountModel): Promise<AccountModel | null>
}
