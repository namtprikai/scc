import camelCaseKeys from 'camelcase-keys'

export const parseToCamelCase = (object: any, ...options: any[]) => {
  return camelCaseKeys(object, ...options)
}
