import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';

import App from './App.vue';
import store from './store';

Vue.filter('formatDate', (d) => {
  if (d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
  return d;
});

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.7.49:5000/chat',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}));

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
