<template>
  <v-container>
  <v-card>
    <v-card-title>
      <v-text-field
          label="Название теста"
          outlined
          v-model="quiz.name"
      ></v-text-field>
    </v-card-title>
    <v-row no-gutters
           :key="question.id"
           v-for="(question,index) in quiz.questions"
    >
      <v-col>
        <Question
            @deleteQuestion="deleteQuestion(index)"
            @updateQuestionPosition="(...args)=>updateQuestionPosition(index, args)"
            v-model="quiz.questions[index]"
            :index="index"
        ></Question>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col style="text-align: left;">
        <v-btn @click="addQuestion"
        >Добавить Вопрос
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col style="text-align: right;">
        <v-btn @click="save"
        >Сохранить
        </v-btn>
        <v-btn @click="back"
        >Назад
        </v-btn>
      </v-col>
    </v-row>

    <v-overlay v-model="dataLoading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-card>
  </v-container>
</template>

<script>
import Question from "@/components/quizes/Question";
import utils from "@/utils";
import Vue from "vue";
import quizes from "@/api/quizes";
export default {
  name: "Quiz",
  components: {Question},
  methods: {
    async save(){
      let quiz = utils.trimQuizIds(this.quiz);
      console.log(quiz)
      if (quiz._id){
        quiz = await quizes.updateQuiz(quiz)
      }else {
        quiz = await quizes.saveQuiz(quiz)
      }
      console.log(JSON.stringify(quiz))
      this.quiz=utils.addQuizIds(quiz);
      console.log(this.quiz)
      this.$router.replace("/quizes/"+quiz._id)
    },
    back(){
      this.$router.push("/quizes")
    },
    getQuiz(id){
      console.log(id)
      quizes.getQuiz(id).then(value => {
        console.log(value)
        this.quiz = value.data
        this.buffered =JSON.parse(JSON.stringify(this.quiz));
        utils.addQuizIds(this.quiz)
        this.dataLoading = false
      });
    },
    updateQuestionPosition(index,args){
       let dir = args[0];
      if(dir==='up' && index>=1){
        let buf = this.quiz.questions[index-1];
        Vue.set(this.quiz.questions, index-1, this.quiz.questions[index])
        Vue.set(this.quiz.questions, index, buf)

      }else if (dir==='down' && index<this.quiz.questions.length-1){
        let buf = this.quiz.questions[index+1];
        Vue.set(this.quiz.questions, index+1, this.quiz.questions[index])
        Vue.set(this.quiz.questions, index, buf)
      }
    },
    deleteQuestion(index){
      this.quiz.questions.splice(index,1);
    },
    addQuestion() {

      this.quiz.questions.push(utils.getDefaultQuestionJSON())
    },
  },
  data() {
    return {
      buffered :{},
      quiz: {},
      dataLoading:true
    }
  },
  created() {
    if (this.$route.params.id!=='new'){
      this.getQuiz(this.$route.params.id)
    }else {
      this.quiz = utils.getDefaultQuizJSON();
      this.dataLoading = false
    }

  }
}
</script>

<style scoped>

</style>

