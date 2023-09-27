<template>
  <div className='navbarContainer'>
    <div>
      <a class="navbarTitle" href="/">Home</a>
      <a class="navbarTitle">Github</a>
      <a class="navbarTitle">About</a>
    </div>
  </div>
  <router-view/>
</template>

<script>
  import 'vue-m-message/dist/style.css'

  export default {
    name: 'App',
    data() {
      return {
        roomCode: '',
        socket: null,
        serversList: [],
      };
    },
  };
</script>

<style>
  .navbarContainer {
    background-color: #39261f;
    width: 100%;
    height: 55px;
    top: 10;
    left: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbarTitle {
    font-family: 'Poppins', cursive;
    font-size: 17px;
    margin-left: 15px;
    color: white;
    text-decoration: none;
    padding-top: 100px;
    margin-top: 100px;
    cursor: pointer;
  }
</style>