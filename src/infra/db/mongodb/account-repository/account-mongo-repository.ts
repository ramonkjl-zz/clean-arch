import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account-usecase'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const insertedAccount = await accountCollection.findOne({ _id: new ObjectId(result.insertedId.toString()) })
    return MongoHelper.map<AccountModel>(insertedAccount)
  }
}
