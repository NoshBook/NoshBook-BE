// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status);

  console.log(req.method + ' ' + req.originalUrl + ' had the following error: ');
  console.error(err.message);

  res.send({
    status,
    message: err.message,
  });
};
