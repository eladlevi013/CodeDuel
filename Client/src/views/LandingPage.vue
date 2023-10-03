<template>  
  <div>
    <div class="main">
      <h1 class="title">CodeDuel⚔️</h1>
      <p class="parContainer">
        Welcome to CodeDuel, where programmers worldwide engage in real-time 
        coding battles! Perfect for all skill levels, it’s a dynamic platform 
        to challenge peers and enhance your programming skills.
      </p>

      <div class="action-container">
        <input type="text" placeholder="Enter Room Code" style="width: 150px;" v-model="roomCode"/>
        <button class="buttonDesign" @click="joinRoom(this.roomCode)">Join</button>
        <button @click="createRoom" class="buttonDesign">Create Room</button>
        <button @click="createRoom" class="buttonDesign">Quick Match</button>
      </div>

      <!-- checkbox -->
      <label class="private-room-label">
        <input type="checkbox" v-model="isPrivate" />
        <span>Make Room Private</span>
      </label>
    </div>

    <!-- rooms -->
    <h1 class="roomsTitle">Rooms🗄️</h1>
    <div class="rooms-container">
      <table v-if="availableRooms.length > 0" class="rooms-table">
      <thead>
        <tr>
          <th>Room Code</th>
          <th>Players</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in availableRooms" :key="server.roomCode"
          @click="joinRoom(server.roomCode)" class="server-row">
          <td>{{ server.roomCode }}</td>
          <td>{{ server?.players?.length ?? 0 }}</td>
        </tr>
      </tbody>
    </table>
    </div>

    <h3 v-if="this.availableRooms.length === 0" class="no-rooms-text">
      There are no available rooms...
    </h3>
  </div>
</template>

<script>
  // message alert library
  import Message from 'vue-m-message';
  import 'vue-m-message/dist/style.css'

  const MESSAGE_DURATION = 1500;

  export default {
    name: 'App',
    data() {
      return {
        joinedRoomCode: '',
        roomCode: '',
        availableRooms: [],
        isPrivate: false,
        gameStarted: false,
      };
    },
    computed: {
      socket() {
        return this.$store.state.socket;
      }
    },
    methods: {
      async joinRoom(roomCode) {
        if (this.joinedRoomCode.trim()) {
          await this.leaveRoom(this.joinedRoomCode);
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
      }
    },
    mounted() {
      if (!this.socket.connected) {
        this.socket.connect();
      }

      this.socket.emit('sendRooms');
      
      this.socket.on('startGame', question => {
        this.gameStarted = true;
        this.$store.commit('setQuestion', question);
        Message.closeAll();
        Message.info(`Joined room ${this.joinedRoomCode}`, { duration: MESSAGE_DURATION });
        this.$router.push({ path: `game/room/${this.joinedRoomCode}` });
      });

      this.$store.state.socket.on('joinedRoom', (roomCode) => {
        Message.closeAll();
        this.$store.state.roomCode = roomCode
        this.joinedRoomCode = roomCode;
        Message.loading(() => (`Waiting to other player, with room code: ${this.joinedRoomCode}`), {duration: -1})
      })
      
      this.$store.state.socket.on('createdRoom', (roomCode) => {
        this.$swal.fire({
          title: 'Room Created',
          text: `Share this code with your friend: ${roomCode}`,
          icon: 'success',
          confirmButtonText: 'Copy Room Code',
          confirmButtonColor: '#005ce6',
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(roomCode);
          }
        })

        this.$store.state.socket.emit('joinRoom', roomCode);
      })

      this.$store.state.socket.on('getRooms', (rooms) => {
        this.availableRooms = rooms;
      })
    },
    beforeUnmount() {
      if (this.joinedRoomCode && !this.gameStarted) {
        this.socket.emit('leaveRoom', this.joinedRoomCode);
      }
      
      ['startGame', 'joinedRoom', 'createdRoom', 'getRooms'].forEach(event => {
        this.socket.off(event);
      });
    }
  }
</script>
  
<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: rgb(245,245,245);
  background: linear-gradient(0deg, rgba(245,245,245,1) 0%,
   rgba(242,234,211,1) 50%, rgba(226,208,156,1) 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

.main {
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.title {
  font-family: 'Skranji';
  font-size: 5rem;
  color: #26160d;
  margin: 100px 0 50px 0;
}

.parContainer {
  font-size: 30px;
  max-width: 800px;
  margin: -40px auto 0 auto;
  text-align: center;
}


.action-container, .rooms-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  max-width: 700px;
  width: 100%;
}

.action-container {
  width: 700px;
  margin: auto;
  gap: 1.0rem;
  background-color: #e8e0c5;
  padding: 1rem 2rem;
  border-radius: 15px;
  margin-top: 60px;
}


.roomsTitle {
  text-align: center;
  align-items: center;
  font-size: 40px;
  margin-top: 200px;
  margin-bottom: 20px;
  font-family: 'Skranji';
  color: #26160d;
  grid-area: title;
}

input {
  font-size: 1.0rem;
  padding: 0px 10px;
  border: none;
  border-radius: 5px;
}

button {
  cursor: pointer;
  border: none;
  border-radius: .5rem;
  font-size: 1rem;
  padding: 0.5rem 4rem;
  transition: transform 0.2s ease-in-out, 
    background-color 0.2s ease-in-out;
}

.buttonDesign {
  background: linear-gradient(to bottom, 
    #fff, #f8eedb);
  color: #482307;
  box-shadow: -6px 8px 10px rgba(81,41,10,0.1),
    0px 2px 2px rgba(81,41,10,0.2);
}

.buttonDesign:active {
  background-color: #f3f4f6;
  box-shadow: -1px 2px 5px rgba(81,41,10,0.15), 
    0px 1px 1px rgba(81,41,10,0.15);
  transform: translateY(0.125rem);
}

.server-btn {
  color: #26160d;
  border: 3px solid #26160d;
  padding: 0rem 4rem;
  height: 70px;
  background: linear-gradient(to bottom, 
    #dccaae, #d2ba93);
  box-shadow: -6px 8px 10px rgba(81,41,10,0.1),
    0px 2px 2px rgba(81,41,10,0.2);
  font-size: 14px;
}

button:hover {
  transform: scale(1.02);
}

.no-rooms-text, .rooms-container {
  text-align: center;
}

.no-rooms-text {
  margin-bottom: 50px;
}

.rooms-container {
  width: 100%;
  max-width: 1200px;
  margin: 3rem auto 50px auto;
}

.rooms-table {
  width: 100%;
  max-width: 800px;
  margin: auto;
  border-collapse: collapse;
  font-size: 1.2rem;
}

.rooms-table th, .rooms-table td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}

.rooms-table tr:nth-child(even) {
  background-color: #f2eedf;
}

.rooms-table tr:nth-child(odd) {
  background-color: #f4ecd4;
}

.server-row:hover {
  background-color: #d4e7ff;
  cursor: pointer;
}

.no-rooms-text {
  margin-bottom: 50px;
  color: #777;
}

.create-room-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.private-room-label {
  align-items: center;
  cursor: pointer;
}

.private-room-label input {
  margin-top: 15px;
}


.private-room-label span {
  margin-left: 0.5rem;
}
</style>