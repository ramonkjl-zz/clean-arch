import { AccountModel } from '../../../domain/models/account-model'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string | null> {
      return 'any_token'
    }
  }
  return new DecrypterStub()
}

const makeFakeAccountModel = () => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
      return makeFakeAccountModel()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = () => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Deveria chamar o Decrypter com os valores corretos', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decrypterStub.decrypt).toBeCalledWith('any_token')
  })

  test('Deveria null se o Decrypter retornar null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Deveria chamar o LoadAccountByTokenRepository com os valores corretos', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadAccountByTokenRepositoryStub.loadByToken).toBeCalledWith('any_token', 'any_role')
  })

  test('Deveria null se o LoadAccountByTokenRepository retornar null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Deveria um account se tudo der certo', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccountModel())
  })

  test('Deveria repassar o error se o Decrypter lançar uma exceção', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error("");
    })
    const promise = sut.load('any_token', 'any_role')
    expect(promise).rejects.toThrow()
  })

  test('Deveria repassar o error se o LoadAccountByTokenRepository lançar uma exceção', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => {
      throw new Error("");
    })
    const promise = sut.load('any_token', 'any_role')
    expect(promise).rejects.toThrow()
  })
})
