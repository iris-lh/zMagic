const jp = require('fs-jetpack')
const _ = require('lodash')
const yaml = require('js-yaml')

const Spell = require('./src/helpers/Spell')
const Book = require('./src/helpers/Book')
const tagHelpers = require('./src/helpers/tag')
const interpolateYaml = require('./src/helpers/interpolate-yaml')
const pipe = require('./src/helpers/pipe')

const constantsPath = './src/constants/'
const contentPath   = './src/content/'
const spellsPath    = contentPath+'/spells/'
const initsPath     = contentPath+'/init/'
const booksPath     = contentPath+'/books/'
const tagsPath      = contentPath+'/tags/'

const costTiers = require(constantsPath+'/cost-tiers.json')



const spells = {}



// TODO RAW FUNCTIONS

// TODO RAW RECIPES

// TODO FANCY RECIPES

// TODO STRUCTURES

// TODO LOOT TABLES

// TODO SPELL TRIGGERS
// TODO SCRIBING TRIGGERS

// TODO INIT



// TAGS

function writeTags() {
  tagHelpers.writeTickTag('./data/minecraft/tags/functions/tick.json')
  tagHelpers.writeTags(tagsPath, './data/zmagic/tags/')
}



// SPELLS

function importSpells() {
  const spellHelpers = new Spell()
  return spellHelpers.importAll(spellsPath)
}

function processSpells(importedSpellYamls) {
  const spellHelpers = new Spell()
  const processedSpells = spellHelpers.processAll(importedSpellYamls)
  processedSpells.forEach(spell => {
    spells[spell.id] = spell
  })
  return processedSpells
}

function writeSpells(processedSpells) {
  const spellHelpers = new Spell()
  spellHelpers.writeAll(processedSpells)
  spellHelpers.writeTriggers(processedSpells)
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

  const functionPath = `./data/zmagic/functions/init/reagents.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}

function buildUpdateReagentScores(costTiers) {
  let lines = []
  _.forOwn(costTiers, function(value, key) {
    const line = `execute as @a store result score @s ${value.resource} run clear @s minecraft:${value.resource} 0`
    lines.push(line)
  });
  const functionPath = `./data/zmagic/functions/reagents/tick.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}

function writeScoreboards() {
  console.log('WRITING SCOREBOARDS...');
  buildInitReagentScores(costTiers)
  buildUpdateReagentScores(costTiers)
}


function writeInit() {
  console.log('WRITING INIT...');
    const lines = [
      'function zmagic:init/spells',
      'function zmagic:init/reagents'
    ]
  const functionPath = `./data/zmagic/functions/init.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}

function writeTick() {
  console.log('WRITING TICK...');
    const lines = [
      'function zmagic:triggers/spells/tick',
      'function zmagic:reagents/tick'
    ]
  const functionPath = `./data/zmagic/functions/tick.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}



// BOOKS


function importBooks() {
  const bookHelpers = new Book(spells)
  return bookHelpers.importAll(booksPath)
}

function processBooks(importedBookYamls) {
  const bookHelpers = new Book(spells)
  return bookHelpers.processAll(importedBookYamls)
}

function writeBooks(processedBooks) {
  const bookHelpers = new Book(spells)
  bookHelpers.writeAll(processedBooks)
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
writeInit()
writeTick()
