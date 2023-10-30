import userModel from '../../../../DB/Models/User.model.js'
import { StatusCodes } from 'http-status-codes'
import { compare } from '../../../utils/HashAndCompare.js'
import ErrorClass from '../../../utils/errorClass.js'
import { generateToken } from '../../../utils/GenerateAndVerifyToken.js'
import { asyncErrorHandler } from '../../../utils/errorHandling.js'

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email })
  if (!user) {
    return next(new ErrorClass('In-valid login data', StatusCodes.NOT_FOUND))
  }
  // Check confirm email
  if (!user.confirmed) {
    return next(
      new ErrorClass('You have to confirm your Email', StatusCodes.BAD_REQUEST)
    )
  }
  // Check password
  const match = compare({ plaintext: password, hashValue: user.password })
  if (!match) {
    return next(new ErrorClass('In-valid login data', StatusCodes.BAD_REQUEST))
  }
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email }
  })
  const refreshToken = generateToken(
    { payload: { id: user._id, email: user.email } },
    { expiresIn: 60 * 60 * 24 * 30 * 2 }
  )
  user.loggedIn = true
  await user.save()
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', accessToken, refreshToken })
})
