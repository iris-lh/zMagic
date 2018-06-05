const _ = require('lodash')
const jp = require('fs-jetpack')
const costTiers = require('../constants/cost-tiers.json')

const Verbose = require('./Verbose')
const verb = new Verbose()

class Reagents {
  constructor() {
    this.writeInit = this.writeInit.bind(this)
    this.writeTick = this.writeTick.bind(this)
  }

  writeInit() {
    verb.buildLog('  WRITING REAGENT INIT...', 2)
    let lines = []
    lines.push('tellraw @p {"text":"- Initialize Reagents", "color":"dark_aqua"}')
    _.forOwn(costTiers, function (value, key) {
      const line0 = `scoreboard objectives add ${value.resource} dummy`
      const line1 = `scoreboard objectives add ${value.name} dummy`
      lines.push(line0, line1)
      for (var i = 0; i < value.tiers.length; i++) {
        const line = `scoreboard players set ${i} ${value.name} ${value.tiers[i]}`
        lines.push(line)
      }
    });

    const functionPath = `./build/data/zmagic/functions/init/reagents.mcfunction`
    verb.buildLog('    ' + functionPath, 3)
    jp.write(functionPath, lines.join('\n'))
  }

  writeTick() {
    verb.buildLog('  WRITING REAGENT TICK...', 2)
    let lines = []
    _.forOwn(costTiers, function (value, key) {
      const line = `execute as @a store result score @s ${value.resource} run clear @s minecraft:${value.resource} 0`
      lines.push(line)
    });
    const functionPath = `./build/data/zmagic/functions/tick/reagents.mcfunction`
    verb.buildLog('    ' + functionPath, 3)
    jp.write(functionPath, lines.join('\n'))
  }

}

module.exports = Reagents
