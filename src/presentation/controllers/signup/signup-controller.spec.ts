import { AccountModel } from '../../../domain/models/account-model'
import { AddAccountModel, AddAccountUseCase } from '../../../domain/usecases/add-account-usecase'
import { AuthenticationModel, AuthenticationUseCase } from '../../../domain/usecases/authentication-usecase'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { EmailInUseError } from '../../errors/email-in-use-error'
import { badRequest, created, forbidden, serverError } from '../../helpers/http-helpers'
import { Validation } from '../../protocols/validation'
import { SignUpController } from './signup-controller'

const makeFakeBodyRequest = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const makeAuthentication = () => {
  class AuthenticationStub implements AuthenticationUseCase {
    async auth(authenticationModel: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccountUseCase {
    async add(account: AddAccountModel): Promise<AccountModel | null> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeValidationStub = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeSut = () => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Deveria chamar AddAccount com os valores corretos', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest()
      }
    }
    await sut.handle(httpRequest)
    expect(addAccountStub.add).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Deveria retornar um statusCode 500 se o AddAccountUseCase retorna uma exceção', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error("");
    })
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deveria retornar um statusCode 403 se o AddAccount retornar null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => null)
    const httpRequest = {
      body: { ...makeFakeBodyRequest() }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Deveria retornar um statusCode 200 se os dados forem válidos', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { ...makeFakeBodyRequest() }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created({ accessToken: 'any_token' }))
  })

  test('Deveria chamar o Validation com os valor correto', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest()
      }
    }
    await sut.handle(httpRequest)
    expect(validationStub.validate).toBeCalledWith(httpRequest.body)
  })

  test('Deveria retornar um statusCode 400 se o Validation retornar um error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = {
      body: { ...makeFakeBodyRequest() }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Deveria chamar o Authentication com os valores corretos', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authenticationStub.auth).toBeCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Deveria retornar 500 se o Authentication retornar uma exceção', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
