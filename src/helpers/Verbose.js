const chalk = require('chalk')

class Verbose {
  constructor() {
    this.level = parseInt(process.env['VERBOSITY']) || 2
  }

  buildLog(message, requiredVerbosity = 1) {
    if (this.level >= requiredVerbosity) {
      console.log(message)
    }
  }

  warn(warning) {
    console.log(chalk.bold.red(warning));
  }
}

module.exports = Verbose