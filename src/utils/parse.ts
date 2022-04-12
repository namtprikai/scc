import { camelCase, mapKeys, snakeCase } from 'lodash'

export const camelizeKeys = (obj: any, options: {deep: boolean, stopPath?: string[]} = { deep: false }): any => {
  const { deep, stopPath } = options
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v, options))
  } else if (obj != null && obj.constructor === Object) {
    if (deep) {
      return Object.keys(obj).reduce(
        (result, key) => {
          if (stopPath?.includes(key)) {
            return {
              ...result,
              [key]: obj[key]
            }
          }
          return {
            ...result,
            [camelCase(key)]: camelizeKeys(obj[key], options)
          }
        },
        {}
      )
    } else {
      return mapKeys(obj, (v, k) => camelCase(k))
    }
  }
  return obj
}

export const snakeKeys = (obj: any, options: {deep: boolean, stopPath?: string[]} = { deep: false }): any => {
  const { deep, stopPath } = options
  if (Array.isArray(obj)) {
    return obj.map(v => snakeKeys(v, options))
  } else if (obj != null && obj.constructor === Object) {
    if (deep) {
      return Object.keys(obj).reduce(
        (result, key) => {
          if (stopPath?.includes(key)) {
            return {
              ...result,
              [key]: obj[key]
            }
          }
          return {
            ...result,
            [snakeCase(key)]: snakeKeys(obj[key], options)
          }
        },
        {}
      )
    } else {
      return mapKeys(obj, (v, k) => snakeCase(k))
    }
  }
  return obj
}
