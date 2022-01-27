import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel, AddAccountUseCase } from '../../../../domain/usecases/add-account-usecase'
import { MissingParamError } from '../../../errors/missing-param-error'
import { ServerError } from '../../../errors/server-error'
import { badRequest } from '../../../helpers/http-helpers'
import { Validation } from '../../../protocols/validation'
import { SignUpController } from './signup-controller'

const makeFakeBodyRequest = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccountUseCase {
    async add(account: AddAccountModel): Promise<AccountModel> {
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
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
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

  test('Deveria retornar um statusCode 200 se os dados forem válidos', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { ...makeFakeBodyRequest() }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
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
