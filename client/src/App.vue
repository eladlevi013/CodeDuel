<script setup>
import { Notivue, Notifications } from 'notivue';
</script>

<template>
  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <Navbar />
  <router-view />
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar }
};
</script>

<style>
@import './styles/main.css';
</style>
