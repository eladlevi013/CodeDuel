import Vuex from 'vuex';
import io from 'socket.io-client';

export default new Vuex.Store({
  state: {
    socket: io('http://localhost:3001'),
  },
  mutations: {},
  actions: {},
  getters: {
    socket: (state) => state.socket,
  },
});
