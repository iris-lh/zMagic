const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const SpellHelpers = require('./spell-helpers')
const spellHelpers = new SpellHelpers()
const interpolateYaml = require('./interpolate-yaml')
const Verbose = require('./Verbose')

const Verbose = require('./Verbose')
const verb = new Verbose()


class Objective {
  constructor() {
    this.commandify = this.commandify.bind(this)
    this.import     = this.import.bind(this)
    this.importAll  = this.importAll.bind(this)
    this.process    = this.process.bind(this)
    this.processAll = this.processAll.bind(this)
    this.write      = this.write.bind(this)
  }

  commandify(objectiveObject) {
    let commands = []
    _.forOwn(objectiveObject, (values, objective) => {
      commands.push(`scoreboard objectives add ${objective} dummy`)

      _.forOwn(values, (value, key) => {
        commands.push(`scoreboard players set ${key} ${objective} ${value}`)
      })
    })
    return commands
  }

  import(objectivePath) {
    verb.buildLog('    '+objectivePath, 3)
    return jp.read(objectivePath)
  }

  importAll(objectivesPath) {
    verb.buildLog('  IMPORTING OBJECTIVES...', 2)
    let objectiveYamls = []
    const objectiveFileNames = jp.list(objectivesPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    objectiveFileNames.map(fileName => {
      const path = objectivesPath + fileName
      objectiveYamls.push(this.import(path))
    })
    return objectiveYamls
  }

  process(objectiveYaml) {
    const rawJson = yaml.load(objectiveYaml)
    const processedObjective = yaml.load(interpolateYaml(objectiveYaml))
    const commandified = this.commandify(processedObjective)
    return commandified
  }

  processAll(importedObjectiveYamls) {
    verb.buildLog('  PROCESSING OBJECTIVES...', 2);
    let commands = []
    importedObjectiveYamls.map(objectiveYaml => {
      commands.push(this.process(objectiveYaml))
    })
    return _.flatten(commands)
  }

  write(commands) {
    const functionPath = `./build/data/zmagic
    /functions/init/objectives.mcfunction`
    verb.buildLog('    '+functionPath, 3)
    const mcFunction = commands.join('\n')

    verb.buildLog(mcFunction);

    jp.write(functionPath, mcFunction)
  }
}

module.exports = Objective
