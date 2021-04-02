<template>
  <div class="chatApp" v-cloak>
    <main>
      <header>
        <div>Chat</div>
      </header>

      <section>
        <div>
          <article>
            <div id="chat-content">
              <div class="recipientBg maxH150">
                <div class="col col2-1">
                  <img
                    :src="selectedUser.avatar"
                    :alt="selectedUser.name"
                    class="chat-ava"
                  />
                </div>
                <div class="col col2-2">
                  <div class="title">
                    {{ selectedUser.name }}
                  </div>
                  <p class="ellipsis-4">
                    {{ (selectedUser.name)? description + selectedUser.name : '' }}
                  </p>
                </div>
              </div>
              <ul>
                <li
                  v-for="msg in messages"
                  :key="msg.id"
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
              <h3>{{ uStatusWrite }}</h3>
            </div>
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
          </article>
          <nav>
            <ul class="top">
              <li
                v-for="item in menu"
                :key="item.text"
                :class="{ active: item.isSelect }"
                @click="selectMenu(item)"
              >
                <a
                >
                  <strong>{{item.text}}</strong>
                </a>
              </li>
              <!-- <li><a href="#">Chats</a></li> -->
            </ul>
            <ul class="list">
              <li 
                v-for="user in filteredUserList"
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
                        description
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <div class="bottom">
              <input
                type="text"
                v-model="filterParams.string"
                placeholder="Search"
              />
            </div>
          </nav>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import './styles/my.css'
import './styles/cloak.css'
export default {
  name: 'App',
  components: {
  },
  data: () => ({
    user: {},
    selectedUser: {},
    usersInChat: [],
    chatId: null,
    chatsLastMsg: {},
    messages: [],
    users: [],
    text: '',
    description: 'Send message to ',
    msgsPos: [],
    userChat: {},
    filterParams: {
      status: '',
      string: '',
    },
    menu: [
      {
        text: 'Online',
        isSelect: false,
      }, 
      {
        text: 'All',
        isSelect: false,
      },
    ],
    writes: [],
  }),
  computed: {
    filteredUserList: function() {
      const newList = this.users.filter((el) =>
        (el.status.startsWith(this.filterParams.status)
        &&
        (el.id !== this.user.id)
        &&
        el.name.toLowerCase()
          .includes(this.filterParams.string.toLowerCase())
        )
      );
      console.log(' - newList:168 >', newList); // eslint-disable-line no-console
      return newList;
    },
    uStatusWrite: function() {
      let res = ''
      if (this.writes.length > 0) {
        this.writes.forEach((id) => {
            res += `${this.usersInChat.find((u) => u.id === id).name}, `
        })
        res += 'is typing'
      }
      console.log(' - res:180 >', res); // eslint-disable-line no-console
      return res;
    },
  },
  sockets: {
    connect: async function () {
      console.log('socket connected')
    },
    getUsers(usersArr) {
      console.log(' - usersArr:180 >', usersArr); // eslint-disable-line no-console
      this.users = usersArr.map((u) => {
        this.userChat[`${u.user.id}`] = u.chatId
        return u.user
      });
      // [...usersArr.filter(user => user.user.id !== this.user.id)];
    },
    updateUserStatus(user) {
      console.log(' - user:193 >', user); // eslint-disable-line no-console
      console.log(' - this.user:193 >', this.user); // eslint-disable-line no-console
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
      console.log(' - 123:192 >', 123); // eslint-disable-line no-console
      if(!localStorage.user || localStorage.user == 'null'){
        user = {
          name: `User ${Math.floor(Math.random() * Math.floor(100))}`,
          avatar: 'https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg',
          status: 'Online'
        }
        // this.$socket.emit('newUser',user);
        console.log('localstorage is empty');
      } else {
        user = JSON.parse(localStorage.user);
        console.log(' - user:203 >', user); // eslint-disable-line no-console
      }
      this.$socket.emit('checkUser', user, ({user}) => {
        console.log(' - che:207 >', user); // eslint-disable-line no-console
        this.user = user;
        console.log(' - this.user:208 >', this.user); // eslint-disable-line no-console
        localStorage.setItem('user', JSON.stringify(this.user));
      });
      if (localStorage.selectMenu && localStorage.selectMenu !== 'null') {
        this.selectMenu(JSON.parse(localStorage.selectMenu))
      }
      if (localStorage.selectedUser && localStorage.selectedUser !== 'null') {
        const user = JSON.parse(localStorage.selectedUser);
        console.log(' - user:235 >', user); // eslint-disable-line no-console
        this.selectChat(user);
        // else localStorage.clear('selectedUser');
      }
      console.log(' - this.chatId:214 >', this.chatId); // eslint-disable-line no-console
    },
    ////
    //messages emit listeners
    getMessage({msg, chatId}) {
      console.log(' - msg:238 >', msg); // eslint-disable-line no-console
      if(this.chatId != chatId)
        // this.getChatMessages.chatId = msg;
        console.log(' - 11:108 >', 11); // eslint-disable-line no-console
      else
        this.messages.push(msg);
      console.log(' - this.messages:246 >', this.messages); // eslint-disable-line no-console
    },
    listenWrite({ writes }) {
      console.log(' - 123:226 >', writes)
      const uInd = writes.findIndex((id) => id === this.user.id)
      console.log(' - uInd:247 >', uInd); // eslint-disable-line no-console
      this.writes = writes;
      if (uInd !== -1) this.writes.splice(uInd, 1)
      // this.writes = writes
      console.log(' - this.writes:248 >', this.writes); // eslint-disable-line no-console
    },
    getChatsLastMsg() {

    },
    updateMsgStatus({ msg, chatId }) {
      console.log(' - msg:245 >', (this.chatId === chatId)); // eslint-disable-line no-console
      if (this.chatId === chatId) {
        const ind = this.messages.findIndex((m)  => m.id === msg.id);
        this.messages[ind] = msg
      }
      console.log(' - this.messages:247 >', this.messages); // eslint-disable-line no-console
    }
  },
  mounted(){
    // Clear the browser cache data in localStorage when closing the browser window
    window.onbeforeunload = () => {
      this.$socket.emit('userGoOffline', this.user);
    }
  },
  methods: {    
    inputListener() {
      this.$socket.emit('userWriteMsg', { uId: this.user.id, chatId: this.chatId })
    },
    reading(msg) {
      if(this.user) {
        if (msg.isReading !== '' && msg.ovner.id === this.user.id)
          return `seen: ${msg.isReading}`
      }
      return '';
    },
    sendMessage()  {
      const newMsg = {
        text: this.text,
        ovner: this.user,
      }
      this.$socket.emit('messageToServer', { msg: newMsg, chatId: this.chatId })
      this.text = '';
    },
    selectChat(user) {
      this.selectedUser = user;
      const chatId = this.userChat[user.id]
      this.$socket.emit('chatFromServer',
        { users: [ this.user, this.selectedUser ], chatId },
        (response) => {
          const {chatId, msgs, usersInChat, writes} = response
          this.chatId = chatId
          this.messages = msgs
          this.usersInChat = usersInChat
          const uInd = writes.findIndex((id) => id === this.user.id)
          this.writes = writes;
          if (uInd !== -1) this.writes.splice(uInd, 1)
        // this.writes = writes
      })
      localStorage.setItem('selectedUser', JSON.stringify(this.selectedUser));
    },
    selectMenu(item) {
      this.filterParams.status = (item.text === 'All')? '': item.text;
      this.menu.forEach((el) => {
          el.isSelect = (item.text === el.text)? true : false
        })
      localStorage.setItem('selectMenu', JSON.stringify(item));
    },
  },
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
