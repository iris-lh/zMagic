const jp = require('fs-jetpack')
const _ = require('lodash')

const spellsPath = './src/spells'
const constantsPath = './src/constants'
const booksPath = './src/books'
const costTiers = require(constantsPath+'/cost-tiers.json')

const spellList = [
  'fireball',
  'lava_flow'
]

const bookList = [
  'spellbook',
  'firebug'
]

const pipe = (arg, ...fns) => {
  const _pipe = (f, g) => {
    return (arg) => {
      return g(f(arg))
    }
  }
  return fns.reduce(_pipe)(arg)
}

function importSpells(spellList) {
  console.log('IMPORTING SPELLS...')
  return spellList.map(spellId => {
    const spellPath = `${spellsPath}/${spellId}.js`
    console.log('  '+spellPath)
    return require(spellPath)
  })
}

function hydrateSpellTiers(spells) {
  let hydratedSpells = []
  spells.map(spell => {
    spell.tiers.map(tier => {
      const hydratedSpell = {
        name: spell.name,
        id: spell.id,
        tier: tier.name,
        isOneOff: spell.tiers.length > 1 ? false : true,
        mcfunction: spell.getMcFunction(tier)
      }
      hydratedSpells.push(hydratedSpell)
    })
  })
  return hydratedSpells
}

function writeSpells(hydratedSpells) {
  console.log('WRITING SPELLS...')
  return hydratedSpells.map(spell => {
    const tierStr = spell.isOneOff ? '' : `_${_.lowerCase(spell.tier)}`
    const functionPath = `./data/zinnoa/functions/spells/${spell.id}${tierStr}.mcfunction`
    console.log('  '+functionPath)
    jp.write(functionPath, spell.mcfunction)
  })
}

function buildInitReagentScores(costTiers) {
  let lines = []
  _.forOwn(costTiers, function(value, key) {
    const line0 = `scoreboard objectives add ${value.resource} dummy`
    const line1 = `scoreboard objectives add ${value.name} dummy`
    lines.push(line0, line1)
    for (var i=0; i<value.tiers.length; i++) {
      const line = `scoreboard players add ${i} ${value.name} ${value.tiers[i]}`
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
    const line = `execute store result score @a ${value.resource} run clear @a minecraft:${value.resource} 0`
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

function importBooks(bookList) {
  console.log('IMPORTING BOOKS...')
  return bookList.map(bookId => {
    const bookPath = `${booksPath}/${bookId}.js`
    console.log('  '+bookPath)
    return require(bookPath)
  })
}

function writeBooks(importedBooks) {
  console.log('WRITING BOOKS...')
  return importedBooks.map(book => {
    const functionPath = `./data/zinnoa/functions/books/${book.id}.mcfunction`
    console.log('  '+functionPath)
    jp.write(functionPath, 'give @p written_book'+book.content)
  })
}

pipe(
  spellList
  , importSpells
  , hydrateSpellTiers
  , writeSpells
)

pipe(
  bookList
  , importBooks
  , writeBooks
)

writeScoreboards()
