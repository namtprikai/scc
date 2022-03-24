import i18n from '@/lang'
import { ValidationType } from '@/utils/request'
import { TranslateResult } from 'vue-i18n'
export const isValidUsername = (str: string) => {
  return str.trim() !== ''
}

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const isValidURL = (url: string) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

// type: validation type
// name: name: validation property
// value: example: length, min value, max value ...
export const getValidationMessage = (type: ValidationType, name: string | null | undefined | TranslateResult = null, value: number | null = null): string | TranslateResult => {
  switch (type) {
    case ValidationType.Null:
      return i18n.t('validError.required', { _field_: name })
    case ValidationType.Empty:
      return i18n.t('validError.required', { _field_: name })
    case ValidationType.Min:
      return i18n.t('validError.min', { _field_: name, length: value })
    case ValidationType.Max:
      return i18n.t('validError.max', { _field_: name, length: value })
    case ValidationType.MinLength:
      return i18n.t('validError.minLength', { _field_: name })
    case ValidationType.MaxLength:
      return i18n.t('validError.maxLength', { _field_: name })
    case ValidationType.Pattern:
      return i18n.t('validError.regex', { _field_: name })
    case ValidationType.Exists:
    case ValidationType.Role:
    case ValidationType.Mismatch:
    case ValidationType.Limit:
    case ValidationType.Unique:
    case ValidationType.Lock:
    case ValidationType.Hierarchy:
      return i18n.t(`validError.${type}`)
  }
}
