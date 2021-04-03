import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

//temporário
require('axios').defaults.headers.common['Authorization']='bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwibmFtZSI6ImpvYW9mbGF2aW8iLCJlbWFpbCI6ImZsYXZpb0BlbWFpbC5jb20iLCJhZG1pbiI6MSwiaWF0IjoxNjE3NDg4MzA3LCJleHAiOjE2MTc3NDc1MDd9.oN8vFcHnxecysHOodueagRMOpsvyoldSfeY00kcX4SI'
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')