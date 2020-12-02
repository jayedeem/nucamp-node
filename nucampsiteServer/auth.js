function auth(req, res, next) {
  console.log('auth', req.user);

  if (!req.user) {
    const err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
}

module.exports = auth;
