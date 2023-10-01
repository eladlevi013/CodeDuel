<template>
  <div class='navbar-container'>
    <div class="pages-container">
      <router-link class="navbar-title" :to="{ path: '/' }">Home</router-link>
      <router-link class="navbar-title" :to="{ path: '/' }">Rooms</router-link>
      <router-link class="navbar-title" :to="{ path: '/' }">About</router-link>
    </div>
    <div class="auth-container">
      <router-link class="navbar-title" :to="{ path: '/auth/login' }">Login</router-link>
      <router-link class="navbar-title" :to="{ path: '/auth/register' }">Register</router-link>
    </div>
  </div>
</template>

<style>
.auth-container {
  justify-content: flex-end;
  margin-right: 15px;
}

.pages-container {
  justify-content: flex-start;
}

.navbar-container {
  display: flex;
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

.navbar-title {
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