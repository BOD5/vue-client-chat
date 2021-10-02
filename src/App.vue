<template>
  <div class="chatApp" v-cloak>
    <main>
      <header>
        <div>Chat</div>
      </header>

      <section>
        <div>
          <ChatApp />          
          <UsersNav />
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
  }),
  computed: {
  },
  created() {
    this.$store.dispatch('newSocket', this.$socket);
  },
  mounted(){
    window.onbeforeunload = () => {
      this.$socket.emit('userGoOffline', this.user);
    }
  },
  sockets: {
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
        this.$store.commit('setUser', user);
        localStorage.setItem('user', JSON.stringify(this.$store.state.user));
      });
    },
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
