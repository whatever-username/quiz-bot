import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'



let vuetify = new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes

    },
    lang: {
        current: 'ru' // en | es | fr | pl | ru | uk | ptbr | tr | he | nl | ja
    }
});


Vue.use(Vuetify)
Vue.use(TiptapVuetifyPlugin, { vuetify , iconsGroup:'mdi'})


export default vuetify