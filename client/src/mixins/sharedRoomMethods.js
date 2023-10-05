import Message from 'vue-m-message';
import 'vue-m-message/dist/style.css'

const MESSAGE_DURATION = 1500;

export const sharedRoomMethods = {
  computed: {
    socket() {
      return this.$store.state.socket;
    }
  },
  data() {
    return {
      joinedRoomCode: '',
      gameStarted: false,
    };
  },
  methods: {
    joinRoom(roomCode) {
      Message.closeAll();

      if (this.joinedRoomCode.trim()) {
        this.leaveRoom(this.joinedRoomCode);
      }
      this.socket.emit('joinRoom', roomCode);
    },
    createRoom() {
      if (this.joinedRoomCode) {
        this.socket.emit('leaveRoom', this.joinedRoomCode);
      }
      this.socket.emit('createRoom', !this.isPrivate);
    },
    leaveRoom(roomCode) {
      this.socket.emit('leaveRoom', roomCode);
    },
    closeAllMessages() {
      Message.closeAll();
    },
    connectSocket() {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    },
    setSocketListeners() {
      this.socket.on('startGame', question => {
        this.gameStarted = true;
        this.$store.commit('setQuestion', question);
        Message.closeAll();
        Message.info(`Joined room ${this.joinedRoomCode}`, { duration: MESSAGE_DURATION });
        this.$router.push({ path: `game/room/${this.joinedRoomCode}` });
      });

      this.socket.on('joinedRoom', (roomCode) => {
        Message.closeAll();
        this.$store.state.roomCode = roomCode;
        this.joinedRoomCode = roomCode;
        Message.loading(() => (`Waiting for another player, with room code: ${this.joinedRoomCode}`), {duration: -1});
      });

      this.socket.on('getRooms', (rooms) => {
        this.availableRooms = rooms;
      });

      this.socket.on('roomNotFound', () => {
        Message.error(`Room ${this.roomCode} not found`, { duration: MESSAGE_DURATION });
      });
    }
  },
  beforeUnmount() {
    this.closeAllMessages();

    if (this.joinedRoomCode && !this.gameStarted) {
      this.socket.emit('leaveRoom', this.joinedRoomCode);
    }

    ['startGame', 'joinedRoom', 'getRooms', 'roomNotFound'].forEach(event => {
      this.socket.off(event);
    });
  },
  mounted() {
    this.connectSocket();
    this.setSocketListeners();
  }
};
