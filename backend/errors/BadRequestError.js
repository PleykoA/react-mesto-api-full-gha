class BadRequestError extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
