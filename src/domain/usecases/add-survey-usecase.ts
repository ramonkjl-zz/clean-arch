export type AddSurveyModel = {
  question: string
  answers: Array<SurveyAnswer>
}

export type SurveyAnswer = {
  image?: string
  answer: string
}

export interface AddSurveyUseCase {
  add(data: AddSurveyModel): Promise<void>
}
