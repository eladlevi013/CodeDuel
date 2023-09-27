//main.js or main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MainPage from './views/MainPage.vue'
import CodeEditor from './views/CodeEditor.vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'; 

const routes = [
    { path: '/', component: MainPage },
    { path: '/game/room/:roomCode', component: CodeEditor },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App);
app.use(VueSweetalert2);
app.use(autoAnimatePlugin);
app.use(router);
app.use(store);
app.mount('#app')
