<template>  
  <div class="main">

    <!-- codeduel title -->
    <h1 class="title">CodeDuel⚔️</h1>

    <!-- codeduel description -->
    <p class="parContainer">
      Welcome to CodeDuel, where programmers worldwide engage in real-time 
      coding battles! Perfect for all skill levels, it’s a dynamic platform 
      to challenge peers and enhance your programming skills.
    </p>

    <!-- quick menu container -->
    <div class="action-container">
      <input type="text" placeholder="Room Code" maxlength="6" v-model="roomCode" class="room-code-input"/>
      <button @click="joinRoom(this.roomCode)" class="buttonDesign">Join</button>
      <button @click="createRoom" class="buttonDesign">Quick Match</button>
    </div>

    <img src="/game_demo.webp" style="margin-bottom: 80px; border-radius: 10px; margin-top: 100px;">
  </div>
</template>

<script>
import { sharedRoomMethods } from '../mixins/sharedRoomMethods';

export default {
  mixins: [sharedRoomMethods],
  name: 'App',
  data() {
    return {
      roomCode: '',
    };
  },
  mounted() {
    console.log("test");
    this.$store.dispatch('fetchUserScore');
  },
}
</script>
  
<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: rgb(245,245,245);
  background: linear-gradient(0deg, rgba(245,245,245,1) 0%,
   rgb(244, 239, 223) 50%, rgb(234, 221, 179) 100%);
}

.main {
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.title {
  font-family: 'Skranji';
  font-size: 5rem;
  color: #26160d;
  margin: 100px 0 50px 0;
}

.parContainer {
  font-size: 29px;
  max-width: 800px;
  margin: -40px auto 0 auto;
  text-align: center;
}

.action-container, .rooms-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  max-width: 500px;
  width: 100%;
}

.action-container {
  width: 700px;
  margin: auto;
  gap: 1.0rem;
  background-color: #e8e0c5;
  padding: 0.8rem 1.9rem;
  border-radius: 15px;
  margin-top: 35px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;}

.room-code-input {
  font-size: 1.2rem;
  padding: 0px 10px;
  border: none;
  border-radius: 5px;
  font-family: 'Skranji';
  width: 150px;
}

button {
  cursor: pointer;
  border: none;
  border-radius: .5rem;
  font-size: 1rem;
  padding: 0.5rem 4rem;
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

button:hover {
  transform: scale(1.02);
} 

img {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: 1000px;
}

@media screen and (max-width: 1050px) {
  img {
    width: 800px;
  }
}

@media only screen and (max-width: 840px) {
  .title {
    font-size: 3rem;
    margin: 50px 0 30px 0;
  }

  .parContainer {
    font-size: 20px;
  }

  .action-container {
    flex-direction: column;
    width: 100%;
    gap: 0.7rem;
    padding: 1rem 1rem;
    max-width: 400px;
    margin: auto;
    margin-top: 30px;
  }

  .room-code-input {
    width: 96%;
    margin-bottom: 0rem;
    text-align: center;
  }

  img {
    width: 90%;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .parContainer {
    font-size: 21px;
    margin-top: -20px;
    width: 60%;
  }
}

@media only screen and (max-width: 480px) {
  .title {
    font-size: 2.5rem;
    margin: 40px 0 20px 0;
  }

  .action-container {
    flex-direction: column;
    width: 100%;
    gap: 0.7rem;
    padding: 1rem 1rem;
    max-width: 70%;
    margin: auto;
    margin-top: 30px;
  }

  .room-code-input {
    width: 92%;
    margin-bottom: 0rem;
    text-align: center;
  }

  .parContainer {
    font-size: 18px;
    margin-top: -20px;
    width: 80%;
  }
}
</style>