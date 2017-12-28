const _ = require('lodash')
const spellHelpers = require('../helpers/spell-helpers')

const params = {
  name         : 'Fireball',
  costTableName: 'blaze_powder',
  executor     : '@p',
  tiers: [
    {
      name: 'I',
      costTier: 1,
      explosionPower: 1
    },
    {
      name: 'II',
      costTier: 3,
      explosionPower: 2
    },
    {
      name: 'III',
      costTier: 5,
      explosionPower: 5
    }
  ]
}

function getMcFunction(tier) {
  const json = {
    fireball: JSON.stringify({
      ExplosionPower:tier.explosionPower,
      direction:'[0.0d,0.0d,0.0d]',
      Motion:'[0.0,0.0,0.0]'
    }).replace(/"/g, '')
  }

  return spellHelpers.payGate(params, tier, [
    `summon minecraft:fireball ~ ~1 ~ ${json.fireball}`
  ]).join('\n')
}

module.exports = spellHelpers.buildOutput(params, getMcFunction)
