import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

import os from 'os';
console.log(' - 123:6 >', 123); // eslint-disable-line no-console
console.log(' - networkIntarfaces():8 >', os.networkInterfaces()); // eslint-disable-line no-console

Vue.filter('formatDate', (d) => {
  if (d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  return d
})

Vue.use(new VueSocketIO({
  debug: true,
  connection: `http://192.168.7.49:5000/chat`,
}))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
