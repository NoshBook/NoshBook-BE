const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Check for the session cookie
    const cookie = req.cookies.session;

    // verify its contents using jsonwebtoken
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);

    // then assign the payload to req.user
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
