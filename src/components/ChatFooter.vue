<template>
  <footer>
    <div class="col col-1">
      <input
        v-model="text"
        type="text"
        autofocus
        placeholder="Start chating!"
        @keyup="inputListener"
        @keyup.enter="sendMessage()"
      />
    </div>
    <div class="col col-2">
      <button
        type="submit"
        @click.prevent="sendMessage()"
      >
      Send
      </button>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: -1,
    },
    chatId: {
      type: Number,
      default : -1,
    }
  },
  data: () => ({
    text: '',
  }),
  updated() {
    console.log(' - props:49 >', this.user.id); // eslint-disable-line no-console
  },
  methods: {
    inputListener() {
      this.$socket.emit('userWriteMsg', { uId: this.user.id, chatId: this.chatId })
    },
    sendMessage()  {
      const newMsg = {
        text: this.text,
        ovner: this.user,
      }
      this.$socket.emit('messageToServer', { msg: newMsg, chatId: this.chatId })
      this.text = '';
    },
  },
}
</script>

<style>

</style>