import { worker } from "./index.js";
import { clean } from "./helpers.js";


/**
 * Create the guesses 
 * @param {Array} data list of drugs 
 */
export const createGuesses = function (list = []) {
  const matches = []
  if (list && list.length) {
    for (let item of list[0].values) {
      const words = getSignificantWords(item[1])
      let res = []
      for (let word of words) {
        res.push(...worker.getMatchingGuess(word))
      }
      if (res.length)
        matches.push({ item, res })
    }
  }
  const fMatches = formatMatches(matches)
  return fMatches
}

/**
 * Create an array of significant words (l>4/l>5) for a particular Drug Name
 * @param {String} str 
 * @returns {Array} Significant Words
 */
const getSignificantWords = function (str = '') {
  let val = clean(str, 'guess')
  let words = val.split(' ').filter(w => w.length > 5)
  if (words.length <= 2)
    words = val.split(' ').filter(w => w.length > 4)
  return words
}

/**
 * Formatter function to convert generated input to Writeable input
 * @param {Array} matches 
 * @returns {Array{Object}} Formatted DS
 */
const formatMatches = function (matches = []) {
  const formatted = {}

  formatted.columns =
    ["contract", "name", "coy", "rate", "gst", "supplier"]
  formatted.values = []

  matches.forEach(function (val) {
    formatted.values.push(val.item)
    formatted.values.push(...val.res[0].values)
    // * to improve readability
    formatted.values.push(['------------XX (ᕗ ͡^ ͜ʖ ͡^)ᕗ XX-----------'])
    formatted.values.push(['                                 '])
  })
  return [formatted]
}
