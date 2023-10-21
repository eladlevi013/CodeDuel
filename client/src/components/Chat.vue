<template>
  <!-- Messages Container -->
  <div class="chat-container" ref="chatContainer">
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      class="chat-message"
      :class="{ self: message.self, other: !message.self }"
    >
      <!-- Sender's Name -->
      <div v-if="isSenderChanged(index)" class="sender-name">
        <span v-if="message.self">You</span>
        <span v-else>{{ message.sender }}</span>
      </div>

      <!-- Message Bubble -->
      <div class="chat-message-bubble">
        {{ message.text }}
        <div
          :class="{
            'timestamp-self': message.self,
            'timestamp-other': !message.self,
          }"
        >
          {{ message.timestamp }}
        </div>
      </div>
    </div>
  </div>

  <!-- Chat input container -->
  <div class="chat-input-container">
    <input
      type="text"
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Chat"
      class="chat-input"
    />
    <button class="chat-send-button" @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: '',
    }
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  mounted() {
    this.$store.state.socket.on('receiveMessage', (message, sender) => {
      this.messages.push({
        self: false,
        text: message,
        sender: sender,
      })
    })
  },
  methods: {
    isSenderChanged(index) {
      if (index === 0) return true
      return this.messages[index].self !== this.messages[index - 1].self
    },
    scrollToBottom() {
      const container = this.$refs.chatContainer
      container.scrollTop = container.scrollHeight
    },
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({
          self: true,
          text: this.newMessage,
        })

        this.$store.state.socket.emit(
          'sendMessage',
          this.newMessage,
          this.$store.state.roomCode
        )
        this.newMessage = ''
      }
    },
  },
}
</script>

<style>
/* Chat Styles */
.chat-container {
  overflow-y: auto;
  height: calc(100% - 100px);
  padding: 20px 10px;
  border-top: 1px solid #a1887f;
  border-bottom: 1px solid #a1887f;
  background-color: #fffaed;
}

.chat-message {
  clear: both;
  /* margin: 3px 0; */
  padding: 5px 0;
}

.sender-name {
  font-weight: bold;
  margin-bottom: 2px;
  text-align: left; /* default alignment for "You" */
  font-size: 0.8em;
  color: #888;
  margin-top: 10px;
}

.other > .sender-name {
  text-align: right; /* alignment for "Opponent" */
}

.chat-message-bubble {
  padding: 5px 30px;
  border-radius: 5px;
  text-align: left;
  max-width: 80%;
}

.self .chat-message-bubble {
  background-color: #3f2305;
  color: white;
  float: left;
}

.chat-message:first-child .sender-name {
  margin-top: 0;
}

.other .chat-message-bubble {
  background-color: #f2ead3;
  float: right;
}

.timestamp-self,
.timestamp-other {
  display: block; /* Making timestamps block-level */
  font-size: 0.8em;
  color: #888;
  margin-top: 3px;
}

.chat-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fffaed;
}

.chat-input {
  width: calc(100% - 80px);
  padding: 10px;
  border: 1px solid #a1887f;
  border-radius: 4px;
  color: #3e2723;
  font-size: 1em;
  outline: none;
}

.chat-input::placeholder {
  color: #6d4c41;
}

.chat-send-button {
  padding: 10px 20px;
  background-color: #3f2305;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  margin-left: 5px;
}
</style>
