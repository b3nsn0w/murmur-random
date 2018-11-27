const murmur = require('./murmur')

const toArray = string => String(string).split('').map(c => c.charCodeAt(0))
const toKey = array => new Float32Array(new Uint32Array([murmur(array, true)]).buffer)[0]

const keys = {}

/**
 * Turns a string into a numeric key for the random generator
 *
 * **Warning:** all strings are indefinitely cached, don't use cache with dynamic input
 *
 * @param {string} string Identifier of the key
 * @param {boolean} cache Set to false to avoid cache (helpful for seeds)
 */

module.exports = function keygen (string, cache = true) {
  if (!cache) return toKey(toArray(string))

  const cached = keys[string]
  if (cached) return cached

  const key = toKey(toArray(string))
  keys[string] = key
  return key
}
