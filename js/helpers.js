const outputElm = document.getElementById('outputLogs');
const errorElm = document.getElementById('errorLogs');


// eslint-disable-next-line import/prefer-default-export
export function print(text, error = false) {
  const elm = error ? errorElm : outputElm;
  elm.value += `${text}\n`;
  elm.scrollTop = elm.scrollHeight
}

export function clear() {
  outputElm.value = ''
  errorElm.value = ''
}

// takes an array of arrays. groups by given length. 
// then joins the group into a single array
export function splitJoinArray(array = [], start, end) {
  return Array.prototype.concat(...array.slice(start, end))
}

// SQL DATA

const alias_ignore = ['tab', 'mg', 'oint', 'ml', 'ointment', 'cap', 'per', 'mg', 'gm', 'amp', 'ampoule', 'cream', 'bott', 'bottle']

const guess_ignore = [
  'insulin', 'collection', 'purified', 'equivalent',
  'containing', 'prefilled', 'syringe', 'closing',
  'polythene', 'envelope', 'facility', 'disposable',
  'plastic', 'sterile', 'suspension', 'inhaler', 'needles',
  'injection', 'culture', 'solution', 'combination',
  'sulphate', 'acetate', 'chloride',
  'test', 'kit', 'water', 'vial', 'powder', 'sodium'
]

export function clean(val = '', type) {
  val = val.toLowerCase().trim()

  // Filter ignored words
  let arr = val.split(' ')
  arr = arr.filter(s => !alias_ignore.includes(s))
  if (type == 'guess')
    arr = arr.filter((s = '') => !guess_ignore.includes(s))
  val = arr.join(' ')

  // RegEx Cleaning
  val = val.replace(/[(\[].+?[)\]]/i, ' ')
  val = val.replace(/[!@#$%^&*(),.?`\'"/:{}|<>+=-]/i, ' ')
  return val
}

// Tales a word
export function makeAlias(val = '') {
  val = clean(val, 'alias')
  let arr = val.split(' ')
  arr.sort()
  val = arr.join('')
  // val = ''.join(e for e in val if e.isalnum());
  return val.replace(' ', '')
}
