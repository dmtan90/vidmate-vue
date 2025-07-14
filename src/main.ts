import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';

import "./styles/global.css";
// Import styles
import 'vue-color/style.css';
import 'vue-sonner/style.css';
// import "vue-draggable-resizable/style.css";
import { queryClient } from './config/queryClient';

import './fabric/initialize';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin, { queryClient });

app.mount('#app');