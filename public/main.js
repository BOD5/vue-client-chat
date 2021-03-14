import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
import App, { USER } from './app.js'

Vue.filter('formatDate', (d) => {
  if (d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  return d
})

window.app = new Vue({
  el: '#chatApp',
  data: () => ({
    title: 'Loading...',
    description: 'Lorem ipsun',
    user: USER.U,
    messages: [
      {
        id: 1,
        text: 'Hello World!',
        author: USER.revertBot,
        created: new Date('2020-12-01 23:23:20'),
        readed: true,
      }, {
        id: 2,
        text: 'Hello, Revert Bot',
        author: USER.U,
        created: new Date('2020-12-01 23:23:23'),
        readed: true,
      },
    ],
  }),
  created() {
    Object.assign(this, App())
  },
  methods: {},
  computed: {},
  watch: {},
})
