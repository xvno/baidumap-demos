/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  {
    path: '/iwin',
    name: 'baidumap.iwin',
    component: () => import('@/views/Baidumap/InfoWindow.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true
    }
  },
  {
    path: '/map',
    name: 'baidumap.m',
    component: () => import('@/views/Baidumap/M.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true
    }
  },
  // Home
  {
    path: '/home',
    name: 'home.index',
    component: () => import('@/views/Home/Index.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true
    }
  },

  // Account
  {
    path: '/account',
    name: 'account.index',
    component: () => import('@/views/Account/Index.vue'),

    // If the user needs to be authenticated to view this page.
    meta: {
      auth: true
    }
  },

  // Login
  {
    path: '/login',
    name: 'login.index',
    component: () => import('@/views/Login/Index.vue'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true
    }
  },

  // Register
  {
    path: '/register',
    name: 'register.index',
    component: () => import('@/views/Register/Index.vue'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true
    }
  },

  {
    path: '/',
    redirect: '/home'
  },

  {
    path: '/*',
    redirect: '/home'
  }
];
