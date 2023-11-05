<template>
  <div class="toolbar">
    <!-- Theme toggle -->
    <div class="theme-toggle">
      <i v-if="!isDarkMode" @click="toggleTheme" class="fas fa-sun fa-2x"></i>
      <i v-else @click="toggleTheme" class="fas fa-moon fa-2x"></i>
    </div>

    <div>
      <!-- Programming language selector -->
      <select v-model="selectedLanguage" v-if="gameMode === 'coding'" class="language-selector">
        <option value="java">Java</option>
        <option value="python">Python</option>
      </select>

      <!-- Font size -->
      <select v-model="fontSize" class="language-selector">
        <option value="1.5em">Smallest</option>
        <option value="2em">Small</option>
        <option value="2.5em">Regular</option>
        <option value="5em">Large</option>
        <option value="6em">Largest</option>
      </select>
    </div>

    <!-- Run button -->
    <button class="run-button" @click="runCode">
      Run {{ gameMode === 'sql' ? 'Query' : 'Code' }}
    </button>
  </div>

  <!-- Codemirror IDE -->
  <div class="codeeditor-container">
    <codemirror
      v-model="code"
      :placeholder="getPlaceholder()"
      :style="{ height: 'calc(100% - 0px)', fontSize: fontSize }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :options="{ theme: 'vscode-dark', line: true, highlightActiveLine: true }"
    />
    <div class="footer-text" v-if="showTimer">{{ formattedTime }} seconds left...</div>
  </div>
</template>

<script>
import { getSignitureByLanguage } from '../utils/codeEditorHelper';
import { Codemirror } from 'vue-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
import { birdsOfParadise } from 'thememirror';
import { clearAllToasts, promiseToast, warningToast } from '../utils/toastController';
import { openGameEndModal } from '../utils/modalController';

export default {
  props: ['question'],
  components: { Codemirror },
  mounted() {
    this.gameMode = this.$store.state.gameMode;
    this.selectedLanguage = this.gameMode === 'coding' ? 'java' : 'sql';

    this.$store.state.socket.on('gameEndWin', () => {
      this.removeSocketListener();
      this.showTimer = false;
      clearAllToasts();
      console.log('You won! 🎉');
      openGameEndModal(
        {
          title: 'Congratulations!',
          text: 'You won!',
          icon: 'success'
        },
        this.$router
      );
    });

    this.$store.state.socket.on('gameEndLose', winnerPlayerName => {
      this.removeSocketListener();
      this.showTimer = false;
      clearAllToasts();
      console.log('You lost! 😢');
      openGameEndModal(
        {
          title: 'Game Over!',
          text: `You lost!, ${winnerPlayerName} won!`,
          icon: 'info'
        },
        this.$router
      );
    });

    this.$store.state.socket.on('endGameTie', () => {
      this.removeSocketListener();
      this.showTimer = false;
      clearAllToasts();
      this.$store.state.socket.off('otherPlayerLeft');
      console.log('It is a tie! 🤝');
      openGameEndModal(
        {
          title: 'Game Over!',
          text: "It's a tie!",
          icon: 'info'
        },
        this.$router
      );
    });

    this.$store.state.socket.on('startGameTimer', async () => {
      if (this.showTimer) return;
      this.showTimer = true;
      this.startTimer();
      console.log('Your opponent finished the question! ⏰');
      warningToast({
        message: 'your opponent finished the question, you have 60 seconds to solve the problem...'
      });
    });

    this.$store.state.socket.on('codeSuccess', () => {
      console.log('Correct Answer! ✅');

      this.loadingMessage.resolve(
        'Problem solved, your opponent has 60 seconds\n to finish their solution...'
      );
      this.$emit('closeTerminal');
    });

    this.$store.state.socket.on('codeWrong', () => {
      console.log('Wrong Answer! ❌');

      if (this.loadingMessage?.reject) {
        this.loadingMessage?.reject({ message: 'Wrong Answer!', duration: 1500 });
      }

      this.$emit('closeTerminal');
    });
  },
  emits: ['closeTerminal'],
  data() {
    return {
      isDarkMode: false,
      selectedLanguage: 'java',
      code: ``,
      extensions: [python(), birdsOfParadise],
      showTimer: false,
      timer: null,
      secondsLeft: 60,
      fontSize: '2.5em',
      loadingMessage: '',
      gameMode: ''
    };
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
    this.removeSocketListener();
  },
  methods: {
    closeMessages() {
      clearAllToasts();
    },
    runCode() {
      if (this.loadingMessage?.clear) {
        this.loadingMessage.clear();
      }
      this.loadingMessage = promiseToast('Testing your code...');

      this.$store.state.socket.emit(
        'codeSubmission',
        this.code,
        this.question.id,
        this.selectedLanguage
      );
    },
    getPlaceholder() {
      return `Write your ${this.selectedLanguage} code here...`;
    },
    getExtensions() {
      switch (this.selectedLanguage) {
        case 'python':
          return [python(), this.isDarkMode ? solarizedLight : birdsOfParadise];
        case 'java':
          return [java(), this.isDarkMode ? solarizedLight : birdsOfParadise];
        case 'sql':
          return [sql(), this.isDarkMode ? solarizedLight : birdsOfParadise];
        default:
          return [this.isDarkMode ? solarizedLight : birdsOfParadise];
      }
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.extensions = this.getExtensions();
    },
    updateProgrammingLanguage() {
      this.extensions = this.getExtensions();
      this.code = getSignitureByLanguage(this.question.funcSignature, this.selectedLanguage);
    },
    startTimer() {
      this.secondsLeft = 60;
      this.timer = setInterval(() => {
        this.secondsLeft--;

        if (this.secondsLeft < 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    removeSocketListener() {
      this.$store.state.socket.off('gameEndWin');
      this.$store.state.socket.off('gameEndLose');
      this.$store.state.socket.off('endGameTie');
      this.$store.state.socket.off('startGameTimer');
      this.$store.state.socket.off('codeSuccess');
      this.$store.state.socket.off('codeWrong');
    }
  },
  watch: {
    gameMode: {
      handler() {
        if (this.gameMode === 'coding') {
          this.selectedLanguage = 'java';
        } else {
          this.selectedLanguage = 'sql';
        }
      },
      immediate: false
    },
    selectedLanguage: {
      handler() {
        try {
          this.updateProgrammingLanguage();
        } catch (error) {
          console.error('Error in watcher: selectedLanguage:', error);
        }
      },
      immediate: false
    },
    question: {
      handler() {
        try {
          this.updateProgrammingLanguage();
        } catch (error) {
          console.error('Error in watcher: question:', error);
        }
      },
      immediate: false
    }
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60);
      const seconds = this.secondsLeft % 60;
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }
};
</script>

<style scoped>
.cm-editor.cm-focused {
  outline: none;
}

.toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.theme-toggle i {
  margin-left: 10px;
}

.language-selector {
  background-color: #fffaeb;
  border: 1px solid #6d4c41;
  border-radius: 5px;
  color: #3e2723;
  margin: 10px 0;
  padding: 5px;
  margin-right: 7px;
}

.run-button {
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 10px 10px 10px 0;
  padding: 10px 40px;
}

.run-button:hover {
  background-color: #45a049;
}

.footer-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: x-large;
  margin-bottom: 20px;
  text-shadow:
    -1px 0 black,
    0 1px black,
    1px 0 black,
    0 -1px black;
}

.codeeditor-container {
  height: 100%;
  position: relative;
  width: 100%;
}
</style>
