const _ = require('lodash')
const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const SpellHelpers = require('./spell-helpers')
const spellHelpers = new SpellHelpers()
const interpolateYaml = require('./interpolate-yaml')


class BookHelpers {
  constructor(spells) {
    this.spells = spells
    this.constructPage = this.constructPage.bind(this)
    this.constructPages = this.constructPages.bind(this)
    this.importBooks = this.importBooks.bind(this)
    this.processBook = this.processBook.bind(this)
    this.processBooks = this.processBooks.bind(this)
    this.writeBook = this.writeBook.bind(this)
    this.writeBooks = this.writeBooks.bind(this)
  }

  constructPage(spellList) {
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
            value:`/function zinnoa:spells/${spellData.id}`
            // TODO: value:`/trigger ${spellData.trigger} set 1`
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

  constructPages(spellLists) {
    let pages = []
    spellLists.forEach(list => {
      pages.push(this.constructPage(list))
    })
    return pages
  }

  importBook(bookPath) {
    console.log('  '+bookPath)
    return jp.read(bookPath)
  }

  importBooks(booksPath) {
    console.log('IMPORTING BOOKS...')
    let bookYamls = []
    const bookFileNames = jp.list(booksPath).filter(fileName => {
      return fileName.match('.yaml')
    })
    bookFileNames.map(fileName => {
      const path = booksPath + fileName
      bookYamls.push(this.importBook(path))
    })
    return bookYamls
  }

  processBook(bookYaml) {
    const rawJson = yaml.load(bookYaml)
    const processedBook = yaml.load(interpolateYaml(bookYaml))
    processedBook.content.pages = this.constructPages(processedBook.content.pages)
    console.log('  '+processedBook.name);
    return processedBook
  }

  processBooks(importedBookYamls) {
    console.log('PROCESSING BOOKS...');
    let processedBooks = []
    importedBookYamls.map(bookYaml => {
      processedBooks.push(this.processBook(bookYaml))
    })
    return processedBooks
  }

  writeBook(book) {
    const functionPath = `./data/zinnoa/functions/books/${_.snakeCase(book.name)}.mcfunction`
    console.log('  '+functionPath)
    const mcFunction = 'give @p written_book'+JSON.stringify(book.content)

    jp.write(functionPath, mcFunction)
  }

  writeBooks(importedBooks) {
    console.log('WRITING BOOKS...')
    return importedBooks.map(book => {
      this.writeBook(book)
    })
  }
}

module.exports = BookHelpers
