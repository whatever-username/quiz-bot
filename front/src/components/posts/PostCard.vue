<template>
  <v-card>
    <v-card-text>{{value.text}}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PostCard",
  props:['value']
}
</script>

<style scoped>

</style>