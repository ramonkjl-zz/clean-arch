import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  }
}))

const makeSut = () => {
  const sut = new JWTAdapter('secret')
  return {
    sut
  }
}

describe('JWT Adapter', () => {
  test('Deveria chamar sign com os valores corretos', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(jwt.sign).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Deveria retornar um token se o sign der certo', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('Deveria retornar uma exceção se o sign retornar uma exceção', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error("") })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
