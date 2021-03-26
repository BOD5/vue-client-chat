import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

Vue.filter('formatDate', (d) => {
  if (d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  return d
})

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000/chat',
}))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
