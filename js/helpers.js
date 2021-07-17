const outputElm = document.getElementById('output');

// eslint-disable-next-line import/prefer-default-export
export function print(text) {
  outputElm.value += `${text}\n`;
  outputElm.scrollTop = outputElm.scrollHeight
}

export function clear() {
  outputElm.value = ''
}

// takes an array of arrays. groups by given length. 
// then joins the group into a single array
export function splitJoinArray(array = [], start, end) {
  return Array.prototype.concat(...array.slice(start, end))
}

// SQL DATA

export const alias_ignore = ['tab', 'mg', 'oint', 'ml', 'ointment', 'cap', 'per', 'mg', 'gm', 'amp', 'ampoule', 'cream', 'bott', 'bottle']

export const guess_ignore = [
  'insulin', 'collection', 'purified', 'equivalent',
  'containing', 'prefilled', 'syringe', 'closing',
  'polythene', 'envelope', 'facility', 'disposable',
  'plastic', 'sterile', 'suspension', 'inhaler', 'needles',
  'injection', 'culture', 'solution', 'combination',
  'sulphate', 'acetate', 'chloride',
  'test', 'kit', 'water', 'vial'
]

function clean(val = '', type) {
  val = val.toLowerCase().trim()

  alias_ignore.forEach(term => {
    val = val.replace(term, '').trim()
  })

  if (type == 'guess') {
    val = val.replace(_, '').trim()
    guess_ignore.forEach(term => {
      val = val.replace(term, '').trim()
    })
  }

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
