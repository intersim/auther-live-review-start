var express = require('express');
var router = express.Router();
var User = require('../api/users/user.model');
module.exports = router;

router.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
      res.json(user);
    }
  });
});

router.get('/logout', function (req, res, next) {
  delete req.session.userId;
  res.sendStatus(204);
});

router.post('/signup', function (req, res, next) {

  User.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      password: req.body.password
    }
  })
  .spread(function (user) {
    req.session.userId = user.id;
    res.json(user);
  })
  .catch(next);

});

router.get('/me', function (req, res, next) {
  if (req.user) {
    res.json(req.user)
  } else {
    res.sendStatus(401);
  }
});

router.use('/google', require('./google.oauth'));