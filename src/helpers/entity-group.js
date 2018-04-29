const _ = require('lodash')
const jp = require('fs-jetpack')
const chalk = require('chalk')
const allEntities = require('../constants/entity-groups/all.json')


function entityGroup(groupName) {
  const data = jp.read(`./src/constants/entity-groups/${groupName}.json`)

  if (typeof data === 'undefined') {
    const message = chalk.red(`Entity group '${groupName}' not found!`)
    throw new Error(message)
  }

  const group = JSON.parse(data)

  const negative = _.pullAll(allEntities, group)
  return negative
  return negative.map(entity => {
    return `type=!${entity}`
  }).join(',')
}

console.log('@e[' + entityGroup('undead') + ']')

module.exports = entityGroup
