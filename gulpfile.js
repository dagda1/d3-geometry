var gulp = require('gulp'),
    GulpSSH = require('gulp-ssh'),
    shell = require('gulp-shell'),
    fs = require('fs');

var host = '46.101.17.251';

var config = {
  host: host,
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync('/Users/paulcowan/.ssh/id_rsa')
};

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

gulp.task('sync', shell.task([
  "rsync -avze 'ssh -p 22' dist/ root@" + host + ":dist"
]));

gulp.task('deploy', ['sync'], function () {
  return gulpSSH
    .exec([
      'docker rm -f d3',
      'docker build -t dnginx .',
      'docker run --name d3 -d -p 80:80 dnginx'
    ]);
});
