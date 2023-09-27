<template>
  <div className='navbarContainer'>
    <div>
      <a class="navbarTitle">
        About
      </a>

      <a class="navbarTitle">
        Github
      </a>
    </div>
  </div>

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
        <button @click="joinRoom(this.roomCode)">Join</button>
        <button @click="createRoom" class="create-room-btn">Create Room</button>
      </div>
    </div>

    <div class="servers-container">
      <h1 class="title" style="font-size: 40px; margin-top: 70px; margin-bottom: 20px;">Servers🗄️</h1>
      <div v-for="server in serversList" :key="server.roomCode" class="server-wrapper" v-auto-animate>
        <button @click="joinRoom(server.roomCode)" class="server-btn">
          Room Code: {{ server.roomCode }} <n/> Players: {{ server?.players?.length }}
        </button>
      </div>

      <h3 v-if="this.serversList == 0">There are no servers...</h3>
    </div>
  </div>
</template>


<script>
  import io from 'socket.io-client'
  import Message from 'vue-m-message'
  import 'vue-m-message/dist/style.css'

  export default {
    name: 'App',
    data() {
      return {
        roomCode: '',
        socket: null,
        serversList: [],
      };
    },
    methods: {
      joinRoom(roomCode) {
        this.socket.emit('joinRoom', roomCode);
      },
      createRoom() {
        this.socket.emit('createRoom');
      }
    },
    mounted() {
      console.log('Connecting socket.io client to server...');
      this.socket = io('http://localhost:3001');
      this.socket.emit('sendRooms');

      this.socket.on('joinedRoom', (roomCode) => {
        Message.info(() => ('Joined room ' + roomCode), {
          duration: 1500,
        });
      });

      this.socket.on('createdRoom', (roomCode) => {
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

      this.socket.on('getRooms', (rooms) => {
        console.log(JSON.stringify(rooms, null, 2));

        this.serversList = rooms;
      });
    },
  };
</script>

<style>
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
  background-image: url('../public/texture.png');
}

.title {
  font-family: 'Skranji';
  text-align: center;
  font-size: 5rem;
  color: #26160d;
  text-shadow: 0px 0px 5px #0000001a;
  margin-bottom: 3rem;
  margin-top: -30px;
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
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.server-wrapper {
  margin-bottom: 1rem; /* Refine spacing as per your preference */
}

.server-btn {
  height: 70px;
  width: 450px;
  background: #351e11;
  padding: 10px 100px; 
  color: #FAFAFA;
  border: none;
  border-radius: 5px;
  transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
  cursor: pointer; 
}

.server-btn:hover {
  transform: scale(1.02);
}

button {
  appearance: button;
  background-color: transparent;
  background-image: linear-gradient(to bottom, #fff, #f8eedb);
  border: 0 solid #e5e7eb;
  border-radius: .5rem;
  box-sizing: border-box;
  color: #482307;
  column-gap: 1rem;
  cursor: pointer;
  display: flex;
  font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 100%;
  font-weight: 700;
  line-height: 24px;
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

button:active {
  background-color: #f3f4f6;
  box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
  transform: translateY(0.125rem);
}

button:focus {
  box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
}

.navbarContainer {
  background-color: #39261f;
  width: 100%;
  height: 55px;
  top: 10;
  left: 0;
  z-index: 3;
  display: flex; /* New property */
  align-items: center; /* New property */
  justify-content: space-between; /* New property */
}

.aTitleContainer {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.navbarTitle {
    font-family: 'Poppins', cursive;
    font-size: 20px;
    margin-left: 15px;
    color: white;
    text-decoration: none;
    padding-top: 100px;
    margin-top: 100px;
    cursor: pointer;
}
</style>
