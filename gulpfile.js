const gulp = require('gulp');
const pump = require('pump');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');
const jsdocConfig = require('./jsdoc.json');

const sourceJs = ['./server/**/*.js'];
const sourceDoc = sourceJs.concat(['./jsdoc-externals.js', 'README.md']);
const pumpPromise = streams => new Promise((resolve, reject) => {
  pump(streams, (err) => {
    if (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      reject(err);
    } else resolve();
  });
});

gulp.task('doc', (cb) => {
  gulp.src(sourceDoc, { read: false })
    .pipe(plugins.jsdoc3(jsdocConfig, cb));
});

// validates js files
gulp.task('lint', () => pumpPromise([
  gulp.src(sourceJs),
  plugins.eslint(),
  plugins.eslint.format('stylish'),
  plugins.eslint.failAfterError(),
]));

// watch files for reload in dev mode
gulp.task('watch', () => {
  gulp.watch(sourceDoc, ['doc']);
});
