<template>
  <div class="container">
    <div v-if="!getStorageToken">
      <v-card>
        <div style="display: flex">
          <v-text-field outlined dense prefix="@" placeholder="Telegram username" v-if="!codeSent"
                        v-model="telegramUsername"
          ></v-text-field>
          <v-text-field outlined dense placeholder="Код" v-if="codeSent"
                        v-model="code"
          ></v-text-field>
          <v-btn v-if="codeSent" @click="checkCode">Проверить код</v-btn>
          <v-btn :disabled="getCodeButtonBlocked" @click="getCode">
            {{ getCodeButtonBlocked ? getCodeButtonTimeout : "Отправить код" }}
          </v-btn>
        </div>

      </v-card>
      <vue-telegram-login
          mode="callback"
          telegram-login="mark_quiz_bot"
          @callback="login"/>

    </div>

    <div v-else>

      <v-btn @click="logout">Выйти</v-btn>
    </div>

    <v-overlay v-model="errorVisible">
      <v-alert
          type="error"
      >{{ errorText }}
      </v-alert>
    </v-overlay>
    <v-overlay v-model="successVisible">
      <v-alert
          type="success"
      >{{ successText }}
      </v-alert>
    </v-overlay>
  </div>
</template>

<script>
import {vueTelegramLogin} from 'vue-telegram-login'
import router from "@/router/router";
import auth from "@/api/auth";

export default {
  name: "Login",
  components: {vueTelegramLogin},

  data() {
    return {
      code: "",
      codeSent: false,
      telegramUsername: "",
      getCodeButtonBlocked: false,
      getCodeButtonTimeout: 60,
      question: this.value,
      errorText: "",
      errorVisible: false,
      successText: "",
      successVisible: false
    }
  },
  methods: {
    logout() {
      delete localStorage.token
      this.reload()
    },
    showError(text) {
      this.errorText = text;
      this.errorVisible = true;
      setTimeout(() => {
        this.errorVisible = false
      }, 1000)
    },
    showSuccess(text) {
      this.successText = text;
      this.successVisible = true;
      setTimeout(() => {
        this.successVisible = false
      }, 1000)
    },
    async checkCode() {
      let res = await auth.validateCode(this.telegramUsername, this.code)
      if (res.data) {
        localStorage.token = res.data.accessToken
        router.push("/");
      }
    },
    async getCode() {
      let res;
      try {
        res = await auth.getCode(this.telegramUsername)
      } catch (e) {
        this.showError(e.data)
        return
      }
      if (res.data === "Код отправлен") {
        this.showSuccess(res.data)
        this.getCodeButtonBlocked = true;
        this.codeSent = true
        setInterval(() => {
          this.getCodeButtonTimeout = this.getCodeButtonTimeout - 1;
          if (this.getCodeButtonTimeout < 0) {
            this.getCodeButtonBlocked = false;
            this.getCodeButtonTimeout = 60
          }
        }, 1000)

      }
    },
    async login(user) {
      let resp = await auth.login(user);
      console.log(resp)
      if (resp) {
        localStorage.token = resp.data.accessToken
        router.push("/");
      }
    },
  },
  computed: {
    getStorageToken() {
      return localStorage.token

    }
  }
}
</script>

<style scoped>

</style>