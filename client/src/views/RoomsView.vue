<template>
  <h1 class="roomsTitle">Quick Menu</h1>
  <div class="quick-menu-container">
    <input
      type="text"
      placeholder="Room Code"
      maxlength="6"
      v-model="roomCode"
      class="room-code-input"
    />
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
  <h1 class="roomsTitle" v-if="this.availableRooms.length > 0">Rooms🗄️</h1>
  <div class="rooms-container" v-if="this.availableRooms.length > 0">
    <div v-if="availableRooms.length > 0" class="rooms-btn-container">
      <button
        v-for="server in availableRooms"
        :key="server.roomCode"
        @click="joinRoom(server.roomCode)"
        class="server-btn"
      >
        {{ server.roomCode }} ({{ server?.players?.length ?? 0 }} Players)
      </button>
    </div>
  </div>
</template>

<script>
import { sharedRoomMethods } from '../mixins/sharedRoomMethods'

export default {
  mixins: [sharedRoomMethods],
  data() {
    return {
      availableRooms: [],
      isPrivate: false,
      roomCode: '',
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserScore')
    this.socket.emit('sendRooms')

    // from link
    if (this.$route.params.roomCode) {
      this.joinRoom(this.$route.params.roomCode)
    }

    this.$store.state.socket.on('createdRoom', (roomCode) => {
      this.$swal
        .fire({
          title: 'Room Created',
          text: `Share this code with your friend: ${roomCode}`,
          icon: 'success',
          confirmButtonText: 'Copy Room Link',
          confirmButtonColor: '#005ce6',
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(
              `${process.env.VUE_APP_BASE_URL}/rooms/${roomCode}`
            )
          }
        })

      this.joinRoom(roomCode)
    })
  },
  beforeUnmount() {
    this.$store.state.socket.off('createdRoom')
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
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  max-width: 500px;
  width: 100%;
  width: 700px;
  margin: auto;
  gap: 1rem;
  background-color: #e8e0c5;
  padding: 0.8rem 1.9rem;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
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
  background-color: #39261f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
}

.server-btn:hover {
  background-color: #39261f;
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
  max-width: 1200px;
  margin: 0rem auto 50px auto;
}

@media only screen and (max-width: 840px) {
  .roomsTitle {
    font-size: 32px;
    margin-top: 50px;
    margin-bottom: 15px;
  }

  .quick-menu-container {
    flex-direction: column;
    width: 100%;
    gap: 0.7rem;
    padding: 1rem 1rem;
    max-width: 400px;
    margin: auto;
    margin-top: 30px;
  }

  .rooms-btn-container {
    grid-template-columns: 1fr;
    width: 100%;
    margin: auto;
  }

  .server-btn {
    padding: 15px 25px;
    font-size: 16px;
    width: 95%;
  }
}

@media only screen and (max-width: 480px) {
  .roomsTitle {
    font-size: 25px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  .quick-menu-container {
    flex-direction: column;
    width: 100%;
    gap: 0.7rem;
    padding: 1rem 1rem;
    max-width: 70%;
    margin: auto;
    margin-top: 30px;
  }

  .rooms-btn-container {
    width: 95%;
  }

  .server-btn {
    padding: 12px 20px;
    font-size: 15px;
  }
}
</style>
