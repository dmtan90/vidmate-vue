import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';

import 'vue-color/style.css';
import 'vue-sonner/style.css';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import "./styles/global.css";
import { queryClient } from './config/queryClient';

import './fabric/initialize';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(ElementPlus);

// import Draggable, { DraggablePlugin, DraggableDirective } from '@braks/revue-draggable';
// // or
// app.directive('draggable', DraggableDirective)
// app.component('Draggable', Draggable);

// import vdr from 'vue-draggable-resizable-gorkys-vue3';
// import 'vue-draggable-resizable-gorkys-vue3/dist/VueDraggableResizable.css';
// app.component('vdr', vdr);

import Vue3DraggableResizable from 'vue3-draggable-resizable';
//default styles
// import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
// import { DraggableContainer } from 'vue3-draggable-resizable';
app.use(Vue3DraggableResizable);
// app.use(DraggableContainer);

import { DraggablePlugin } from '@braks/revue-draggable';
// Use as Plugin (registers directives and components)
app.use(DraggablePlugin);

app.mount('#app');