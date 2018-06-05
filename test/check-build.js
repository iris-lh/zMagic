const _ = require('lodash')
const glob = require('glob')
const grep = require('grepit')
const chalk = require('chalk')
const triggerList = require('../src/constants/triggers.json')
const Verbose = require('../src/helpers/Verbose')
const verb = new Verbose


// TODO maybe switch to chai/mocha


function highlightResults(results, target) {
  return results.map(result => {
    return result.replace(target, chalk.red(target))
  })
}

function checkFileFor(target, file) {
  let clean = true
  const results = grep(target, file)

  if (results.length > 0) {
    console.log();
    console.log(chalk.bold.red(file));
    clean = false
  }

  if (results.length > 0) {
    console.log(chalk.bold.red(`  File contains ${target}!`));
    const highlighted = highlightResults(results, target)
    console.log(chalk('    ' + highlighted.join('\n    ')));
  }

  return clean
}

function checkRedFlags() {
  console.log('CHECKING BUILD FOR RED FLAGS...')

  let clean = true

  glob('./build/data/**/*.*', {}, (er, files) => {
    files.forEach(file => {
      checkFileFor('undefined', file)
      checkFileFor('NaN', file)
      checkFileFor('null', file)

    })
  })
  if (clean) {
    console.log('ALL CLEAR.')
  }
}

function checkTriggers() {
  console.log('CHECKING FOR DUPLICATE TRIGGERS...')

  let clean = true

  for (var i = 0; i < triggerList.length; i++) {
    const matches = _.filter(triggerList, {
      trigger: triggerList[i].trigger
    })
    if (matches.length > 1) {
      clean = false
      console.log(chalk.bold.red(`  Duplicate trigger found! (${matches[0].trigger})`))

      for (var i = 0; i < matches.length; i++) {
        console.log(chalk.red('    ID:', matches[i].id))
      }
      console.log()
    }
    _.pullAll(triggerList, matches)
  }

  if (clean) {
    console.log('ALL CLEAR.')
  }
}

function checkBuild() {
  checkRedFlags()
  checkTriggers()
}


module.exports = checkBuild