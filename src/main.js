import './assets/main.css'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import store from './store'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(store)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import {init} from './js/webSocket.js'

if(sessionStorage.getItem('jwt') != null){
  init();
}