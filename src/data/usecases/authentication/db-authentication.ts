import { AuthenticationModel, AuthenticationUseCase } from '../../../domain/usecases/authentication-usecase'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async auth(authenticationModel: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authenticationModel.email)
    return ''
  }
}
