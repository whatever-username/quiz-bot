<template>
  <v-container>
    <v-card :color="'#e8d6f1'">
      <v-toolbar
          dark
      >
        {{ "Вопрос №" + (this.index + 1) }}
        <v-spacer></v-spacer>
        <v-text-field
            v-if="type==='quiz'"
            hide-details v-model="question.time" label="Время на ответ (секунд)" dense outlined
                      class="centered-input text--darken-3" type="number" placeholder="30" min="5"
                      max="600"></v-text-field>
        <v-icon color="white" @click="updateQuestionPosition('up')">mdi-arrow-up</v-icon>
        <v-icon color="white" @click="updateQuestionPosition('down')">mdi-arrow-down</v-icon>
        <v-icon color="red" @click="deleteQuestion">mdi-close-circle</v-icon>
      </v-toolbar>
      <v-card-title>
        <v-text-field
            label="Текст вопроса"
            outlined
            :color="'#ffffff'"
            v-model="question.text"
        ></v-text-field>
      </v-card-title>
      <v-row no-gutters v-if="type==='quiz'">
        <v-col>
          <p>Пояснение к правильному ответу</p>
          <TextEditor class="px-4 my-5" v-model="question.answerComment" style="width: 100%"></TextEditor>

        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>Ответы</v-col>
      </v-row>
      <v-row no-gutters class="my-3">
        <v-col cols="1">№</v-col>
        <v-col :cols="type==='quiz'? 8:10">Текст</v-col>
        <v-col v-if="type==='quiz'" cols="2">Правильный?</v-col>
        <v-col cols="1"></v-col>
      </v-row>
      <v-row no-gutters
             :key="answer.id"
             v-for="(answer,index) in question.answers"
      >
        <v-col cols="1">
          {{ index + 1 }}
        </v-col>
        <v-col>
          <Answer
              :type="type"
              v-model="question.answers[index]"
              @input="handleInput(index)"
              @deleteAnswer="deleteAnswer(index)"
              @updateAnswerPosition="(...args)=>updateAnswerPosition(index, args)"
              @changeAnswerCorrectness="changeAnswerCorrectness(index)"
          >
          </Answer>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col style="text-align: left;">
          <v-btn @click="addAnswer" class="mx-5 my-5"
          >Добавить ответ
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-alert type="warning" v-model="answersSizeAlertShown" :dismissible="true">
      Допустимое количество ответов в вопросе - от 2 до 10
      <template v-slot:close="{ toggle }">
        <v-icon @click="dismissSizeAlert(toggle)">mdi-close-circle</v-icon>
      </template>
    </v-alert>
  </v-container>
</template>

<script>
import Answer from "@/components/tests/Answer";
import utils from "@/utils";
import Vue from "vue";
import TextEditor from "@/components/TextEditor";

export default {
  name: "Question",
  components: {Answer, TextEditor},
  props: ['value', 'index', 'type'],
  data() {
    return {
      answersSizeAlertShown: false,
      question: this.value,
      awaitingTimeVal: false
    }
  },
  mounted() {
  },
  methods: {
    changeAnswerCorrectness(index) {
      let newIndex
      if (this.question.answers[index].correct){
        newIndex = index===0 ? 1:0;
      }else{
        newIndex = this.question.answers.findIndex(value => value.correct);
      }
      Vue.set(this.question.answers[index], 'correct', !this.question.answers[index].correct)
      Vue.set(this.question.answers[newIndex], 'correct', !this.question.answers[newIndex].correct)
    },

    updateQuestionPosition(dir) {
      this.$emit('updateQuestionPosition', dir)
    },
    updateAnswerPosition(index, args) {
      let dir = args[0];
      if (dir === 'up' && index >= 1) {
        let buf = this.question.answers[index - 1];
        Vue.set(this.question.answers, index - 1, this.question.answers[index])
        Vue.set(this.question.answers, index, buf)

      } else if (dir === 'down' && index < this.question.answers.length - 1) {
        let buf = this.question.answers[index + 1];
        Vue.set(this.question.answers, index + 1, this.question.answers[index])
        Vue.set(this.question.answers, index, buf)
      }
    },
    dismissSizeAlert(toggleFn) {
      if (toggleFn) {
        toggleFn();
        return
      }
      this.answersSizeAlertShown = false;
    },
    getKey() {
      return Math.random();
    },
    addAnswer() {
      if (this.question.answers.length >= 10) {
        this.answersSizeAlertShown = true
        return
      }
      this.question.answers.push(utils.getDefaultAnswerJSON())
    },
    deleteAnswer(index) {
      if (this.question.answers.length <= 2) {
        this.answersSizeAlertShown = true
        return
      }
      this.question.answers.splice(index, 1);
    },
    deleteQuestion() {
      this.$emit("deleteQuestion");
    }
  },
  watch:{
    question:{
      deep: true,
      handler: function (val) {
        if (!this.awaitingTimeVal) {
          setTimeout(() => {
            if(Number(val.time) > Number(600)) {
              this.question.time = 600;
            }
            if(Number(val.time) < Number(5)) {
              this.question.time = 5;
            }
            this.awaitingTimeVal = false;
          }, 1000); // 1 sec delay
        }
        this.awaitingTimeVal = true;
      }
    }
  }

}
</script>

<style scoped>
.centered-input >>> input {
}
</style>