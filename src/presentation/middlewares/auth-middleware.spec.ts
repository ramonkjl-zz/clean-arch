import { forbidden } from '../helpers/http-helpers'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account-model'

const makeFakeAccountModel = () => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = () => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = () => {
  const loadAccountByToken = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByToken)
  return {
    sut,
    loadAccountByToken
  }
}

describe('Auth Middleware', () => {
  test('Deveria retornar 403 se não x-access-token não existir no headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Deveria chamar o LoadAccountByToken com o accessToken correto', async () => {
    const { sut, loadAccountByToken } = makeSut()
    jest.spyOn(loadAccountByToken, 'load')
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(loadAccountByToken.load).toBeCalledWith('any_token')
  })
})
