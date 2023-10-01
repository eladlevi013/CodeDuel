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
    </div>

    <div class="servers-container">
      <h1 class="roomsTitle">Rooms🗄️</h1>
      <div v-for="server in servers" :key="server.roomCode" class="server-wrapper" v-auto-animate>
        <button @click="joinRoom(server.roomCode)" class="server-btn">
          Code: {{ server.roomCode }} <br/> Players: {{ server?.players?.length }}
        </button>
      </div>
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
        this.$store.state.socket.emit('createRoom');
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
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh; /* Set minimum height to viewport height */
  font-family: 'Poppins', sans-serif;
  background: rgb(245,245,245);
  background: linear-gradient(0deg, rgba(245,245,245,1) 0%, rgba(242,234,211,1) 50%, rgba(226,208,156,1) 100%);
  background-repeat: no-repeat;
  background-attachment: fixed; /* This makes the background fixed while scrolling */
  background-size: cover; /* This makes sure your background fully covers the element */
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
  gap: 1.5rem;
}

.roomsTitle {
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
  padding: 1rem 4.5rem;
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
  border: 3px solid #26160d;
  padding: 0rem 3rem;
  height: 70px;
  background: linear-gradient(to bottom, 
    #765827, #65451F);
    color: #FAFAFA;
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
  margin: 3rem auto 50px auto;
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-areas:
    "title title title"
    "server server server";
  gap: 1rem;
}

.server-wrapper {
  width: 100%;
}
</style>