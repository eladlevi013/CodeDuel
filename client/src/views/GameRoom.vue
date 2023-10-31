<template>
  <div class="main-div">
    <splitpanes class="default-theme" ref="mainSplitPane">
      <pane :size="this.gameMode === 'sql' ? '34' : '24'">
        <splitpanes horizontal>
          <!-- Question section -->
          <pane :size="this.gameMode === 'sql' ? '90' : '50'">
            <div class="panel question-section">
              <h2 class="question-title">Question {{ question?.id }}: {{ question?.title }}</h2>
              <div style="display: flex; flex-direction: row; align-items: center">
                <div class="tags-wrapper">
                  <div :class="getDifficultyClass(question?.difficulty)">
                    {{ getDifficultyText(question?.difficulty) }}
                  </div>
                  <div
                    class="question-tags-container"
                    v-for="(tag, index) in question?.categories"
                    :key="index"
                  >
                    <div class="question-tag">{{ tag }}</div>
                  </div>
                </div>
              </div>
              <div class="content">
                <p>{{ question?.description }}</p>
              </div>

              <div v-if="gameMode === 'sql' && question && question.tables">
                <div v-for="(tableData, tableName) in question.tables" :key="tableName">
                  <h3 class="question-title">{{ tableName }} table:</h3>
                  <table class="table">
                    <thead v-if="tableData.titles && tableData.values">
                      <tr>
                        <th v-for="title in tableData.titles" :key="title">
                          {{ title }}
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="tableData.values">
                      <tr
                        v-for="(row, index) in tableData.values"
                        :key="tableName + '-row-' + index"
                      >
                        <td v-for="(value, i) in row" :key="tableName + '-cell-' + i">
                          {{ value }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table on SQL mode -->
              <br v-if="this.gameMode === 'sql'" />
              <h3 class="question-title" v-if="this.gameMode === 'sql'">Result:</h3>
              <table v-if="this.gameMode === 'sql'" class="table">
                <thead>
                  <tr>
                    <th v-for="title in question?.example?.titles" :key="title">
                      {{ title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in question?.example?.values" :key="index">
                    <td style="padding: 10px 45px" v-for="(value, i) in row" :key="i">
                      {{ value }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br v-if="this.gameMode == 'sql'" />
              <br v-if="this.gameMode == 'sql'" />
              <div v-if="this.gameMode == 'coding'">
                <pre>{{ question?.example }}</pre>
              </div>
            </div>
          </pane>

          <!-- Chat section -->
          <pane>
            <Chat />
          </pane>
        </splitpanes>
      </pane>

      <pane>
        <splitpanes horizontal>
          <!-- Code editor section -->
          <pane>
            <div class="panel code-section">
              <CodeEditor
                ref="codeEditorRef"
                @closeTerminal="closeTerminal"
                :question="this.question"
              />
            </div>
          </pane>

          <!-- Console section -->
          <pane v-if="showTerminalPane" ref="terminalPane" size="30">
            <error-console @openTerminal="openTerminalOnError" ref="terminalRef" />
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
      showTerminalPane: false,
      question: {},
      roomCode: '',
      gameMode: ''
    };
  },
  methods: {
    openTerminalOnError(error) {
      this.showTerminalPane = true;
      this.$nextTick(() => {
        this.$refs.codeEditorRef.closeMessages();
        this.$refs.terminalRef.setErrorMessage(error);
      });
    },
    closeTerminal() {
      this.showTerminalPane = false;
    },
    getDifficultyClass(difficulty) {
      switch (difficulty) {
        case 1:
          return 'question-difficulty-easy';
        case 2:
          return 'question-difficulty-medium';
        case 3:
          return 'question-difficulty-hard';
        default:
          return '';
      }
    },
    getDifficultyText(difficulty) {
      switch (difficulty) {
        case 1:
          return 'Easy';
        case 2:
          return 'Medium';
        case 3:
          return 'Hard';
        default:
          return '';
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserScore');
    this.$swal.close();
    this.question = this.$store.state.question;
    this.roomCode = this.$store.state.roomCode;
    this.gameMode = this.$store.state.gameMode;

    // on socket problem, redirect to home page
    if (this.$store.state.socket == null || this.$store.state.socket.disconnected) {
      this.$router.push('/');
    }

    this.$store.state.socket.on('codeError', error => {
      this.openTerminalOnError(error);
    });

    this.$store.state.socket.on('otherPlayerLeft', () => {
      this.$swal({
        title: 'Other player left the room',
        text: 'Redirecting to home page...',
        icon: 'warning',
        timer: 5000,
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
      }).then(() => {
        if (this.$route.path !== '/') {
          this.$router.push('/');
        }
      });
    });
  },
  beforeUnmount() {
    this.$store.state.socket.off('otherPlayerLeft');
    this.$store.state.socket.off('codeError');
    this.$store.state.socket.disconnect();
  }
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
  background-color: #f5f5dc;
  border: 1px solid #a1887f;
  border-radius: 4px;
  padding: 10px;
}

p {
  margin-bottom: 10px;
}

.question-section {
  background-color: #fff9ea;
  border: 1px solid #e9ecef;
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
  color: #3f2305;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.table-title {
  color: #3f2305;
  font-size: 1em;
  margin-bottom: 10px;
  margin-left: 10px;
}

.question-section pre {
  background-color: #e5dfcc;
  text-align: left;
  white-space: pre-line;
}

/* Overriding default splitpanes */
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background: linear-gradient(90deg, #dfd7bf, #dfd7bf);
}

.splitpanes--vertical > .splitpanes__splitter:hover {
  background: linear-gradient(90deg, #d0c8b0, #d0c8b0);
}

.splitpanes--vertical > .splitpanes__splitter:active {
  background: linear-gradient(90deg, #c1b898, #c1b898);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 6px;
  background: linear-gr adient(0deg, #dfd7bf, #dfd7bf);
}

/* Table styles */
.table {
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 auto;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  overflow: hidden;
}

.table th,
.table td {
  padding: 10px 6px;
  border: none;
  text-align: center;
  font-size: 16px;
}

.table tbody tr:nth-child(odd) {
  background-color: #ede6cf;
}

.table tbody tr:nth-child(even) {
  background-color: #f2ebd6;
}

.table tr:hover {
  background-color: rgba(57, 38, 31, 0.1);
}

.table th {
  background-color: #4a3423;
  color: #ffffff;
  font-weight: 100;
  font-family: Arial, sans-serif;
}
</style>
