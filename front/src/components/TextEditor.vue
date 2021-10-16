<template>
  <div>
    <tiptap-vuetify
        style="width: 100%; text-align: start"
        v-model="dataValue"
        :extensions="extensions"
    ></tiptap-vuetify>
  </div>
</template>

<script>
import {
  TiptapVuetify,
  Bold,
  HardBreak,
  Italic,
  Link,
  Strike,
  Underline
} from 'tiptap-vuetify'
export default {
  name: "TextEditor",
  data() {
    return {
      dataValue:this.value,
      extensions: [
        Link,
        Underline,
        Strike,
        Italic,
        Bold,
        HardBreak
      ],
    }
  },
  props:['value', 'placeholder'],
  components: { TiptapVuetify },
  methods: {
    handleInput () {
      this.$emit('input', this.dataValue)
    }
  },
  watch:{
    dataValue: function ()  {
      this.handleInput();
    }
  }

}
</script>

<style scoped>

</style>