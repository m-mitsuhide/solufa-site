var gulp = require('gulp');
var JSON5 = require('json5');
var fs = require( "fs" );
var msx = require( "gulp-msx" );

gulp.task('json5', function() {
  [ "menu" ].forEach( function( name ) {
    fs.writeFile( "./document/json/" + name + ".json", JSON.stringify( JSON5.parse( fs.readFileSync( "./document/json5/" + name + ".json5", "utf-8" ) ) ) );
  });
});

gulp.task( "toppage-msx", function() {
  gulp.src('./msx/*.js')
  .pipe(msx({harmony: true}))
  .pipe(gulp.dest('./js'));
});

gulp.task( "document-msx", function() {
  gulp.src('./document/msx/*.js')
  .pipe(msx({harmony: true}))
  .pipe(gulp.dest('./document/js'));
});

gulp.task( "playground-msx", function() {
  gulp.src('./playground/msx/*.js')
  .pipe(msx({harmony: true}))
  .pipe(gulp.dest('./playground/js'));
});

gulp.task('default', function(){
  gulp.watch('./document/json5/*.json5', ['json5']);
  gulp.watch('./msx/*.js', ['toppage-msx']);
  gulp.watch('./document/msx/*.js', ['document-msx']);
  gulp.watch('./playground/msx/*.js', ['playground-msx']);

});
