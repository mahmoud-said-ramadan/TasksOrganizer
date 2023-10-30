import { Router } from 'express'
import { fileUpload, filesValidation } from '../../utils/multer.js'
import { asyncErrorHandler } from '../../utils/errorHandling.js'
import { auth, roles } from '../../middleware/auth.js'
import addTask_SubtaskController from '../commonController/add-task-subtask.js'
import updateTask_SubtaskController from '../commonController/update-task-subtask.js'
import { deleteTask } from './controller/deleteTask.js'

const router = Router()

router.post(
  '/add',
  auth(Object.values(roles).join()),
  fileUpload(filesValidation.image).fields([
    {
      name: 'coverImage',
      maxCount: 1
    },
    {
      name: 'attachment',
      maxCount: 1
    }
  ]),
  addTask_SubtaskController
)

router.put(
  '/update/:id',
  auth(Object.values(roles).join()),
  fileUpload(filesValidation.image).fields([
    {
      name: 'coverImage',
      maxCount: 1
    },
    {
      name: 'attachment',
      maxCount: 1
    }
  ]),
  updateTask_SubtaskController
)

router.delete(
  '/delete/:listId/:taskId',
  auth(Object.values(roles).join()),
  asyncErrorHandler(deleteTask)
)
export default router
