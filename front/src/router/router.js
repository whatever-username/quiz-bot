import VueRouter from "vue-router";
import Main from "@/pages/Main";
import Login from "@/pages/Login";
import Vue from 'vue'
import Quizes from "@/pages/Quizes";
import Posts from "@/pages/Posts";
import Quiz from "@/components/quizes/Quiz";


Vue.use(VueRouter)

const routes = [
    { name:"Главная", path: '/', component: Main },
    { name:"Тесты",path: '/quizes', component: Quizes },
    { name:"Тест",path: '/quizes/:id', component: Quiz , inMenu: false},
    { name:"Посты",path: '/posts', component: Posts },
    { name:"Логин",path: '/login', component: Login }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    mode: 'history',
    routes
})
router.beforeEach((to, from, next) => {
    if (process.env.disableTG && to.path !== '/login' && !isAuthenticated()) {
        next({ path: '/login' })
    }
    else next()
})
function isAuthenticated(){
        let stored = localStorage.token;
        if (!stored){
            return false;
        }
        return true;
}
export default router;
