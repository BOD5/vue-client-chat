import Vuex from 'vuex';
import vue from 'vue';

vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    socket: null,
    user: {},
    selectedUser: {},
    usersInChat: [],
    chatId: null,
    messages: [],
    users: [],
    writes: {},
    chatsLastMsg: {},
    userChatId: {},
  },
  getters: {
    getUsers(state) {
      return state.users;
    }
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
    setUser(state, user) {
      state.user = user;
      console.log(' - state:30 >', state); // eslint-disable-line no-console
    },
    setUsers(state, usersArr) {
      state.users = usersArr.map((u) => {
          state.userChatId[`${u.user.id}`] = u.chatId;
          return u.user;
      });
    },
    newMessage(state, {msg, chatId}) {
      state.chatsLastMsg[`${chatId}`] = msg;
      if(state.chatId === chatId) {
        state.messages.push(msg);
      }
    },
    SOKET_getChatsLastMsg(state, chatsLastMsg) {
      state.chatsLastMsg = chatsLastMsg
    },
    SOKET_updateMsgStatus(state, { msg, chatId }) {
      if (state.chatId === chatId) {
        const ind = state.messages.findIndex((m)  => m.id === msg.id);
        state.messages[ind] = msg
      }
    },
    SOKET_listenWrite(state, { writes, chatId}) {
      const uInd = writes.findIndex((id) => id === state.user.id)
      if (uInd !== -1) state.writes.splice(uInd, 1)
      state.writes[`${chatId}`] = writes;
      state.curentChatWrites = writes;
    },
    SOKET_updateUserStatus(state, user) {
      if(user !== null && user.id !== state.user.id) {
        if(state.users.find((u) => u.id === user.id)) {
          state.users = state.users.map((u) => {
            if (u.id === user.id)
              return user
            return u
          })
        }
        else state.users.push(user);
      }
    },
    SOKET_checkUser(state) {
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
      state.$socket.emit('checkUser', user, ({user}) => {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(state.user));
      });
    },

    selectUser(state, selectedUser) {
      state.selectedUser = selectedUser;
    },
    setUsersInChat(state, usersInChat) {
      state.usersInChat = usersInChat;
    },
    setChat(state, chatData) {
      const {chatId, msgs, usersInChat, writes } = chatData
      console.log(' - chatId:98 >', chatId); // eslint-disable-line no-console
      state.chatId = chatId
      state.messages = msgs
      state.usersInChat = usersInChat
      state.writes = writes;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
  },
  actions: {

    newSocket(ctx, socket) {
      ctx.commit('setSocket', socket);
    },

    selectUser(ctx, user) {
      ctx.commit('selectUser', user);
    },
    
    SOCKET_connect: () => {
      console.log('connected');
    },

    SOCKET_getChat({commit}, data) {
      console.log(' - data:123 >', data); // eslint-disable-line no-console
      commit('setChat', data);
    },

    SOCKET_getUsers({commit}, usersArr) {
      commit('setUsers', usersArr);
    },

    SOCKET_getMessage({commit}, msgData) {
      commit('newMessage', msgData);
    },
  },
});

export default store;
