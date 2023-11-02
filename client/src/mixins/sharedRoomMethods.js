import { push } from '../main';

// Constants
const MESSAGE_DURATION = 1500;
const SHORT_MESSAGE_DURATION = 1000;

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
      loadingMessage: ''
    };
  },
  methods: {
    quickMatch() {
      this.socket.emit('quickMatch', this.$store.state.user?._id || null);
    },
    joinRoom(roomCode) {
      if (this.joinedRoomCode.trim()) {
        this.leaveRoom(this.joinedRoomCode);
      }

      const uid = this.$store.state.user?._id;
      this.socket.emit('joinRoom', roomCode, uid ? uid : null);
    },
    createRoom() {
      this.$swal
        .fire({
          title: 'Room Creation',
          text: `Customize your room options below. You can choose to play in Coding Mode or SQL Mode.`,
          icon: 'question',
          confirmButtonText: 'Coding Mode',
          confirmButtonColor: '#39261f',
          showCancelButton: true,
          showDenyButton: true,
          denyButtonText: 'SQL Mode',
          denyButtonColor: '#5e3f34'
        })
        .then(result => {
          let gameMode = 'coding';

          if (result.isConfirmed) {
            gameMode = 'coding';
          } else if (result.isDenied) {
            gameMode = 'sql';
          } else {
            return;
          }

          if (this.joinedRoomCode) {
            this.socket.emit('leaveRoom', this.joinedRoomCode);
          }

          this.socket.emit('createRoom', !this.isPrivate, gameMode);
        });
    },
    leaveRoom(roomCode) {
      this.socket.emit('leaveRoom', roomCode);
    },
    closeAllMessages() {
      // push.clearAll();
    },
    connectSocket() {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    },
    setSocketListeners() {
      this.socket.on('startGame', (question, gameMode) => {
        this.gameStarted = true;
        this.$store.commit('setQuestion', question);
        this.$store.commit('setGameMode', gameMode);
        this.$router.push(`/rooms/game/${this.joinedRoomCode}`);
      });

      this.socket.on('joinedRoom', roomCode => {
        this.$store.state.roomCode = roomCode;
        this.joinedRoomCode = roomCode;

        // Handling loading message
        if (this.loadingMessage?.clear) this.loadingMessage?.clear();
        this.loadingMessage = push.promise(
          `Waiting for another player, with room code: ${this.joinedRoomCode}`
        );
      });

      this.socket.on('getRooms', rooms => {
        this.availableRooms = rooms;
      });

      this.socket.on('roomNotFound', () => {
        push.error({
          message: `Room ${this.roomCode} not found`,
          duration: SHORT_MESSAGE_DURATION
        });
      });

      this.socket.on('roomFull', () => {
        push.warning({
          message: `Room ${this.roomCode} is full`,
          duration: MESSAGE_DURATION
        });
      });

      this.socket.on('roomManagementError', error => {
        push.error({
          message: error,
          duration: MESSAGE_DURATION
        });
      });
    }
  },
  beforeUnmount() {
    this.closeAllMessages();

    if (this.joinedRoomCode && !this.gameStarted) {
      this.socket.emit('leaveRoom', this.joinedRoomCode);
    }

    [
      'startGame',
      'joinedRoom',
      'getRooms',
      'roomNotFound',
      'roomFull',
      'roomManagementError'
    ].forEach(event => {
      this.socket.off(event);
    });
  },
  mounted() {
    this.connectSocket();
    this.setSocketListeners();
  }
};
