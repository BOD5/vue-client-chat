<template>
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
    </ul>
    <UsersList
      :users="filteredUserList || []"
      @select-user="selectUser"
    />
    <div class="bottom">
      <input
        type="text"
        v-model="filterParams.string"
        placeholder="Search"
      />
    </div>
  </nav>
</template>

<script>
import UsersList from './UsersList'
export default {
  components: {
    UsersList,
  },
  data: () => ({
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
    filterParams: {
      status: '',
      string: '',
    },
  }),
  computed: {
    user() {
      return this.$store.state.user;
    },
    filteredUserList: function() {
      const newList = this.$store.state.users.filter((el) =>
        el
        &&
        (el.status.startsWith(this.filterParams.status)
        &&
        (el.id !== this.user.id)
        &&
        el.name.toLowerCase()
          .includes(this.filterParams.string.toLowerCase())
        )
      );
      return newList;
    },
  },
  methods: {
    selectMenu(item) {
      this.filterParams.status = (item.text === 'All')? '': item.text;
      this.menu.forEach((el) => {
          el.isSelect = (item.text === el.text)? true : false
        })
      localStorage.setItem('selectMenu', JSON.stringify(item));
    },
    selectUser(user) {
      this.$emit('select-user', user);
    }
  }
}
</script>

<style>

</style>