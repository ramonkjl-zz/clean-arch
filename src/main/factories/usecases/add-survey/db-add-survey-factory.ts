import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey-repository/survey-mongo-repository'
import { DbAddSurveyUseCase } from '../../../../data/usecases/add-survey/db-add-survey-usecase'
import { AddSurveyUseCase } from '../../../../domain/usecases/add-survey-usecase'

export const makeDbAddSurveyUseCase = (): AddSurveyUseCase => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurveyUseCase(surveyMongoRepository)
}
