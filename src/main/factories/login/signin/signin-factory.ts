import { DbAuthenticationUseCase } from '../../../../data/usecases/authentication/db-authentication'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { SignInController } from '../../../../presentation/controllers/login/signin/signin-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = (): Controller => {
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthenticationUseCase(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validationComposite = makeSignInValidation()
  const signInController = new SignInController(dbAuthentication, validationComposite)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signInController, logMongoRepository)
}
