import {baseURL} from "@/api/config";
import axios from "axios";

async function login(userData) {
    try {
        let url = baseURL + "/login"
        return await axios.post(
            url,
            userData
        )
    } catch (error) {
        console.log(error);
    }
}

export default {
    login
}