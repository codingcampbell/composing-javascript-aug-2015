var fs = require('fs');
var del = require('del');
var http = require('http');
var connect = require('connect');
var compression = require('compression');
var serveStatic = require('serve-static');
var remoteControl = require('./src/js/remote/server');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var flair = require('./lib/flair');
var sane = require('sane');

process.on('uncaughtException', function(err) {
  console.log(err.message);
});

var _uncache = function(pattern) {
  Object.keys(require.cache).forEach(function(key) {
    if (pattern.test(key)) {
      delete require.cache[key];
    }
  });
};

var config = {};
config.jsRoot = './src/js/'
config.jsMain = config.jsRoot + 'main.js';
config.styleRoot = './src/js/style/';
config.styleMain = config.styleRoot + 'styles.js';
config.web = './web/';
config.port = 8888;
config.jsBundle = config.web + 'app.js';
config.styleBundle = config.web + 'styles.css';

var tasks = {};
tasks.javascript = function(opts) {
  opts = opts || {};

  var b = browserify({
    debug: !opts.minify,
    cache: {},
    packageCache: {},
    paths: [config.jsRoot]
  });

  if (opts.watch) {
    b = watchify(b);
  }

  b.transform(babelify);

  if (opts.minify) {
    b.transform({
      global: true,
      mangle: true,
      compress: {
        unsafe: true,
        drop_debugger: true,
        drop_console: true
      }
    }, 'uglifyify');
  }

  if (opts.watch) {
    b.on('update', function () { b.bundle().pipe(fs.createWriteStream(config.jsBundle)); })
    b.on('time', function (time) { console.log(config.jsBundle + ' built in ' + time + ' ms'); })
  }

  b.on('error', function (err) { console.log('Error : ' + err.message); })
  b.require(config.jsMain, { entry: true })
  b.bundle().pipe(fs.createWriteStream(config.jsBundle));
};

tasks.styles = function(opts) {
  _uncache(new RegExp(config.styleRoot));
  opts = opts || {};

  var startTime = Date.now();

  flair.compile(require(config.styleMain), function(compiled) {
    fs.writeFile(config.styleBundle, compiled, function(err) {
      if (err) {
        console.error('Failed to write css file:', err);
        return;
      }

      console.log(config.styleBundle + ' built in ' + (Date.now() - startTime) + ' ms');
    });
  });

  if (opts.watch) {
    opts.watch = false;
    var watchCallback = tasks.styles.bind(tasks, opts);
    var watcher = sane(config.styleRoot, { glob: ['**/*.js'] });
    watcher.on('change', watchCallback);
    watcher.on('add', watchCallback);
    watcher.on('delete', watchCallback);
  }
};

tasks.compile = function() {
  tasks.clean(function() {
    tasks.javascript();
    tasks.styles();
  });
};

tasks.build = function(opts) {
  tasks.clean(function() {
    tasks.javascript({ minify: true });
    tasks.styles({ minify: true });
  });
};

tasks.dev = function() {
  tasks.clean(function() {
    tasks.javascript({ watch: true });
    tasks.styles({ watch: true });
    tasks.serve();
  });
};

tasks.serve = function() {
  var server = connect();
  server.use(remoteControl());
  server.use(compression());
  server.use(serveStatic(config.web));

  http.createServer(server).listen(config.port);
  console.log('Listening on http://localhost:' + config.port + '/ ...');
};

tasks.clean = function(callback) {
  del([config.jsBundle, config.styleBundle], callback);
};

tasks['default'] = function() {
  tasks.dev();
};

var args = process.argv.slice(2);
if (!args.length) {
  tasks['default']();
} else {
  args.forEach(function(task) {
    if (typeof tasks[task] !== 'function') {
      console.error('Unknown task: ' + task);
      return;
    }

    tasks[task]();
  });
}
