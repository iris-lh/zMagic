const _ = require('lodash')
const yaml = require('js-yaml')
const jp = require('fs-jetpack')

const Book = require('./Book')


class Scribing {
  constructor() {
    this.writeInit   = this.writeInit.bind(this)
    this.writeTick   = this.writeTick.bind(this)
    this.writeGivers = this.writeGivers.bind(this)

    this.papers = [
      {
        name: 'Ignus Page',
        enchantId: 1,
        triggerObjective: 'scrIgnusPage',
        reagent: 'lapis_lazuli',
        tiers: [
          {
            name: 'I',
            trigger: 10,
            lore: 'Page detailing basic Ignan spellcasting.'
          },
          {
            name: 'II',
            trigger: 11,
            lore: 'Page detailing intermediate Ignan spellcasting.'
          },
          {
            name: 'III',
            trigger: 12,
            lore: 'Page detailing advanced Ignan spellcasting.'
          }
        ]
      }
    ]

  }

  getIngredientsScores(paper, index) {
    let ingredients = ''
    switch(index) {
      case 0:
        ingredients = `${paper.reagent}=8..,paper=1..`
        break;
      case 1:
        ingredients = `${_.camelCase(paper.name)+'I'}=4..,paper=1..`
        break;
      case 2:
        ingredients = `${_.camelCase(paper.name)+'II'}=4..,paper=1..`
        break;
    }
    return ingredients
  }

  getIngredientsToClear(paper, index) {
    console.log('getIngredientsToClear');
    let ingredients = ''
    switch(index) {
      case 0:
        var line1 = `clear @s minecraft:paper 1`
        var line2 = `clear @s minecraft:${paper.reagent} 8`
        ingredients = line1+'\n'+line2
        break;
      case 1:
        var line1 = `clear @s minecraft:paper 1`
        var pageConsumed = `minecraft:paper{ench:[{id:${paper.enchantId},lvl:${index}}]}`
        var line2 = `clear @s ${pageConsumed} 4`
        break;
      case 2:
        var line1 = `clear @s minecraft:paper 1`
        var pageConsumed = `minecraft:paper{ench:[{id:${paper.enchantId},lvl:${index}}]}`
        var line2 = `clear @s ${pageConsumed} 4`
        break;
    }
    return ingredients
  }

  writeInit() {
    let lines = []
    this.papers.forEach(paper => {
      lines.push(`scoreboard objectives add scribePage trigger`)
      lines.push(`scoreboard objectives add scribePage dummy`)
      paper.tiers.forEach((tier, index) => {
        const item = `minecraft:paper{ench:[{id:${paper.enchantId},lvl:${index}}]}`
        // const line = `execute as @a store result score @s ${_.camelCase(paper.name)+tier.name} run clear @s ${item} 0`
        const line = `scoreboard objectives add ${_.camelCase(paper.name)+tier.name} dummy`

        lines.push(line)
      })
    })
    console.log(lines.join('\n'));
  }

  writeTick() {
    let lines = []
    this.papers.forEach(paper => {
      lines.push(`scoreboard players enable @a scribePage`)
      lines.push(`execute as @a store result score @s paper run clear @s minecraft:paper 0`)
      paper.tiers.forEach((tier, index) => {
        const ingredients = this.getIngredientsScores(paper, index)
        const execute = `execute at @a[scores={scribePage=${tier.trigger},${ingredients}] run`
        const mcfunction = `function zmagic:scribe/${_.snakeCase(paper.name+tier.name)}`
        const line = `${execute} ${mcfunction}`
        lines.push(line)
      })
      lines.push(`scoreboard players set @a[scores={scribePage=1..}] scribePage -1`)
    })
    console.log(lines.join('\n'));
  }

  writeGivers() {
    let lines = []
    this.papers.forEach(paper => {
      paper.tiers.forEach((tier, index) => {
        let color = ''
        switch(tier.name) {
          case 'I':
            color = 'green'
            break;
          case 'II':
            color = 'aqua'
            break;
          case 'III':
            color = 'light_purple'
            break;
        }

        const give = `give @s minecraft:paper`
        const nbt = `{display: {Name: "{\\"text\\":\\"${paper.name} ${tier.name}\\",\\"color\\":\\"${color}\\"}", Lore:["${tier.lore}"]}, ench:[{id:${paper.enchantId},lvl:${index}}], HideFlags:1 }`
        const line1 = `${give}${nbt}`
        // const line2 = `clear @s minecraft:paper 1`
        const pageConsumed = `minecraft:paper{ench:[{id:${paper.enchantId},lvl:${index}}]}`
        const line3 = this.getIngredientsToClear(paper, index)

        const sublines = [
          line1,
          line3
        ]
        lines.push(sublines.join('\n'))
      })
    })
    console.log(lines.join('\n\n'));
  }
}


module.exports = Scribing



const scribingHelpers = new Scribing()
console.log('\nINIT');
scribingHelpers.writeInit()
console.log('\nTICK');
scribingHelpers.writeTick()
console.log('\nGIVERS');
scribingHelpers.writeGivers()
