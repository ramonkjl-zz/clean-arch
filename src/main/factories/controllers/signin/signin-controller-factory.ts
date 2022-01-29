import { SignInController } from '../../../../presentation/controllers/signin/signin-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignInValidation } from './signin-validation-factory'
import { makeDbAuthenticationUseCase } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeDbAuthenticationUseCase(), makeSignInValidation())
  return makeLogControllerDecorator(controller)
}
