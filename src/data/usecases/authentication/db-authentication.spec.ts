import { AccountModel } from '../../../domain/models/account-model'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { Encrypter } from '../../protocols/cryptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { DbAuthenticationUseCase } from './db-authentication'

const makeFakeAccountModel = () => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthenticationModel = () => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return makeFakeAccountModel()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = () => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = () => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Deveria chamar o LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationModel())
    expect(loadAccountByEmailRepositoryStub.loadByEmail).toBeCalledWith('any_email@mail.com')
  })

  test('Deveria retornar uma exceção se o LoadAccountByEmailRepository retornar uma exceção', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  test('Deveria retornar null se o LoadAccountByEmailRepository retornar null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBeNull()
  })

  test('Deveria chamar o HashComparer com os valores corretos', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(hashComparerStub.compare).toBeCalledWith('any_password', 'hashed_password')
  })

  test('Deveria retornar uma exceção se o HashComparer retornar uma exceção', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  test('Deveria retornar null se o HashComparer retornar false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBeNull()
  })

  test('Deveria chamar o Encrypter com o id correto', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())
    expect(encrypterStub.encrypt).toBeCalledWith('valid_id')
  })

  test('Deveria retornar uma exceção se o Encrypter retornar uma exceção', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  test('Deveria chamar o Encrypter com o id correto', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBe('any_token')
  })

  test('Deveria chamar o UpdateAccessTokeRepository com os valores corretos', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthenticationModel())
    expect(updateAccessTokenRepositoryStub.updateAccessToken).toBeCalledWith('valid_id', 'any_token')
  })

  test('Deveria retornar uma exceção se o UpdateAccessTokenRepository retornar uma exceção', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })
})
