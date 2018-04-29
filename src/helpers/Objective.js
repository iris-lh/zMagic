const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const SpellHelpers = require('./spell-helpers')
const spellHelpers = new SpellHelpers()
const interpolateYaml = require('./interpolate-yaml')


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
    console.log('  '+objectivePath)
    return jp.read(objectivePath)
  }

  importAll(objectivesPath) {
    console.log('IMPORTING OBJECTIVES...')
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
    console.log('PROCESSING OBJECTIVES...');
    let commands = []
    importedObjectiveYamls.map(objectiveYaml => {
      commands.push(this.process(objectiveYaml))
    })
    return _.flatten(commands)
  }

  write(commands) {
    const functionPath = `./build/data/zmagic
    /functions/init/objectives.mcfunction`
    console.log('  '+functionPath)
    const mcFunction = commands.join('\n')

    console.log(mcFunction);

    jp.write(functionPath, mcFunction)
  }
}

module.exports = Objective
