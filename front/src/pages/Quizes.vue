<template>
  <div class="container">
      <QuizInfoCard
          :key="quiz.id" v-for="(quiz, index) in quizes" v-model="quizes[index]"
          @deleteQuiz="deleteQuiz"
      ></QuizInfoCard>
    <v-btn @click="newQuiz()">Добавить тест</v-btn>
    <v-overlay v-model="dataLoading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>

</template>

<script>
import QuizInfoCard from "@/components/quizes/QuizInfoCard";
import quizes from "@/api/quizes";
export default {
  name: "Quizes",
  components: {QuizInfoCard},
  data() {
    return {
      quizes:[],
      dataLoading:true
    }
  },
  mounted() {
    this.quizes = this.getQuizes();
  },
  methods:{
    newQuiz(){
      this.$router.push('/quizes/'+'new')
    },
    getQuizes(){
      quizes.getQuizes().then(value => {
        console.log(value)
        this.quizes = value.data
        this.dataLoading = false
      });
    },
    async deleteQuiz(id){
      try {
        await quizes.deleteQuiz(id)
        const findById = (element) => element._id ===id;
        this.quizes.splice(this.quizes.findIndex(findById),1)
      }catch (err){
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>

</style>