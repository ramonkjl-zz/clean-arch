import { SignUpController } from '../../presentation/controllers/login/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccountUseCase } from '../../data/usecases/add-account/db-add-account-usecase'
import { BcryptAdapter } from '../../infra/cryptography/cryptography'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols/controller'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const bbAddAccountUseCase = new DbAddAccountUseCase(bcryptAdapter, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(emailValidatorAdapter, bbAddAccountUseCase, validationComposite)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
