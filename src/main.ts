import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import {router} from './router'
import './assets/app.css'
import axios from 'axios';

const app = createApp(App)

app.use(createPinia())
app.provide('axios', axios);
app.use(router)

app.mount('#app')
