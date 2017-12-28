const _ = require('lodash')
const costTiers = require('../constants/cost-tiers.json')
const payGate = require('../helpers/pay-gate')

const params = {
  name         : 'Lava Flow',
  costTableName: 'blaze_powder',
  executor     : '@p',
  tiers: [
    {
      name: 'I',
      costTier: 1,
      explosionPower: 1
    }
  ]
}

function getMcFunction(tier) {
  return payGate(params, tier, [
    `setblock ~ ~ ~ minecraft:lava`,
    `setblock ~ ~1 ~ minecraft:lava`,
    `setblock ~ ~1 ~ minecraft:air`
  ]).join('\n')
}

const spell = {
  name: params.name,
  id: _.snakeCase(params.name),
  tiers: params.tiers,
  textColor: costTiers[params.costTableName].color,
  getMcFunction: getMcFunction
}

module.exports = spell
