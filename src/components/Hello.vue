<template>
  <h1>Hello</h1>
</template>

<script>
export default {
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function () {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        clickButton: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', data)
        }
    }
}
</script>

<style>

</style>