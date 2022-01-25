import { AddAccountUseCase } from '../../../../domain/usecases/add-account-usecase'
import { InvalidPramError } from '../../../errors/invalid-param-error'
import { badRequest, created, serverError } from '../../../helpers/http-helpers'
import { Validation } from '../../../helpers/validators/validation'
import { Controller } from '../../../protocols/controller'
import { EmailValidator } from '../../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidPramError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValidEmail) {
        return badRequest(new InvalidPramError('email'))
      }

      const account = await this.addAccountUseCase.add({
        name,
        email,
        password
      })

      return created(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
