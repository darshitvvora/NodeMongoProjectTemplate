// Generated on 2019-07-12 using generator-angular-fullstack 5.0.0-rc.4
import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import opn from 'opn';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import { Server as KarmaServer } from 'karma';
import runSequence from 'run-sequence';
import { protractor, webdriver_update } from 'gulp-protractor';
import { Instrumenter } from 'isparta';
import webpack from 'webpack';
import makeWebpackConfig from './webpack.make';

const plugins = gulpLoadPlugins();
let config;

const serverPath = 'server';
const paths = {
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`,
    ],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js'],
    },
  },
  karma: 'karma.conf.js',
  dist: 'dist',
};

/** ******************
 * Helper functions
 ******************* */

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
  const options = {
    host: 'localhost',
    port: config.port,
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  let serverReady = false;
  var appReadyInterval = setInterval(() =>
    checkAppReady((ready) => {
      if (!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
  100);
}

/** ******************
 * Reusable pipelines
 ******************* */

const lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const lintServerTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: [
      'node',
      'es6',
      'mocha',
    ],
  })
  .pipe(plugins.eslint.format);

const transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime',
    ],
  })
  .pipe(plugins.sourcemaps.write, '.');

const mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      './mocha.conf',
    ],
  });

const istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80,
      },
    },
    coverageDirectory: './coverage',
    rootDirectory: '',
  });

/** ******************
 * Env
 ******************* */

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig,
  });
});
gulp.task('env:test', () => {
  plugins.env({
    vars: { NODE_ENV: 'test' },
  });
});
gulp.task('env:prod', () => {
  plugins.env({
    vars: { NODE_ENV: 'production' },
  });
});

/** ******************
 * Tasks
 ******************* */

gulp.task('inject', (cb) => {
  runSequence(cb);
});



function webpackCompile(options, cb) {
  const compiler = webpack(makeWebpackConfig(options));

  compiler.run((err, stats) => {
    if (err) return cb(err);

    plugins.util.log(stats.toString({
      colors: true,
      timings: true,
      chunks: options.BUILD,
    }));
    cb();
  });
}

gulp.task('webpack:dev', cb => webpackCompile({ DEV: true }, cb));
gulp.task('webpack:dist', cb => webpackCompile({ BUILD: true }, cb));
gulp.task('webpack:test', cb => webpackCompile({ TEST: true }, cb));



gulp.task('transpile:server', () => gulp.src(_.union(paths.server.scripts, paths.server.json))
  .pipe(transpileServer())
  .pipe(gulp.dest(`${paths.dist}/${serverPath}`)));

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:server'], cb));


gulp.task('lint:scripts:server', () => gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => `!${blob}`)))
  .pipe(lintServerScripts()));

gulp.task('lint:scripts:serverTest', () => gulp.src(paths.server.test)
  .pipe(lintServerTestScripts()));


gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));


gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
  nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('watch', () => {
  const testFiles = _.union(paths.server.test.unit, paths.server.test.integration);

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts());

  plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber())
    .pipe(lintServerTestScripts());
});

gulp.task('serve', (cb) => {
  runSequence(
    [
      'lint:scripts',
      'env:all',
    ],
    // 'webpack:dev',
    ['start:server'],
    'watch',
    cb,
  );
});

gulp.task('serve:debug', (cb) => {
  runSequence(
    [
      'clean:tmp',
      'lint:scripts',
      'inject',
      'copy:fonts:dev',
      'env:all',
    ],
    'webpack:dev',
    ['start:server:debug'],
    'watch',
    cb,
  );
});

gulp.task('serve:dist', (cb) => {
  runSequence(
    'build',
    'env:all',
    'env:prod',
    ['start:server:prod'],
    cb);
});

gulp.task('test', cb => runSequence('test:server', cb));

gulp.task('test:server', (cb) => {
  runSequence(
    'env:all',
    'env:test',
    'mocha:unit',
    'mocha:integration',
    cb);
});

gulp.task('mocha:unit', () => gulp.src(paths.server.test.unit)
  .pipe(mocha()));

gulp.task('mocha:integration', () => gulp.src(paths.server.test.integration)
  .pipe(mocha()));

gulp.task('test:server:coverage', (cb) => {
  runSequence('coverage:pre',
    'env:all',
    'env:test',
    'coverage:unit',
    'coverage:integration',
    cb);
});

gulp.task('coverage:pre', () => gulp.src(paths.server.scripts)
// Covering files
  .pipe(plugins.istanbul({
    instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
    includeUntested: true,
  }))
// Force `require` to return covered files
  .pipe(plugins.istanbul.hookRequire()));

gulp.task('coverage:unit', () =>
  gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul()),
  // Creating the reports after tests ran
);

gulp.task('coverage:integration', () =>
  gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul()),
  // Creating the reports after tests ran
);

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);


/** ******************
 * Build
 ******************* */

gulp.task('build', (cb) => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp',
    ],
    'transpile:server',
    [
      'build:images',
    ],
    [
      'copy:extras',
      'copy:assets',
      'copy:fonts:dist',
      'copy:server',
      'webpack:dist',
    ],
    'revReplaceWebpack',
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));



/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
  return through2.obj(function (file, enc, next) {
    if (!file.isDirectory()) {
      try {
        const dir = path.dirname(file.relative).split(path.sep)[0];
        const fileName = path.normalize(path.basename(file.path));
        file.path = path.join(file.base, path.join(dir, fileName));
        this.push(file);
      } catch (e) {
        this.emit('error', new Error(e));
      }
    }
    next();
  });
}


gulp.task('copy:server', () => gulp.src([
  'package.json',
], { cwdbase: true })
  .pipe(gulp.dest(paths.dist)));

/** ******************
 * Grunt ported tasks
 ******************* */

grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%',
    },
    heroku: {
      options: {
        remote: 'heroku',
        branch: 'master',
      },
    },
    openshift: {
      options: {
        remote: 'openshift',
        branch: 'master',
      },
    },
  },
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', (done) => {
  grunt.tasks(
    ['buildcontrol:heroku'], // you can add more grunt tasks in this array
    { gruntfile: false }, // don't look for a Gruntfile - there is none. :-)
    () => { done(); },
  );
});
gulp.task('buildcontrol:openshift', (done) => {
  grunt.tasks(
    ['buildcontrol:openshift'], // you can add more grunt tasks in this array
    { gruntfile: false }, // don't look for a Gruntfile - there is none. :-)
    () => { done(); },
  );
});
