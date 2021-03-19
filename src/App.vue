<template>
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
                    <span>{{ msg.created | formatDate }}</span>
                  </div>
                  <div class="chat-msg">
                    {{ msg.text }}
                  </div>
                </li>
              </ul>
            </div>
            <footer>
              <div class="col col-1">
                <input
                  v-model="text"
                  type="text"
                  autofocus
                  placeholder="Start chating!"
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
              <li class="article"><a href="#">Online</a></li>
              <li><a href="#">All</a></li>
              <!-- <li><a href="#">Chats</a></li> -->
            </ul>
            <ul class="list">
              <li 
                v-for="user in users"
                :key="user.id"
                :class="{ active: selectedUser.id === user.id }"
              >
                <a href="#" @click.prevent="selectChat(user)">
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
            <div class="buttom">
              <input
                type="text"
                placeholder="Search"
              />
            </div>
          </nav>
        </div>
      </section>
    </main>
    <!-- <div class="messager">
      <h1 class="user">
        Current User {{user}}
      </h1>
      <h1 class="user">
        Chat whith User {{selectedUser}}
      </h1>
      <section class="chat">
        <div class="chatMessages">
          <ul>
            <li
              v-for="msg of messages"
              :key="msg.id"
            >
              <div class="message">
                {{ msg }}
              </div>
            </li>
          </ul>
        </div>
        <form action="">
          <input v-model="text" type="text"/>
          <button type="submit" @click.prevent="sendMessage()">Send Message</button>
        </form>
        <div class="chatsList">
          <ul>
            <li
              v-for="user of users"
              :key="user.id"
            >
              <button class="selectUserToChat" @click.prevent="selectChat(user)">
                <div class="userInfo">
                  {{ user }}
                </div>
              </button>
            </li>
          </ul>
          
        </div>
      </section>
    </div> -->
  <!-- </div> -->
</template>

<script>
import './styles/my.css'
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
    description: 'Send message to '
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    //Users emit listeners
    getUser(newUser) {
      this.user = newUser;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    getUsers(usersArr) {
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
    },
    ////
    //messages emit listeners
    getMessage({msg, chatId}) {
      console.log(' - chatId:109 >', chatId); // eslint-disable-line no-console
      if(this.chatId != chatId)
        // this.getChatMessages.chatId = msg;
        console.log(' - 11:108 >', 11); // eslint-disable-line no-console
      else
        this.messages.push(msg);
    },
    getChatsLastMsg() {

    },
    changeMessageStatus() {

    }
  },
  methods: {
    sendMessage()  {
      const newMsg = {
        text: this.text,
        ovner: this.user,
      }
      this.$socket.emit('messageToServer', { msg: newMsg, chatId: this.chatId })
    },
    selectChat(user) {
      this.selectedUser = { ...user };
      //receive chat messages from server
      this.$socket.emit('chatFromServer', [ this.user.id, this.selectedUser.id ], (response) => {
        console.log(' - response:134 >', response); // eslint-disable-line no-console
        const {chatId, msgs} = response
        this.chatId = chatId
        this.messages = msgs
      })
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
