<template>
  <h1 class="roomsTitle">Quick Menu</h1>
  <div class="quick-menu-container">
    <input type="text" placeholder="Room Code" maxlength="6" v-model="roomCode" class="room-code-input"/>
    <button class="buttonDesign" @click="joinRoom(this.roomCode)">Join</button>
    <button @click="createRoom" class="buttonDesign">Create Room</button>
  </div>

  <!-- checkbox -->
  <div class="checkbox-container">
    <label class="private-room-label">
      <input type="checkbox" v-model="isPrivate" />
      <span>Make Room Private</span>
    </label>
  </div>

  <!-- rooms -->
  <h1 class="roomsTitle">Rooms🗄️</h1>
  <div class="rooms-container">
    <div v-if="availableRooms.length > 0" class="rooms-btn-container">
      <button v-for="server in availableRooms" :key="server.roomCode" 
        @click="joinRoom(server.roomCode)" class="server-btn">
        {{ server.roomCode }} ({{ server?.players?.length ?? 0 }} Players)
      </button>
    </div>
  </div>

  <h3 v-if="this.availableRooms.length === 0" class="no-rooms-text">
    There are no available rooms...
  </h3>
</template>

<script>
import { sharedRoomMethods } from '../mixins/sharedRoomMethods';

export default {
  mixins: [sharedRoomMethods],
  data() {
    return {
      availableRooms: [],
      isPrivate: false
    };
  },
  mounted() {
    this.socket.emit('sendRooms');

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

      this.joinRoom(roomCode);
    })
  },
  beforeUnmount() {
    this.$store.state.socket.off('createdRoom');
  },
}
</script>

<style>
.no-rooms-text {
  margin-bottom: 50px;
  color: #777;
  text-align: center;
}

.roomsTitle {
  text-align: center;
  align-items: center;
  font-size: 40px;
  margin-top: 100px;
  margin-bottom: 20px;
  font-family: 'Skranji';
  color: #26160d;
  grid-area: title;
}

.quick-menu-container {
  width: 700px;
  margin: auto;
  gap: 1.0rem;
  padding: 1rem 2rem;
  border-radius: 15px;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  margin-top: 0rem;
  max-width: 500px;
  width: 100%;
  background-color: #dccfaa;
}

.rooms-btn-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-items: center;
  width: 57%;
}

.server-btn {
  padding: 20px 30px;
  background-color: #39261F;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
  width: 95%;
}

.server-btn:hover {
  background-color: #39261F;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 6px;
}

.private-room-label input {
  margin-top: 15px;
}

.private-room-label span {
  margin-left: 0.5rem;
}

.rooms-container {
  width: 100%;
  max-width: 1200px;
  margin: 0rem auto 50px auto;
}
</style>