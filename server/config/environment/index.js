/* eslint no-process-env:0 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');
const shared = require('./shared');


/* function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
} */

// All configurations will extend these options
// ============================================

const root = path.normalize(`${__dirname}/../../..`);
if (!fs.existsSync(path.join(root, '.env'))) {
  fs.writeFileSync(path.join(root, '.env'), fs.readFileSync(path.join(root, '.env.sample')));
}

const env = dotenv.config({ path: path.join(root, '.env') }).parsed;
const all = {
  env: env.NODE_ENV,

  // Root path of server
  root,

  // dev client port
  clientPort: process.env.CLIENT_PORT || 3111,

  // Server port
  port: process.env.PORT || 9111,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'Wndh34Njdn4dssfd4sn$ds',
  },

  // MongoDB connection options
  mongo: {
    useMongoClient: true,
    uri: env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumeserver-dev?gssapiServiceName=mongodb/',
    options: {
      db: {
        safe: true,
      },
    },
  },
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  env,
  shared || {});
