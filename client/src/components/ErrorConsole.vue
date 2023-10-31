<template>
  <div class="error-container">{{ error }}</div>
</template>

<script>
export default {
  data() {
    return {
      error: ''
    };
  },
  methods: {
    setErrorMessage(error) {
      this.error = error;
    }
  }
};
</script>

<style scoped>
.error-container {
  background-color: #1f1611;
  width: 100%;
  height: 100%;
  color: #6b4e32;
  padding: 10px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-size: 20px;
}
</style>
