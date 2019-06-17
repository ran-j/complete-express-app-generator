#!/usr/bin/env node

var ejs = require('ejs')
var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')
var util = require('util')
var minimatch = require('minimatch')
var readline = require('readline')

var MODE_0666 = parseInt('0666', 8)
var MODE_0755 = parseInt('0755', 8)

var TEMPLATE_DIR = path.join(__dirname, '..', 'templates')

const mkdir = (base, dir) => {
  let loc = path.join(base, dir)
  console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
  mkdirp.sync(loc, MODE_0755)
}

const createAppName = (pathName) => {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

const write = (file, str, mode) => {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}

const copyTemplate = (from, to) => {
  write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'))
}

const copyTemplateMulti = (fromDir, toDir, nameGlob) => {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
    .filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach(function (name) {
      copyTemplate(path.join(fromDir, name), path.join(toDir, name), TEMPLATE_DIR)
    })
}

/**
 * Install an around function; AOP.
 */

const around = (obj, method, fn) => {
  var old = obj[method]

  obj[method] = function () {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) args[i] = arguments[i]
    return fn.call(this, old, args)
  }
}

/**
 * Install a before function; AOP.
 */

const before = (obj, method, fn) => {
  var old = obj[method]

  obj[method] = function () {
    fn.call(this)
    old.apply(this, arguments)
  }
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

const confirm = (msg, callback) => {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}

const renamedOption = (originalName, newName) => {
  return function (val) {
    warning(util.format("option `%s' has been renamed to `%s'", originalName, newName))
    return val
  }
}

/**
 * Display a warning similar to how errors are displayed by commander.
 *
 * @param {String} message
 */

const warning = (message) => {
  console.error()
  message.split('\n').forEach(function (line) {
    console.error('  warning: %s', line)
  })
  console.error()
}

const emptyDirectory = (dir, fn) => {
  fs.readdir(dir, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

const sortedNPM = (input) => {
  var output = Object.create(null);

  Object.keys(input).sort().forEach(function (key) {
    output[key] = input[key];
  });

  return output;
}

const launchedFromCmd = () => {
  return process.platform === 'win32' && process.env._ === undefined
}

const loadTemplate = (name) => {
  var contents = fs.readFileSync(path.join(__dirname, '..', 'templates', (name + '.ejs')), 'utf-8')
  var locals = Object.create(null)

  function render() {
    return ejs.render(contents, locals, {
      escape: util.inspect
    })
  }

  return {
    locals: locals,
    render: render
  }
}

const createApplication = (name, dir, stage, useIO) => {
  // return console.log(TEMPLATE_DIR);
  // Package
  var pkg = {
    name: name,
    version: '0.0.1',
    private: true,
    scripts: {
      start: 'node ./bin/www',
      dev: `SET DEBUG=${name}:* & npm start`
    },
    dependencies: {
      "bcrypt": "^3.0.6",
      "debug": "~2.6.9",
      "ejs": "~2.5.7",
      'express': '~4.16.1',
      "express-session": "^1.15.6",
      "express-validator": "^5.3.1",
      "body-parser": "^1.18.3",
      "cookie-parser": "~1.4.3",
      "morgan": "~1.9.0",
      "cookie-parser": "~1.4.3",
      "request": "^2.88.0",
      "validator": "^10.11.0",
      "jsonwebtoken": "^8.4.0",
      "prom-client": "^11.2.1",
      "response-time": "^2.3.2",
      "moment": "^2.24.0",
    }
  }

  if (dir !== '.') {
    mkdir(dir, '.')
  }

  //create folders
  mkdir(dir, 'public')
  mkdir(dir, 'public/js')
  mkdir(dir, 'public/img')
  mkdir(dir, 'public/css')
  mkdir(dir, 'bin')
  mkdir(dir, 'db')
  mkdir(dir, 'libs')
  mkdir(dir, 'models')
  mkdir(dir, 'routes')
  mkdir(dir, 'routes/Controllers')
  mkdir(dir, 'views')

  //copy files
  //css
  copyTemplateMulti('public/css', dir + '/public/css', '*.css')
  //routes
  copyTemplateMulti('routes', dir + '/routes', '*.js')
  copyTemplateMulti('routes/Controllers', dir + '/routes/Controllers', '*.js')
  //libs
  copyTemplateMulti('libs', dir + '/libs', '*.js')
  //views
  copyTemplateMulti('views', dir + '/views', '*.ejs')
  //gitignore
  copyTemplate('gitignore', path.join(dir, '.gitignore'))
  //bin
  copyTemplateMulti('bin', dir + '/bin', '*.js')
  
  var app = null
  var www = null
  var config = null
 
  if (useIO) {
    pkg.dependencies["socket.io"] = "^2.2.0"
    pkg.dependencies["socket.io-prometheus"] = "^0.2.1"
    pkg.dependencies["socketio-jwt-auth"] = "^0.0.6"
    mkdir(dir, 'SocketsApi')
    copyTemplateMulti('SocketsApi', dir + '/SocketsApi', '*.js')
  }

  if (stage == 1 || stage == 2) {
    pkg.dependencies["connect-mongo"] = "^2.0.3"
    pkg.dependencies["express-session"] = "^1.15.6"
    pkg.dependencies["mongoose"] = "^5.4.7"

    mkdir(dir, 'Middlewares')
    mkdir(dir, 'models')
    //models
    copyTemplateMulti('models', dir + '/models', '*.js')
    copyTemplateMulti('Middlewares', dir + '/Middlewares', '*.js')

    app = loadTemplate('app.js')
    config = loadTemplate("bin/config.js")
    www = loadTemplate(stage == 2 ? 'bin/wwwCluster' : 'bin/www')

    app.locals.useIO = useIO
    app.locals.name = name

    www.locals.useIO = useIO
    www.locals.name = name

    config.locals.name = name
    config.locals.mongo = true

    write(path.join(dir, 'app.js'), app.render())
    write(path.join(dir, 'bin/www'), www.render(), MODE_0755)
    write(path.join(dir, 'bin/config.js'), config.render(), MODE_0755)

    copyTemplate('db/mongo.js', path.join(dir, 'db/index.js'))
  } else {
    pkg.dependencies["mysql"] = "^2.17.1"

    app = loadTemplate('app.SQL.js')
    www = loadTemplate(stage == 4 ? 'bin/wwwCluster' : 'bin/www')
    config = loadTemplate("bin/config.js")

    app.locals.useIO = useIO
    app.locals.name = name

    www.locals.useIO = useIO
    www.locals.name = name

    config.locals.name = name
    config.locals.mongo = false

    write(path.join(dir, 'app.js'), app.render())
    write(path.join(dir, 'bin/www'), www.render(), MODE_0755)
    write(path.join(dir, 'bin/config.js'), config.render(), MODE_0755)

    copyTemplate('db/mysql.js', path.join(dir, 'db/index.js'))
  }

  //sort objects
  pkg.dependencies = sortedNPM(pkg.dependencies)

  write(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
 
  var prompt = launchedFromCmd() ? '>' : '$'

  if (dir !== '.') {
    console.log()
    console.log('   change directory:')
    console.log('     %s cd %s', prompt, dir)
  }

  console.log()
  console.log('   install dependencies:')
  console.log('     %s npm install', prompt)
  console.log()
  console.log('   run the app:')
  console.log('     npm start')
  console.log()
  console.log('   run the app as dev:')
  console.log('     npm run dev')

  console.log()

}

module.exports = {
  mkdir,
  write,
  copyTemplate,
  confirm,
  before,
  around,
  renamedOption,
  warning,
  copyTemplateMulti,
  createAppName,
  emptyDirectory,
  createApplication
}