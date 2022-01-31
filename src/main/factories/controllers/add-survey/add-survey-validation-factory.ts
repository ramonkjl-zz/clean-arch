import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeAddSurveyValidation = () => {
  const validations: Array<Validation> = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
