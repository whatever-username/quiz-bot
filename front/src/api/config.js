import router from "@/router/router";
import axios from "axios";
export const baseURL = process.env.VUE_APP_BACKEND_BASE_URL+":"+process.env.VUE_APP_BACKEND_PORT;
// export const baseURL = "http://localhost:3000";
console.log("baseURL: "+baseURL)
axios.interceptors.request.use(req => {
    let token = localStorage.token;
    if (!token && !req.url.includes("/login")){
        router.push("/login")
    }
    req.headers["Authorization"] = 'Bearer ' + token;
    return req;
})
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        delete localStorage.token;
        router.push("/login");
    }
    return error;
})
