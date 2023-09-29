<template>
<div class="mainDiv">
  <splitpanes class="default-theme">
    <pane size="30">
      <splitpanes horizontal>
        <!-- Question section -->
        <pane size="70">
          <div class="panel question-section">
            <h2 class="question-title">Question {{ question.id }}: {{ question.title }}</h2>
            <div class="content">
              <p>{{ question.description }}</p>
              <pre>{{ question.example }}</pre>
            </div>
          </div>
        </pane>
        
        <!-- Chat section -->
        <pane>
          <div class="chat-container">
            <div v-for="message in messages" :key="message.id" class="chat-message" 
              :class="{ 'self': message.self, 'other': !message.self }">
              <div class="chat-message-bubble">
                {{ message.text }}
                <div :class="{ 'timestamp-self': message.self, 'timestamp-other': 
                  !message.self }">{{ message.timestamp }}</div>
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input type="text" v-model="newMessage" @keyup.enter="sendMessage" 
              placeholder="Chat" class="chat-input" />
            <button class="chat-send-button" @click="sendMessage">Send</button>
          </div>
        </pane>
      </splitpanes>
    </pane>

    <!-- Code editor section -->
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
          <codemirror v-model="code" :placeholder="getPlaceholder()" :style="{ height: 'calc(100% - 0px)',
            fontSize: '2em' }" :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
            :options="{ theme: 'vscode-dark' }" @ready="handleReady"/>
        </div>
      </div>
    </pane>
  </splitpanes>
</div>
</template>

<script>
import { getSignitureByLanguage } from '../utils/ideUtility';
// import splitpanes and its css
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
// codemirror language support
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
// codemirror themes
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
    this.$store.state.socket.off('codeSuccess');
    this.$store.state.socket.off('codeWrong');
    this.$store.state.socket.off('codeError');
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
      Message.loading('Testing your code...', {duration: -1,});
      this.$store.state.socket.emit('codeSubmission', this.code, this.question.id, this.selectedLanguage);
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
      immediate: false,
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

    this.$store.state.socket.on('codeSuccess', () => {
      Message.closeAll();
      Message.success(() => (`Problem Solved!`), {duration: 2000})
    });

    this.$store.state.socket.on('codeWrong', () => {
      Message.closeAll();
      Message.warning(() => (`Wrong Answer!`), {duration: 2000})
    });

    this.$store.state.socket.on('codeError', (error) => {
      Message.closeAll();
      Message.error(() => (`Code error: ${error}`), {duration: 2100})
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
.mainDiv {
  color: #3E2723;
  height: calc(100vh - 60px);
}

.panel {
  height: 100%;
  overflow-y: auto;
}

.code-section {
  background-color: #fffaed;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.content p {
  color: #212529;
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 20px;
}

.content pre {
  background-color: #f0f1f2;
  border: 1px solid #c4beae;
  border-radius: 5px;
  color: #212529;
  font-size: 1.1em;
  line-height: 1.5;
  padding: 15px;
}

pre {
  background-color: #F5F5DC;
  border: 1px solid #A1887F;
  border-radius: 4px;
  padding: 10px;
}

.language-selector {
  background-color: #FFFAEB;
  border: 1px solid #6D4C41;
  border-radius: 5px;
  color: #3E2723;
  margin: 10px 0;
  padding: 5px;
}

.run-button {
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 10px 10px 10px 0;
  padding: 10px 40px;
}

.run-button:hover { background-color: #45a049; }

p { margin-bottom: 10px; }

.question-section {
  background-color: #fff9ea;
  border: 1px solid #E9ECEF;
  color: #495057;
  padding: 20px;
}

.question-title {
  color: #3F2305;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.question-section pre {
  background-color: #e5dfcc;
  text-align: left;
  white-space: pre-line;
}

.theme-toggle i {
  margin-left: 10px;
}

/* Overriding default splitpanes */
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