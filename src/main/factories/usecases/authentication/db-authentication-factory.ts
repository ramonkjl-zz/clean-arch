import { DbAuthenticationUseCase } from '../../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'
import { AuthenticationUseCase } from '../../../../domain/usecases/authentication-usecase'

export const makeDbAuthenticationUseCase = (): AuthenticationUseCase => {
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthenticationUseCase(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
