<template>
  <div class="home-wrap">
    <el-form label-width="90px">
      <!--        <el-form-item label="公告名称" prop="title">-->
      <!--          <el-input v-model="info.title"></el-input>-->
      <!--        </el-form-item>-->
      <el-form-item label="首页显示" prop="home_show">
        <el-radio-group v-model="info.home_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告详情" style="margin-right: 100px;">
        <wzw-tinymce @initDone="initDone"  :content="info.content" ref="richtext"></wzw-tinymce>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <el-button size="small" type="primary" @click="subFn" class="m-r-15">保存</el-button>
          <el-button size="small" @click="back" class="">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import WzwTinymce from "../components/editor/WzwTinymce.vue";
import {bizMessageDetail, operateBizMessage} from "../common/fetch";
import {Exception} from "../common/Exception";


@Component({
  components: {
    WzwTinymce

  }
})
export default class MessageForm extends Vue {

  info={
    msg_id:'',
    title:'',
    home_show:0,
    content:''
  }

  back(){
    history.go(-1)
  }
  async subFn(){
    this.info.content = this.$refs.richtext.getContent()

    await operateBizMessage({
      ...this.info
    }).then(res=>{
      this.back()
    }).catch(err=>{
      Exception.handler(err)
    })
  }

  initDone(){
    this.$refs.richtext.setContent(this.info.content)
  }
  bindRichChange(val){
    this.info.content = val
  }
  async created() {

    if(this.$route.query.id){
      const msg_id = this.$route.query.id

      bizMessageDetail({msg_id:msg_id}).then(res=>{
        this.info = res.data
        this.info.msg_id = msg_id
      }).catch(err=>{
        Exception.handle(err)
      })
    }

  }

}
</script>
<style lang="scss" scoped>
</style>
