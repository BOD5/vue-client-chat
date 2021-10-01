<template>
  <ul class="list">
    <li 
      v-for="user in users"
      :key="user.id"
      :class="{ 
        active: selectedUser.id === user.id,
        online: user.status === 'Online'
        }"
      @click.prevent="selectChat(user)"
    >
      <a href="#"
      >
        <img :src="user.avatar" :alt="user.name" />
        <div>
          <div>
            <strong>{{ user.name }}</strong>
            <div>
              {{ statusChatInMenu(user) }}
            </div>
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => ([]),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    selectedUser: {
      type: Object,
      default: () => ({})
    },
    userChatId: {
      type: Object,
      default: () => ({}),
    },
    chatsLastMsg: {
      type: Object,
      default: () => ({}),
    },
    writes: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['select-user'],
  methods: {
    selectChat(user) {
      this.$socket.emit('chatFromServer', {
        users: [ this.user, user ],
      })
      this.$emit('select-user', user)
        // (response) => {
        //   const {chatId, msgs, usersInChat, writes} = response
        //   this.chatId = chatId
        //   this.messages = msgs
        //   this.usersInChat = usersInChat
        //   this.selectedUser = user;
        //   const uInd = writes.findIndex((id) => id === this.user.id)
        //   this.curentChatWrites = writes;
        //   if (uInd !== -1) this.writes.splice(uInd, 1)
        // this.writes = writes
      // })
      // localStorage.setItem('selectedUser', JSON.stringify(this.selectedUser));
    },
    statusChatInMenu(user) {
      const id = this.userChatId[`${user.id}`];
      const msg = this.chatsLastMsg[`${id}`];
      let text = '';
      if (this.writes[`${id}`] && this.writes[`${id}`].length > 0) {
        text = `user is typing`;
      } else 
        if (msg && msg.text)
          text = msg.text;
        else
          text = `type to ${user.name}`
      text = (text.length < 15)? text: text.slice(0, 15) + '...'
      return text;
    },
  },
}
</script>

<style>

</style>