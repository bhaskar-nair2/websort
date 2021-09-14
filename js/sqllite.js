import stmts from './sqlStmts.js';
import { print, makeAlias } from './helpers.js';

// const stmt = db.prepare(stmts.insert('search'));
// stmt.getAsObject(Object.values(sample));

export default class SQLWorker {

  tables = [
    { table: 'gpaTable', view: 'gpaView', count: 'paCount' },
    { table: 'spaTable', view: 'spaView', count: 'spaCount' },
    { table: 'rclTable', view: 'rclView', count: 'rcCount' },
  ]

  indentTable = 'indTable'
  notFoundView = 'notFoundView'

  initSqlJs = window.initSqlJs

  async init() {
    print(`Initiating WebSQL system`);

    this.SQL = await this.initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    this.db = new this.SQL.Database();

    // Create search Tables & Views
    this.tables.forEach(tab => {
      this.db.exec(stmts.createSearchTable(tab.table));
      this.db.exec(stmts.createIndex(tab.table))
      this.db.exec(stmts.createViewForTable(tab.view, tab.table, this.indentTable));
    })

    // Create 1 table to store indent data
    this.db.exec(stmts.createIndentTable(this.indentTable));

    // Create Not-found view
    this.db.exec(
      stmts.createNotFoundView(
        this.notFoundView,
        this.indentTable,
        this.tables.map(t => t.view)
      )
    );

    print(`WebSQL system ready!`);
  }

  formatSearchItem(item) {
    return [
      item['C'], //contract:
      item['D'], //name:
      makeAlias(item['D']), //alias:
      item['E'] || '', //unit: or AU
      item['F'] || '', //coy: company
      item['G'] || 0, //rate:
      item['J'] || 12, //gst:
      item['L'] || '', //supplier:
      item['M'] || '', //to:
      item['N'] || '', //from:
    ]
  }

  // ! Will recieve an array
  addSearchData(table, arr = []) {
    print(`Adding data to ${table}`);

    arr.forEach(item => {
      const formattedItem = this.formatSearchItem(item)
      try {
        const stmt = this.db.prepare(stmts.insertInSearch(table))
        stmt.run(formattedItem)
        stmt.free()
      } catch (error) {
        console.error(error, formattedItem);
        print(
          `Error in Item: ${item['C'] || item['D'] || 'Missing Name!'}`, true
        )
      }
    })
  }

  formatIndentItem(item) {
    return [
      item['A'], // indref
      item['B'], // name
      makeAlias(item['B']), // alias
      item['D'] || '', // qty 
    ]
  }

  addIndentData(arr = []) {
    const tableName = this.indentTable

    arr.forEach(item => {
      const formattedItem = this.formatIndentItem(item)
      try {
        const stmt = this.db.prepare(stmts.insertInIndent(tableName))
        stmt.run(formattedItem)
        stmt.free()
      } catch (error) {
        console.error(error, item);
        print(`Error in Item: ${item['A'] || item['B'] || 'Missing Name!'}`)
        print('Please check if all required fields are provided')
      }
    })

  }


  getMatchingGuess(word) {
    const res = []
    for (let tab of this.tables)
      res.push(...this.db.exec(stmts.getMatching(word, tab.table)))
    return res
  }

  getTableData(tname) {
    return this.db.exec(`select * from ${tname}`)
  }
}

