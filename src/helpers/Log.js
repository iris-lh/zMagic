const _ = require('lodash')
const jp = require('fs-jetpack')
const timeStamp = require('time-stamp')
const glob = require('glob')

class Log {
  constructor(options) {
    this.name = options.name || _.toString(_.now())
    this.extension = options.extension || 'log'
    this.type = options.type || 'lines'
    this.overwrite = options.overwrite || false
    this.path = options.path || ''
    this.timeFormat = options.timeFormat || 'YYYY-MM-DD-HH-mm-ss'
    this._renderer = options.renderer || (entry => _.toString(entry))

    this._entries = []
    this._contentLines = []
  }

  push(entry) {
    this._entries.push(entry)
  }

  _sortEntriesByKeys() {
    return _.sortBy(this._entries, entry => {
      return entry[0]
    })
  }

  _render() {
    if (this.type === 'custom') {
      this._entries.map(entry => {
        this._contentLines.push(this._renderer(entry))
      })
    } else if (this.type === 'lines') {
      this._entries.map(entry => {
        this._contentLines.push(_.toString(entry))
      })
    } else if (this.type === 'key-value') {
      this._sortEntriesByKeys().map(entry => {
        const key = _.padStart(entry[0], 3, '0')
        const value = entry[1]
        this._contentLines.push(`${key}: ${value}`)
      })
    }
  }

  _cleanOldLogs(newLogFilename) {
    const pattern = `./logs/${this.path}/${this.name}.*.${this.extension}`
    const that = this
    glob(pattern, {
      nonull: true
    }, function (er, files) {
      const deletables = files.map(file => {
        const match = file.match(newLogFilename)
        if (match === null) {
          return file
        }
      })

      deletables.forEach(file => {
        jp.remove(file)
      })
    })
  }

  write() {
    this._render()
    const newLogFilename = `${this.path}/${this.name}.${timeStamp(this.timeFormat)}.${this.extension}`
    if (this.overwrite) {
      this._cleanOldLogs(newLogFilename)
    }
    jp.write(`./logs/${newLogFilename}`, this._contentLines.join('\n'))
  }
}

module.exports = Log