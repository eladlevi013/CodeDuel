<template>
  <div class="auth-container">
    <h1 class="title-auth">CodeDuel⚔️</h1>
    <h2 class="subtitle-auth">
      {{ isLogin ? 'Login Panel' : 'Register Panel' }}
    </h2>
    <form class="auth-form" @submit.prevent>
      <input
        v-if="!isLogin"
        class="auth-input"
        type="text"
        placeholder="Enter your username"
        v-model="username"
        autocomplete="on"
      />
      <input
        class="auth-input"
        type="email"
        placeholder="Enter your email"
        v-model="email"
        autocomplete="on"
      />
      <input
        autocomplete="on"
        type="password"
        :placeholder="isLogin ? 'Enter your password' : 'Enter your password'"
        class="auth-input"
        v-model="password"
      />
      <div class="button-container">
        <button
          :disabled="isLoading"
          class="auth-button"
          @click.prevent="isLogin ? login() : register()"
        >
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </div>

      <p class="switch-auth">
        <transition name="fade" mode="out-in">
          <span v-if="isLogin" key="register">
            New to CodeDuel?
            <a @click.prevent="switchForm" href="#">Register Here</a>
          </span>
          <span v-else key="login">
            Already have an account?
            <a @click.prevent="switchForm" href="#">Login Here</a>
          </span>
        </transition>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { promiseToast } from '../utils/toastController';

export default {
  data() {
    return {
      isLogin: true,
      username: '',
      password: '',
      email: '',
      isLoading: false,
      loadingMessage: ''
    };
  },
  created() {
    this.checkRoute();
  },
  watch: {
    $route: 'checkRoute'
  },
  methods: {
    switchForm() {
      this.$router.push(this.isLogin ? '/auth/register' : '/auth/login');
    },
    async login() {
      this.isLoading = true;
      this.loadingMessage = promiseToast('Logging in...');

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_SERVER_URL}/auth/login`,
          {
            email: this.email,
            password: this.password
          },
          { withCredentials: true }
        );

        this.$store.commit('setUser', response.data.account);

        if (response.data && response.status === 200) {
          this.loadingMessage.resolve('Logged in successfully');
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.loadingMessage.reject(`Login Error: ${error.response.data.message}`);
        } else {
          this.loadingMessage.reject('An error occurred during login');
        }
      } finally {
        this.isLoading = false;
      }
    },
    async register() {
      this.isLoading = true;
      this.loadingMessage = promiseToast('Registering...');

      try {
        const response = await axios.post(`${process.env.VUE_APP_SERVER_URL}/auth/register`, {
          username: this.username,
          password: this.password,
          email: this.email
        });

        this.$store.commit('setUser', response.data.account);

        if (response.data && response.status === 200) {
          this.loadingMessage.resolve('Account created successfully');
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.loadingMessage.reject(`Registration Error: ${error.response.data.message}`);
        } else {
          this.loadingMessage.reject('An error occurred during registration');
        }
      } finally {
        this.isLoading = false;
      }
    },
    checkRoute() {
      this.isLogin = this.$route.path === '/auth/login';
    }
  }
};
</script>

<style scoped>
.auth-container {
  text-align: center;
  padding: 5rem;
}

.title-auth {
  font-family: 'Skranji';
  font-size: 4rem;
  color: #26160d;
  margin: 0px 0 0rem 0;
}

.subtitle-auth {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  color: #482307;
  margin-bottom: 3rem;
  margin-top: -15px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 300px;
  margin: auto;
}

.auth-form input {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  width: 100%;
  transition:
    box-shadow 0.3s ease-in-out,
    border 0.3s ease-in-out;
}

.auth-form input:focus {
  outline: none;
  border-color: #482307;
  box-shadow: 0 0 10px #ac9950;
}
::placeholder {
  transition: opacity 0.3s ease;
}

input:focus::placeholder {
  opacity: 0.5;
}

.auth-button {
  cursor: pointer;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  padding: 0.8rem 6.5rem;
  background: linear-gradient(to bottom, #fff, #f8eedb);
  color: #482307;
  box-shadow:
    -6px 8px 10px rgba(81, 41, 10, 0.1),
    0px 2px 2px rgba(81, 41, 10, 0.2);
  transition:
    transform 0.3s ease-in-out,
    background-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}

.auth-button:active {
  background-color: #f3f4f6;
  box-shadow:
    -1px 2px 5px rgba(81, 41, 10, 0.15),
    0px 1px 1px rgba(81, 41, 10, 0.15);
  transform: translateY(0.125rem);
}

.auth-button:hover {
  transform: scale(1.05);
}

.switch-auth {
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #482307;
}

.switch-auth a {
  color: #26160d;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.switch-auth a:hover {
  color: #ac9950;
  text-decoration: none;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.auth-input {
  padding: 0.8rem 3rem !important;
  margin-top: -7px !important;
  border-radius: 7px !important;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1) !important;
}
</style>
