/**
 *
 * @param {string} message
 * @param {number} statusCode
 * @param {boolean} isThrow defaults to False.
 * @returns {error} returns an error object by default.
 */
module.exports = (message, statusCode, isThrow = false) => {
  const error = new Error(message);
  error.code = statusCode;
  if (isThrow) {
    throw error;
  } else {
    return error;
  }
};
