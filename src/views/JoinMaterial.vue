<template>
  <div class="page-wrap p-20">

    <div class="cate-div">
      <span class="select-cate">企业入驻资料设置:</span>
      <el-popover
        placement="top"
        trigger="manual"
        v-model="companyPopVisible"
        width="160"
      >
        <div class="p-10">
          <el-select class="width-120" placeholder="请选择" size="mini" v-model="companyAddTypeIdx">
            <el-option
              :key="idx"
              :label="item.title"
              :value="idx"
              v-for="(item,idx) in eleTypeList">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right; margin: 0">
          <el-button @click="companyPopVisible =false" size="mini" type="text">取消</el-button>
          <el-button @click="companyAddRow" size="mini" type="primary">确定</el-button>
        </div>
        <span @click.prevent="openCompanyAdd" class="select-cate-right" slot="reference">添加</span>
      </el-popover>
    </div>
    <form-wrap :_conf="companyData" @change="upCompanyData" ref="company" v-if="ready"></form-wrap>
    <div class="p-30"></div>
    <div class="cate-div">
      <span class="select-cate">个人入驻资料设置:</span>
      <el-popover
        placement="top"
        trigger="manual"
        v-model="personPopVisible"
        width="160"
      >
        <div class="p-10">
          <el-select class="width-120" placeholder="请选择" size="mini" v-model="personAddTypeIdx">
            <el-option
              :key="idx"
              :label="item.title"
              :value="idx"
              v-for="(item,idx) in eleTypeList">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right; margin: 0">
          <el-button @click="personPopVisible =false" size="mini" type="text">取消</el-button>
          <el-button @click="personAddRow" size="mini" type="primary">确定</el-button>
        </div>
        <span @click.prevent="openPersonAdd" class="select-cate-right" slot="reference">添加</span>
      </el-popover>
    </div>
    <form-wrap :_conf="personData" @change="upPersonData" ref="person" v-if="ready"></form-wrap>
    <div class="flex m-t-40">
      <el-button @click="sub" size="small" type="primary">提交</el-button>
      <el-button @click="cancel" size="small" type="info">取消</el-button>
    </div>

  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import FormWrap from '../components/form/FormWrap';
import {fun} from '../common';
import {getBizConfig, updateBizConfig} from '../common/fetch';


@Component({
  components: {FormWrap},
})
export default class JoinMaterial extends Vue {

  ready = false;

  personData = [];
  companyData = [];

  eleTypeList = [
    {title: '文本框', type: 'input'},
    {title: '选择框', type: 'picker'},
    {title: '图片上传', type: 'img'},
    {title: '地区选择', type: 'area'},
  ]
  personPopVisible = false
  personAddTypeIdx = 0

  companyPopVisible = false
  companyAddTypeIdx = 0

  openCompanyAdd() {
    this.companyAddTypeIdx = 0
    this.companyPopVisible = true
  }

  companyAddRow() {
    this.companyPopVisible = false
    if (!this.eleTypeList[this.companyAddTypeIdx]) {
      fun.error({msg: '请选择新增的表单组件类型'})
      return;
    }
    this.$refs.company.rowAdd(this.eleTypeList[this.companyAddTypeIdx])
  }


  openPersonAdd() {
    this.personAddTypeIdx = 0
    this.personPopVisible = true
  }

  personAddRow() {
    this.personPopVisible = false
    if (!this.eleTypeList[this.personAddTypeIdx]) {
      fun.error({msg: '请选择新增的表单组件类型'})
      return;
    }
    this.$refs.person.rowAdd(this.eleTypeList[this.personAddTypeIdx])
  }

  upPersonData(arr) {
    this.personData = arr.concat([])
  }

  upCompanyData(arr) {
    this.companyData = arr.concat([])
  }

  sub() {
    const data = {
      'company': this.companyData,
      'person': this.personData,
    }
    const postData = {industry_form: JSON.stringify(data)}

    updateBizConfig(postData).then(res => {
      fun.success({msg: '修改成功'})
      // setTimeout(function () {
      //   window.location.href=window.parent.location.origin+'/member/biz/biz_industry.php'
      // },1000)


    }).catch(() => {

    })

  }

  cancel() {
    history.go(-1)
  }

  async created() {

    await getBizConfig().then(res => {
      const {company = [], person = []} = res.data.industry_form
      this.personData = person
      this.companyData = company

    }).catch(err => {

    })

    this.ready = true

  }

}

</script>

<style lang="less" scoped>
  .cate-div {
    font-size: 14px;
    margin-top: 17px;
    margin-bottom: 17px;
    height: 12px;
    line-height: 12px;
  }

  .select-cate {
    color: #606266;
    margin-right: 16px;
  }

  .select-cate-right {
    color: #409EFF;
    cursor: pointer;
  }


</style>
