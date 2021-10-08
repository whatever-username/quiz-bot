import axios from "axios";
import {baseURL} from "@/api/config";


async function getQuizes() {
    try {
        let url = baseURL + "/quizes"
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function getQuiz(id) {
    try {
        let url = baseURL + "/quizes/" + id
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function saveQuiz(quiz) {
    let url = baseURL + "/quizes"
    return (await axios.post(
        url,
        quiz
    )).data
}
async function updateQuiz(quiz) {
        let url = baseURL + "/quizes/"+quiz._id
        return (await axios.put(
            url,
            quiz
        )).data

}
async function deleteQuiz(id) {
    let url = baseURL + "/quizes/"+id
    return (await axios.delete(
        url
    )).data

}
export default {
    getQuizes,
    getQuiz,
    saveQuiz,
    updateQuiz,
    deleteQuiz
}

