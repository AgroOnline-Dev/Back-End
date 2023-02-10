class CustomAPIError extends Error {
<<<<<<< HEAD
  constructor(message) {
    super(message);
=======
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
>>>>>>> working on signIn
  }
}

module.exports = CustomAPIError;
