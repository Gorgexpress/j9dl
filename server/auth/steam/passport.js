import passport from 'passport';
import {Strategy as SteamStrategy} from 'passport-steam';

export function setup(User, Rating, config) {
  passport.use(new SteamStrategy({
    returnURL: config.steam.returnURL,
    realm: config.steam.realm,
    apiKey: config.steam.apiKey,
    passReqToCallback: true
  }, 
  function(req, identifier, profile, done) {
    User.findOne({'steam.steamid': profile.id}).exec()
      .then(user => {
        if (user) {
          req.session.userid = user.id;
          req.session.name = profile.displayName;
          return done(null, user);
        }
        user = new User({
          provider: 'steam',
          steam: {
            steamid: profile._json.steamid,
            avatar: profile._json.avatar,
            profileurl: profile._json.profileurl
          }
        });
        req.session.userid = user.id;
        req.session.name = profile.displayName;
        let rating = new Rating({userid: user.id});
        rating.save()
          .then( () =>  {
            user.save()
            .then(user => done(null, user))
            .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
