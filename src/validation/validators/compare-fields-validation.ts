import { InvalidPramError } from '../../presentation/errors/invalid-param-error'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) { }

  validate(input: any): Error | undefined {
    if (input[this.fieldName] !== input[this.fieldToCompareName])
      return new InvalidPramError(this.fieldToCompareName)
  }
}
