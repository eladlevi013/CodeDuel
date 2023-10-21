<template>
  <div class="navbar-container">
    <div class="pages-container">
      <router-link class="navbar-title" :to="{ path: '/' }">Home</router-link>
      <router-link class="navbar-title" :to="{ path: '/rooms' }">Rooms</router-link>
      <router-link
        class="navbar-title hide-on-tablet hide-on-mobile"
        :to="{ path: '/leaderboard' }"
      >
        Leaderboard
      </router-link>
      <a
        class="navbar-title hide-on-tablet hide-on-mobile"
        href="https://github.com/eladlevi013/CodeDuel"
      >
        Github
      </a>
    </div>
    <div class="auth-container">
      <template v-if="user">
        <span class="navbar-title hide-on-mobile">⚔️ {{ user.score }} score</span>
        <span class="navbar-title hide-on-mobile">{{ user.username }}</span>
        <span class="navbar-title" @click="logout">Logout</span>
      </template>
      <template v-else>
        <router-link class="navbar-title" :to="{ path: '/auth/login' }">Login</router-link>
        <router-link class="navbar-title" :to="{ path: '/auth/register' }">Register</router-link>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout() {
      this.$store.commit('setUser', null);
      this.$store.commit('setSessionId', null);
      this.$router.push('/');
      this.$store.dispatch('logout');
    },
    fetchUserDetails() {
      this.$store.dispatch('fetchUserScore');
    }
  }
};
</script>

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
  flex-wrap: wrap;
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

@media only screen and (max-width: 768px) {
  .hide-on-tablet {
    display: none;
  }
}

@media only screen and (max-width: 550px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
