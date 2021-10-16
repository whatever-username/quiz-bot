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

  async function getCode(username) {
    let url = baseURL + "/login/bot_code"
        return  axios.post(
            url,
            {username}
        ).then(response => {
           return response;
        })

}

async function validateCode(username, code) {
    try {
        let url = baseURL + "/login/bot_code/check"
        return await axios.post(
            url,
            {username, code}
        )
    } catch (error) {
        console.log(error);
    }
}

export default {
    login,
    getCode,
    validateCode
}