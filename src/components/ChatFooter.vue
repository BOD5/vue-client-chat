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
  data: () => ({
    text: '',
  }),
  methods: {
    inputListener() {
      console.log('tee', {
        uId: this.$store.state.user.id,
        chatId: this.$store.state.chatId
      })
      this.$socket.emit('userWriteMsg', {
        uId: this.$store.state.user.id,
        chatId: this.$store.state.chatId
      })
    },
    sendMessage()  {
      const newMsg = {
        text: this.text,
        ovner: this.$store.state.user,
      }
      console.log(' - newMsg:44 >', newMsg); // eslint-disable-line no-console
      this.$socket.emit('messageToServer', {
        msg: newMsg,
        chatId: this.$store.state.chatId
      })
      this.text = '';
    },
  },
}
</script>

<style>

</style>