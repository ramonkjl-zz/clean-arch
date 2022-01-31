import { AddSurveyUseCase } from '../../../../domain/usecases/add-survey-usecase'
import { badRequest, noContent, serverError } from '../../../helpers/http-helpers'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurveyUseCase: AddSurveyUseCase
  ) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const error = this.validation.validate(httpRequest.body)
      if (error)
        return badRequest(error)

      const { question, answers } = httpRequest.body
      await this.addSurveyUseCase.add({
        question,
        answers
      })

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}