import { createApp } from 'vue'
import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App);
app.use(VueSweetalert2);
app.use(autoAnimatePlugin);
app.mount('#app')
