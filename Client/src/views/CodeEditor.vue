<template>
  <div class="mainPanel">
    <splitpanes class="default-theme">
      <pane size="30">
        <splitpanes horizontal>
          <pane size="70">
            <div class="panel question-section">
              <h2 class="questionTitle">Question {{ question.id }}: {{ question.title }}</h2>
              <div class="content">
                <p>{{ question.description }}</p>
                <pre>{{ question.example }}</pre>
              </div>
            </div>
          </pane>
          <!-- Chat -->
          <pane>
            <div class="chat-container">
              <div v-for="message in messages" :key="message.id" class="chat-message" :class="{ 'chat-message-self': message.self, 'chat-message-other': !message.self }">
                <div class="chat-message-bubble">
                  {{ message.text }}
                  <div :class="{ 'timestamp-self': message.self, 'timestamp-other': !message.self }">{{ message.timestamp }}</div>
                </div>
              </div>
            </div>
            <div class="chat-input-container">
              <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Chat" class="chat-input" />
              <button class="chat-send-button" @click="sendMessage">Send</button>
            </div>
          </pane>
        </splitpanes>
      </pane>
      <pane>
        <div class="panel code-section">
          <div class="toolbar">
            <div class="theme-toggle">
              <i v-if="!isDarkMode" @click="toggleTheme" class="fas fa-sun fa-2x"></i>
              <i v-else @click="toggleTheme" class="fas fa-moon fa-2x"></i>
            </div>
            <select v-model="selectedLanguage" class="language-selector">
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <button class="run-button" @click="runCode">Run</button>
          </div>
          <div class="content">
            <codemirror v-model="code" :placeholder="getPlaceholder()" :style="{ height: 'calc(100% - 0px)', fontSize: '2em' }" :autofocus="true"
              :indent-with-tab="true" :tab-size="2" :extensions="extensions" :options="{ theme: 'vscode-dark' }" @ready="handleReady" />
          </div>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { getSignitureByLanguage } from '../utils/ideUtility';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { bespin } from '@uiw/codemirror-theme-bespin';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
// message alert library
import Message from 'vue-m-message';
import 'vue-m-message/dist/style.css'

export default {
  components: { Splitpanes, Pane, Codemirror },
  data() {
    return {
      isDarkMode: false,
      selectedLanguage: 'java',
      code: ``,
      extensions: [javascript(), solarizedLight],
      view: null,
      messages: [],
      newMessage: '',
      question: {},
    };
  },
  beforeUnmount() {
    this.$store.state.socket.off('receiveMessage');
    this.$store.state.socket.off('otherPlayerLeft');
  },
  methods: {
    getPlaceholder() {
      return `Write your ${this.selectedLanguage} code here...`;
    },
    getExtensions() {
    switch (this.selectedLanguage) {
      case 'javascript':
        return [javascript(), this.isDarkMode ? bespin : solarizedLight];
      case 'python':
        return [python(), this.isDarkMode ? bespin : solarizedLight];
      case 'java':
        return [java(), this.isDarkMode ? bespin : solarizedLight];
      default:
        return [this.isDarkMode ? bespin : solarizedLight];
    }
  },
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.extensions = this.getExtensions();
  },
    handleReady(payload) {
      this.view = payload.view;
    },
    runCode() {
      console.log('Running the code:', this.code);
    },
    updateCode() {
      this.extensions = this.getExtensions();
      console.log('after: ' + JSON.stringify(this.question));
      this.code = getSignitureByLanguage(this.question.funcSignature, this.selectedLanguage);
    },
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({
          self: true,
          text: this.newMessage,
        });
        this.$store.state.socket.emit('sendMessage', this.newMessage, this.$store.state.roomCode);
        this.newMessage = '';
      }
    },
  },
  watch: {
    selectedLanguage: {
      handler() {
        this.updateCode();
      },
      immediate: false, // to run the handler immediately after the component’s mounting
    },
  },
  mounted() {
    this.question = this.$store.state.question;
    this.roomCode = this.$store.state.roomCode;
    const socketConnected = this.$store.state.socket.connected;

    // If the socket is connected, update the code
    if (socketConnected) {
      this.updateCode();
    } else {
      this.$router.push('/');
    }

    this.$store.state.socket.on('receiveMessage', (message) => {
      this.messages.push({
        self: false,
        text: message,
      });
    });

    this.$store.state.socket.on('otherPlayerLeft', () => {
      Message.warning('Other player left the room, redirecting to home page...', {
        duration: 3000,
      });

      setTimeout(() => {
        this.$router.push('/');
      }, 3000)
    });
  },
};
</script>

<style>

/* Adjust the color to suit your needs */
.theme-toggle i { 
  margin-left: 10px; 
}

.mainPanel {
  height: 94vh;
  width: 100%;
  color: #3E2723;
}


.panel {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #8D6E63;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  
}

.question-section {
  background-color: #fff9ea;
}

.code-section {
  background-color: #fffaed;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content  {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

pre {
  background-color: #F5F5DC;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #A1887F;


}

.language-selector {
  padding: 5px;
  border-radius: 5px;
  background-color: #FFFAEB;
  border: 1px solid #6D4C41;
  color: #3E2723;
}

.run-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 50px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.run-button:hover {
  background-color: #45a049;
}

.code-section {
  border-radius: 0;
}



h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
  color: #6D4C41;
}

p {
  margin-bottom: 10px;
}

.question-section {
  background-color: #fffaed; /* Lighter background color for better readability */
  color: #495057; /* Darker text color for better readability */
  border: 1px solid #E9ECEF; /* Subtle border color */
  padding: 20px; /* Increased padding */
}

h2 {
  font-size: 2em; /* Increased font size */
  color: #6C757D; /* More subtle color */
  margin-bottom: 15px; /* Increased margin */
  font-weight: 600; /* Bolder font weight */
}

.content p {
  font-size: 1.2em; /* Increased font size */
  line-height: 1.6; /* Improved line spacing */
  margin-bottom: 20px; /* Increased margin */
  color: #212529; /* Darker text color */
}

.content pre {
  background-color: #f0f1f2; /* Lighter background color */
  color: #212529; /* Darker text color */
  padding: 15px; /* Increased padding */
  border-radius: 5px; /* Rounded corners */
  border: 1px solid #c4beae; /* Subtle border color */
  font-size: 1.1em; /* Increased font size */
  line-height: 1.5; /* Improved line spacing */
}

.question-section pre {
  text-align: left;
  white-space: pre-line; /* This will allow the text to wrap */
  background-color: #e5dfcc



}

.code-section, .code-section * {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
}

.language-selector {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  background-color: #FFFAEB;
  border: 1px solid #6D4C41;
  color: #3E2723;
  margin-top: 10px;
  margin-left: 10px;
}

.run-button {
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 40px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-start; /* Align to the start of flex container */
  margin-bottom: 10px;
  margin-right: 10px;
}

.run-button:hover {
  background-color: #45a049; /* Darker green */
}

.splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background: linear-gradient(90deg, #DFD7BF, #DFD7BF);
}

.splitpanes--vertical > .splitpanes__splitter:hover {
  background: linear-gradient(90deg, #D0C8B0, #D0C8B0);
}

.splitpanes--vertical > .splitpanes__splitter:active {
  background: linear-gradient(90deg, #C1B898, #C1B898);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 6px;
  background: linear-gradient(0deg, #DFD7BF, #DFD7BF);
}



.questionTitle {
  margin-bottom: 10px;
  font-size: 1.5em;
  color: #3F2305;
}

.chat-container {
  overflow-y: auto;
  height: calc(100% - 100px); /* Adjusted height considering the input box height and padding */
  border-top: 1px solid #A1887F;
  border-bottom: 1px solid #A1887F;
  padding: 10px;
  background-color: #fffaed; /* to match the rest of the UI */
}

.chat-message-self {
  text-align: left;
}

.chat-message-other {
  text-align: right;
}

.chat-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ddd; /* subtle border */
  padding: 10px;
  background-color: #fffaed;
}

.chat-input {
  width: calc(100% - 80px); /* considering button width */
  padding: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #A1887F;
  color: #3E2723;
  font-size: 1em;
  outline: none;
}

.chat-input::placeholder {
  color: #6D4C41; /* subtle color for placeholder */
}

.chat-send-button {
  background-color: #3F2305;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.chat-send-button:hover {
  background-color: #3F2305;
}

.chat-message-self {
  background-color: #D1C4E9; /* Lighter background for self messages */
  padding: 5px;
  border-radius: 8px;
  margin-bottom: 7px;
  display: inline-block;
  max-width: 80%; /* Ensuring the message doesn't occupy full width */
}

.chat-message-other {
  background-color: #BBDEFB; /* Lighter background for other messages */
  padding: 5px;
  border-radius: 8px;
  margin-bottom: 7px;
  display: inline-block;
  max-width: 80%; /* Ensuring the message doesn't occupy full width */
}

.chat-container {
  padding: 20px 10px; /* More padding at the top and bottom of the chat container */
  background-color: #fffaf0; /* A light, pleasant background color */
}

/* Aligning the chat text to the respective side but the background (bubble) towards the center */
.chat-message-self, .chat-message-other {
  clear: both;
}

.chat-message-self {
  float: left;
  color: white;
  background-color: #3F2305; /* A pleasant green background color */
}

.chat-message-other {
  float: right;
  background-color: #F2EAD3; /* A pleasant red background color */
}

/* Adding some box shadows for depth */
.chat-message-self, .chat-message-other {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}

/* Adjusting margin and padding */
.chat-message-self, .chat-message-other {
  margin: 3px 0;
  padding: 5px 30px;
  border-radius: 5px;
  text-align: left;
}

.timestamp-self, .timestamp-other {
  font-size: 0.8em;
  color: #888;
  margin-top: 3px;
}

.timestamp-self {
  float: left;
}

.timestamp-other {
  float: right;
}

</style>