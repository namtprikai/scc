import Cookies from 'js-cookie'
/* eslint-disable */
import jwt_decode from 'jwt-decode'
/* eslint-enable */

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// Admin
const acTokenKey = 'ac_token'
const rfTokenKey = 'rf_token'
export const getAcToken = () => Cookies.get(acTokenKey)
export const setAcToken = (token: string) => Cookies.set(acTokenKey, token)
export const removeAcToken = () => Cookies.remove(acTokenKey)

export const getRfToken = () => Cookies.get(rfTokenKey)
export const setRfToken = (token: string) => Cookies.set(rfTokenKey, token)
export const removeRfToken = () => Cookies.remove(rfTokenKey)

export const decodeToken = (token: string): any => {
  const acToken: any = token || getAcToken()
  return jwt_decode(acToken)
}
