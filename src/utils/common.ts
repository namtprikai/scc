import { AdminModule } from '@/store/modules/admin'
import { getAcToken, decodeToken } from './cookies'

export const isLoggedInAdmin = () => {
  const token = getAcToken()
  let tokenInfo: any
  if (token) {
    tokenInfo = decodeToken(token)
  }
  return AdminModule.id === tokenInfo.id
}

export const isMasterAdmin = () => {
  return AdminModule.isMaster
}

export const hasPolicy = (policyUriName: string, policyMethod: string) => {
  const hasPolicy = AdminModule.policyList.find(x => x.uriName === policyUriName && x.method === policyMethod)
  if (hasPolicy) {
    return true
  }
  return false
}

export const loggedInAdmin = () => {
  return AdminModule
}
