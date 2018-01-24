const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const Spell = require('./Spell')
const spellHelpers = new Spell()
const interpolateYaml = require('./interpolate-yaml')

const Verbose = require('./Verbose')
const verb = new Verbose()


class Book {
  constructor(spells) {
    this.spells = spells
    this.constructSpellPage = this.constructSpellPage.bind(this)
    this.constructSpellPages = this.constructSpellPages.bind(this)
    this.import = this.import.bind(this)
    this.importAll = this.importAll.bind(this)
    this.process = this.process.bind(this)
    this.processAll = this.processAll.bind(this)
    this.write = this.write.bind(this)
    this.writeAll = this.writeAll.bind(this)
  }

  constructSpellPage(spellList) {
    let page = []
    spellList.forEach(entry => {
      let json = {}
      if (entry) {
        const spellId = entry.split(' ')[0]
        const spellTier = entry.split(' ')[1]
        const spellTierStr = spellTier ? ' '+_.upperCase(spellTier) : ''
        const spellData = this.spells[_.snakeCase(entry)]
        json = {
          text:`\n${spellData.name}${spellTierStr}`,
          color:spellHelpers.colors[spellData.costTableName],
          italic:'true',
          underlined:'true',
          clickEvent:{
            action:'run_command',
            value: `/trigger cast_spell set ${spellData.tier.trigger}`
          }
        }
      } else {
        json = {
          text:`\n`,
        }
      }

      page.push(json)
    })
    return JSON.stringify(page)
  }

  constructSpellPages(spellLists) {
    let pages = []
    spellLists.forEach(list => {
      pages.push(this.constructSpellPage(list))
    })
    return pages
  }

  import(bookPath) {
    verb.buildLog('    '+bookPath, 3)
    return jp.read(bookPath)
  }

  importAll(booksPath) {
    verb.buildLog('  IMPORTING BOOKS...', 2)
    let bookYamls = []
    const bookFileNames = jp.list(booksPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    bookFileNames.map(fileName => {
      const path = booksPath + fileName
      bookYamls.push(this.import(path))
    })
    return bookYamls
  }

  process(bookYaml) {
    const rawJson = yaml.load(bookYaml)
    const processedBook = yaml.load(interpolateYaml(bookYaml))
    processedBook.content.pages = this.constructSpellPages(processedBook.content.pages)
    verb.buildLog('    '+processedBook.name, 3);
    return processedBook
  }

  processAll(importedBookYamls) {
    verb.buildLog('  PROCESSING BOOKS...', 2);
    let processedBooks = []
    importedBookYamls.map(bookYaml => {
      processedBooks.push(this.process(bookYaml))
    })
    return processedBooks
  }

  write(book) {
    const functionPath = `./data/zmagic/functions/give/book/${_.snakeCase(book.name)}.mcfunction`
    verb.buildLog('    '+functionPath, 3)
    const mcFunction = 'give @p written_book'+JSON.stringify(book.content)

    jp.write(functionPath, mcFunction)
  }

  writeAll(importedBooks) {
    verb.buildLog('  WRITING BOOK GIVERS...', 2)
    return importedBooks.map(book => {
      this.write(book)
    })
  }
}

module.exports = Book
