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
      :class="{ myMsg: msg.ovner.id === $store.state.user.id }"
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
  data: () => ({
    bottomPos: false,
  }),
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  },
  watch: {
    messages() {

    },
  },
  updated() {
    const el = document.getElementById('messageBox');
    if (this.bottomPos) {
      el.scrollTop = el.scrollHeight;
      this.bottomPos = false;
    }
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
              this.$socket.emit('changeMsgStatus', {chatId: this.$store.state.chatId, msgId: msg.id})
            }
          }
          return;
        }
      );
    },
  }
}
// getMessage({msg, chatId}) {
//       this.chatsLastMsg[`${chatId}`] = msg;
//       if(this.chatId === chatId) {
//         this.messages.push(msg);
//         const el = document.getElementById('messageBox');
//         this.bottomPos = (el.scrollTop === el.scrollHeight - el.clientHeight)
//         const arr = this.$refs.msg;
//         console.log(' - arr:247 >', arr); // eslint-disable-line no-console
//         if (arr) arr.map((e, i) => {
//           console.log(' - const pref = el.getBoundingClientRect().y:249 >', el.getBoundingClientRect().y); // eslint-disable-line no-console
//           const pref = el.getBoundingClientRect().y;
//           console.log(' - e.getBoundingClientRect().y:250 >', e.getBoundingClientRect().y); // eslint-disable-line no-console
//           if (
//             e.getBoundingClientRect().y - pref >= 0
//             &&
//             e.getBoundingClientRect().y < pref + el.clientHeight ) {
//             const msgA = this.messages[i];
//             console.log(' - msgA:254 >', msgA); // eslint-disable-line no-console
//             if (msgA.isReading === '' && msgA.ovner.id !== this.user.id) {
//               console.log(' - msgA:255 >', msgA); // eslint-disable-line no-console
//               this.$socket.emit('changeMsgStatus', {chatId: this.chatId, msgId: msgA.id})
//             }
//           }
//         })
//       }
//     },
</script>


<style>

</style>