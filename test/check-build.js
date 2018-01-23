const glob = require('glob')
const grep = require('grepit')
const chalk = require('chalk')
const Verbose = require('../src/helpers/Verbose')
const verb = new Verbose

function highlightResults(results, target) {
  return results.map(result => {
    return result.replace(target, chalk.red(target))
  })
}

function checkBuild() {
  verb.log('CHECKING BUILD FOR RED FLAGS...')

  glob('./data/**/*.*', {}, (er, files) => {
    let clean = true
    files.forEach(file => {
      const resultsUndefined = grep('undefined', file)
      const resultsNaN = grep('NaN', file)
      const resultsNull = grep('null', file)

      const foundMatch
         = resultsUndefined.length > 0
        || resultsNaN.length > 0
        || resultsNull.length > 0

      if (foundMatch) {
        console.log();
        console.log(chalk.bold.red(file));
        clean = false
      }

      if (resultsUndefined.length > 0) {
        console.log(chalk.bold.red('  File contains undefined!'));
        const highlighted = highlightResults(resultsUndefined, 'undefined')
        console.log(chalk('    '+highlighted.join('\n    ')));
      }

      if (resultsNaN.length > 0) {
        console.log(chalk.bold.red('  File contains NaN!'));
        const highlighted = highlightResults(resultsNaN, 'NaN')
        console.log(chalk('    '+highlighted.join('\n    ')));
      }

      if (resultsNull.length > 0) {
        console.log(chalk.bold.red('  File contains null!'));
        const highlighted = highlightResults(resultsNull, 'null')
        console.log(chalk('    '+highlighted.join('\n    ')));;
      }
    })
    if (clean) {
      verb.log('ALL CLEAR.')
    }
  })
}

module.exports = checkBuild