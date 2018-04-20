const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const surge = require('gulp-surge')
const uglify = require('gulp-uglify')

gulp.task('browser-sync', () =>
  browserSync.init({
    server: 'dest'
  })
)

gulp.task('build', callback =>
  runSequence('clean', 'source', 'public', callback)
)

gulp.task('clean', () =>
  del('dest')
)

gulp.task('default', callback =>
  runSequence('build', 'watch', callback)
)

gulp.task('public', () =>
  gulp.src('public/**/*')
    .pipe(gulp.dest('dest'))
)

gulp.task('scripts', () =>
  gulp.src([
    'node_modules/what-input/dist/what-input.js',
    'src/scripts/*.js'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(babel({
        only: ['src/scripts/*.js'],
        presets: ['env']
      }))
      .pipe(concat('index.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dest/scripts'))
    .on('end', browserSync.reload)
)

gulp.task('source', ['scripts', 'stylesheets', 'templates'])

gulp.task('stage', callback =>
  runSequence('build', 'surge', callback)
)

gulp.task('stylesheets', () =>
  gulp.src('src/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
        precision: 10
      }))
      .pipe(autoprefixer())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dest/stylesheets'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }))
)

gulp.task('surge', () =>
  surge({
    project: 'dest',
    domain: 'commonwealth-bank-financial-planning-infographic.surge.sh'
  })
)

gulp.task('templates', () =>
  gulp.src('src/templates/*.njk')
    .pipe(plumber())
    .pipe(nunjucks.compile())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dest'))
    .on('end', browserSync.reload)
)

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch('src/scripts/**/*.js', ['scripts'])
  gulp.watch('src/stylesheets/**/*.scss', ['stylesheets'])
  gulp.watch('src/templates/**/*.njk', ['templates'])
})
