import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Dexie from 'dexie'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// create web sql
const thinkbackDB = new Dexie('think-back')
thinkbackDB.version(0.1).stores({
  snippets: '++id, title, type, content, date, description'
})
Vue.prototype.$thinkbackDB = thinkbackDB
// // insert test Data
// for (let index = 0; index < 200; index++) {
//   thinkbackDB.snippets.add({
//     title: '代码块' + index,
//     description: '这是测试代码块' + index,
//     date: (new Date()).getTime(),
//     content: 'var a = ' + index,
//     type: 'text/javascript'
//   })
// }

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
