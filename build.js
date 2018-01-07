const jp = require('fs-jetpack')
const _ = require('lodash')
const yaml = require('js-yaml')
const SpellHelpers = require('./src/helpers/spell-helpers')
const BookHelpers = require('./src/helpers/book-helpers')
const tagHelpers = require('./src/helpers/tag-helpers')
const interpolateYaml = require('./src/helpers/interpolate-yaml')

const spellsPath = './src/spells/'
const constantsPath = './src/constants/'
const booksPath = './src/books/'
const tagsPath = './src/tags/'
const costTiers = require(constantsPath+'/cost-tiers.json')

const spells = {}

const pipe = (arg, ...fns) => {
  const _pipe = (f, g) => {
    return (arg) => {
      return g(f(arg))
    }
  }
  return fns.reduce(_pipe)(arg)
}



// TAGS

function writeTags() {
  tagHelpers.writeTickTag('./data/minecraft/tags/functions/tick.json')
  tagHelpers.writeTags(tagsPath, './data/zinnoa/tags/')
}



// SPELLS

function importSpells() {
  const spellHelpers = new SpellHelpers()
  return spellHelpers.importSpells(spellsPath)
}

function processSpells(importedSpellYamls) {
  const spellHelpers = new SpellHelpers()
  const processedSpells = spellHelpers.processSpells(importedSpellYamls)
  processedSpells.forEach(spell => {
    spells[spell.id] = spell
  })
  return processedSpells
}

function writeSpells(processedSpells) {
  const spellHelpers = new SpellHelpers()
  spellHelpers.writeSpells(processedSpells)
}

function buildSpells() {
  pipe(
    importSpells()
    , processSpells
    , writeSpells
  )
}




// REAGENTS

function buildInitReagentScores(costTiers) {
  let lines = []
  _.forOwn(costTiers, function(value, key) {
    const line0 = `scoreboard objectives add ${value.resource} dummy`
    const line1 = `scoreboard objectives add ${value.name} dummy`
    lines.push(line0, line1)
    for (var i=0; i<value.tiers.length; i++) {
      const line = `scoreboard players set ${i} ${value.name} ${value.tiers[i]}`
      lines.push(line)
    }
  });

  const functionPath = `./data/zinnoa/functions/sys/init_reagent_scores.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))

}

function buildUpdateReagentScores(costTiers) {
  let lines = []
  _.forOwn(costTiers, function(value, key) {
    const line = `execute as @a store result score @s ${value.resource} run clear @s minecraft:${value.resource} 0`
    lines.push(line)
  });
  const functionPath = `./data/zinnoa/functions/sys/update_reagent_scores.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}

function writeScoreboards() {
  console.log('WRITING SCOREBOARDS...');
  buildInitReagentScores(costTiers)
  buildUpdateReagentScores(costTiers)
}



// BOOKS


function importBooks() {
  const bookHelpers = new BookHelpers(spells)
  return bookHelpers.importBooks(booksPath)
}

function processBooks(importedBookYamls) {
  const bookHelpers = new BookHelpers(spells)
  return bookHelpers.processBooks(importedBookYamls)
}

function writeBooks(processedBooks) {
  const bookHelpers = new BookHelpers(spells)
  bookHelpers.writeBooks(processedBooks)
}

function buildBooks() {
  pipe(
    importBooks()
    , processBooks
    , writeBooks
  )
}



buildSpells()
buildBooks()
writeTags()
writeScoreboards()
