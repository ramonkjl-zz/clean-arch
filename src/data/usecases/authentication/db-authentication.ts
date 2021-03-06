import { AuthenticationModel, AuthenticationUseCase } from '../../../domain/usecases/authentication-usecase'
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { Encrypter } from '../../protocols/cryptography/encrypter';
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository';

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth(authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationModel.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticationModel.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }

    return null
  }
}
