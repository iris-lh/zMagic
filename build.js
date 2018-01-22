const jp = require('fs-jetpack')
const _ = require('lodash')
const yaml = require('js-yaml')

const packageJson      = require('./package.json')
const version          = packageJson.version
const minecraftVersion = packageJson.minecraftVersion

const Spell = require('./src/helpers/Spell')
const Reagents = require('./src/helpers/Reagents')
const Book = require('./src/helpers/Book')
const Scribing = require('./src/helpers/Scribing')
const tagHelpers = require('./src/helpers/tag')
const pipe = require('./src/helpers/pipe')

const contentPath   = './src/content/'
const spellsPath    = contentPath+'/spells/'
const booksPath     = contentPath+'/books/'
const tagsPath      = contentPath+'/tags/'



const spells = {}

// TODO split spell commands into effects (do the thing for free) and casts (do the effect if conditions are met)
// TODO nbt/json helpers
// TODO item helper
// TODO error handling!
// TODO tests/checks
// TODO get a roman numeral converter up in here, probably
// TODO verbose/quiet modes
// TODO raw/fancy function helper
// TODO raw/fancy recipe helper
// TODO structures???
// TODO loot tables???



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

function writeReagents() {
  console.log('WRITING SCOREBOARDS...');
  const reagents = new Reagents
  reagents.writeInit()
  reagents.writeTick()
}



// SCRIBING

function writeScribing() {
  console.log('WRITING SCRIBING...');
  const scribingHelpers = new Scribing()
  scribingHelpers.writeInit()
  scribingHelpers.writeTick()
  scribingHelpers.writeTriggerTick()
  scribingHelpers.writeScribers()
  scribingHelpers.writeGivers()
}



// ROOT

function writeInit() {
  console.log('WRITING INIT...');
    const lines = [
      // TODO 'function zmagic:greet'
      // TODO 'function zmagic:version'
      'tellraw @p {"text":"\\nThank you for using Zinnoa\'s Magic Pack!", "color":"aqua"}',
      `tellraw @p {"text":"Version: zMagic ${version} for Minecraft ${minecraftVersion}", "color":"dark_aqua"}`,
      'tellraw @p {"text":"\\nInitializing...", "color":"aqua"}',
      'function zmagic:init/spells',
      'function zmagic:init/reagents',
      'function zmagic:init/scribing',
      'tellraw @p {"text":"Done. Enjoy!\\n", "color":"aqua"}'
    ]
  const functionPath = `./data/zmagic/functions/init.mcfunction`
  console.log('  '+functionPath)
  jp.write(functionPath, lines.join('\n'))
}

function writeTick() {
  console.log('WRITING TICK...');
    const lines = [
      'function zmagic:tick/triggers/spells',
      'function zmagic:tick/triggers/scribing',
      'function zmagic:tick/scribing',
      'function zmagic:tick/reagents'
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
writeReagents()
writeScribing()
writeInit()
writeTick()
