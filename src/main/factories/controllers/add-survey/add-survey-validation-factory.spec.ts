import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Deveria chamar o ValidationComposite com todos os Validations', async () => {
    makeAddSurveyValidation()
    const validations: Array<Validation> = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
