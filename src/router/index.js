import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/LogARis/Login.vue'
import Register from '../components/LogARis/Register.vue'
import Home from '../components/home.vue'
import Moments from '../components/moments.vue'
import Show from '../components/moments/show.vue'
import Edit from '../components/moments/edit.vue'
import Index from '../components/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/index'
    },
    {
      path:'/index',
      name:'index',
      component:Index,
      children:[
        {
          path: '',
          redirect:'/index/login'
        },
        {
          path:'/index/login',
          name: 'login',
          component: Login
        },
        {
          path:'/index/register',
          name: 'register',
          component: Register
        }
      ]
    },
    {
      path:'/home',
      name:'home',
      component:Home
    },
    {
      path:'/moments',
      name:'moments',
      component:Moments,
      children:[
        {
          path:'',
          redirect:'/moments/show'
        },
        {
          path:'/moments/show',
          name:'show',
          component:Show
        },
        {
          path:'/moments/edit',
          name:'edit',
          component:Edit
        }
      ]
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
