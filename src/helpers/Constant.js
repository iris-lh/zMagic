const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const SpellHelpers = require('./spell-helpers')
const spellHelpers = new SpellHelpers()
const interpolateYaml = require('./interpolate-yaml')
const Verbose = require('./Verbose')

const Verbose = require('./Verbose')
const verb = new Verbose()


class Constant {
  constructor() {
    this.commandify = this.commandify.bind(this)
    this.import = this.import.bind(this)
    this.importAll = this.importAll.bind(this)
    this.process = this.process.bind(this)
    this.processAll = this.processAll.bind(this)
    this.write = this.write.bind(this)
  }

  commandify(constantObject) {
    let commands = []
    _.forOwn(constantObject, (values, objective) => {
      commands.push(`scoreboard objectives add ${objective} dummy`)

      _.forOwn(values, (value, key) => {
        commands.push(`scoreboard players set ${key} ${objective} ${value}`)
      })
    })
    return commands
  }

  import (constantPath) {
    verb.buildLog('    ' + constantPath, 3)
    return jp.read(constantPath)
  }

  importAll(constantsPath) {
    verb.buildLog('  IMPORTING CONSTANTS...', 2)
    let constantYamls = []
    const constantFileNames = jp.list(constantsPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    constantFileNames.map(fileName => {
      const path = constantsPath + fileName
      constantYamls.push(this.import(path))
    })
    return constantYamls
  }

  process(constantYaml) {
    const rawJson = yaml.load(constantYaml)
    const processedConstant = yaml.load(interpolateYaml(constantYaml))
    const commandified = this.commandify(processedConstant)
    return commandified
  }

  processAll(importedConstantYamls) {
    verb.buildLog('  PROCESSING CONSTANTS...');
    let commands = []
    importedConstantYamls.map(constantYaml => {
      commands.push(this.process(constantYaml))
    })
    return _.flatten(commands)
  }

  write(commands) {
    const functionPath = `./build/data/zmagic/functions/init/constants.mcfunction`
    verb.buildLog('    ' + functionPath, 3)
    const mcFunction = commands.join('\n')

    jp.write(functionPath, mcFunction)
  }
}

module.exports = Constant