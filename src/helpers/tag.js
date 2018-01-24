const jp = require('fs-jetpack')

const Verbose = require('./Verbose')
const verb = new Verbose()

const tag = {
  writeTickTag: function(writePath) {
    verb.buildLog('  WRITING MINECRAFT:TICK TAG...', 2);

    const tag = {
      "values": [
        "zmagic:tick"
      ]
    }

    verb.buildLog('    '+writePath, 3);
    jp.write(writePath, tag)
  },

  writeTags: function(tagSrcPath, tagWritePath) {
    verb.buildLog('  WRITING TAGS...', 2);
    const blockTagFileNames    = jp.list(tagSrcPath+'/blocks')    || []
    const itemTagFileNames     = jp.list(tagSrcPath+'/items')     || []
    const functionTagFileNames = jp.list(tagSrcPath+'/functions') || []

    blockTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}blocks/${fileName}`
      const writePath = `${tagWritePath}blocks/${fileName}`
      const tag = jp.read(srcPath)
      verb.buildLog('    '+writePath, 3);
      jp.write(writePath, tag)
    })

    itemTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}items/${fileName}`
      const writePath = `${tagWritePath}items/${fileName}`
      const tag = jp.read(srcPath)
      verb.buildLog('    '+writePath, 3);
      jp.write(writePath, tag)
    })

    functionTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}functions/${fileName}`
      const writePath = `${tagWritePath}functions/${fileName}`
      const tag = jp.read(srcPath)
      verb.buildLog('    '+writePath, 3);
      jp.write(writePath, tag)
    })
  }
}

module.exports = tag
