import { Collection } from 'mongodb'
import request from 'supertest'
import bcrypt from 'bcrypt'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Deveria retornar 201 der certo', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Ramon',
          email: 'ramon@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(201)
    })
  })

  describe('POST /signin', () => {
    test('Deveria retornar 200 der certo', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Ramon',
        email: 'ramon@mail.com',
        password
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'ramon@mail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Deveria retornar 401 der certo', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'ramon@mail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
