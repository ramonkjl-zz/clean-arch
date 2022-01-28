import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = () => {
  const sut = new RequiredFieldValidation('field')
  return { sut }
}

describe('Required Field Validation', () => {
  test('Deveria retornar um MissingParamError se a validação falhar', async () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Deveria não retornar nada se a validação não falhar', async () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
