import { SignUpController } from '../../../../presentation/controllers/login/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthenticationUseCase } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccountUseCase } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccountUseCase(), makeSignUpValidation(), makeDbAuthenticationUseCase())
  return makeLogControllerDecorator(controller)
}
