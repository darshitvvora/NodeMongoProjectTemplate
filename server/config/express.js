/**
 * Express configuration
 */

const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const path = require('path');
const lusca = require('lusca');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./environment');
const MongoStore = connectMongo(session);

module.exports = function (app) {
  const env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(morgan('dev'));
    app.use(require('cors')());
  }

  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }

  // - only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use\, custom Nginx setup)
  app.enable('trust proxy');
  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  if (env === 'production') {
    app.use('/', expressStaticGzip(app.get('appPath')));
  }

  app.set('views', `${config.root}/server/views`);
  app.set('view engine', 'pug');
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(methodOverride());
  app.use(cookieParser());


  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'resumedb',
    }),
  }));

  /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
  if (env !== 'test' && env !== 'development') {
    app.use(lusca({
      csrf: {
        header: 'x-xsrf-token',
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, // 1 year, in seconds
        includeSubDomains: true,
        preload: true,
      },
      xssProtection: true,
    }));
  }

  if (env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
