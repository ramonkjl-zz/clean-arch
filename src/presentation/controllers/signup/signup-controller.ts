import { AddAccountUseCase } from '../../../domain/usecases/add-account-usecase'
import { badRequest, created, forbidden, serverError } from '../../helpers/http-helpers'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { AuthenticationUseCase } from '../../../domain/usecases/authentication-usecase'
import { EmailInUseError } from '../../errors/email-in-use-error'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation,
    private readonly authenticationUseCase: AuthenticationUseCase
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccountUseCase.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const accessToken = await this.authenticationUseCase.auth({ email, password })
      return created({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
