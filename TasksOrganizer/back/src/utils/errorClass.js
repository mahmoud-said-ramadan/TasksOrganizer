import { allMessages } from "./localizationHelper.js";

class ErrorClass extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.error = allMessages.en.ERROR
    }
}
export default ErrorClass