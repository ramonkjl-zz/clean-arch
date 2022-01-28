import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = () => {
  const sut = new EmailValidatorAdapter()

  return {
    sut
  }
}

describe('EmailValidator Adapter', () => {
  test('Deveria retornar false se o Validator retornar false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Deveria retornar true se o Validator retornar true', () => {
    const { sut } = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Deveria chamar o Validator com o email correto', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')
    expect(validator.isEmail).toBeCalledWith('any_email@mail.com')
  })
})
