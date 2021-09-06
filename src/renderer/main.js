import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Dexie from 'dexie' // 操作数据库
import VueCodemirror from 'vue-codemirror' // 代码高亮

import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/hint/show-hint.css'
// for javascript
import 'codemirror/mode/javascript/javascript.js'
// for python3
import 'codemirror/mode/python/python.js'
// for java
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/closebrackets.js'
// for sql
import 'codemirror/addon/hint/sql-hint.js'
// for html
import 'codemirror/addon/hint/html-hint.js'
// for xml
import 'codemirror/addon/hint/xml-hint.js'
// for html mixed
import 'codemirror/mode/htmlmixed/htmlmixed.js'
// for xml
import 'codemirror/mode/xml/xml.js'
// for yaml
import 'codemirror/mode/yaml/yaml.js'
// for properties
import 'codemirror/mode/properties/properties.js'
// for shell
import 'codemirror/mode/shell/shell.js'
// for css
import 'codemirror/mode/css/css.js'
// for dart
import 'codemirror/mode/dart/dart.js'
// for vue
import 'codemirror/mode/vue/vue.js'
// for go
import 'codemirror/mode/go/go.js'
// groovy
import 'codemirror/mode/groovy/groovy.js'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueCodemirror, {
  options: { theme: 'base16-dark' }
})

// create web sql
const thinkbackDB = new Dexie('think-back')
thinkbackDB.version(0.1).stores({
  think: '++id, title, type, content, date, description' // 表think及表中字段
})
Vue.prototype.$thinkbackDB = thinkbackDB

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
