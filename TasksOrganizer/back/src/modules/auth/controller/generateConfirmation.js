import { generateConfirmCode } from "../../../utils/code.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";

export const generateConfirmation = asyncErrorHandler(
  async (req, res, next) => {
    const codeStatus = await generateConfirmCode(req);
    if (codeStatus.error) {
      return next(
        new ErrorClass(codeStatus.error.message, codeStatus.error.statusCode)
      );
    }
    return res.status(202).json({
      message: "Code Sent!... Please Check Your inbox!",
    });
  }
);
