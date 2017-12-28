const _ = require('lodash')

function page(spellList) {
  let page = []
  spellList.forEach(entry => {
    const spellId = entry.split(' ')[0]
    const spellTier = entry.split(' ')[1]
    const spellTierStr = spellTier ? '_'+spellTier : ''
    const spellData = require(`../spells/${spellId}`)
    const json = {
      text:`\n${spellData.name} ${_.upperCase(spellTier)}`,
      color:spellData.textColor,
      italic:'true',
      underlined:'true',
      clickEvent:{
        action:'run_command',
        value:`/function zinnoa:spells/${spellData.id}${spellTierStr}`
      }
    }
    page.push(json)

  })
  return JSON.stringify(page)
}

function pages(spellLists) {
  let pages = []
    spellLists.forEach(list => {
      pages.push(page(list))
    })
  return pages
}

module.exports = {
  page: page,
  pages: pages
}
