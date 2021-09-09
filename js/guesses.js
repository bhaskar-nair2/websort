import { worker } from "./index.js";
import { clean } from "./helpers.js";


/**
 * Create the guesses 
 * @param {Array} data list of drugs 
 */
export const createGuesses = function (list = []) {
  const matches = []
  console.log(list);
  if (list && list.length) {
    for (let item of list[0].values) {
      const words = getSignificantWords(item[1])
      for (let word of words) {
        let res = worker.getMatchingGuess(word)
        console.log(res);
        if (res.length)
          matches.push({ item, res })
      }
    }
  }
  const fMatches = formatMatches(matches)
  console.log(fMatches);
  return fMatches
}

const getSignificantWords = function (str = '') {
  let val = clean(str)
  let words = val.split(' ').filter(w => w.length > 5)
  if (words.length == 0)
    words = val.split(' ').filter(w => w.length > 4)
  return words
}

const formatMatches = function (matches = []) {
  const formatted = {}
  formatted['columns'] =
    ["contract", "name", "coy", "rate", "gst", "supplier"]
  formatted['values'] = []
  matches.forEach(function (val) {
    formatted['values'].push(val.item)
    formatted['values'].push(...val.res[0].values)
    formatted['values'].push(['------------XX (ᕗ ͡^ ͜ʖ ͡^)ᕗ XX------------'])
  })
  return [formatted]
}
