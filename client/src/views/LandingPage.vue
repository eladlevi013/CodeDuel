<template>
  <div class="content">
    <!-- codeduel title -->
    <h1 class="title-primary">CodeDuel⚔️</h1>

    <!-- codeduel description -->
    <p class="game-desc">
      Welcome to CodeDuel, where programmers worldwide engage in real-time coding battles! Perfect
      for all skill levels, it’s a dynamic platform to challenge peers and enhance your programming
      skills.
    </p>

    <!-- quick menu container -->
    <div class="action-container">
      <input
        type="text"
        placeholder="Room Code"
        maxlength="8"
        v-model="roomCode"
        class="room-code-input"
      />
      <button @click="joinRoom(this.roomCode)" class="btn-main">Join</button>
      <button @click="quickMatch" class="btn-main">Quick Match</button>
    </div>

    <!-- demo image -->
    <img class="game-img-demo" src="/game_demo.webp" />
  </div>
</template>

<script scoped>
import { sharedRoomMethods } from '../mixins/sharedRoomMethods';
import { destroyAllToasts } from '../utils/toastController';

export default {
  mixins: [sharedRoomMethods],
  name: 'App',
  data() {
    return {
      roomCode: ''
    };
  },
  mounted() {
    this.$store.dispatch('fetchUserScore');
  },
  beforeUnmount() {
    destroyAllToasts();
  }
};
</script>
``

<style scoped>
@import '../styles/main.css';

.content {
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.title-primary {
  font-family: 'Skranji';
  font-size: 5rem;
  color: #26160d;
  padding: 40px 0 0px 0;
}

.game-desc {
  font-size: 27px;
  max-width: 800px;
  margin: -40px auto 0 auto;
  text-align: center;
}

.game-img-demo {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: 1000px;
  margin-bottom: 80px;
  border-radius: 10px;
  margin-top: 100px;
}

@media screen and (max-width: 1050px) {
  .game-img-demo {
    width: 800px;
  }
}

@media only screen and (max-width: 850px) {
  .title-primary {
    font-size: 3rem;
    margin: 50px 0 30px 0;
  }

  .game-desc {
    font-size: 20px;
  }

  .game-img-demo {
    width: 90%;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .game-desc {
    font-size: 21px;
    margin-top: -20px;
    width: 60%;
  }
}

@media only screen and (max-width: 480px) {
  .title-primary {
    font-size: 2.5rem;
    margin: 40px 0 20px 0;
  }

  .game-desc {
    font-size: 18px;
    margin-top: -20px;
    width: 80%;
  }
}
</style>
