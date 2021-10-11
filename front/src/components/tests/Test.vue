<template>
  <v-container>
  <v-card>
    <v-card-title>
      <v-text-field
          label="Название теста"
          outlined
          v-model="test.name"
      ></v-text-field>
    </v-card-title>
    <v-row no-gutters
           :key="question.id"
           v-for="(question,index) in test.questions"
    >
      <v-col>
        <Question
            @deleteQuestion="deleteQuestion(index)"
            @updateQuestionPosition="(...args)=>updateQuestionPosition(index, args)"
            v-model="test.questions[index]"
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
import Question from "@/components/tests/Question";
import utils from "@/utils";
import Vue from "vue";
import tests from "@/api/tests";
export default {
  name: "Test",
  components: {Question},
  methods: {
    async save(){
      let test = utils.trimTestIds(this.test);
      console.log(test)
      if (test._id){
        test = await tests.updateTest(test)
      }else {
        test = await tests.saveTest(test)
      }
      console.log(JSON.stringify(test))
      this.test=utils.addTestIds(test);
      console.log(this.test)
      this.$router.replace("/tests/"+test._id)
    },
    back(){
      this.$router.push("/tests")
    },
    getTest(id){
      console.log(id)
      tests.getTest(id).then(value => {
        console.log(value)
        this.test = value.data
        this.buffered =JSON.parse(JSON.stringify(this.test));
        utils.addTestIds(this.test)
        this.dataLoading = false
      });
    },
    updateQuestionPosition(index,args){
       let dir = args[0];
      if(dir==='up' && index>=1){
        let buf = this.test.questions[index-1];
        Vue.set(this.test.questions, index-1, this.test.questions[index])
        Vue.set(this.test.questions, index, buf)

      }else if (dir==='down' && index<this.test.questions.length-1){
        let buf = this.test.questions[index+1];
        Vue.set(this.test.questions, index+1, this.test.questions[index])
        Vue.set(this.test.questions, index, buf)
      }
    },
    deleteQuestion(index){
      this.test.questions.splice(index,1);
    },
    addQuestion() {

      this.test.questions.push(utils.getDefaultQuestionJSON())
    },
  },
  data() {
    return {
      buffered :{},
      test: {},
      dataLoading:true
    }
  },
  created() {
    if (this.$route.params.id!=='new'){
      this.getTest(this.$route.params.id)
    }else {
      this.test = utils.getDefaultTestJSON();
      this.dataLoading = false
    }

  }
}
</script>

<style scoped>

</style>

