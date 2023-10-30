import { dbConnection } from '../DB/dbConnection.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import ErrorClass from './utils/errorClass.js'
import { errorHandel } from './utils/errorHandling.js'
import { allMessages } from './utils/localizationHelper.js'
import workspaceRouter from './modules/workspace/workspace.router.js'
import boardRouter from './modules/board/board.router.js'
import commentRouter from './modules/comment/comment.router.js'
import taskRouter from './modules/task/task.router.js'
import subtaskRouter from './modules/subtask/subtask.router.js'
import listRouter from './modules/list/list.router.js'


const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json({}))
    //*Setup API Routing
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use('/workspace',workspaceRouter)
    app.use('/board',boardRouter)
    app.use('/comment',commentRouter)
    app.use('/task',taskRouter)
    app.use('/subtask',subtaskRouter)
    app.use('/list',listRouter)
    app.all('*', (req, res, next) => {
        return next(new ErrorClass(allMessages.en.IN_VALID_URL))
    });
    
    app.use(errorHandel)
    dbConnection()
}


export default initApp