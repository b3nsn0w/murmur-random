const murmur = require('./murmur')
const keygen = require('./keygen')

const separate = (min, max) => max != null ? [Math.abs(max - min), Math.min(min, max)] : [Math.abs(min), 0]

const float = (value, min, max) => {
  const [difference, offset] = separate(min, max)
  return value * difference + offset
}

const int = (value, min, max) => {
  return Math.floor(float(value, min, max))
}

const from = (value, array) => {
  return array[int(value, array.length)]
}

const repeat = (value, func, min, max) => {
  return new Array(int(value, min, max)).fill().map((v, i) => func(i))
}

const chance = (value, probability) => {
  return value < probability
}

const point = (value, min, max, ymin, ymax) => {
  return {
    x: float(murmur([value, keygen('x')]), min, max),
    y: float(murmur([value, keygen('y')]), ymin != null ? ymin : min, ymin != null ? ymax : max)
  }
}

const pick = (value, array, amount) => {
  const index = int(value, array.length)
  const currentPick = array[index]

  if (amount <= 1) return [currentPick]

  const arrayWithout = [...array.slice(0, index), ...array.slice(index + 1)]
  return [currentPick, ...pick(murmur([value, keygen('nextPick')]), arrayWithout, amount - 1)]
}

module.exports = {
  float,
  int,
  from,
  repeat,
  chance,
  point,
  pick
}
