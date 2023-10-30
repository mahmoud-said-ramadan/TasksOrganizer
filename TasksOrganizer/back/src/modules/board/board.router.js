import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import { fileUpload, filesValidation } from '../../utils/multer.js'
import * as validators from './board.validation.js'
import { validation } from '../../middleware/validation.js'
import { boardEndPoint } from './board.endPoint.js'
import { create } from '../commonController/create.js'
import { update } from '../commonController/update.js'
import { get } from '../commonController/get.js'
import addMemberController from '../commonController/addMember.js'
import deleteMemberController from '../commonController/deleteMember.js'

const router = Router()

router.get('/', validation(validators.get), auth(boardEndPoint.getBoard), get)

router.post(
  '/',
  auth(boardEndPoint.AddBoard),
  fileUpload(filesValidation.image).fields([
    { name: 'coverImages', maxCount: 5 }
  ]),
  validation(validators.createBoard),
  create
)

router.put(
  '/:id',
  auth(boardEndPoint.UpdateBoard),
  fileUpload(filesValidation.image).fields([
    { name: 'coverImages', maxCount: 5 }
  ]),
  validation(validators.updateBoard),
  update
)

router.patch(
  '/add-member/:id',
  auth(boardEndPoint.deleteMember),
  validation(validators.addOrDeleteMember),
  addMemberController
)

router.delete(
  '/delete-member/:id',
  auth(boardEndPoint.deleteMember),
  validation(validators.addOrDeleteMember),
  deleteMemberController
)
export default router
