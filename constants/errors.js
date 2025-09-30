/* eslint-disable max-classes-per-file */
const httpCodes = require("./http-codes");

class ApiError extends Error {
  constructor(message) {
    super();
    this.http_code = httpCodes.INTERNAL_ERROR;
    this.error_code = "INTERNAL_ERROR";
    this.message = message || "Internal unexpected server error";
  }
}

class BadRequest extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.BAD_REQUEST;
    this.error_code = "BAD_REQUEST";
    this.message = message || "Malformed request syntax";
  }
}

class Unauthorized extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.UNAUTHORIZED;
    this.error_code = "UNAUTHORIZED";
    this.message = message || "Unauthorized request";
  }
}

class Forbidden extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.FORBIDDEN;
    this.error_code = "FORBIDDEN";
    this.message = message || "Not enough permission to access this resource";
  }
}

class NotFound extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.NOT_FOUND;
    this.error_code = "NOT_FOUND";
    this.message =
      message || "The requested entity is unavailable or doesn't exist";
  }
}

class UnprocessableEntity extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.UNPROCESSABLE_ENTITY;
    this.error_code = "UNPROCESSABLE_ENTITY";
    this.message = message || "Illegal request params values";
  }
}

class TooManyRequests extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.TOO_MANY_REQUESTS;
    this.error_code = "TOO_MANY_REQUESTS";
    this.message = message || "Too many requests to access this resource";
  }
}

class InternalError extends ApiError {
  constructor(message) {
    super();
    this.http_code = httpCodes.INTERNAL_ERROR;
    this.error_code = "INTERNAL_ERROR";
    this.message = message || "Internal unexpected server error";
  }
}

module.exports = {
  ApiError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  UnprocessableEntity,
  TooManyRequests,
  InternalError,
};
