<template>  
  <div class="container">
    <div class="main">
      <h1 class="title">CodeDuel⚔️</h1>
      <p class="parContainer">
        Welcome to CodeDuel, where programmers worldwide engage in real-time 
        coding battles! Perfect for all skill levels, it’s a dynamic platform 
        to challenge peers and enhance your programming skills.
      </p>
      <div class="action-container">
        <input type="text" placeholder="Enter Room Code" v-model="roomCode" />
        <button class="buttonDesign" @click="joinRoom(this.roomCode)">Join</button>
        <button @click="createRoom" class="create-room-btn buttonDesign">Create Room</button>
      </div>
    </div>
    <div class="servers-container">
      <h1 class="title" style="font-size: 40px; margin-top: 70px; margin-bottom: 20px;">Rooms🗄️</h1>
      <div v-for="server in serversList" :key="server.roomCode" class="server-wrapper" v-auto-animate>
        <button @click="joinRoom(server.roomCode)" class="server-btn">
          Room Code: {{ server.roomCode }} <n/> Players: {{ server?.players?.length }}
        </button>
      </div>
    </div>
    <h3 v-if="this.serversList == 0" class="no-servers-text">There are no servers...</h3>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Message from 'vue-m-message';
  import 'vue-m-message/dist/style.css'

  export default {
    name: 'App',
    data() {
      return {
        roomCode: '',
        serversList: [],
      };
    },
    computed: {
      // Map Vuex getters to computed properties
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
      console.log('Connecting socket.io client to server...');
      this.$store.state.socket.emit('sendRooms');

      this.$store.state.socket.on('joinedRoom', (roomCode) => {
        console.log(`Joined room ${roomCode}`);
        this.$store.state.roomCode = roomCode;

        Message.info(() => ('Joined room ' + roomCode), {
          duration: 1500,
        });
        
        this.$router.push({ path: `game/room/${roomCode}` });
      });

      this.$store.state.socket.on('createdRoom', (roomCode) => {
        this.$swal.fire({
          title: 'Room Created',
          text: 'Share this code with your friend: ' + roomCode,
          icon: 'success',
          confirmButtonText: 'Copy Room Code',
          confirmButtonColor: '#005ce6',
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(roomCode);
          }
        });
      });

      this.$store.state.socket.on('getRooms', (rooms) => {
        console.log(JSON.stringify(rooms, null, 2));
        this.serversList = rooms;
      });
    },
  };
</script>
  
<style>
  .no-servers-text {
    text-align: center;
    margin-bottom: 50px;
  }
  
  .parContainer {
    font-size: 30px;
    font-family: 'Poppins', sans-serif;
    width: 800px;
    text-align: "center";
    margin: 0 auto;
    margin-top: -40px;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #fff8e7;
  }
  
  .container {
    max-width: 100%;
    overflow: hidden;
  }
  
  .main {
    text-align: center;
    background: #fff;
    padding: 8rem;
    border-bottom-left-radius: 80px;
    border-bottom-right-radius: 80px;
    box-shadow: 0px 0px 10px 5px #0000001a;
    background-color: #f8eedb;
    background-image: url('../../public/texture.png');
  }
  
  .title {
    font-family: 'Skranji';
    text-align: center;
    font-size: 5rem;
    color: #26160d;
    text-shadow: 0px 0px 5px #0000001a;
    margin-bottom: 3rem;
    margin-top: -30px;
    grid-area: header;
  }
  
  .action-container {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 3rem;
  }
  
  input {
    font-size: 1.2rem;
    padding: 0.5rem;
    width: 200px;
    border: none;
    outline: none;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 1px #0000001a;
  }
  
  .create-room-btn {
    background-color: #28a745;
  }
  
  .create-room-btn:hover {
    background-color: #218838;
  }
  
  .servers-container {
    text-align: center;
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(3, 350px);
    gap: 1rem;
    justify-content: center;
    align-items: center;
    grid-column-start: 2;
    grid-template-areas: "header header header";
    max-width: 70%;
    margin: auto;
    margin-bottom: 50px;
  }
  
  .server-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .server-btn {
    font-size: 15px;
    justify-content: center;
    background: #351e11;
    color: #FAFAFA;
    border: none;
    border-radius: 5px;
    transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
    cursor: pointer; 
    padding: 1rem 4.5rem;
    line-height: 18px;
    margin: 0;
    appearance: button;
    background-color: transparent;
    border: 0 solid #e5e7eb;
    border-radius: .5rem;
    box-sizing: border-box;
    background-color: #482307;
    column-gap: 0.5rem;
    cursor: pointer;
    display: flex;
    font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 100%;
    font-weight: 700;
    line-height: 18px;
    margin: 0;
    outline: 2px solid transparent;
    padding: 1rem 4.5rem;
    text-align: center;
    text-transform: none;
  }
  
  .server-btn:hover {
    transform: scale(1.02);
  }
  
  .buttonDesign {
    appearance: button;
    background-color: transparent;
    background-image: linear-gradient(to bottom, #fff, #f8eedb);
    border: 0 solid #e5e7eb;
    border-radius: .5rem;
    box-sizing: border-box;
    color: #482307;
    column-gap: 0.5rem;
    cursor: pointer;
    display: flex;
    font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 100%;
    font-weight: 700;
    line-height: 18px;
    margin: 0;
    outline: 2px solid transparent;
    padding: 1rem 4.5rem;
    text-align: center;
    text-transform: none;
    transition: all .1s cubic-bezier(.4, 0, .2, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
  }
  
  buttonDesign:active {
    background-color: #f3f4f6;
    box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
    transform: translateY(0.125rem);
  }
  
  buttonDesign:focus {
    box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
  }
</style>