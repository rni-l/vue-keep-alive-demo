import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vue'), meta: { key: 'home' } },
  { path: '/p-one', name: 'p-one', component: () => import('./pages/p-one/index.vue'), meta: { keepAlive: true } },
  { path: '/p-two', name: 'p-two', component: () => import('./pages/p-two/index.vue'), meta: { keepAlive: true } },
  { path: '/p-three', name: 'p-three', component: () => import('./pages/PThree.vue') },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})
router.afterEach((to, from) => {
})
export { router }