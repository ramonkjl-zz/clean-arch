import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  test('Deveria chamar sign com os valores corretos', async () => {
    const sut = new JWTAdapter('secret')
    jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(jwt.sign).toBeCalledWith({ id: 'any_id' }, 'secret')
  })
})
