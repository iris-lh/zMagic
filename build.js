const jp = require('fs-jetpack')
const _ = require('lodash')
const yaml = require('js-yaml')

const Verbose = require('./src/helpers/Verbose')
const verb = new Verbose()

const packageJson      = require('./package.json')
const version          = packageJson.version
const buildVersion     = require('./build-count.json')
const minecraftVersion = packageJson.minecraftVersion

const Spell      = require('./src/helpers/Spell')
const Reagents   = require('./src/helpers/Reagents')
const Book       = require('./src/helpers/Book')
const Scribing   = require('./src/helpers/Scribing')
const tagHelpers = require('./src/helpers/tag')
const pipe       = require('./src/helpers/pipe')

const checkBuild = require('./test/check-build')

const contentPath = './src/content/'
const spellsPath  = contentPath+'/spells/'
const booksPath   = contentPath+'/books/'
const tagsPath    = contentPath+'/tags/'

const spells = {}


// FIXME move pack.mcmeta to ./src and copy it to ./build


// TAGS

function buildTags() {
  verb.buildLog('BUILDING TAGS...')
  tagHelpers.writeTickTag('./build/data/minecraft/tags/functions/tick.json')
  tagHelpers.writeTags(tagsPath, './build/data/zmagic/tags/')
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
  verb.buildLog('BUILDING SPELLS...')
  pipe(
    importSpells()
    , processSpells
    , writeSpells
  )
}



// REAGENTS

function buildReagents() {
  verb.buildLog('BUILDING REAGENTS...');
  const reagents = new Reagents
  reagents.writeInit()
  reagents.writeTick()
}



// SCRIBING

function buildScribing() {
  verb.buildLog('BUILDING SCRIBING...');
  const scribingHelpers = new Scribing()
  scribingHelpers.writeInit()
  scribingHelpers.writeTick()
  scribingHelpers.writeTriggerTick()
  scribingHelpers.writeScribers()
  scribingHelpers.writeGivers()
}



// ROOT

function buildInit() {
  verb.buildLog('BUILDING INIT...');
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
  const functionPath = `./build/data/zmagic/functions/init.mcfunction`
  verb.buildLog('  '+functionPath, 3)
  jp.write(functionPath, lines.join('\n'))
}

function buildTick() {
  verb.buildLog('BUILDING TICK...');
    const lines = [
      'function zmagic:tick/triggers/spells',
      'function zmagic:tick/triggers/scribing',
      'function zmagic:tick/scribing',
      'function zmagic:tick/reagents'
    ]
  const functionPath = `./build/data/zmagic/functions/tick.mcfunction`
  verb.buildLog('  '+functionPath, 3)
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
  verb.buildLog('BUILDING BOOKS...')
  pipe(
    importBooks()
    , processBooks
    , writeBooks
  )
}

verb.buildLog(`zMagic ${version} build ${buildVersion+1} for Minecraft ${minecraftVersion}`)

// BUILD
buildSpells()
buildBooks()
buildTags()
buildReagents()
buildScribing()
buildInit()
buildTick()

//CHECK
checkBuild()

jp.write('./build-version.json', _.toString(buildVersion+1))
