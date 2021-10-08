<template>
  <div class="container">
<v-btn @click="login">login</v-btn>
<!--    <vue-telegram-login-->
<!--        mode="callback"-->
<!--        telegram-login="mark_quiz_bot"-->
<!--        @callback="login"-->
<!--         />-->
<!--    <b-card
        v-else
        :title="userInfo.username"
        :img-src="userInfo.photo_url"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem"
        class="mb-2"
    >
      <b-button variant="danger" @click="logout">Logout</b-button>
    </b-card>-->
  </div>
</template>

<script>
// import {vueTelegramLogin} from 'vue-telegram-login'
import router from "@/router/router";
import auth from "@/api/auth";

export default {
  name: "Login",
  // components: {vueTelegramLogin},
  methods:{
    async login(user) {
      user.toString();
      let userData ={id:74374352,first_name:"Иннокентий",
         username:"galleySlave",photo_url:"https://t.me/i/userpic/320/F3rqk8wy4nc1mqxU4PRwwJ6IKtfKqJGD8GMkHiv-SxU.jpg",
          auth_date:1631927256,hash:"346cdedad09b6fc149ed9ecc0a45ebcaf50687b24bc9fdad8ca3cc4037c078c4"};
      let resp = await auth.login(userData);
      console.log(resp)
      if (resp){
        localStorage.token = resp.data.accessToken
        router.push("/");
      }
    },
  }
}
</script>

<style scoped>

</style>