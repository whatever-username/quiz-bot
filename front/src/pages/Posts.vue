<template>
  <div class="container">
      <v-row v-for="(post, index) in posts" :key="post._id">
        <v-col>
          <PostCard v-model="posts[index]"></PostCard>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import postsApi from "@/api/posts";
import PostCard from "@/components/posts/PostCard";
export default {
  name: "Posts",
  components: {PostCard},
  data(){
    return {
      posts:[]
    }
  },
  created() {
    this.posts = postsApi.getPosts();
  }
}
</script>

<style scoped>

</style>