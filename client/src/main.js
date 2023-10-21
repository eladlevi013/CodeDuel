import { createApp } from 'vue'
import App from './App.vue'
import LandingPage from './views/LandingPage.vue'
import GameRoom from './views/GameRoom.vue'
import AuthView from './views/AuthView.vue'
import LeaderboardView from './views/LeaderboardView.vue'
import RoomsView from './views/RoomsView.vue'
import NotFound from './views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'; 
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
import Message from 'vue-m-message'
import 'vue-m-message/dist/style.css'

// Routes
const routes = [
    { path: '/', component: LandingPage },
    { path: '/auth/login', component: AuthView },
    { path: '/auth/register', component: AuthView },
    { path: '/rooms', component: RoomsView },
    { path: '/rooms/:roomCode', component: RoomsView },
    { path: '/rooms/game/:roomCode', component: GameRoom },
    { path: '/leaderboard', component: LeaderboardView },
    { path: '/:pathMatch(.*)*', component: NotFound}
]

// Router
const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Middlewares
const app = createApp(App);
app.use(VueSweetalert2);
app.use(router);
app.use(store);
app.use(Message)
app.mount('#app')
