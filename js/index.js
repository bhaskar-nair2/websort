// eslint-disable-next-line import/extensions
import { readFile } from './xlsx.js';
import SQL from './sqllite.js'
import stmts from './sqlStmts.js';
import { print, splitJoinArray } from './helpers.js';


// Todo: Get excel files from user
const worker = new SQL()
const tables = worker.tables

const searchFileIn = document.getElementById('searchFileIn');
const sortFileIn = document.getElementById('sortFileIn');
const startBtn = document.getElementById('startBtn');


let searchFile, sortFile;

// Event listners for elements
searchFileIn.addEventListener('input', async (event) => {
  searchFile = event.target.files[0];
});

sortFileIn.addEventListener('input', async (event) => {
  sortFile = event.target.files[0];
});

startBtn.addEventListener('click', start)

// Main Thread
async function start() {
  // Init db
  await worker.init()

  // Todo: Convert excel to JSON
  // Read Search File
  const searchFileData = await readFile(searchFile);
  const sortFileData = await readFile(sortFile);


  // Search data functions
  const splits = tables.map(tab =>
    Array.prototype.concat(
      ...searchFileData.splice(0,
        document.getElementById(tab.count).value)
    )
  )
  tables.forEach((tab, index) => {
    worker.addSearchData(tab.table, splits[index])
    worker.logTableData(tab.table)
  })
  print(`Search Data Added!`);

  // Indent data functions
  worker.addIndentData(sortFileData[0])

  console.table(worker.db.exec(`select * from notFoundView`))

  window.worker = worker
}


// Todo: Perform Quiries
// Todo: Generate result file in excel
