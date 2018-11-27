const murmur = require('./murmur')
const keygen = require('./keygen')
const util = require('./util')

function createSeed (seed, length = 4) {
  const seedKey = Array.isArray(seed) ? seed : [keygen(seed, false)]

  return new Array(length).fill().map((v, i) => murmur([i, ...seedKey], true))
}

/**
 * Creates a deterministic random generator
 *
 * @param {...number} seed Raw seed of the random generator
 */

function random (seed) {
  /**
   * Creates a subgenerator from the current one
   *
   * @param {string} key Key of the subgenerator
   * @param  {...number} params Parameters affecting the subgenerator's seed
   */

  function subgen (key, ...params) {
    return random(createSeed([...seed, keygen(key), ...params]))
  }

  /**
   * Retrieves a value from the random generator
   *
   * **Warning:** keys are cached indefinitely, keep them constant
   *
   * @param {string} key Key of the random value
   * @param  {...number} params Parameters affecting the value
   */

  function value (key, ...params) {
    return murmur([...seed, keygen(key), ...params])
  }

  return { seed, subgen, value, util }
}

/**
 * Creates a deterministic random generator
 *
 * @param {string} seed Seed of the random generator
 */

function createRandom (seed) {
  return random(createSeed(seed))
}

module.exports = createRandom
module.exports.raw = random
