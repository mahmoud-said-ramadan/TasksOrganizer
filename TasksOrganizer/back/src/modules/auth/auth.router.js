import { Router } from 'express'
const router = Router()
import { signup } from './controller/signup.js'
import { login } from './controller/login.js'
import * as validators from './auth.validation.js'
import { validation } from '../../middleware/validation.js'
import { confirm } from './controller/confirm.js'
import { generateConfirmation } from './controller/generateConfirmation.js'

router.post('/signup', validation(validators.signup), signup)
router.post('/login', validation(validators.login), login)
router.post('/confirm', validation(validators.confirm), confirm)
router.post('/changeEmail/confirm', validation(validators.confirm), confirm)
router.post('/reset-password', validation(validators.reset), confirm)
router.post(
  '/newConfirm',
  validation(validators.generate),
  generateConfirmation
)
router.post(
  '/forget-password',
  validation(validators.generate),
  generateConfirmation
)
router.post(
  '/unsubscribe',
  validation(validators.generate),
  generateConfirmation
)

export default router
