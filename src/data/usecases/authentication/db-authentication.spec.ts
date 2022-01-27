import { AccountModel } from '../../../domain/models/account-model'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthenticationUseCase } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Deveria chamar o LoadAccountByEmailRepository com o email correto', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        return {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthenticationUseCase(loadAccountByEmailRepositoryStub)
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadAccountByEmailRepositoryStub.load).toBeCalledWith('any_email@mail.com')
  })
})
