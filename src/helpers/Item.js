const _ = require('lodash')

const packageJson      = require('../../package.json')
const version          = packageJson.version
const minecraftVersion = packageJson.minecraftVersion

class Item {
  constructor() {

  }

  createItem(options) {
    const id        = options.id        || ''
    const subId     = options.subId     || id
    const name      = options.name      || ''
    const color     = options.color     || 'white'
    const lore      = options.lore      || []
    const ench      = options.ench      || []
    const hideFlags = options.hideFlags || 0

    const loreWithVersion = JSON.stringify(
      _.flatten([lore])
      .concat(['', 'zMagic '+version, 'Minecraft '+minecraftVersion])
    )
    const enchStr = JSON.stringify(_.map(_.flatten([ench]), element => {
      return {Id: element.id, Lvl: element.lvl}
    },[]))

    return `${id}{subId:"${subId}", display:{Name:"{\\"text\\":\\"${name}\\", \\"color\\":\\"${color}\\"}}", Lore:${loreWithVersion}}, ench:${enchStr}, HideFlags:${hideFlags}}`
  }
}

module.exports = Item

const itemHelper = new Item()

const options = {
  id: 'minecraft:dirt',
  subId: 'zmagic:zdirt',
  name: 'zDirt',
  color: 'light_purple',
  lore: 'no brackets',
  ench: {id:0,lvl:0},
  hideFlags: 1
}

const item = itemHelper.createItem(options)

console.log(item);
