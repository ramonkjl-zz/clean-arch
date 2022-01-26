import { AddAccountUseCase } from '../../../../domain/usecases/add-account-usecase'
import { badRequest, created, serverError } from '../../../helpers/http-helpers'
import { Validation } from '../../../helpers/validators/validation'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly validation: Validation
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

      return created(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
