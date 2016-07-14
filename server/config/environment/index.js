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
  steam: {
    returnURL: process.env.STEAM_RETURNURL || 'http://localhost:3000/auth/steam/return',
    realm: process.env.REALM || 'http://localhost:3000/',
    apiKey: process.env.STEAM_APIKEY || null
  },

  secrets: {
    session: process.env.SESSION_SECRET || 'secret'
  }

};

export default all;

