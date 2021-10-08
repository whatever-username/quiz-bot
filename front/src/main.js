import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router.js"
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  vuetify,
  router
}).$mount('#app')


