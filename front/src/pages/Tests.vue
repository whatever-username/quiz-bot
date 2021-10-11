<template>
  <div class="container">
      <TestInfoCard
          :key="test.id" v-for="(test, index) in tests" v-model="tests[index]"
          @deleteTest="deleteTest"
      ></TestInfoCard>
    <v-btn @click="newTest()">Добавить тест</v-btn>
    <v-overlay v-model="dataLoading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>

</template>

<script>
import TestInfoCard from "@/components/tests/TestInfoCard";
import tests from "@/api/tests";
export default {
  name: "Tests",
  components: {TestInfoCard},
  data() {
    return {
      tests:[],
      dataLoading:true
    }
  },
  mounted() {
    this.tests = this.getTests();
  },
  methods:{
    newTest(){
      this.$router.push('/tests/'+'new')
    },
    getTests(){
      tests.getTests().then(value => {
        console.log(value)
        this.tests = value.data
        this.dataLoading = false
      });
    },
    async deleteTest(id){
      try {
        await tests.deleteTest(id)
        const findById = (element) => element._id ===id;
        this.tests.splice(this.tests.findIndex(findById),1)
      }catch (err){
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>

</style>