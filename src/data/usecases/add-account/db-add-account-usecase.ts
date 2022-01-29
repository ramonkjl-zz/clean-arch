import { AccountModel } from '../../../domain/models/account-model';
import { AddAccountModel, AddAccountUseCase } from '../../../domain/usecases/add-account-usecase'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository';
import { Hasher } from '../../protocols/cryptography/hasher';
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository';

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const newAccount = {
        ...accountData,
        password: hashedPassword
      }
      // const account = Object.assign({}, accountData, { password: hashedPassword })
      const accountAdded = await this.addAccountRepository.add(newAccount)
      return accountAdded
    }
    return null
  }
}
