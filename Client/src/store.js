import Vuex from 'vuex';
import io from 'socket.io-client';
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
  state: {
    socket: io(process.env.VUE_APP_PROD === 'true' ? 
      'https://playground-ts-production.up.railway.app/': 'http://localhost:3001'),
    roomCode: '',
    question: null,
    sessionId: '',
    user: null,
  },
  mutations: {
    setRoomCode(state, code) {
      state.roomCode = code;
    },
    setQuestion(state, question) {
      state.question = question;
    },
    setSessionId(state, sessionId) {
      state.sessionId = sessionId;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
  },
  getters: {
    socket: (state) => state.socket,
    roomCode: (state) => state.roomCode,
    question: (state) => state.question,
    sessionId: (state) => state.sessionId,
    user: (state) => state.user,
  },
  plugins: [createPersistedState({
    paths: ['roomCode', 'question', 'sessionId', 'user']
  })],
});
