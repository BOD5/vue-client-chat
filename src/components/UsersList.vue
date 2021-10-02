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
  },
  methods: {
    selectChat(user) {
      this.$socket.emit('chatFromServer', {
        users: [ this.$store.state.user, user ],
      })
      this.$store.dispatch('selectUser', user);
    },
    statusChatInMenu(user) {
      const id = this.userChatId[`${user.id}`];
      const msg = this.chatsLastMsg[`${id}`];
      let text = '';
      if (this.writes[`${id}`] && this.writes[`${id}`].length > 0) {
        text = `user is typing...`;
      } else 
        if (msg && msg.text)
          text = msg.text;
        else
          text = `type to ${user.name}`
      text = (text.length < 15)? text: text.slice(0, 15) + '...'
      return text;
    },
  },
  computed: {
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    userChatId() {
      return this.$store.state.userChatId;
    },
    chatsLastMsg() {
      return this.$store.state.chatsLastMsg;
    },
    writes() {
      return this.$store.state.writes;
    },
    users() {
      console.log(' - users:63 >', this.$store.getters.getUsers); // eslint-disable-line no-console
      return this.$store.getters.getUsers;
    },
  },
}
</script>

<style>

</style>