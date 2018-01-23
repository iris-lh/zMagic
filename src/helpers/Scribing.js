const _ = require('lodash')
const yaml = require('js-yaml')
const jp = require('fs-jetpack')

const Verbose = require('./Verbose')
const verb = new Verbose()

const Item = require('./Item')
const Book = require('./Book')

const packageJson      = require('../../package.json')
const version          = packageJson.version
const minecraftVersion = packageJson.minecraftVersion

const tickPath        = './data/zmagic/functions/tick/scribing.mcfunction'
const triggerTickPath = './data/zmagic/functions/tick/triggers/scribing.mcfunction'
const initPath        = './data/zmagic/functions/init/scribing.mcfunction'
const scribePath      = './data/zmagic/functions/scribe/'
const givePath        = './data/zmagic/functions/give/page/'
const itemHelper = new Item()

// TODO scribing tome

class Scribing {
  constructor() {
    this.writeInit        = this.writeInit.bind(this)
    this.writeTriggerTick = this.writeTriggerTick.bind(this)
    this.writeGivers      = this.writeGivers.bind(this)
    this.writeGivePapers  = this.writeGivePapers.bind(this)
    this.writeGiveTome    = this.writeGiveTome.bind(this)

    this.scribingPaper = 'minecraft:paper{display:{Name:"{\\"text\\":\\"Scribing Paper\\"}"}}'

    this.papers = [
      {
        name: 'Ignus Page',
        triggerObjective: 'scrIgnusPage',
        reagent: 'blaze_powder',
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
        ingredients = `${paper.reagent}=8..,scribingPaper=1..`
        break;
      case 1:
        ingredients = `${_.camelCase(paper.name)+'I'}=4..,scribingPaper=1..`
        break;
      case 2:
        ingredients = `${_.camelCase(paper.name)+'II'}=4..,scribingPaper=1..`
        break;
    }
    return ingredients
  }

  getIngredientsToClear(paper, index) {
    let ingredients = ''
    const pageName = _.snakeCase(paper.name)
    var line1 = `clear @s[scores={${this.getIngredientsScores(paper, index)}}] ${this.scribingPaper} 1`
    switch(index) {
      case 0:
        var line2 = `clear @s[scores={${this.getIngredientsScores(paper, index)}}] minecraft:${paper.reagent} 8`
        ingredients = line1+'\n'+line2
        break;
      case 1:
        var pageConsumed = `minecraft:paper{subId:"zmagic:${pageName}_i"}`
        var line2 = `clear @s[scores={${this.getIngredientsScores(paper, index)}}] ${pageConsumed} 4`
        ingredients = line1+'\n'+line2
        break;
      case 2:
        var pageConsumed = `minecraft:paper{subId:"zmagic:${pageName}_ii"}`
        var line2 = `clear @s[scores={${this.getIngredientsScores(paper, index)}}] ${pageConsumed} 4`
        ingredients = line1+'\n'+line2
        break;
    }
    return ingredients
  }

  writeInit() {
    verb.log('  WRITING SCRIBING INIT...', 2)
    let lines = []

    lines.push('tellraw @p {"text":"- Initialize Scribing", "color":"dark_aqua"}')

    this.papers.forEach(paper => {
      lines.push(`scoreboard objectives add scribePage trigger`)
      lines.push(`scoreboard objectives add scribingPaper dummy`)
      paper.tiers.forEach((tier, index) => {
        const id = _.snakeCase(paper.name+tier.name)
        const item = `minecraft:paper{subId:"zmagic:${id}"}`
        const line = `scoreboard objectives add ${_.camelCase(paper.name)+tier.name} dummy`

        lines.push(line)
      })
    })
    verb.log('    '+initPath, 3);
    jp.write(initPath, lines.join('\n'))
  }

  writeTick() {
    verb.log('  WRITING SCRIBING TICK...', 2)
    let lines = []
    this.papers.forEach(paper => {
      lines.push(`execute as @a store result score @s scribingPaper run clear @s ${this.scribingPaper} 0`)
      paper.tiers.forEach((tier, index) => {
        const ingredients = this.getIngredientsScores(paper, index)
        const objective = _.camelCase(paper.name)+tier.name
        const id = _.snakeCase(paper.name+tier.name)
        const line = `execute as @a store result score @s ${objective} run clear @s minecraft:paper{subId: "zmagic:${id}"} 0`
        lines.push(line)
      })
    })
    verb.log('    '+tickPath, 3);
    jp.write(tickPath, lines.join('\n'))
  }

  writeTriggerTick() {
    verb.log('  WRITING SCRIBING TRIGGER TICK...', 2)
    let lines = []
    this.papers.forEach(paper => {
      lines.push(`scoreboard players enable @a scribePage`)
      paper.tiers.forEach((tier, index) => {
        const ingredients = this.getIngredientsScores(paper, index)
        const execute = `execute at @a[scores={scribePage=${tier.trigger},${ingredients}}] run`
        const mcfunction = `function zmagic:scribe/${_.snakeCase(paper.name+tier.name)}`
        const line = `${execute} ${mcfunction}`
        lines.push(line)
      })
      lines.push(`scoreboard players set @a[scores={scribePage=1..}] scribePage -1`)
    })
    verb.log('    '+triggerTickPath, 3);
    jp.write(triggerTickPath, lines.join('\n'))
  }

  writeScribers() {
    verb.log('  WRITING SCRIBERS...', 2)
    this.papers.forEach(paper => {
      paper.tiers.forEach((tier, index) => {
        let color = ''
        switch(index) {
          case 0:
            color = 'green'
            break;
          case 1:
            color = 'aqua'
            break;
          case 2:
            color = 'light_purple'
            break;
        }

        const id = _.snakeCase(paper.name+tier.name)

        const give = `execute as @s[scores={${this.getIngredientsScores(paper, index)}}] run function zmagic:give/page/${id}`
        const line1 = `${give}`
        const pageConsumed = `minecraft:paper{subId:"zmagic:${id}"}`
        const line3 = this.getIngredientsToClear(paper, index)

        const lines = [
          this.getIngredientsToClear(paper, index),
          `${give}`,
        ]

        const writePath = `${scribePath}${id}.mcfunction`
        verb.log('    '+writePath, 3);
        jp.write(writePath, lines.join('\n'))
      })
    })
  }

  writeGivePapers() {
    this.papers.forEach(paper => {
      paper.tiers.forEach((tier, index) => {
        let color = ''
        switch(index) {
          case 0:
            color = 'green'
            break;
          case 1:
            color = 'aqua'
            break;
          case 2:
            color = 'light_purple'
            break;
        }

        const id = _.snakeCase(paper.name+tier.name)

        const item = itemHelper.createItem({
          id: 'minecraft:paper',
          subId: id,
          name: paper.name+' '+tier.name,
          color: color,
          lore: tier.lore,
          ench: {id:0,lvl:0},
          hideFlags: 1
        })

        const lines = [
          `give @s ${item}`
        ]

        const writePath = `${givePath}${id}.mcfunction`
        verb.log('    '+writePath, 3);
        jp.write(writePath, lines.join('\n'))
      })
    })
  }

  writeGiveTome() {
    const entry = JSON.stringify({
      text:`\nIgnus Page I`,
      color:'green',
      italic:'true',
      underlined:'true',
      clickEvent:{
        action:'run_command',
        value: `/trigger scribePage set 10`
      }
    })
    const tome = itemHelper.createItem({
      id: 'minecraft.written_book',
      subId: 'zmagic:scribing_tome',
      name: 'Scribing Tome',
      color: 'aqua',
      lore: 'A tome used for scribing spell pages.',
      ench: {id:0,lvl:0},
      hideFlags: 1,
      pages: [entry]
    })

    jp.write(`./data/zmagic/functions/give/book/scribing_tome.mcfunction`, `give @s ${tome}`)
  }

  writeGivers() {
    verb.log('  WRITING SCRIBING GIVERS...', 2)
    this.writeGivePapers()
    this.writeGiveTome()
  }
}


module.exports = Scribing
