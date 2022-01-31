import { AddSurveyModel } from '../../../domain/usecases/add-survey-usecase'
import { AddSurveyRepository } from '../../../data/protocols/db/survey/add-survey-repository'
import { DbAddSurveyUseCase } from './db-add-survey-usecase'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {

    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = () => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurveyUseCase(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  test('Deveria chamar AddSurveyRepository com os valores corretos', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSurveyRepositoryStub.add).toBeCalledWith(surveyData)
  })

  test('Deveria repassar o error se o AddSurveyRepository lançar uma exceção', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error("");
    })
    const surveyData = makeFakeSurveyData()
    const promise = sut.add(surveyData)
    expect(promise).rejects.toThrow()
  })
})
