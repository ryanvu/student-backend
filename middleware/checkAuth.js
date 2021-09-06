const checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send(403).json({
      isAuth: false,
      message: "Unauthorized",
    });
  }
};

module.exports = checkAuth;
