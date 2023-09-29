import Vuex from 'vuex';
import io from 'socket.io-client';

export default new Vuex.Store({
  state: {
    socket: io(process.env.VUE_APP_PROD == 'true' ? 'https://codeduel-production.up.railway.app/'
      : 'http://localhost:3001'),
    roomCode: '',
    question: {},
  },
  mutations: {},
  actions: {},
  getters: {
    socket: (state) => state.socket,
    roomCode: (state) => state.roomCode,
    question: (state) => state.question,
  },
});
