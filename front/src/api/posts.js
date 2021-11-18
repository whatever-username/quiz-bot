import axios from "axios";
import {baseURL} from "@/api/config";


async function getPosts() {
    try {
        let url = baseURL + "/posts"
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function getPost(id) {
    try {
        let url = baseURL + "/posts/" + id
        return await axios.get(
            url
        )
    } catch (error) {
        console.log(error);
    }
}

async function savePost(post) {
    let url = baseURL + "/posts"
    return (await axios.post(
        url,
        post
    )).data
}
async function updatePost(post) {
        let url = baseURL + "/posts/"+post._id
        return (await axios.put(
            url,
            post
        )).data

}
async function deletePost(id) {
    let url = baseURL + "/posts/"+id
    return (await axios.delete(
        url
    )).data

}
export default {
    getPosts,
    getPost,
    savePost,
    updatePost,
    deletePost
}

