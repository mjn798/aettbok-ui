import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/',               name: 'Aettbok',   component: () => import('../views/Aettbok.vue') },
  { path: '/charts',         name: 'Charts',    component: () => import('../views/Charts.vue') },
  { path: '/documents',      name: 'Documents', component: () => import('../views/Documents.vue') },
  { path: '/events',         name: 'Events',    component: () => import('../views/Events.vue') },
  { path: '/locations/:id?', name: 'Locations', component: () => import('../views/Locations.vue') },
  { path: '/persons/:id?',   name: 'Persons',   component: () => import('../views/Persons.vue') },
  { path: '/tags',           name: 'Tags',      component: () => import('../views/Tags.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router