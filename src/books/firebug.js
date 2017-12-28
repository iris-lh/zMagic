const _ = require('lodash')
const construct = require('../helpers/construct.js')

const book = {
  id: 'firebug',
  content: JSON.stringify({
    title:"Firebug",
    author:"Zinnoa",
    display:{Lore:['Ignan cantrips for the pyromaniac.']},
    pages: [
      construct.page([
        'fireball i',
        'fireball ii',
        'fireball iii',
        'lava_flow'
      ])
    ]
  }
)}

module.exports = book
