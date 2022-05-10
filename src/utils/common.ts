import { AdminModule } from '@/store/modules/admin'
import { getAcToken, decodeToken } from './cookies'

export const isLoggedInAdmin = (id: number) => {
  const token = getAcToken()
  let tokenInfo: any
  if (token) {
    tokenInfo = decodeToken(token)
  }
  return AdminModule.id === tokenInfo.id && AdminModule.id === id
}

export const isMasterAdmin = () => {
  return AdminModule.isMaster
}

export const hasPolicy = (policyUriName: string, policyMethod: string) => {
  const hasPolicy = AdminModule.policyList.find(x => x.uriName === policyUriName && x.method === policyMethod)
  if (AdminModule.isMaster || hasPolicy) {
    return true
  }
  return false
}

export const loggedInAdmin = () => {
  return AdminModule
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
