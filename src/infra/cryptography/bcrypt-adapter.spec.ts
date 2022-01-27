import bcrypt from 'bcrypt'
import { BcryptAdapter } from './cryptography'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
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
  test('Deveria chamar o Bcrypt com o valor correto', async () => {
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

  test('Deveria repassar o error se o Bcrypt lançar uma exceção', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error("")
    })
    const promise = sut.hash('any_value')
    expect(promise).rejects.toThrow()
  })
})
