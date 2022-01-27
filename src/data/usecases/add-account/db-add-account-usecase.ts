import { AccountModel } from '../../../domain/models/account-model';
import { AddAccountModel, AddAccountUseCase } from '../../../domain/usecases/add-account-usecase'
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { Hasher } from '../../protocols/cryptography/hasher';

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = {
      ...accountData,
      password: hashedPassword
    }
    // const account = Object.assign({}, accountData, { password: hashedPassword })
    const accountAdded = await this.addAccountRepository.add(account)
    return accountAdded
  }
}
