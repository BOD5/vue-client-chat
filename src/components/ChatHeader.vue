<template>
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
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
  }),
  computed: {
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    description() {
      return (this.selectedUser.name)? `Send message to ${this.selectedUser.name}` : 'Select user to send message';
    }
  }
}
</script>

<style>

</style>