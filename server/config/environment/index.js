import _ from 'lodash';

let localEnv;
try {
  localEnv = require('../local.env').default;
} catch(e) {
  localEnv = {};
}

_.forEach(localEnv, (value, key) => {
  process.env[key] = value;
});

var all = {
  env: process.env.NODE_ENV || 'production',

  steam: {
    returnURL: process.env.STEAM_RETURNURL || 'http://localhost:3000/auth/steam/callback',
    realm: process.env.REALM || 'http://localhost:3000/',
    apiKey: process.env.STEAM_APIKEY || null
  },

  secrets: {
    session: process.env.SESSION_SECRET || 'secret'
  },

  lobbySize: process.env.NODE_ENV !== 'test' ? 10 : 4

};

export default all;

