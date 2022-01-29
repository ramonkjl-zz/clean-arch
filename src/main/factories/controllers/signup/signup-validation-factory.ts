import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignUpValidation = () => {
  const validations: Array<Validation> = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  const validationComposite = new ValidationComposite(validations)
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return validationComposite
}
