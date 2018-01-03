const jp = require('fs-jetpack')

const tagHelpers = {
  writeTickTag: function(writePath) {
    console.log('WRITING TICK TAG...');

    const tag = {
      "values": [
        "#zinnoa:tick"
      ]
    }

    console.log('  '+writePath);
    jp.write(writePath, tag)
  },

  writeTags: function(tagSrcPath, tagWritePath) {
    console.log('WRITING TAGS...');
    const blockTagFileNames    = jp.list(tagSrcPath+'/blocks')    || []
    const itemTagFileNames     = jp.list(tagSrcPath+'/items')     || []
    const functionTagFileNames = jp.list(tagSrcPath+'/functions') || []

    blockTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}blocks/${fileName}`
      const writePath = `${tagWritePath}blocks/${fileName}`
      const tag = jp.read(srcPath)
      console.log('  '+writePath);
      jp.write(writePath, tag)
    })

    itemTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}items/${fileName}`
      const writePath = `${tagWritePath}items/${fileName}`
      const tag = jp.read(srcPath)
      console.log('  '+writePath);
      jp.write(writePath, tag)
    })

    functionTagFileNames.forEach(fileName => {
      const srcPath   = `${tagSrcPath}functions/${fileName}`
      const writePath = `${tagWritePath}functions/${fileName}`
      const tag = jp.read(srcPath)
      console.log('  '+writePath);
      jp.write(writePath, tag)
    })
  }
}

tagHelpers.writeTags('./src/tags/', './data/zinnoa/tags/')

module.exports = tagHelpers
