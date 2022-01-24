import { AccountModel } from '../../../domain/models/account-model';
import { AddAccountModel, AddAccountUseCase } from '../../../domain/usecases/add-account-usecase'
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = {
      ...accountData,
      password: hashedPassword
    }
    // const account = Object.assign({}, accountData, { password: hashedPassword })
    const accountAdded = await this.addAccountRepository.add(account)
    return accountAdded
  }
}
