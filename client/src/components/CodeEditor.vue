<template>
  <div class="toolbar">
    <!-- Theme toggle -->
    <div class="theme-toggle">
      <i v-if="!isDarkMode" @click="toggleTheme" class="fas fa-sun fa-2x"></i>
      <i v-else @click="toggleTheme" class="fas fa-moon fa-2x"></i>
    </div>
    <!-- Programming language selector -->
    <select v-model="selectedLanguage" class="language-selector">
      <option value="java">Java</option>
      <option value="python">Python</option>
    </select>
    <!-- Run button -->
    <button class="run-button" @click="runCode">Run</button>
  </div>

  <!-- Codemirror IDE -->
  <div class="content">
    <codemirror
      v-model="code"
      :placeholder="getPlaceholder()"
      :style="{ height: 'calc(100% - 0px)', fontSize: '2em' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :options="{ theme: 'vscode-dark', line: true, highlightActiveLine: true }"
    />
    <div class="footer-text" v-if="showTimer">
      {{ formattedTime }} seconds left...
    </div>
  </div>
</template>

<script>
import { getSignitureByLanguage } from '../utils/codeEditorHelper'
// codemirror language support
import { Codemirror } from 'vue-codemirror'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
// codemirror themes
import { solarizedLight } from '@uiw/codemirror-theme-solarized'
import { birdsOfParadise } from 'thememirror'
// message alert library
import Message from 'vue-m-message'
import 'vue-m-message/dist/style.css'

export default {
  props: ['question'],
  components: { Codemirror },
  mounted() {
    this.$store.state.socket.on('gameEndWin', () => {
      this.removeSocketListener()
      this.showTimer = false
      Message.closeAll()

      this.$swal({
        title: 'Congratulations!',
        text: 'You won!',
        icon: 'success',
        timer: 10000,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(() => {
        this.$router.push('/')
      })
    })

    this.$store.state.socket.on('gameEndLose', (winnerPlayerName) => {
      this.removeSocketListener()
      this.showTimer = false
      Message.closeAll()

      this.$swal({
        title: 'Game Over!',
        text: `You lost!, ${winnerPlayerName} won!`,
        icon: 'info',
        timer: 10000,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(() => {
        this.$router.push('/')
      })
    })

    this.$store.state.socket.on('endGameTie', () => {
      this.removeSocketListener()
      this.showTimer = false
      Message.closeAll()

      this.$swal({
        title: 'Game Over!',
        text: "It's a tie!",
        icon: 'info',
        timer: 10000,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(() => {
        this.$router.push('/')
      })
    })

    this.$store.state.socket.on('startGameTimer', () => {
      this.showTimer = true
      this.startTimer()
      Message.closeAll()
      Message.warning(
        () =>
          `your opponent finished the question, you have 60 seconds to solve the problem...`,
        { duration: 5000 }
      )
    })

    this.$store.state.socket.on('codeSuccess', () => {
      Message.closeAll()
      Message.success(
        () =>
          `Problem solved, your opponent has 60 seconds\n to finish their solution...`,
        { duration: 5000 }
      )
      this.$emit('closeTerminal')
    })

    this.$store.state.socket.on('codeWrong', () => {
      Message.closeAll()
      Message.warning(() => `Wrong Answer!`, { duration: 2000 })
      this.$emit('closeTerminal')
    })
  },
  data() {
    return {
      isDarkMode: false,
      selectedLanguage: 'java',
      code: ``,
      extensions: [python(), birdsOfParadise],
      showTimer: false,
      timer: null,
      secondsLeft: 60,
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    closeMessages() {
      Message.closeAll()
    },
    runCode() {
      Message.loading('Testing your code...', { duration: -1 })
      this.$store.state.socket.emit(
        'codeSubmission',
        this.code,
        this.question.id,
        this.selectedLanguage
      )
    },
    getPlaceholder() {
      return `Write your ${this.selectedLanguage} code here...`
    },
    getExtensions() {
      switch (this.selectedLanguage) {
        case 'python':
          return [python(), this.isDarkMode ? solarizedLight : birdsOfParadise]
        case 'java':
          return [java(), this.isDarkMode ? solarizedLight : birdsOfParadise]
        default:
          return [this.isDarkMode ? solarizedLight : birdsOfParadise]
      }
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      this.extensions = this.getExtensions()
    },
    updateProgrammingLanguage() {
      this.extensions = this.getExtensions()
      this.code = getSignitureByLanguage(
        this.question.funcSignature,
        this.selectedLanguage
      )
    },
    startTimer() {
      this.secondsLeft = 15
      this.timer = setInterval(() => {
        this.secondsLeft--

        if (this.secondsLeft < 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    removeSocketListener() {
      this.$store.state.socket.off('gameEndWin')
      this.$store.state.socket.off('gameEndLose')
      this.$store.state.socket.off('endGameTie')
      this.$store.state.socket.off('startGameTimer')
      this.$store.state.socket.off('codeSuccess')
      this.$store.state.socket.off('codeWrong')
    },
  },
  watch: {
    selectedLanguage: {
      handler() {
        try {
          this.updateProgrammingLanguage()
        } catch (error) {
          console.error('Error in watcher: selectedLanguage:', error)
        }
      },
      immediate: false,
    },
    question: {
      handler() {
        try {
          this.updateProgrammingLanguage()
        } catch (error) {
          console.error('Error in watcher: question:', error)
        }
      },
      immediate: false,
    },
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60)
      const seconds = this.secondsLeft % 60
      return `${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`
    },
  },
}
</script>

<style>
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
</style>
