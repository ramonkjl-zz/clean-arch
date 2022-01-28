import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = () => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}
let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Deveria retornar um account se o add der certo ', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Deveria retornar um account se o loadByEmail der certo', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account!.id).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('any_password')
  })

  test('Deveria retornar null se o loadByEmail retornar null', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Deveria atualizar accessToken do account se o updateAccessToken der certo', async () => {
    const { sut } = makeSut()
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const insertedAccount = await accountCollection.findOne({ _id: result.insertedId })
    expect(insertedAccount!.accessToken).toBeFalsy()
    await sut.updateAccessToken(insertedAccount!._id.toString(), 'any_token')
    const account = await accountCollection.findOne({ _id: insertedAccount?._id })
    expect(account).toBeTruthy()
    expect(account!.accessToken).toBe('any_token')
  })
})
