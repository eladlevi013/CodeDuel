<template>
  <div class="mainPanel">
    <splitpanes class="default-theme" :sizes="[25, 75]" :push-other-panes="false">
      <pane size="30">
  <div class="panel question-section">
    <h2 class="questionTitle">Extended Example Question: Advanced Array Sum</h2>
    <div class="content">
      <p>
        Given an array of integers, find two non-overlapping (contiguous) subarrays,
        which have the largest sum. Return the indices of the two numbers such that
        they add up to form the maximum possible sum. The number at each index is
        considered to be part of the subarray.
      </p>
      <pre>
        Given nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        The two subarrays are [1, 2, 3, 4, 5] and [6, 7, 8, 9, 10], 
        The largest sum would be 55.
      </pre>
    </div>
  </div>
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
            <codemirror
              v-model="code"
              :placeholder="placeholder"
              :style="{ height: 'calc(100% - 0px)', fontSize: '2em'}"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              :options="{ theme: 'vscode-dark' }"
              @ready="handleReady"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { ref, computed } from 'vue'
// import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// import { eclipse } from '@uiw/codemirror-theme-eclipse'
import { bespin } from '@uiw/codemirror-theme-bespin'
import { solarizedLight } from 'thememirror';

export default {
  components: { Splitpanes, Pane, Codemirror},
  setup() {
    const isDarkMode = ref(false); // manage the theme state
    const selectedLanguage = ref('javascript')
    const code = ref(`console.log('Hello, world!')`)
    const extensions = ref([javascript(), solarizedLight]); // this should now be a ref instead of const
    const view = ref(null)

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        extensions.value = [javascript(), bespin]; // change to dark theme
      } else {
        extensions.value = [javascript(), solarizedLight]; // change to light theme
      }
    }

    const placeholder = computed(() => `Write your ${selectedLanguage.value} code here...`)

    const handleReady = (payload) => {
      view.value = payload.view
    }

    const runCode = () => {
      console.log('Running the code:', code.value)
    }

    return {
      isDarkMode,
      toggleTheme,
      selectedLanguage,
      code,
      extensions,
      placeholder,
      handleReady,
      runCode,
    }
  }
}
</script>

<style>

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

.splitpanes--vertical > .splitpanes__splitter {
  min-height: 6px;
  cursor: row-resize;
  background-color: #8D6E63;

}

.questionTitle {
  margin-bottom: 10px;
  font-size: 1.5em;
  color: #3F2305;
}

</style>