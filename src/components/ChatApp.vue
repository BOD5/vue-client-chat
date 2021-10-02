<template>
  <article>
    <div id="chat-content">
      <ChatHeader />
      <MessageList />
      <h3>{{ uStatusWrite }}</h3>
      </div>
    <ChatFooter v-bind="{user, chatId}"/>
  </article>
</template>

<script>
import MessageList from './MessageList.vue';
import ChatHeader from './ChatHeader.vue';
import ChatFooter from './ChatFooter.vue';

export default {
  components: {
    MessageList,
    ChatHeader,
    ChatFooter,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    selectedUser: {
      type: Object,
      default: () => ({}),
    },
    chatId: {
      type: Number,
      default: -1,
    },
    messages: {
      type: Array,
      default: () => ([]),
    },
    uStatusWrite: {
      type: String,
      default: () => (''),
    },
  },
  data: () => ({

  }),
  created() {
    console.log(' - props:49 >', this.user); // eslint-disable-line no-console
  },
  methods: {

  }
}
</script>

<style>

</style>