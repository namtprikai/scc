import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { AdminModule } from '@/store/modules/admin'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/active-admin', '/404', '/reset-password']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`screenTitle.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`screenTitle.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  // Determine whether the user has logged in
  if (AdminModule.acToken) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      // next({ path: '/' })
      router.push({ path: '/', replace: true })
      NProgress.done()
    } else {
      // next()
      if (AdminModule.id === 0) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          await AdminModule.GetAdminInfo()
          // Generate accessible routes map based on role
          PermissionModule.GenerateRoutes()
          // Dynamically add accessible routes
          // PermissionModule.dynamicRoutes.forEach(route => {
          //   router.addRoute(route)
          // })
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          router.push({ path: to.fullPath, replace: true })
          // next({ ...to, replace: true })
        } catch (err: any) {
          // Remove token and redirect to login page
          AdminModule.ResetToken()
          Message.error(err || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          router.push({ path: `/login?redirect=${to.path}`, replace: true })
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1 || whiteList.find(() => to.path.includes('active-admin')) || to.path.includes('reset-password')) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()
  // set page title
  document.title = getPageTitle(to?.meta?.title)
})
