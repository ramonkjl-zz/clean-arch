import { Authentication } from '../../../../domain/usecases/authentication-usecase'
import { InvalidPramError } from '../../../errors/invalid-param-error'
import { MissingParamError } from '../../../errors/missing-param-error'
import { badRequest, ok, serverError, unauthorized, } from '../../../helpers/http-helpers'
import { Controller } from '../../../protocols/controller'
import { EmailValidator } from '../../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid)
        return badRequest(new InvalidPramError('email'))

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken)
        return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
