const _ = require('lodash')
const jp = require('fs-jetpack')

const triggerListPath = './src/constants/triggers.json'
let triggerList = JSON.parse(jp.read(triggerListPath))


function generate() {
  let chars = '0123456789'
  let trigger = ''
  for (var i=0; i<16; i++) {
    trigger += _.sample(chars)
  }
  return trigger
}


function updateList(spellId) {

  const triggerNotFound = typeof _.find(triggerList, {id: spellId}) === 'undefined'
  console.log(triggerNotFound);

  if (triggerNotFound) {
    const newTrigger = generate()
    const entry = {id: spellId, trigger: newTrigger}
    triggerList.push(entry)
    jp.write(triggerListPath, triggerList)
  }
}


module.exports = updateList
