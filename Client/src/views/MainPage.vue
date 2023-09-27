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
          Room Code: {{ server.roomCode }} <n/> Players: {{ server?.players?.length }}
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
      };
    },
    computed: {
      ...mapGetters(['socket']),
    },
    methods: {
      joinRoom(roomCode) {
        this.$store.state.socket.emit('joinRoom', roomCode);
      },
      createRoom() {
        this.$store.state.socket.emit('createRoom');
      }
    },
    mounted() {
      this.$store.state.socket.emit('sendRooms');

      this.$store.state.socket.on('joinedRoom', (roomCode) => {
        this.$store.state.roomCode = roomCode
        Message.info(() => (`Joined room ${roomCode}`), {duration: 1500})
        this.$router.push({ path: `game/room/${roomCode}` })
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
      })

      this.$store.state.socket.on('getRooms', (rooms) => {
        this.servers = rooms;
      })
    },
  }
</script>
  
<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #fff8e7;
}

.main {
  text-align: center;
  padding: 8rem;
  border-radius: 0 0 50px 50px;
  box-shadow: 0px 0px 5px 1px #0000001a;
  background: #f8eedb url('../../public/texture.png');
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
  display: flex;
  justify-content: center;
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
  background-color: #482307;
  color: #FAFAFA;
  height: 70px;
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
  display: grid;
  grid-template-columns: repeat(3, 350px);
  grid-template-areas:
    "title title title"
    "server server server";
  gap: 1rem;
  margin: 3rem auto 50px auto;
  max-width: 70%;
}

.server-wrapper {
  width: 100%;
}
</style>