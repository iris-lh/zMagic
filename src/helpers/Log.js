const _ = require('lodash')
const jp = require('fs-jetpack')

class Log {
  constructor(options) {
    this.type = options.type
    this.name = options.name
    this._entries = []
    this._content = []
  }

  push(entry) {
    this._entries.push(entry)
  }

  _keyValueSorted() {
    return _.sortBy(this._entries, entry => {
      return entry.key
    })
  }

  _render() {
    if (this.type === 'key-value') {
      return this._keyValueSorted().map(entry => {
        const key = _.padStart(entry.key, 3, '0')
        return `${key}: ${entry.value}`
      }).join('\n')
    }
  }

  write() {
    jp.write(`./logs/${this.name}.txt`, this._render())
  }
}

module.exports = Log
