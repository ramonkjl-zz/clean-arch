import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel, AddAccountUseCase } from '../../../../domain/usecases/add-account-usecase'
import { InvalidPramError } from '../../../errors/invalid-param-error'
import { MissingParamError } from '../../../errors/missing-param-error'
import { ServerError } from '../../../errors/server-error'
import { EmailValidator } from '../../../protocols/email-validator'
import { SignUpController } from './signup-controller'

const makeFakeBodyRequest = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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

const makeSut = () => {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Deveria retornar um statusCode 400 se o nome não for passado', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest(),
        name: null
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Deveria retornar um statusCode 400 se o email não for passado', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest(),
        email: null
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Deveria retornar um statusCode 400 se o password não for passado', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest(),
        password: null
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Deveria retornar um statusCode 400 se o passwordConfirmation não for passado', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest(),
        passwordConfirmation: null
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Deveria retornar um statusCode 400 se o password e o passwordConfirmation não forem iguais', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest(),
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidPramError('passwordConfirmation'))
  })

  test('Deveria retornar um statusCode 400 se o email não for válido', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        ...makeFakeBodyRequest()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(emailValidatorStub.isValid).toBeCalledWith('any_email@mail.com')
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidPramError('email'))
  })

  test('Deveria retornar um statusCode 500 se o EmailValidador retorna uma exceção', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
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
})
