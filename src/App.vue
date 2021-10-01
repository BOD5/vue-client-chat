<template>
  <div class="chatApp" v-cloak>
    <main>
      <header>
        <div>Chat</div>
      </header>

      <section>
        <div>
          <ChatApp v-bind="{ user, selectedUser, chatId, messages, uStatusWrite }"/>          
          <UsersNav 
            :user="user"
            :users="users"
            :userChatId="userChatId"
            :chatsLastMsg="chatsLastMsg"
            :writes="writes"
            @select-user="selectUser"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import './styles/my.css'
import './styles/cloak.css'
import UsersNav from './components/UsersNav.vue';
import ChatApp from './components/ChatApp.vue';
export default {
  name: 'App',
  components: {
    UsersNav,
    ChatApp
  },
  data: () => ({
    user: {},
    selectedUser: {},
    usersInChat: [],
    chatId: null,
    messages: [],
    users: [],
    writes: {},
    chatsLastMsg: {},
    userChatId: {},
    curentChatWrites: [],
    bottomPos: false,
  }),
  computed: {
    uStatusWrite: function() {
      let res = '';
      if (this.curentChatWrites.length > 0) {
        this.curentChatWrites.forEach((id) => {
          const us = this.usersInChat.find((u) => u.id === id)
          if (us) res += `${us.name}, `
        })
        res += 'is typing'
      }
      return res;
    },
  },
  sockets: {
    connect: async function () {
      console.log('socket connected')
    },

    getChat(response) {
      const {chatId, msgs, usersInChat, writes} = response
      this.chatId = chatId
      this.messages = msgs
      this.usersInChat = usersInChat
      // this.selectedUser = user;
      const uInd = writes.findIndex((id) => id === this.user.id)
      this.curentChatWrites = writes;
      if (uInd !== -1) this.writes.splice(uInd, 1)
      localStorage.setItem('selectedUser', JSON.stringify(this.selectedUser));
    },

    getUsers(usersArr) {
      this.users = usersArr.map((u) => {
        this.userChatId[`${u.user.id}`] = u.chatId
        return u.user
      });
      [...usersArr.filter(user => user.user.id !== this.user.id)];
    },
    updateUserStatus(user) {
      if(user !== null && user.id !== this.user.id) {
        if(this.users.find((u) => u.id === user.id)) {
          this.users = this.users.map((u) => {
            if (u.id === user.id)
              return user
            return u
          })
        }
        else this.users.push(user);
      }
    },
    checkUser() {
      let user;
      if(!localStorage.user || localStorage.user == 'null'){
        user = {
          name: `User ${Math.floor(Math.random() * Math.floor(100))}`,
          avatar: 'https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg',
          status: 'Online'
        }
        console.log('localstorage is empty');
      } else {
        user = JSON.parse(localStorage.user);
      }
      this.$socket.emit('checkUser', user, ({user}) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        // shit
        // if (localStorage.selectMenu && localStorage.selectMenu !== 'null') {
        //   this.selectMenu(JSON.parse(localStorage.selectMenu))
        // }
        // if (localStorage.selectedUser && localStorage.selectedUser !== 'null') {
        //   const user = JSON.parse(localStorage.selectedUser);
        //   this.selectChat(user);
        //   // else localStorage.clear('selectedUser');
        // }
      });
    },
    ////
    //messages emit listeners
    getMessage({msg, chatId}) {
      this.chatsLastMsg[`${chatId}`] = msg;
      if(this.chatId === chatId) {
        this.messages.push(msg);
        const el = document.getElementById('messageBox');
        this.bottomPos = (el.scrollTop === el.scrollHeight - el.clientHeight)
        const arr = this.$refs.msg;
        console.log(' - arr:247 >', arr); // eslint-disable-line no-console
        if (arr) arr.map((e, i) => {
          console.log(' - const pref = el.getBoundingClientRect().y:249 >', el.getBoundingClientRect().y); // eslint-disable-line no-console
          const pref = el.getBoundingClientRect().y;
          console.log(' - e.getBoundingClientRect().y:250 >', e.getBoundingClientRect().y); // eslint-disable-line no-console
          if (
            e.getBoundingClientRect().y - pref >= 0
            &&
            e.getBoundingClientRect().y < pref + el.clientHeight ) {
            const msgA = this.messages[i];
            console.log(' - msgA:254 >', msgA); // eslint-disable-line no-console
            if (msgA.isReading === '' && msgA.ovner.id !== this.user.id) {
              console.log(' - msgA:255 >', msgA); // eslint-disable-line no-console
              this.$socket.emit('changeMsgStatus', {chatId: this.chatId, msgId: msgA.id})
            }
          }
        })
      }
    },
    listenWrite({ writes, chatId}) {
      const uInd = writes.findIndex((id) => id === this.user.id)
      if (uInd !== -1) this.writes.splice(uInd, 1)
      this.writes[`${chatId}`] = writes;
      this.curentChatWrites = writes;
    },
    getChatsLastMsg(chatsLastMsg) {
      this.chatsLastMsg = chatsLastMsg
    },
    updateMsgStatus({ msg, chatId }) {
      if (this.chatId === chatId) {
        const ind = this.messages.findIndex((m)  => m.id === msg.id);
        this.messages[ind] = msg
      }
    }
  },
  mounted(){
    // Clear the browser cache data in localStorage when closing the browser window
    window.onbeforeunload = () => {
      this.$socket.emit('userGoOffline', this.user);
    }
  },
  updated() {
    const el = document.getElementById('messageBox');
    // console.log(`y: ${el.scrollTop } y: ${el.clientHeight + el.scrollTop} `);
    
    if (this.bottomPos) {
      el.scrollTop = el.scrollHeight;
      this.bottomPos = false;
    }
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
    }
  },
}
</script>

<style>
</style>
