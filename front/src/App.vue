
<template>
  <div id="app">
    <v-app-bar

        app
        color="primary"
        dark

    >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn :key="route.name" v-for="route in routes" @click="$router.push(route.path )">{{ route.name }}</v-btn>
      </v-toolbar-items>

    </v-app-bar>
    <v-app>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import router from "@/router/router";
export default {
  name: 'App',
  components: {

  },
  mounted() {
  },
  data:  () => ({
  routes: router.options.routes.filter(value => value.inMenu!==false)
  })
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
