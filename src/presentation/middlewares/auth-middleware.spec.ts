import { forbidden, ok, serverError } from '../helpers/http-helpers'
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
    async load(accessToken: string, role?: string): Promise<AccountModel | null> {
      return makeFakeAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string) => {
  const loadAccountByToken = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByToken, role)
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
    const role = 'any_role'
    const { sut, loadAccountByToken } = makeSut(role)
    jest.spyOn(loadAccountByToken, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadAccountByToken.load).toBeCalledWith('any_token', role)
  })

  test('Deveria retornar 403 o LoadAccountByToken retornar null', async () => {
    const { sut, loadAccountByToken } = makeSut()
    jest.spyOn(loadAccountByToken, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Deveria retornar 200 se o LoadAccountByToken retornar um account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Deveria retornar 500 se o LoadAccountByToken retornar uma exceção', async () => {
    const { sut, loadAccountByToken } = makeSut()
    jest.spyOn(loadAccountByToken, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error))
  })
})
