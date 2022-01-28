import { Router } from 'express'
import { makeSignUpController } from '../factories/login/signup/signup-factory'
import { adaptRoute } from '../adapters/express/express-routes-adapter'


export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
