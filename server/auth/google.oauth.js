const router = require('express').Router();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const User = require('../api/users/user.model');

passport.use(new GoogleStrategy({
		clientID: '14340150421-94scpqdhkrfp1ckdu26akk68ne37hb7g.apps.googleusercontent.com',
		clientSecret: 'zK2qaKMmVe0GEvmGL1KrBuzZ',
		callbackURL: '/auth/google/callback'
	}, function (token, refreshToken, profile, done) {
	  // info provided to us:
	  const info = {
	      name: profile.displayName,
	      email: profile.emails[0].value,
	      photo: profile.photos ? profile.photos[0].value : undefined
	  }

	  User.findOrCreate({
      where: {
        googleId: profile.id
      },
      defaults: info
    })
    .spread(function (user) {
      done(null, user);
    })
    .catch(done);
	})
);

router.get('/', passport.authenticate('google', { scope: 'email' }));

router.get('/callback', passport.authenticate('google', {
	successRedirect: '/stories',
	failureRedirect: '/'
}));

module.exports = router;