import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'

import { WsService } from './services/WsService.js'
WsService.connect()
.then(res => { console.log('Ws connestion is done!') })
.catch(err => { alert('Ws connestion ERROR!') });

createApp(App).mount('#app')