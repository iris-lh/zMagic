const construct = require('../helpers/construct.js')

const book = {
  id: 'spellbook',
  content: JSON.stringify({
    title:"Spellbook",
    author:"Zinnoa",
    pages: [
      construct.pages([
        [
          'fireball i',
          'fireball ii',
          'fireball iii'
          // 'summon_golem',
          // 'detect_monsters'
        ]
      ])
    ]
  }
)}

module.exports = book
