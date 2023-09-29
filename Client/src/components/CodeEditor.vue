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
        <option value="javascript">JavaScript</option>
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
</div>
</template>

<script>
import { getSignitureByLanguage } from '../utils/codeEditorHelper';
// codemirror language support
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
// codemirror themes
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
import { birdsOfParadise } from 'thememirror';
// message alert library
import Message from 'vue-m-message';
import 'vue-m-message/dist/style.css'

export default {
    props: ['question'],
    components: { Codemirror },
    mounted() {
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
    },
    data() {
        return {
            isDarkMode: false,
            selectedLanguage: 'java',
            code: ``,
            extensions: [javascript(), birdsOfParadise],
        }
    },
    methods: {
        runCode() {
            Message.loading('Testing your code...', {duration: -1,});
            this.$store.state.socket.emit('codeSubmission', this.code, this.question.id, this.selectedLanguage);
        },
        getPlaceholder() {
            return `Write your ${this.selectedLanguage} code here...`;
        },
        getExtensions() {
            switch (this.selectedLanguage) {
                case 'javascript':
                    return [javascript(), this.isDarkMode ? solarizedLight : birdsOfParadise];
                case 'python':
                    return [python(), this.isDarkMode ? solarizedLight : birdsOfParadise];
                case 'java':
                    return [java(), this.isDarkMode ? solarizedLight : birdsOfParadise];
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
    },
    watch: {
        selectedLanguage: {
            handler() {this.updateProgrammingLanguage()},
            immediate: false,
        },
        question: {
            handler() {this.updateProgrammingLanguage()},
            immediate: false,
        },
    },
}
</script>

<style>
.cm-editor.cm-focused { 
outline: none; }

.toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.theme-toggle i {
  margin-left: 10px;
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
</style>