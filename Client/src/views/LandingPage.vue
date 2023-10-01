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
        <input type="text" placeholder="Enter Room Code" v-model="roomCode"/>
        <button class="buttonDesign" @click="joinRoom(this.roomCode)">Join</button>
        <button @click="createRoom" class="buttonDesign">Create Room</button>
      </div>

      <!-- checkbox -->
      <label class="private-room-label">
        <input type="checkbox" v-model="isPrivate" />
        <span>Make Room Private</span>
      </label>
    </div>

    <h1 class="roomsTitle">Rooms🗄️</h1>
    <div class="servers-container">
      <table v-if="servers.length > 0" class="servers-table">
      <thead>
        <tr>
          <th>Room Code</th>
          <th>Players</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in servers" :key="server.roomCode" @click="joinRoom(server.roomCode)" class="server-row">
          <td>{{ server.roomCode }}</td>
          <td>{{ server?.players?.length }}</td>
        </tr>
      </tbody>
    </table>
    </div>

    <h3 v-if="this.servers == 0" class="no-servers-text">There are no servers...</h3>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  // message alert library
  import Message from 'vue-m-message';
  import 'vue-m-message/dist/style.css'

  export default {
    name: 'App',
    data() {
      return {
        roomCode: '',
        servers: [],
        joinedRoomCode: '',
        question: '',
      };
    },
    computed: {
      ...mapGetters(['socket']),
    },
    methods: {
      joinRoom(roomCode) {
        if (roomCode.trim() !== '') {
          this.$store.state.socket.emit('leaveRoom', this.joinedRoomCode);
        }

        this.$store.state.socket.emit('joinRoom', roomCode);
      },
      createRoom() {
        this.$store.state.socket.emit('leaveRoom', this.joinedRoomCode);
        this.$store.state.socket.emit('createRoom', !this.isPrivate);

      }
    },
    mounted() {
      this.$store.state.socket.on('startGame', (question) => {
        Message.closeAll();
        Message.info(() => (`Joined room ${this.joinedRoomCode}`), {duration: 1500})
        this.$router.push({ path: `game/room/${this.joinedRoomCode}` })
        this.$store.state.question = question;
      })

      this.$store.state.socket.emit('sendRooms');

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

        // join the room after creating it
        this.$store.state.socket.emit('joinRoom', roomCode);
      })

      this.$store.state.socket.on('getRooms', (rooms) => {
        this.servers = rooms;
      })
    },
    beforeUnmount() {
      this.$store.state.socket.off('startGame');
      this.$store.state.socket.off('joinedRoom');
      this.$store.state.socket.off('createdRoom');
      this.$store.state.socket.off('getRooms');
    }
  }
</script>
  
<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh; /* Set minimum height to viewport height */
  font-family: 'Poppins', sans-serif;
  background: rgb(245,245,245);
  background: linear-gradient(0deg, rgba(245,245,245,1) 0%, rgba(242,234,211,1) 50%, rgba(226,208,156,1) 100%);
}

.main {
  text-align: center;
  padding: 8rem;
}

.title {
  font-family: 'Skranji';
  font-size: 5rem;
  color: #26160d;
  margin: -30px 0 3rem 0;
}

.parContainer {
  font-size: 30px;
  width: 800px;
  margin: -40px auto 0 auto;
}

.action-container, .servers-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.action-container {
  width: 700px; /* or any specific value you prefer */
  margin: auto;
  gap: 1.7rem;
  background-color: #e8e0c5;
  padding: 1rem 2rem;
  border-radius: 15px;
  margin-top: 50px;
}


.roomsTitle {
  text-align: center;
  align-items: center;
  font-size: 40px;
  margin-top: 70px;
  margin-bottom: 20px;
  font-family: 'Skranji';
  color: #26160d;
  grid-area: title;
}

input {
  font-size: 1.2rem;
  padding: 0px 15px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 1px #0000001a;
}

button {
  cursor: pointer;
  border: none;
  border-radius: .5rem;
  font-size: 1rem;
  padding: 0.5rem 5rem;
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

.no-servers-text, .servers-container {
  text-align: center;
}

.no-servers-text {
  margin-bottom: 50px;
}

.servers-container {
  width: 100%;
  max-width: 1200px; /* Max-width for better responsiveness */
  margin: 3rem auto 50px auto;
}

.servers-table {
  width: 100%; /* Full width for smaller screens */
  max-width: 800px; /* Max-width for better responsiveness */
  margin: auto;
  border-collapse: collapse;
  font-size: 1.2rem;
}

.servers-table th, .servers-table td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}

.servers-table tr:nth-child(even) {
  background-color: #f2eedf; /* A lighter, bluish color for better aesthetics */
}

.servers-table tr:nth-child(odd) {
  background-color: #f4ecd4; /* A lighter, bluish color for better aesthetics */
}

.server-row:hover {
  background-color: #d4e7ff; /* A lighter, bluish color for hover effect */
  cursor: pointer;
}

.no-servers-text {
  margin-bottom: 50px;
  color: #777; /* Darker color for better readability */
}

.confirm-button-class {
  background-color: #39261F !important; /* or any cool brown color you prefer */
  color: #ffffff !important; 
}

.cancel-button-class {
  background-color: #ffffff !important; 
  color: #000000 !important; 
  border: 1px solid #39261F !important; /* to maintain consistency */
}

.custom-popup-class {
  background-color: #eee6cd !important; /* Use any color you prefer */
}

.create-room-container {
  display: flex;
  align-items: center;
  gap: 1rem; /* Adjust gap as needed */
}

.private-room-label {
  align-items: center;
  cursor: pointer;
}

.private-room-label input {
  margin-top: 15px;
}


.private-room-label span {
  margin-left: 0.5rem; /* Adjust margin as needed */
}

</style>