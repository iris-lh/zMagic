const _ = require('lodash')
const yaml = require('js-yaml')
const jp = require('fs-jetpack')
const costTiers = require('../constants/cost-tiers.json')
const messages = require('./messages')
const pipe = require('./pipe')
const interpolateYaml = require('./interpolate-yaml')


class SpellHelpers {
  constructor() {
    this.importSpell = this.importSpell.bind(this)
    this.importSpells = this.importSpells.bind(this)
    this.processSpell = this.processSpell.bind(this)
    this.processSpells = this.processSpells.bind(this)
    this.buildMcFunction = this.buildMcFunction.bind(this)
    this.buildMcFunctions = this.buildMcFunctions.bind(this)
    this.writeSpell = this.writeSpell.bind(this)
    this.writeSpells = this.writeSpells.bind(this)

    this.colors = _.reduce(costTiers, (result, value, key) => {
      return _.set(result, `${key}`, value.color)
    }, {})
  }

  payGate(spell, tier) {
    const costTier  = spell.tier.costTier
    const costTable = costTiers[spell.costTableName]
    const resource  = costTiers[spell.costTableName].resource
    let lines = []

    lines.push(`execute unless score ${spell.executor} ${resource} >= ${costTier} ${costTable.name} run tellraw ${spell.executor} ${messages.cantAfford(costTier, costTable)}`)
    spell.commands.forEach(command => {
      lines.push(`execute if score ${spell.executor} ${resource} >= ${costTier} ${costTable.name} run ${command}`)
    })
    lines.push(`execute if score ${spell.executor} ${resource} >= ${costTier} ${costTable.name} run clear ${spell.executor} minecraft:${resource} ${costTable.tiers[costTier]}`)

    return lines
  }

  importSpell(path) {
    console.log('  '+path)
    return jp.read(path)
  }

  importSpells(spellsPath) {
    console.log('IMPORTING SPELLS...')
    let spellYamls = []
    const spellFileNames = jp.list(spellsPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    spellFileNames.map(fileName => {
      const path = spellsPath + fileName
      spellYamls.push(this.importSpell(path))
    })
    return spellYamls
  }

  processSpell(importedSpellYaml, tier) {
    const rawJson = yaml.load(importedSpellYaml)
    const processedSpell = yaml.load(interpolateYaml(importedSpellYaml, {tier: tier}))
    processedSpell.tier = tier
    const isOneOff = rawJson.tiers.length <= 1
    processedSpell.id = isOneOff
      ? _.snakeCase(processedSpell.name)
      : _.snakeCase(`${processedSpell.name}_${processedSpell.tier.name}`)
    console.log('  '+processedSpell.name+' '+(isOneOff ? '' : processedSpell.tier.name));
    return processedSpell
  }

  processSpells(importedSpellYamls) {
    console.log('PROCESSING SPELLS...');
    let processedSpells = []
    importedSpellYamls.map(spellYaml => {
    const rawJson = yaml.load(spellYaml)
      rawJson.tiers.map(tier => {
        processedSpells.push(this.processSpell(spellYaml, tier))
      })
    })
    return processedSpells
  }

  buildMcFunction(hydratedSpell) {
    return this.payGate(hydratedSpell)
  }

  buildMcFunctions(hydratedSpells) {
    return hydratedSpells.map(hydratedSpell => {
      return this.buildMcFunction(hydratedSpell)
    })
  }

  writeSpell(processedSpell) {
    const rawJson = processedSpell
    const isOneOff = rawJson.tiers.length <= 1
    const functionPath = `./data/zinnoa/functions/spells/${processedSpell.id}.mcfunction`
    console.log('  '+functionPath)
    const mcFunction = this.buildMcFunction(processedSpell).join('\n')
    jp.write(functionPath, mcFunction)
  }

  writeSpells(processedSpells) {
    console.log('WRITING SPELLS...')

    processedSpells.map(spell => {
      this.writeSpell(spell)
    })
  }

}


module.exports = SpellHelpers
