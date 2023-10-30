import { Router } from 'express'
import { fileUpload, filesValidation } from '../../utils/multer.js'
import { asyncErrorHandler } from '../../utils/errorHandling.js'
import addTask_SubtaskController from '../commonController/add-task-subtask.js'
import { auth, roles } from '../../middleware/auth.js'
import { deleteSubTask } from './controller/deleteSubtask.js'
import updateTask_SubtaskController from '../commonController/update-task-subtask.js'

const router = Router()

router.post(
  '/add',
  auth(Object.values(roles).join()),
  fileUpload(filesValidation.image).fields([
    {
      name: 'attachment',
      maxCount: 1
    }
  ]),
  addTask_SubtaskController
)

router.delete(
  '/delete/:taskId/:subtaskId',
  auth(Object.values(roles).join()),
  asyncErrorHandler(deleteSubTask)
)
router.put(
  '/update/:id',
  auth(Object.values(roles).join()),
  fileUpload(filesValidation.image).fields([
    {
      name: 'attachment',
      maxCount: 1
    }
  ]),
  updateTask_SubtaskController
)
export default router
