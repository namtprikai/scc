import { DirectiveOptions } from 'vue'
import { AdminModule } from '@/store/modules/admin'

export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding
    const roles = AdminModule.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style.display = 'block'
      }
    } else {
      throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
    }
  }
}
