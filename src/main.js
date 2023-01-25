import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import DetailsPage from './components/DetailsPage.vue'
import './assets/index.css'
createApp(App).mount('#app')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: HomePage },
        { path: '/details/:id', component: DetailsPage },
    ]
})

const app = createApp(App)

app.use(router)
app.mount('#app')
