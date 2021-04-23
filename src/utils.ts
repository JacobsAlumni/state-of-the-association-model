/**
 * Implements lexiographic ordering on strings
 * @param a First string to compare
 * @param b Second string to compare
 * @returns 0 when the strings are equal, -1 if a comes before b, 1 if b comes before a.
 */
export function compareStrings (a: string, b: string): number {
  switch (true) {
    case a < b:
      return -1
    case a > b:
      return 1
    default:
      return 0
  }
}

/** A cloneable object is any object that can be passed to JSON.stringify() */
export type Cloneable = null | number | boolean | string | Cloneable[] | { [key: string]: Cloneable }

/**
 * Makes a deep clone of a cloneable object.
 *
 * @param obj Object to clone, may be a primitive, an object, or an array.
 * @returns a clone of the object
 */
export function deepClone<T extends Cloneable> (obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
