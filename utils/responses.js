const Response = {
  fieldAddedSuccessResponse: id => ({
    code: 200,
    id,
    message: 'Field added successfully',
    date: new Date().getTime()
  }),
  fieldAddedErrorResponse: errorMessage => ({
    code: 400,
    message: errorMessage || 'Error adding field',
    date: new Date().getTime()
  }),

  code: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQUES_TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500
  }
};

module.exports = Response;
