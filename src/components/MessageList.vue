<template>
  <ul 
    id="messageBox"
    v-on:scroll="msgScroll"
  >
    <li
      v-for="msg in messages"
      :key="msg.id"
      :data-id="msg.id"
      ref="msg"
      :class="{ myMsg: msg.ovner.id === user.id }"
    >
      <div class="chat-title">
        {{ msg.ovner.name }}
        <span>{{ new Date(msg.created) | formatDate }}</span>
      </div>
      <div class="chat-msg">
        {{ msg.text }}
      </div>
      <h5>{{ reading(msg) }}</h5>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => ([]),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    chatId: {
      type: Number,
      default: () => (-1),
    },
  },
  data: () => ({

  }),
  updated() {
    // console.log(' - :36 >', this.messagesArray); // eslint-disable-line no-console
  },
  computed: {
    // messages: function() {
    //   console.log(' - :37 >', this.messagesArray); // eslint-disable-line no-console
    //   return this.messagesArray;
    // }
  },
  methods: {
    reading(msg) {
      if(this.user) {
        if (msg.isReading !== '' && msg.ovner.id === this.user.id)
          return `seen: ${msg.isReading}`
      }
      return '';
    },
    msgScroll() {
      const el = document.getElementById('messageBox'); //mb be better
      //getBoundingClientRect()
      const arr = this.$refs.msg;
      if (arr) arr.map((e, i) => {
        const pref = el.getBoundingClientRect().y;
          if (e.getBoundingClientRect().y - pref >= 0 && e.getBoundingClientRect().y < pref + el.clientHeight){
            const msg = this.messages[i];
            if (msg.isReading === '' && msg.ovner.id !== this.user.id) {
              this.$socket.emit('changeMsgStatus', {chatId: this.chatId, msgId: msg.id})
            }
          }
          return;
        }
      );
    },
  }
}
</script>

<style>

</style>