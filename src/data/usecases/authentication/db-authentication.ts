import { AuthenticationModel, AuthenticationUseCase } from '../../../domain/usecases/authentication-usecase'
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) { }

  async auth(authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (account)
      await this.hashComparer.compare(authenticationModel.password, account.password)

    return null
  }
}
