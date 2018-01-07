const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const SpellHelpers = require('./spell-helpers')
const spellHelpers = new SpellHelpers()
const interpolateYaml = require('./interpolate-yaml')


class ConstantHelpers {
  constructor() {
    this.commandify       = this.commandify.bind(this)
    this.importConstant   = this.importConstant.bind(this)
    this.importConstants  = this.importConstants.bind(this)
    this.processConstant  = this.processConstant.bind(this)
    this.processConstants = this.processConstants.bind(this)
    this.writeConstants   = this.writeConstants.bind(this)
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

  importConstant(constantPath) {
    console.log('  '+constantPath)
    return jp.read(constantPath)
  }

  importConstants(constantsPath) {
    console.log('IMPORTING CONSTANTS...')
    let constantYamls = []
    const constantFileNames = jp.list(constantsPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    constantFileNames.map(fileName => {
      const path = constantsPath + fileName
      constantYamls.push(this.importConstant(path))
    })
    return constantYamls
  }

  processConstant(constantYaml) {
    const rawJson = yaml.load(constantYaml)
    const processedConstant = yaml.load(interpolateYaml(constantYaml))
    const commandified = this.commandify(processedConstant)
    return commandified
  }

  processConstants(importedConstantYamls) {
    console.log('PROCESSING CONSTANTS...');
    let commands = []
    importedConstantYamls.map(constantYaml => {
      commands.push(this.processConstant(constantYaml))
    })
    return _.flatten(commands)
  }

  writeConstants(commands) {
    const functionPath = `./data/zinnoa/functions/init/constants.mcfunction`
    console.log('  '+functionPath)
    const mcFunction = commands.join('\n')

    console.log(mcFunction);

    jp.write(functionPath, mcFunction)
  }
}

module.exports = ConstantHelpers
