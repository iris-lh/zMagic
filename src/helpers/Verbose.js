

class Verbose {
  constructor() {
    this.level = parseInt(process.env['VERBOSITY']) || 2
  }

  log(message, requiredVerbosity=1) {
    if (this.level >= requiredVerbosity) {
      console.log(message)
    }
  }
}

module.exports = Verbose
