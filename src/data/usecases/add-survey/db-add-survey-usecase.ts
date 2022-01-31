import { AddSurveyModel, AddSurveyUseCase } from '../../../domain/usecases/add-survey-usecase'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository';

export class DbAddSurveyUseCase implements AddSurveyUseCase {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) { }

  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
