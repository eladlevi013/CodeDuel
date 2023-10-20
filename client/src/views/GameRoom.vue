<template>
  <div class="main-div">
    <splitpanes class="default-theme">
      <pane size="20">
        <splitpanes horizontal>
          <!-- Question section -->
          <pane size="60">
            <div class="panel question-section">
              <h2 class="question-title">Question {{ question?.id }}: {{ question?.title }}</h2>
              <div style="display: flex; flex-direction: row; align-items: center;">
                <div class="tags-wrapper">
                  <div :class="getDifficultyClass(question?.difficulty)">{{ getDifficultyText(question?.difficulty) }}</div>
                  <div class="question-tags-container" v-for="(tag, index) in question?.categories" :key="index">
                    <div class="question-tag">{{ tag }}</div>
                  </div>
                </div>
              </div>
              <div class="content">
                <p>{{ question?.description }}</p>
                <pre>{{ question?.example }}</pre>
              </div>
            </div>
          </pane>
  
          <!-- Chat section -->
          <pane>
            <Chat/>
          </pane>
        </splitpanes>
      </pane>
  
      <!-- Code editor and new pane section -->
      <pane>
        <splitpanes horizontal @resize="terminalPaneSize = $event[1].size">
          <!-- Code editor section -->
          <pane>
            <div class="panel code-section">
              <CodeEditor ref="codeEditorRef" @closeTerminal="closeTerminal" :question="this.question"/>
            </div>
          </pane>
          
          <!-- New pane section -->
          <pane :size="terminalPaneSize">
            <error-console @openTerminal="openTerminalOnError"/>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
  
  </template>

<script>
import Chat from '../components/Chat.vue';
import CodeEditor from '../components/CodeEditor.vue';
import ErrorConsole from '../components/ErrorConsole.vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
  components: { Splitpanes, Pane, Chat, CodeEditor, ErrorConsole },
  data() {
    return {
      question: {},
      roomCode: '',
      terminalPaneSize: 0,
    };
  },
  methods: {
    openTerminalOnError() {
      this.terminalPaneSize = this.terminalPaneSize < 43
        ? 43 : this.terminalPaneSize;
      this.$refs.codeEditorRef.closeMessages();
    },
    closeTerminal() {
      // this.terminalPaneSize = 20;
    },
    getDifficultyClass(difficulty) {
      switch (difficulty) {
        case 1: return 'question-difficulty-easy';
        case 2: return 'question-difficulty-medium';
        case 3: return 'question-difficulty-hard';
        default: return '';
      }
    },
    getDifficultyText(difficulty) {
      switch (difficulty) {
        case 1: return 'Easy';
        case 2: return 'Medium';
        case 3: return 'Hard';
        default: return '';
      }
    },
  },
  mounted() {
    this.$store.dispatch('fetchUserScore');
    this.$swal.close();
    this.question = this.$store.state.question;
    this.roomCode = this.$store.state.roomCode;

    // on socket problem, redirect to home page
    if (this.$store.state.socket == null || this.$store.state.socket.disconnected) {
      this.$router.push('/');
    }

    this.$store.state.socket.on('otherPlayerLeft', () => {
      this.$swal({
        title: 'Other player left the room',
        text: 'Redirecting to home page...',
        icon: 'warning',
        timer: 5000,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(() => {
        if (this.$route.path !== '/') {
          this.$router.push('/');
        }
      })
    });
  },
  beforeUnmount() {
    this.$store.state.socket.off('otherPlayerLeft');
    this.$store.state.socket.disconnect();
  },
};
</script>

<style>
pre {
  margin-bottom: 40px;
}

.main-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 55px);
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

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
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

.tags-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}


pre {
  background-color: #F5F5DC;
  border: 1px solid #A1887F;
  border-radius: 4px;
  padding: 10px;
}

p { margin-bottom: 10px; }

.question-section {
  background-color: #fff9ea;
  border: 1px solid #E9ECEF;
  color: #495057;
  padding: 20px;
}

.question-tag {
  background-color: #e5dfcc;
  border-radius: 50px;
  font-size: 0.9em;
  padding: 3px 23px;
  margin-bottom: 10px;
  white-space: nowrap;
}

.question-tags-container {
  margin-left: 9px;
}

.question-difficulty-easy {
  color: #20cc10;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.question-difficulty-medium {
  color: #daa70d;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.question-difficulty-hard {
  color: #ff0000;
  font-size: 1.2em;
  margin-bottom: 10px;
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
</style>