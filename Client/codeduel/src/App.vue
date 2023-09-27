<template>
  <div className='navbarContainer'>
    <div>
      <a class="navbarTitle" href="/">Home</a>
      <a class="navbarTitle">Github</a>
      <a class="navbarTitle">About</a>
    </div>
  </div>
  <router-view/>
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
        this.serversList = rooms;
      });
    },
  };
</script>

<style>
  .navbarContainer {
    background-color: #39261f;
    width: 100%;
    height: 55px;
    top: 10;
    left: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbarTitle {
    font-family: 'Poppins', cursive;
    font-size: 17px;
    margin-left: 15px;
    color: white;
    text-decoration: none;
    padding-top: 100px;
    margin-top: 100px;
    cursor: pointer;
  }
</style>