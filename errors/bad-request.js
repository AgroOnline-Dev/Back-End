const CustomAPIError = require("./custom-error");

class BadRequest extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
  }
}

module.exports = CustomAPIError;
