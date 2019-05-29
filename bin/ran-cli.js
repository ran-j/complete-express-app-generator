var path = require('path')
var program = require('commander')
var VERSION = require('../package').version
var func = require("./utils")

var _exit = process.exit

// Re-assign process.exit because of commander
process.exit = exit

function exit(code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done() {
    if (!(draining--)) _exit(code)
  }

  var draining = 0
  var streams = [process.stdout, process.stderr]

  exit.exited = true

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}

// CLI

func.around(program, 'optionMissingArgument', function (fn, args) {
  program.outputHelp()
  fn.apply(this, args)
  return { args: [], unknown: [] }
})

func.before(program, 'outputHelp', function () {
  // track if help was shown for unknown option
  this._helpShown = true
})

func.before(program, 'unknownOption', function () {
  // allow unknown options if help was shown, to prevent trailing error
  this._allowUnknownOption = this._helpShown

  // show help if not yet shown
  if (!this._helpShown) {
    program.outputHelp()
  }
})

program
  .name('express')
  .version(VERSION, '    --version')
  .usage('[options] [project name]')
  .option('-s, --stack <Stack id>', 'express app with a stack below')
  .option('    --mgnc', 'express mongoose no cluster', func.renamedOption('--mgnc', '--stack=1'))
  .option('    --mgwc', 'express mongoose with cluster', func.renamedOption('--mgwc', '--stack=2'))
  .option('    --msnc', 'express mySQL no cluster', func.renamedOption('--msnc', '--stack=3'))
  .option('    --mswc', 'express mySQL with cluster', func.renamedOption('--mswc', '--stack=4'))
  .option('-io, --socket <id>', 'add or not socket io to project')
  .option('     --io,', 'add socket io to project',func.renamedOption('--io', '--socket=1'))
  .parse(process.argv)
if (!exit.exited) {
  main()
}

function main() {
  // Path
  
  var projectName = program.args.shift() || '.'
  // console.log(projectName)
  var appName = func.createAppName(path.resolve(projectName)) || 'ran-hello-world'
  // console.log(program.Stack)
  var destinationPath = path.join(process.cwd() + "\\" + appName)
  var useio = !program.socket ? !program.io  ? false : true : (program.socket == "1" ? true : false)

  // return console.log({
  //   a: projectName,
  //   b: appName,
  //   arg : useio
  // })
 
  if (program.stack == "1" || program.mgnc) {
    CreateProjetc(appName, destinationPath, 1, useio)
  } else if (program.stack == "2" || program.mgwc) { 
    CreateProjetc(appName, destinationPath, 2, useio)
  } else if (program.stack == "3" || program.msnc) { 
    CreateProjetc(appName, destinationPath, 3, useio)
  } else if (program.stack == "4" || program.mswc) { 
    CreateProjetc(appName, destinationPath, 4, useio)
  } else {
    func.warning("No Stack selected") 
    program.outputHelp();
  }
}

function CreateProjetc (appName, destinationPath, stack, useIO) {
  // Generate application
  func.emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      func.createApplication(appName, destinationPath, stack, useIO)
    } else {
      func.confirm('destination is not empty, continue? [y/N] ', function (ok) {
        if (ok) {
          process.stdin.destroy()
          func.createApplication(appName, destinationPath, stack, useIO)
        } else {
          console.error('aborting')
          exit(1)
        }
      })
    }
  })
}