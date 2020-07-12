<template>
  <div class="home-wrap">
    <div style="margin: 90px">
      31231231
      <wzw-tinymce></wzw-tinymce>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import WzwTinymce from "../components/editor/WzwTinymce.vue";


@Component({
  components: {
    WzwTinymce

  }
})
export default class Demo extends Vue {

  async created() {

    console.log(333)
  }

}
</script>
<style lang="scss" scoped>
</style>