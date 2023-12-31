<template>
  <h1 class="rooms-title">Quick Menu</h1>
  <section class="quick-menu-container">
    <input
      type="text"
      placeholder="Room Code"
      maxlength="6"
      v-model="roomCode"
      class="room-code-input"
    />
    <button class="btn-main" @click="joinRoom(this.roomCode)">Join</button>
    <button @click="createRoom" class="btn-main">Create Room</button>
  </section>

  <!-- checkbox -->
  <section class="checkbox-container">
    <label class="private-room-label">
      <input type="checkbox" v-model="isPrivate" />
      <span>Make Room Private</span>
    </label>
  </section>

  <!-- rooms -->
  <h1 class="rooms-title" v-if="this.availableRooms.length > 0">Rooms🗄️</h1>
  <div
    class="quick-menu-container quick-menu-container-filter"
    v-if="this.availableRooms.length > 0"
  >
    <button class="btn-main filter-button" @click="filterRooms('ALL')">All Rooms</button>
    <button class="btn-main filter-button" @click="filterRooms('sql')">SQL Rooms</button>
    <button class="btn-main filter-button" @click="filterRooms('coding')">Coding Rooms</button>
  </div>
  <br />

  <div class="rooms-container" v-if="this.availableRooms.length > 0">
    <div class="rooms-btn-container">
      <button
        v-for="server in filteredRooms"
        :key="server.roomCode"
        @click="joinRoom(server.roomCode)"
        :class="{ 'server-btn-sql': server.mode === 'sql' }"
        class="server-btn"
      >
        <span style="font-size: 17px; font-weight: bold">
          {{ server.mode == 'sql' ? 'SQL🗄️' : 'CODING💻' }}
        </span>
        <br />
        {{ server.roomCode }} ({{ server?.players?.length ?? 0 }} Players)
      </button>
    </div>
  </div>
</template>

<script>
import { sharedRoomMethods } from '../mixins/sharedRoomMethods';
import { destroyAllToasts } from '../utils/toastController';
import { openRoomCreatedModal } from '../utils/modalController';

export default {
  mixins: [sharedRoomMethods],
  computed: {
    filteredRooms() {
      if (this.currentFilter === 'ALL') {
        return this.availableRooms;
      }
      return this.availableRooms.filter(server => server.mode === this.currentFilter);
    }
  },
  data() {
    return {
      availableRooms: [],
      isPrivate: false,
      roomCode: '',
      currentFilter: 'ALL'
    };
  },
  mounted() {
    this.socket.emit('sendRooms');

    // from link
    if (this.$route.params.roomCode) {
      this.joinRoom(this.$route.params.roomCode);
    }

    this.$store.state.socket.on('createdRoom', roomCode => {
      openRoomCreatedModal(roomCode).then(result => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(`${process.env.VUE_APP_BASE_URL}/rooms/${roomCode}`);
        }
      });

      this.joinRoom(roomCode);
    });
  },
  methods: {
    filterRooms(filter) {
      this.currentFilter = filter;
    }
  },
  beforeUnmount() {
    destroyAllToasts();
    this.$store.state.socket.off('createdRoom');
  }
};
</script>

<style scoped>
@import '../styles/main.css';

.filter-button {
  background-color: #e8e0c5;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px 33px;
  height: 40px;
}

.no-rooms-text {
  margin-bottom: 50px;
  color: #777;
  text-align: center;
}

.rooms-title {
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

.quick-menu-container-filter {
  width: 500px;
  height: 40px;
}

.rooms-btn-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-items: center;
  width: 57%;
}

.server-btn {
  padding: 15px 30px;
  background-color: #39261f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
}

.server-btn-sql {
  background-color: #5d3f34;
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
  .rooms-title {
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

  .quick-menu-container-filter {
    height: 110px;
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
  .rooms-title {
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
