// Vue
import { createApp } from 'vue'
import App from './App.vue'
import LandingPage from './views/LandingPage.vue'
import GameRoom from './views/GameRoom.vue'
// Vue Router
import { createRouter, createWebHistory } from 'vue-router'
// SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
// Vuex
import store from './store'; 

const routes = [
    { path: '/', component: LandingPage },
    { path: '/game/room/:roomCode', component: GameRoom },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Middlewares
const app = createApp(App);
app.use(VueSweetalert2);
app.use(autoAnimatePlugin);
app.use(router);
app.use(store);
app.mount('#app')
