// eslint-disable-next-line import/extensions
import { print } from './helpers.js';

const { XLSX } = window;

const excelFileToUT8Array = function (file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Problem reading input file.'));
    };

    reader.onload = (e) => {
      const ut8ar = new Uint8Array(e.target.result);
      resolve(ut8ar);
    };

    reader.readAsArrayBuffer(file);
  });
};

const UT8ArraytoJSON = async function (ut8ar) {
  try {
    const workbook = XLSX.read(ut8ar, { type: 'array' });
    const jsonData = [];

    // const p = new Parallel(Object.values(workbook.Sheets));

    console.log(Object.values(workbook.Sheets));

    // const data = await p.map(XLSX.utils.sheet_to_json)
    // console.log(data)

    workbook.SheetNames.forEach((sheet) => {
      print(`Now reading sheet ${sheet}`);
      const newArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
        header: 'A', // header type
        range: 2,
      });

      print(`Enteries: ${newArr.length}`);
      // ! Returns data split by by sheets 
      jsonData.push(newArr);
    });

    return jsonData;
  } catch (error) {
    console.error(error);
    throw new Error('Error in parsing File')
  }
};

// eslint-disable-next-line import/prefer-default-export
export const readFile = async function (file) {
  const ut8ar = await excelFileToUT8Array(file);
  const jsonData = await UT8ArraytoJSON(ut8ar);
  return jsonData;
};

export const writeFile = async function (lists) {
  var wb = XLSX.utils.book_new();

  for (const [list, nm] of lists) {
    console.log(list, nm);
    if (list && list.length) {
      var ws_data = [
        list[0].columns, // headers
        ...list[0].values  // values
      ];
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, nm);
    }

  }

  XLSX.writeFile(wb, 'out.xlsx');
}
