export default {
  createSearchTable(tname, type) {
    let stmt = `create table ${tname} (`;
    stmt += 'contract varchar(20) not null,';
    stmt += 'name  varchar(200) not null,';
    stmt += 'alias varchar(200) not null,';
    stmt += 'unit varchar(20),';
    stmt += 'coy  varchar(30),';
    stmt += 'rate int default 0,';
    stmt += 'gst int default 12,';
    stmt += 'supplier varchar(50),';
    stmt += 'to_date varchar(50),';
    stmt += 'from_date varchar(50)';
    // stmt += 'primary key (contract)';
    stmt += ')';
    return stmt;
  },

  createIndentTable(tname) {
    return `create table ${tname} (indref varchar(200), name varchar(200), alias varchar(200), qty int)`
  },

  createViewForTable(vname, tname, itname) {
    const cols = "i.indref, g.contract, g.name, g.unit, g.coy, g.rate, i.qty, g.rate*i.qty as amount, g.gst, (g.rate*i.qty*gst)+(g.rate*i.qty) as totalAmount, g.supplier"

    let stmt = `CREATE view ${vname} as `;
    stmt += `select ${cols} from ${tname} g, ${itname} i `
    stmt += `WHERE g.name like i.name `
    stmt += `or g.alias like i.alias `
    // stmt += `or i.name like "%"||g.name||"%"  `
    // stmt += `or i.alias like "%"||g.alias||"%" `

    console.log(stmt);

    return stmt
  },

  createNotFoundView(vname, itname, views) {
    const stmt = `CREATE view ${vname} as 
    select i.indref, i.name, i.qty 
    from ${itname} i 
    WHERE indref not in (select indref from ${views[0]}) 
    and indref not in (select indref from ${views[1]}) 
    and indref not in (select indref from ${views[2]});`

    return stmt
  },

  insertInSearch(tname) {
    return `insert into ${tname} values (${nm(10)}) `;
  },

  insertInIndent(tname) {
    return `insert into ${tname} values (${nm(4)}) `;
  },

  // Demo
  createDm() {
    return 'create table search (contract varchar(20), name varchar(200) not null)'
  },

  insertDm(tname) {
    return `insert into ${tname} values ( :0, :1)`
  },

  getMatching(word, tname) {
    return `select contract, name, coy, rate, gst, supplier from ${tname} where name like '%${word}%'`
  }
};

/**
 * Return ?, ?, ? len number of times
 * @param {Number} len 
 * @returns ?, ?, ?
 */
const nm = (len) => Array.from(Array(len).keys()).reduce((acc, _, cur) => {
  let sm = acc;
  sm += `?`;
  sm += cur < len - 1 ? ', ' : ' ';
  return sm;
}, '');
