<template>
    <div class="not-found-container">
      <h1 class="not-found-title">404 - Not Found</h1>
      <p class="not-found-description" style="font-size: 20px;">Sorry, the page you are looking for does not exist.</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>

  .not-found-title {
  font-family: 'Skranji';
  font-size: 3rem;
  color: #26160d;
    margin-bottom: 0;


    }

    .not-found-description {
    font-family: 'Poppins';
    font-size: 1.5rem;
    color: #26160d;
    margin-top: 0;
    }


    .not-found-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh;
    }

  </style>
  