import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { makeSignInValidation } from './signin-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignIn Validation Factory', () => {
  test('Deveria chamar o ValidationComposite com todos os Validations', async () => {
    makeSignInValidation()
    const validations: Array<Validation> = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
