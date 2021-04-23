import { compareStrings, deepClone, Cloneable } from './utils'

describe(compareStrings, () => {
  // strings in ascending order to be compared
  const compareStringTests = [
    'a',
    'aa',
    'bb',
    'brown',
    'c',
    'd',
    'dog',
    'fox',
    'jumped',
    'lazy',
    'over',
    'the'
  ]

  it('returns equal strings as 0', () => {
    compareStringTests.forEach(s => {
      expect(compareStrings(s, s)).toBe(0)
    })
  })

  it('returns -1 when the first string is smaller', () => {
    for (let i = 0; i < compareStringTests.length; i++) {
      for (let j = i + 1; j < compareStringTests.length; j++) {
        expect(compareStrings(compareStringTests[i], compareStringTests[j])).toBe(-1)
      }
    }
  })

  it('returns 1 when the first string is larger', () => {
    for (let i = 0; i < compareStringTests.length; i++) {
      for (let j = 0; j < i; j++) {
        expect(compareStrings(compareStringTests[i], compareStringTests[j])).toBe(1)
      }
    }
  })
})

describe(deepClone, () => {
  const deepCloneTests: Cloneable[] = [
    0, 1, -1, 1.0, -1.0,
    null,
    true, false,
    'hello', 'world',
    ['hello', 'world', 123], [],
    {}, { a: 'b' }
  ]

  it('clones objects', () => {
    deepCloneTests.forEach(o => {
      expect(deepClone(o)).toStrictEqual(o)
    })
  })
})
