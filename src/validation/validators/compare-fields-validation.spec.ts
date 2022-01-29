import { InvalidPramError } from '../../presentation/errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = () => {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare')
  return { sut }
}

describe('Compare Fields Validation', () => {
  test('Deveria retornar um InvalidParamError se a validação falhar', async () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidPramError('fieldToCompare'))
  })

  test('Deveria não retornar nada se a validação não falhar', async () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(error).toBeFalsy()
  })
})
