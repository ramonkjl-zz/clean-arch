import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignInValidation = () => {
  const validations: Array<Validation> = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
