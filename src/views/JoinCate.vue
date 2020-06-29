<template>
  <div class="page-wrap p-20">
    <div class="form-item">
      <div class="label">排序：</div>
      <div class="content">
        <input class="input w400" placeholder="请输入排序" v-model="weight" />
      </div>
    </div>
    <div class="form-item">
      <div class="label">类别名称：</div>
      <div class="content">
        <input class="input w400" placeholder="请输入类别名称" v-model="industry_name" />
      </div>
    </div>
    <div @click="bindCateDialogShow=true" class="form-item">
      <div class="label">上级类目：</div>
      <div class="content parent">
        <div class="actions"><span class="color-blue m-r-10">{{parent.industry_name}}</span><span
          class="">设置类目</span></div>
        <!--        <div class="box">-->
        <!--          <div class="cate_list" style="margin-left: 120px;margin-bottom: 22px;" v-if="cate_list.length>0">-->
        <!--            <span class="cate_item" v-for="(cate,idx) in show_cate_list">{{cate.Category_Name}}</span>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>

    <div class="form-item">
      <div class="label">类目图片：</div>
      <div class="content parent">
        <upload-img-components
          :img-url="industry_img"
          :onSuccess='uploadImgCB'
          :small="true"
          class="myUploadImg"
          type='avatar'>
        </upload-img-components>
      </div>
    </div>
    <block v-if="pid>0">
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
      <form-wrap :_conf="companyData" @change="upCompanyData" ref="company"
                 v-if="ready"></form-wrap>
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

    </block>
    <div class="flex m-t-40">
      <el-button @click="sub" size="small" type="primary">提交</el-button>
      <el-button @click="cancel" size="small" type="info">取消</el-button>
    </div>

    <bind-biz-cate-components
      :has.sync="cate_list"
      :multiple="false"
      :onSuccess="bindCateSuccessCall"
      :pageEl="pageEl"
      :show="bindCateDialogShow"
      :strictly="true"
      @cancel="bindCateCancel"
      propTitle="上级类目" />

  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import FormWrap from '../components/form/FormWrap';
import {fun} from '../common';
import {addBizIndustry, editBizIndustry, getBizIndustryDetail} from '../common/fetch';
import UploadImgComponents from '@/components/diy/tool/UploadImgComponents';
import {domain} from '@/common/utils';
import BindBizCateComponents from '@/components/BindBizCateComponents';


@Component({
  components: {BindBizCateComponents, UploadImgComponents, FormWrap},
})
export default class JoinCate extends Vue {


  pageEl = this
  show_cate_list = []
  bindCateDialogShow = false
  cate_list = []
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
  id = null
  industry_name = ''
  industry_img = ''
  personData = []
  companyData = []
  pid = 0
  weight = 0
  parent = {industry_name: ''}

  bindCateCancel() {
    this.bindCateDialogShow = false
  }

  bindCateSuccessCall(dataType, type, path, tooltip, dataObj, pageEl, idx2, ext) {
    console.log('返回的数据', dataObj)
    this.pid = dataObj.id
    this.parent.industry_name = dataObj.industry_name
    this.bindCateDialogShow = false
  }

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

    const action = this.id ? editBizIndustry : addBizIndustry

    let postData = {
      industry_name: this.industry_name,
      industry_img: this.industry_img,
      pid: this.pid,
      weight: this.weight,
      industry_form: JSON.stringify({
        company: this.companyData,
        person: this.personData,
      }),
    }
    if (this.id) {
      postData.industry_id = this.id
    }

    action(postData).then(res => {
      fun.success({msg: '操作成功'})
    }).catch(() => {

    })

  }

  cancel() {
    history.go(-1)
  }

  uploadImgCB(res) {
    if (!res.data.path) {
      fun.error({title: '图片上传失败'})
      return;
    }
    this.industry_img = domain(res.data.path)
  }

  async created() {

    const industry_id = this.$route.query.id
    if (!industry_id) {
      this.ready = true
      return;
    }
    this.id = industry_id
    getBizIndustryDetail({industry_id}).then(res => {
      const {pid, industry_name = '顶级目录', industry_img = '', industry_form, weight = 0, parent = {}} = res.data
      this.industry_name = industry_name
      this.industry_img = industry_img
      this.pid = pid
      this.weight = weight

      this.parent = parent

      const {company = [], person = []} = industry_form
      this.personData = person
      this.companyData = company
      this.ready = true
    }).catch(err => {

    })


  }

}

</script>

<style lang="less" scoped>
  .form-item {
    margin-bottom: 22px;
    font-size: 14px;
    display: flex;

    .label {
      text-align: right;
      vertical-align: middle;

      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      width: 90px;
      box-sizing: border-box;
    }

    .content {

      .input {
        display: inline-block;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      }
    }

    .parent {
      .actions {
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }

      .box {
        background: #f8f8f8;
        padding: 20px;
        width: 360px;
      }
    }
  }

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
