import Vue from 'vue'
import Router from 'vue-router'

const Book = resolve => require(['@/views/Book'], resolve)
const Reader = resolve => require(['@/views/Reader'], resolve)
const Editor = resolve => require(['@/views/Editor'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Book
    },
    {
        path: '/books/:id',
        component: Reader
    },
    {
        path: '/editor',
        component: Editor
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
