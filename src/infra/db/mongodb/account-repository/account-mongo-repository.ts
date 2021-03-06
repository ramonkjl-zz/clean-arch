import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account-usecase'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const insertedAccount = await accountCollection.findOne({ _id: new ObjectId(result.insertedId.toString()) })
    return MongoHelper.map<AccountModel>(insertedAccount)
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map<AccountModel>(account)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const _id = new ObjectId(id)
    await accountCollection.updateOne(
      { _id },
      {
        $set: {
          accessToken: token
        }
      })
  }
}
