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



  const match = processedYaml.match(/\$([a-z]|[A-Z]|\.)*/g) !== null
  const needsAnotherPass = match

  if (replaceables !== null) {
    return interpolateYaml(processedYaml, externalValues, pass+1)
  }

  return processedYaml
}

module.exports = interpolateYaml
