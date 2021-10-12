<template>
  <div class="container">
    <v-row :key="test.id" v-for="(test, index) in tests" >
      <v-col>
        <TestInfoCard
            v-model="tests[index]"
            @deleteTest="deleteTest"
        ></TestInfoCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog
            transition="dialog-bottom-transition"
            max-width="300"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
            >Добавить тест
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                  color="primary"
                  dark
              >Выберите тип теста
              </v-toolbar>
              <v-card-text>
                <div class="text-h2 pa-12">
                  <v-btn
                      @click="dialog.value = false; newTest('quiz')"
                  >Викторина
                  </v-btn>
                  <v-btn
                      @click="dialog.value = false; newTest('poll')"
                  >Опрос
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>


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
      tests: [],
      dataLoading: true
    }
  },
  mounted() {
    this.tests = this.getTests();
  },
  methods: {
    newTest(type) {
      this.$router.push('/tests/' + 'new'+"?type="+type)
    },
    getTests() {
      tests.getTests().then(value => {
        console.log(value)
        this.tests = value.data
        this.dataLoading = false
      });
    },
    async deleteTest(id) {
      try {
        await tests.deleteTest(id)
        const findById = (element) => element._id === id;
        this.tests.splice(this.tests.findIndex(findById), 1)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>

</style>