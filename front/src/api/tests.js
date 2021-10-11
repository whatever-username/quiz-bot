import axios from "axios";
import {baseURL} from "@/api/config";


async function getTests() {
    try {
        let url = baseURL + "/tests"
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function getTest(id) {
    try {
        let url = baseURL + "/tests/" + id
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function saveTest(test) {
    let url = baseURL + "/tests"
    return (await axios.post(
        url,
        test
    )).data
}
async function updateTest(test) {
        let url = baseURL + "/tests/"+test._id
        return (await axios.put(
            url,
            test
        )).data

}
async function deleteTest(id) {
    let url = baseURL + "/tests/"+id
    return (await axios.delete(
        url
    )).data

}
export default {
    getTests,
    getTest,
    saveTest,
    updateTest,
    deleteTest
}

