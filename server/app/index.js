'use strict'; 

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');
const passport = require('passport');

app.use(require('./logging.middleware'));
app.use(require('./request-state.middleware'));
app.use(require('./statics.middleware'));

var session = require('express-session');

app.use(session({
  secret: 'supersecret'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    // this happens once, when user logs in
    // in this context, `done` adds some info about user to the session
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    // this happens anytime a user makes a request
    // `done` here adds user info to the request object
    User.findById(id)
    .then(function(user){
        done(null, user);
    })
    .catch(done);
});

app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use('/api', require('../api/api.router'));

app.use('/auth', require('../auth'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;
