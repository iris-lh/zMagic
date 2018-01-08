const _ = require('lodash')
const yaml = require('js-yaml')
const jp = require('fs-jetpack')



function interpolateYaml(yamlStr, externalValues = {}, pass = 0) {
  const rawJson = yaml.load(yamlStr)

  let processedYaml = yamlStr + ''

  const replaceables = yamlStr.match(/\$([a-z]|[A-Z]|\.)*/g)

  if (replaceables !== null) {
    replaceables.map(instance => {
      const yamlValue = _.at(rawJson, instance.replace('$', ''))
      const externalValue = _.at(externalValues, instance.replace('$', ''))
      const sanitized = '\\'+instance

      const removeableQuotes = /"/g

      if (typeof externalValue[0] !== 'undefined') {
        processedYaml = processedYaml.replace(new RegExp(sanitized, 'g'), JSON.stringify(externalValue[0]).replace(removeableQuotes, ''))
      } else if (typeof yamlValue[0] !== 'undefined') {
        processedYaml = processedYaml.replace(new RegExp(sanitized, 'g'), JSON.stringify(yamlValue[0]).replace(removeableQuotes, ''))
      }
    })
  }


  // console.log(pass+'\n'+processedYaml);

  const match = processedYaml.match(/\$([a-z]|[A-Z]|\.)*/g) !== null
  const needsAnotherPass = match

  if (replaceables !== null) {
    // console.log('doing another pass');
    return interpolateYaml(processedYaml, externalValues, pass+1)
  }

  return processedYaml
}

// const spellsPath = jp.cwd()+'/src/spells/'
// const fireballPath = spellsPath+'/fireball.yaml'
// const fireballYaml = jp.read(fireballPath)
// const fireball = yaml.load(fireballYaml)
//
// const externalValues = {
//   tier: {
//     name: 'I',
//     costTier: 1,
//     explosionPower: 1
//   }
// }
//
// const result = interpolateYaml(fireballYaml, externalValues)
//
// console.log(yaml.load(result));

module.exports = interpolateYaml
