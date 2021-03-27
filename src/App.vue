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
    chatId: null,
    chatsLastMsg: {},
    messages: [],
    users: [],
    text: '',
    description: 'Send message to ',
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
    uStatusWrite: '',
  }),
  computed: {
    filteredUserList: function() {
      try {
      const newList = this.users.filter((el) =>
        el.status.startsWith(this.filterParams.status)
        &&
        el.name.toLowerCase()
          .includes(this.filterParams.string.toLowerCase())
      );
      return newList;
      } catch (e) {
        return null;
      }
    }
  },
  created() {
    console.log(' - this.user:169 >', this.user); // eslint-disable-line no-console
  },
  sockets: {
    connect: async function () {
      console.log('socket connected')
      // console.log(' - this.user:172 >', this.user); // eslint-disable-line no-console
      // if (Object.keys(this.user).length == 0){
      //   console.log(' - this.$sockets:174 >', this.sockets); // eslint-disable-line no-console
      //   this.$socket.emit('getDataForClien');
      // }
    },
    //Users emit listeners
    getUser(newUser) {
      this.user = newUser;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    getUsers(usersArr) {
      // this.setUsersList(usersArr); 
      this.users = [...usersArr.filter(user => user.id != this.user.id)];
    },
    updateUserStatus(user) {
      if(user.id !== this.user.id) {
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
      if(!localStorage.user || localStorage.user == 'null'){
      const user = {
        name: `User ${Math.floor(Math.random() * Math.floor(100))}`,
        avatar: 'https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg',
        status: 'Online'
      }
        this.$socket.emit('newUser',user);
        console.log('localstorage is empty');
      } else {
        this.user = JSON.parse(localStorage.user);
        this.$socket.emit('checkUser', this.user);
      }
      if (localStorage.selectMenu && localStorage.selectMenu !== 'null') {
        this.selectMenu(JSON.parse(localStorage.selectMenu))
      }
      if (localStorage.selectedUser && localStorage.selectedUser !== 'null') {
        const user = JSON.parse(localStorage.selectedUser);
        this.selectChat(user);
        // else localStorage.clear('selectedUser');
      }
      console.log(' - this.chatId:214 >', this.chatId); // eslint-disable-line no-console
    },
    ////
    //messages emit listeners
    getMessage({msg, chatId}) {
      if(this.chatId != chatId)
        // this.getChatMessages.chatId = msg;
        console.log(' - 11:108 >', 11); // eslint-disable-line no-console
      else
        this.messages.push(msg);
    },
    listenWrite({ uId, isWrite }) {
      console.log(' - 123:226 >', 123); // eslint-disable-line no-console
      this.uStatusWrite = !isWrite ? '': (
        `${this.users.find(u => u.id === uId).name} is writing`
      )
    },
    getChatsLastMsg() {

    },
    changeMessageStatus() {

    }
  },
  methods: {    
    inputListener() {
      console.log(' - { uId: this.user.id, chatId: this.chatId }:240 >', { uId: this.user.id, chatId: this.chatId }); // eslint-disable-line no-console
      this.$socket.emit('userWriteMsg', { uId: this.user.id, chatId: this.chatId })
    },
    sendMessage()  {
      const newMsg = {
        text: this.text,
        ovner: this.user,
      }
      console.log(' - newMsg:246 >', newMsg); // eslint-disable-line no-console
      this.$socket.emit('messageToServer', { msg: newMsg, chatId: this.chatId })
      this.text = '';
    },
    selectChat(user) {
      this.selectedUser = { ...user };
      this.$socket.emit('chatFromServer', [ this.user.id, this.selectedUser.id ], (response) => {
        const {chatId, msgs} = response
        this.chatId = chatId
        this.messages = msgs
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
