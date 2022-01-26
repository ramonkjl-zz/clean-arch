import { Authentication } from '../../../../domain/usecases/authentication-usecase'
import { InvalidPramError } from '../../../errors/invalid-param-error'
import { MissingParamError } from '../../../errors/missing-param-error'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http-helpers'
import { Validation } from '../../../helpers/validators/validation'
import { SignInController } from './signin-controller'

const makeFakeBodyRequest = () => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

const makeValidationStub = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeAuthentication = () => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeSut = () => {
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthentication()
  const sut = new SignInController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Sign In Controller', () => {
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
    expect(authenticationStub.auth).toBeCalledWith('any_email@mail.com', 'any_password')
  })

  test('Deveria retornar 401 se as credenciais forem inválidas', async () => {
    const { sut, authenticationStub } = makeSut()
    // @ts-ignore
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
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

  test('Deveria retornar 200 se as credenciais forem válidas', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
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
})
