const _ = require('lodash')

const messages = {
  cantAfford: function (costTier, costTable) {
    return JSON.stringify(['', {
      'text': 'Insufficient reagents!',
      'color': 'red',
      'italic': true
    }, {
      'text': `\nRequired: `,
      'color': 'red',
      'italic': true
    }, {
      'text': `${_.lowerCase(costTable.resource)}`,
      'color': costTable.color
    }, {
      'text': ` x ${costTable.tiers[costTier]}`,
      'color': 'red'
    }])
  }
}

module.exports = messages