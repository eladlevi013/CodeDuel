<template>
<div class="mainDiv">
  <splitpanes class="default-theme">
    <pane size="30">
      <splitpanes horizontal>
        <!-- Question section -->
        <pane size="70">
          <div class="panel question-section">
            <h2 class="question-title">Question {{ question.id }}: {{ question.title }}</h2>
            <div style="display: flex; flex-direction: row; align-items: center;">
              <div :class="getDifficultyClass(question.difficulty)">{{ getDifficultyText(question.difficulty) }}</div>
                <div class="question-tags-container" v-for="(tag, index) in question.categories" :key="index">
                  <div class="question-tag">{{ tag }}</div>
                </div>
              </div>
              <div class="content">
                <p>{{ question.description }}</p>
                <pre>{{ question.example }}</pre>
            </div>
          </div>
        </pane>
        <!-- Chat section -->
        <pane>
          <Chat/>
        </pane>
      </splitpanes>
    </pane>
    <!-- Code editor section -->
    <pane>
      <div class="panel code-section">
        <CodeEditor :question="this.question"/>
      </div>
    </pane>
  </splitpanes>
</div>

</template>

<script>
// import vue components
import Chat from '../components/Chat.vue';
import CodeEditor from '../components/CodeEditor.vue';
// import splitpanes and its css
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
// message alert library
import Message from 'vue-m-message';
import 'vue-m-message/dist/style.css'

export default {
  components: { Splitpanes, Pane, Chat, CodeEditor },
  data() {
    return {
      question: {},
    };
  },
  methods: {
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
    this.question = this.$store.state.question;
    this.roomCode = this.$store.state.roomCode;

    if (!this.$store.state.socket.connected) {
      this.$router.push('/');
    }

    this.$store.state.socket.on('otherPlayerLeft', () => {
      Message.warning('Other player left the room, redirecting to home page...', {
        duration: 3000});
      setTimeout(() => {this.$router.push('/')}, 3000)
    });


    this.$store.state.socket.on('gameEnd', () => {
      this.$swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          this.$swal.fire('Changes are not saved', '', 'info')
        }
      })
    });
  },
  beforeUnmount() {
    this.$store.state.socket.off('otherPlayerLeft');
    this.$store.state.socket.off('codeSuccess');
    this.$store.state.socket.off('codeWrong');
    this.$store.state.socket.off('codeError');
  },
};
</script>

<style>
.mainDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Align children vertically such that the last child is pushed to the bottom */
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
  font-size: 1.0em;
  padding: 3px 30px;
  margin-bottom: 10px;
  margin-right: -10px;
}

.question-tags-container {
  margin-left: 20px;
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