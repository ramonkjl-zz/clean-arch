import { InvalidPramError } from '../../presentation/errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '../../presentation/protocols/validation'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) { }

  validate(input: any): Error | undefined {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) {
      return new InvalidPramError(this.fieldName)
    }
  }
}
