import Vuex from 'vuex';
import io from 'socket.io-client';
import createPersistedState from "vuex-persistedstate";
import axios from 'axios';

export default new Vuex.Store({
  state: {
    socket: io(process.env.VUE_APP_PROD === 'true' ? 
      'https://codeduel-production.up.railway.app/': 'http://localhost:3001'),
    roomCode: '',
    question: null,
    user: null,
  },
  mutations: {
    setUserScore(state, score) {
      if (state.user) {
        state.user.score = score;
      }
    },
    setRoomCode(state, code) {
      state.roomCode = code;
    },
    setQuestion(state, question) {
      state.question = question;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async fetchUserScore({ commit }) {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}/users/score`);
        const data = await response.data;
        const score = data.score;
        commit('setUserScore', score);
      } catch (error) {
        console.error('Error fetching the user score:', error);
      }
    },
    async logout({ commit }) {
      try {
        await axios.post(`${process.env.VUE_APP_SERVER_URL}/users/logout`, {}, {
          withCredentials: true
        });
    
        commit('setUser', null);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  },
  getters: {
    socket: (state) => state.socket,
    roomCode: (state) => state.roomCode,
    question: (state) => state.question,
    user: (state) => state.user,
    userScore: (state) => state.user ? state.user.score : 0,
  },
  plugins: [createPersistedState({
    paths: ['roomCode', 'question', 'user']
  })],
});
