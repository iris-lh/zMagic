const _ = require('lodash')
const jp = require('fs-jetpack')
const chalk = require('chalk')
const allEntities = require('../constants/entity-groups/all.json')


function loadGroup(groupName) {
  const data = jp.read(`./src/constants/entity-groups/${groupName}.json`)

  if (typeof data === 'undefined') {
    const message = chalk.red(`Entity group '${groupName}' not found!`)
    throw new Error(message)
  }

  return JSON.parse(data)
}

function formatGroup(group) {
  return group.map(entity => {
    return `type=!${entity}`
  }).join(',')
}

function entityGroup(groupName) {
  const group = loadGroup(groupName)

  if (groupName !== 'all') {
    const negative = _.pullAll(allEntities, group)
    return formatGroup(negative)
  } else {
    return ''
  }

}

function getAllGroups() {
  const groupFiles = jp.list('./src/constants/entity-groups/')
  let groups = {}

  groupFiles.forEach(file => {
    const groupName = file.split('.')[0]
    groups[groupName] = entityGroup(groupName)
  })

  return groups
}


module.exports = getAllGroups