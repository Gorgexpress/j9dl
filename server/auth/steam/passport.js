import passport from 'passport';
import {Strategy as SteamStrategy} from 'passport-steam';

export function setup(User, config) {
  passport.use(new SteamStrategy({
    returnURL: config.steam.returnURL,
    realm: config.steam.realm,
    apiKey: config.steam.apiKey,
    passReqToCallback: true
  }, 
  function(req, identifier, profile, done) {
    User.findOne({'steam.id': profile.id}).exec()
      .then(user => {
        if (user) {
          req.session.userid = user._id;
          return done(null, user);
        }
        user = new User({
          provider: 'steam',
          steam: profile._json
        });
        req.session.userid = user.steam.steamid;
        user.save()
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
