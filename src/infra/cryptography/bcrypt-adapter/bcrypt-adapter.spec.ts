import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
  },
  async compare(): Promise<boolean> {
    return true
  }
}))

const salt = 12
const makeSut = () => {
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Deveria chamar o hash com o valor correto', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(bcrypt.hash).toBeCalledWith('any_value', salt)
  })

  test('Deveria retornar uma hash se der tudo certo', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash')
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Deveria repassar o error se o hash lançar uma exceção', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.hash('any_value')
    expect(promise).rejects.toThrow()
  })

  test('Deveria chamar o compare com os valores corretos', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.compare).toBeCalledWith('any_value', 'any_hash')
  })

  test('Deveria retornar true se o compare der certo', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Deveria retornar false se o compare retornar false', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Deveria repassar o error se o compare lançar uma exceção', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.compare('any_value', 'any_hash')
    expect(promise).rejects.toThrow()
  })
})
