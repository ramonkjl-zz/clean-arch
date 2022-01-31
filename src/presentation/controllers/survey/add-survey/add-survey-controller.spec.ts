import { AddSurveyController } from './add-survey-controller'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { badRequest, noContent, serverError } from '../../../helpers/http-helpers'
import { AddSurveyModel, AddSurveyUseCase } from '../../../../domain/usecases/add-survey-usecase'

const makeFakeReques = (): HttpRequest => ({
  body: {
    question: '',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = () => {
  class AddSurveyStub implements AddSurveyUseCase {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

const makeSut = () => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  test('Deveria chamar o Validation com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeReques()
    await sut.handle(httpRequest)
    expect(validationStub.validate).toBeCalledWith(httpRequest.body)
  })

  test('Deveria retornar 400 se o Validation falhar', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeReques()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Deveria chamar o AddSurvey com os valores corretos', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeReques()
    await sut.handle(httpRequest)
    expect(addSurveyStub.add).toBeCalledWith(httpRequest.body)
  })

  test('Deveria retornar 500 se o AddSurvey retornar um erro', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeReques()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Deveria retornar 204 se tudo der certo', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeReques()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
