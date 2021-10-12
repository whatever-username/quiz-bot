<template>
  <v-row no-gutters justify="center">
    <v-col cols="8">
      <v-text-field
          class="my-0 py-0"
          label="Текст ответа"
          outlined
          v-model="answer.text"
          :background-color="type==='quiz' ? answer.correct ? '#b4ff92' : '#ff8e9f' : '#ffffff'"
      ></v-text-field>
    </v-col>
    <v-col cols="2" v-if="type==='quiz'">
      <v-switch class="my-0"
                @click.native.capture.stop="changeAnswerCorrectness"
                v-model="answer.correct"
                :color="answer.correct ? '#b4ff92' : '#ff8e9f'"
      ></v-switch>
    </v-col>
    <v-col cols="1">
      <v-icon color="white" @click="updateAnswerPosition('up')">mdi-arrow-up</v-icon>
      <v-icon color="white" @click="updateAnswerPosition('down')">mdi-arrow-down</v-icon>
      <v-icon color="red" @click="deleteAnswer()">mdi-close-circle</v-icon>

    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Answer",
  props: ['value', 'type'],
  data() {
    return {
      answer: this.value
    }
  },
  mounted() {
  },
  methods: {
    changeAnswerCorrectness(){
      this.$emit("changeAnswerCorrectness");
    },
    updateAnswerPosition(dir){
      this.$emit('updateAnswerPosition', dir)
    },
    deleteAnswer() {
      this.$emit('deleteAnswer', this.answer)
    }
  }
}
</script>

<style>
.v-input--selection-controls__input {
  margin: auto !important;
}
</style>