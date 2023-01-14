import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/',                 name: 'Aettbok',        component: () => import('../views/Aettbok.vue') },
  { path: '/charts',           name: 'Charts',         component: () => import('../views/Charts.vue') },
  { path: '/charts/fan',       name: 'Fan',            component: () => import('../components/charts/Fan.vue') },
  { path: '/charts/histogram', name: 'Histogram',      component: () => import('../components/charts/Histogram.vue') },
  { path: '/charts/migration', name: 'Migration',      component: () => import('../components/charts/Migration.vue') },
  { path: '/charts/tree',      name: 'Tree',           component: () => import('../components/charts/Tree.vue') },
  { path: '/charts/waterfall', name: 'Waterfall',      component: () => import('../components/charts/Waterfall.vue') },
  { path: '/documents',        name: 'Documents',      component: () => import('../views/Documents.vue') },
  { path: '/events',           name: 'Events',         component: () => import('../views/Events.vue') },
  { path: '/locations/:id?',   name: 'Locations',      component: () => import('../views/Locations.vue') },
  { path: '/login',            name: 'Login',          component: () => import('../views/Login.vue') },
  { path: '/persons/:id?',     name: 'Persons',        component: () => import('../views/Persons.vue') },
  { path: '/sources',          name: 'Sources',        component: () => import('../views/Sources.vue') },
  { path: '/tags',             name: 'Tags',           component: () => import('../views/Tags.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router