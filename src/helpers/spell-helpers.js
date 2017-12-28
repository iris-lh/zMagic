const _ = require('lodash')
const costTiers = require('../constants/cost-tiers.json')
const messages = require('./messages')

const spellHelpers = {
  costTiers: costTiers,
  
  payGate: function(params, tier, commands) {
    const costTier  = tier.costTier
    const costTable = costTiers[params.costTableName]
    const resource  = costTiers[params.costTableName].resource
    let lines = []

    lines.push(`execute unless score ${params.executor} ${resource} >= ${costTier} ${costTable.name} run tellraw ${params.executor} ${messages.cantAfford(costTier, costTable)}`)
    commands.forEach(command => {
      lines.push(`execute if score ${params.executor} ${resource} >= ${costTier} ${costTable.name} run ${command}`)
    })
    lines.push(`execute if score ${params.executor} ${resource} >= ${costTier} ${costTable.name} run clear ${params.executor} minecraft:${resource} ${costTable.tiers[costTier]}`)

    return lines
  },

  buildOutput: function(params, getMcFunction) {
    return {
      name: params.name,
      id: _.snakeCase(params.name),
      tiers: params.tiers,
      textColor: costTiers[params.costTableName].color,
      getMcFunction: getMcFunction
    }
  }
}

module.exports = spellHelpers
