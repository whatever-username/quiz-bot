<template>
  <v-card>
    <v-card-title>
      {{value.type==='poll' ? "Опрос":"Викторина"}} "{{value.name}}". {{questionsLengthString}}
      <v-spacer></v-spacer>
      <v-btn @click="goTo(value._id)">
        <v-icon>mdi-grease-pencil</v-icon>
      </v-btn>

      <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
                color="primary"
                dark
            >Подтвержение</v-toolbar>
            <v-card-text>
              <div class="text-h2 pa-12">Удалить тест "{{value.name}}"?</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  text
                  @click="dialog.value = false; deleteTest(value._id)"
              >Да</v-btn>
              <v-btn
                  text
                  @click="dialog.value = false"
              >Нет</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-title>


  </v-card>
</template>

<script>

export default {
  name: "TestInfoCard",
  props:['value'],
  methods:{
    deleteTest(id){
      this.$emit('deleteTest',id)
    },
    goTo(id){
      this.$router.push('/tests/'+id)
    },
  },
  computed:{
    questionsLengthString: function (){
      let length = 0;
      try {
        length = this.value.questions.length
        // eslint-disable-next-line no-empty
      }catch (e) {}
      if (length ===1){
        return length+" вопрос";
      }else if ([2,3,4,5].includes(length)){
        return length+" вопроса";
      }else {
        return length+" вопросов";
      }
    }
  }
}
</script>

<style scoped>

</style>