<template>
  <main>

      <header>
        <div>Chat bot 2.0</div>
      </header>
      
      <section>
        <div>
          <article>
            <div id="chat-content">
              <div class="recipientBg maxH150">
                <div class="col col2-1">
                  <img src="assets/img/user-2.jpg" alt="ava user-1" class="chat-ava" />
                </div>
                <div class="col col2-2">
                  <div>{{ title }}</div>
                  <p class="ellipsis-4">{{ description }}</p>
                </div>
              </div>
              <ul>
                <li
                  v-for="msg in messages"
                  :key="msg.id"
                  :class="{ myMsg: msg.author.id === user.id }"
                >
                  <div class="chat-title">
                    {{ msg.author.name }}
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
                  autofocus
                  placeholder="Start chatting!"
                />
              </div>
              <div class="col col-2">
                <button>Send message</button>
              </div>
            </footer>
          </article>
          <nav>
            <ul class="top">
              <li class="active"><a href="#">Online</a></li>
              <li><a href="#">All</a></li>
            </ul>
            <ul class="list">
              <li class="active">
                <a href="#chat-reverseBot-online" onclick="return false;">
                  <img src="/assets/img/user-2.jpg" alt="bot avatar" />
                  <div>
                    <div>
                      <strong>Echo</strong>
                    </div>
                    <div>
                      Echo description bot
                    </div>
                  </div>
                </a>
              </li>
              
              <li>
                <a href="#chat-reverseBot-online" onclick="return false;">
                  <img src="/assets/img/user-2.jpg" alt="bot avatar" />
                  <div>
                    <div>
                      <strong>Reverse Bot</strong>
                    </div>
                    <div>
                      Reverse description bot
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <div class="bottom">
              <input placeholder="Search" />
            </div>
          </nav>
        </div>
      </section>
    </main>
</template>

<script>
import App, { USER } from '../../public/app.js'
export default {
  // el: '#chatApp',
  data: () => ({
    title: 'Loading...',
    description: 'Lorem ipsun',
    user: USER.U,
    messages: [
      {
        id: 1,
        text: 'Hello World!',
        author: USER.revertBot,
        created: new Date('2020-12-01 23:23:20'),
        readed: true,
      }, {
        id: 2,
        text: 'Hello, Revert Bot',
        author: USER.U,
        created: new Date('2020-12-01 23:23:23'),
        readed: true,
      },
    ],
  }),
  created() {
    Object.assign(this, App())
  },
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style>

</style>