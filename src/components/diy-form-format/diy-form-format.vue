<template>
	<div class="form-wrap" v-if="formList.length>0">
		<el-form ref="form" :label-width="labelWidth" :size="formSize">
			<div v-for="(item,idx) in formList" :key="idx">

				<div v-show="!item.hide">
					<el-form-item v-if="item.type==='input'" :label="item.label">
						<el-input @input="bindInputEvent($event,idx)" v-model="item.value" :required="item.required"></el-input>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>

					<el-form-item v-if="item.type==='picker'" :label="item.label" :required="item.required">
						<el-select v-model="item.value" placeholder="item.desc">
							<el-option v-for="(opt,idx2) in item.options" :key="idx2" label="opt.label" :value="opt.val"></el-option>
						</el-select>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>

					<el-form-item v-if="item.type==='radio'" :label="item.label" :required="item.required">
						<el-radio-group v-model="item.value" @change="bindRadioChange($event,idx)">
							<el-radio v-for="(opt,idx2) in item.options" :key="idx2" :label="opt.label"></el-radio>
						</el-radio-group>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>

					<el-form-item v-if="item.type==='switch'" label="即时配送" :required="item.required">
						<el-switch v-model="item.value"></el-switch>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>

					<el-form-item v-if="item.type==='textarea'" :label="item.label">
						<el-input @input="bindInputEvent($event,idx)" :required="item.required" type="textarea" v-model="item.value"></el-input>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>

					<el-form-item v-if="item.type==='img'" :label="item.label" :required="item.required" @click="setActiveIdx(idx)">
						<upload-img-components
						:idx2="idx"
						:limit="item.limit"
						:img-url="item.value|domain"
						:type="item.limit==1?'avatar':'multiple'"
						:mini="imgSize==='mini'"
						:small="imgSize==='small'"
						:onSuccess="upImgSuccess"
						></upload-img-components>
						<div class="form-desc">{{item.desc}}</div>
					</el-form-item>
				</div>

			</div>

		</el-form>


	</div>
</template>

<script>
import {Component, Vue,Watch} from 'vue-property-decorator'
import { findArrayIdx, objTranslate } from '@/common/utils'
import {domain} from '@/common/utils'
import UploadImgComponents from '@/components/diy/tool/UploadImgComponents'



@Component({
  name: 'diy-form-format',
  components: { UploadImgComponents },
  props: {
    labelWidth:{
      type:String,
      default:'120px'
    },
    formSize:{
      type:String,
      default:'small'
    },
    imgSize:{
      type:String,
      default:'mini'
    },
    eid: {
      type: String,
      require: true
    },
    // 编辑模式
    action: {
      type: String,
      default: 'add'
    },
    // 编辑模式
    isedit: {
      type: Boolean,
      default: false
    },
    // 显示模式
    isshow: {
      type: Boolean,
      default: false
    },
    forms: {
      type: Array,
      require: true
    }
  },
})
export default class DiyFormFormat extends Vue{

  idx = null
  formList = []

  setActiveIdx (idx) {
    // console.log(`active index change,current idx is ${idx}`)
    this.idx = idx
  }

  setVal (val, idx,column='value') {

    const _idx = idx>=0 ?idx:this.idx
    this.$set(this.formList[_idx], column, val)
	  this.refreshData()
  }


  refreshData(){
    const formList = this.formList
    if (Array.isArray(formList) && formList.length > 0) {
      this.$emit('update', objTranslate(formList))
    }
  }



  upImgSuccess (res,idx) {

	  if(this.formList[idx].limit>1){
      var imgList = []
      if(this.formList[idx].value){
        imgList = this.formList[idx].value.split(',')
      }

      imgList.push(res.data.path)
      // console.log(imgList)
      this.setVal(imgList.join('|'),idx)
      this.setVal(imgs.length,idx,'count')
	  }else{
      this.setVal(res.data.path,idx)
      this.setVal(1,idx,'count')
	  }

  }



  getDomain = (str)=>domain(str)

  openPop(name) {
    this.$refs[name].show()
  }
  updateAddress(data) {
    // console.log(data)
    this.setVal(data.strArr.join(''))
  }
  getData() {
    // console.log('formList is', this.formList)
    // return objTranslate(this.formList)
  }
  openAddressChoose() {
    const rt = {province: '北京', city: '北京', area: '西山', town: '香山公园'}
    showLoading('获取地址')
    setTimeout(() => {
      hideLoading()
      this.addressCall(rt)
    }, 500)
  }

  // pickerChange(e) {
  //   const val = e.$wx.detail.value
  //   this.setVal(this.formList[this.idx].options[val])
  // }

  bindRadioChange(e,idx){
    const val = e
    this.setVal(val, idx)
  }

  bindInputEvent(e, idx) {
    // console.log(e,idx)
    const val = e
    this.setVal(val, idx)
  }

  addressCall({province, city, area, town}) {
    // const val = e.$wx.detail.value
    this.setVal(Object.values({province, city, area, town}).join(' '))
  }

  taggleHide(idx,statusVal){
    // console.log(idx,statusVal)
	  if(statusVal === undefined){
      this.$set(this.formList[idx],'hide',!this.formList[idx].hide)
	  }else{
      this.$set(this.formList[idx],'hide',statusVal)
	  }

  }



  // @Watch('formList',{deep: true, immediate: true })
  // handlerFn(newVal) {
  //   console.log(newVal)
  //   if (Array.isArray(newVal) && newVal.length > 0) {
  //     this.$emit('update', objTranslate(newVal))
  //   }
  // }

  created(){

    const _arr = objTranslate(this.forms)
    // console.log(_arr)
    // 我也太聪明了
    if (Array.isArray(_arr) && _arr.length > 0) {
      this.formList = _arr.map(row => {
        // 只有picker是要特殊处理的


        if (row.type === 'picker' && this.action === 'edit') {
          // 下标
          const selectOptIdx = row.options.indexOf(row.value)
          if (selectOptIdx !== -1) {
            row.selectOptIdx = selectOptIdx
          }
        }

        if (row.type === 'radio') {
          // 下标
          const selectOptIdx = findArrayIdx(row.options,{val:row.value})
          if (selectOptIdx !== false) {
            row.value = row.options[selectOptIdx].label
          }
        }

        // 编辑和显示模式下图片格式化
        if (this.action === 'show' && row.type === 'img') {
          row.src = domain(row.value)
        }

        if (this.action === 'edit' && row.type === 'img') {
          row.hasImg = []
          if (row.value) {
            row.src = domain(row.value)
            row.hasImg = [domain(row.value)]
          }
        }

        return row
      })
      // console.log(this.formList)
      // this.refreshData()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-desc{
	color: #999;
	font-size: 13px;
	margin-top: 6px;
	line-height: 18px;
}
</style>
