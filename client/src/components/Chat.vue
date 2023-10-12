<template>
<!-- Messages Container -->
<div class="chat-container" ref="chatContainer">
  <div v-for="message in messages" :key="message.id" class="chat-message" 
    :class="{ 'self': message.self, 'other': !message.self }">
    <div class="chat-message-bubble">
      {{ message.text }}
      <div :class="{ 'timestamp-self': message.self, 'timestamp-other': 
        !message.self }">{{ message.timestamp }}</div>
    </div>
  </div>
</div>

<!-- Chat input container -->
<div class="chat-input-container">
  <input type="text" v-model="newMessage" @keyup.enter="sendMessage" 
    placeholder="Chat" class="chat-input" />
  <button class="chat-send-button" @click="sendMessage">Send</button>
</div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: '',
    };
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  mounted() {
    this.$store.state.socket.on('receiveMessage', (message) => {
      this.messages.push({
        self: false,
        text: message,
      });
    });
  },
  methods: {
    scrollToBottom() {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
    },
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({
          self: true,
          text: this.newMessage,
        });

        this.$store.state.socket.emit('sendMessage', 
          this.newMessage, this.$store.state.roomCode);
        this.newMessage = '';
      }
    },
  }
}
</script>

<style>
/* Chat Styles */
.chat-container {
  overflow-y: auto;
  height: calc(100% - 100px);
  padding: 20px 10px;
  border-top: 1px solid #A1887F;
  border-bottom: 1px solid #A1887F;
  background-color: #fffaed;
}

.chat-message {
  text-align: left;
  clear: both;
  margin: 3px 0;
  padding: 5px 30px;
  border-radius: 5px;
  max-width: 80%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}

.self { float: left; color: white; background-color: #3F2305; }
.other { float: right; background-color: #F2EAD3; text-align: right; }

.timestamp-self, .timestamp-other {
  font-size: 0.8em;
  color: #888;
  margin-top: 3px;
}

.timestamp-self { float: left; }
.timestamp-other { float: right; }

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
  border: 1px solid #A1887F;
  border-radius: 4px;
  color: #3E2723;
  font-size: 1em;
  outline: none;
}

.chat-input::placeholder { color: #6D4C41; }

.chat-send-button {
  padding: 10px 20px;
  background-color: #3F2305;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  margin-left: 5px;
}
</style>