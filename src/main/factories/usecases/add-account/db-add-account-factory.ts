import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccountUseCase } from '../../../../domain/usecases/add-account-usecase'
import { DbAddAccountUseCase } from '../../../../data/usecases/add-account/db-add-account-usecase'

export const makeDbAddAccountUseCase = (): AddAccountUseCase => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccountUseCase(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
