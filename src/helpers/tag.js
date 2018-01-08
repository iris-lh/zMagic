const jp = require('fs-jetpack')

const tag = {
  writeTickTag: function(writePath) {
    console.log('WRITING TICK TAG...');

    const tag = {
      "values": [
        "zmagic:tick"
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

tag.writeTags('./src/tags/', './data/zmagic/tags/')

module.exports = tag
