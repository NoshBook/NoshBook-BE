module.exports = (message, statusCode) => {
  const error = new Error(message);
  error.code = statusCode;
  throw error;
};
