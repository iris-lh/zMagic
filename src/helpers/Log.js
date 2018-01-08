const _ = require('lodash')
const jp = require('fs-jetpack')

class Log {
  constructor(path) {
    this.path = path
    this.entries = []
  }

  push(entry) {
    this.entries.push(entry)
  }

  _sorted() {
    return _.sortBy(this.entries, entry => {
      return entry.trigger
    })
  }

  _render() {
    return this._sorted().map(entry => {
      const triggerStr = _.padStart(entry.trigger, 3, '0')
      return `${triggerStr}: ${entry.id}`
    }).join('\n')
  }

  write() {
    jp.write(this.path, this._render())
  }
}

module.exports = Log
