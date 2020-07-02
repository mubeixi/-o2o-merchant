<template>
  <div class="free-all">
    <div class="free-content">
      <div class="free-top">
        <div>活动状态</div>
        <el-switch v-model="status"></el-switch>
      </div>
      <el-form label-width="180px" ref="form" v-if="status">
        <el-form-item label="活动时间：">
          <el-date-picker
            align="right"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            v-model="value2"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="免单概率：">
          <div class="flex flex-align-c c8">
            <div>
              首单免单概率
              <el-input class="inputs" max="100" min="0.0001" type="number"
                        v-model="first"></el-input>
              %
            </div>
            <div style="margin-left: 42px">
              非首单免单概率
              <el-input class="inputs" max="100" min="0.0001" type="number"
                        v-model="after"></el-input>
              %
            </div>
          </div>
        </el-form-item>

        <el-form-item label="单笔订单最高免单金额：">
          <div class="flex flex-align-c c8">
            <el-input class="inputs" style="width: 150px !important;" v-model="top_free"></el-input>
            元

          </div>
        </el-form-item>

        <el-form-item label="如未免单，则：">
          <div>
            <el-checkbox :disabled="miss_free2.length>0||miss_free3.length>0" label=0
                         v-model="miss_free1">不做任何处理
            </el-checkbox>
          </div>
          <!--              <div>-->
          <!--                <el-checkbox label=1 v-model="miss_free2" :disabled="miss_free1.length>0">送赠品</el-checkbox> <span class="select" v-if="miss_free2.length>0">选择赠品</span>-->
          <!--                <div class="give-div"  v-if="miss_free2.length>0">-->
          <!--                    <div class="give-div-item flex flex-align-c">-->
          <!--                      <img class="imgs" src="https://new401t.bafangka.com/static/template/20191206151009125.jpg" >-->
          <!--                      秋装2019年新款裙子女法式复古气质宽松中长款假两件连衣裙新款法式复古-->
          <!--                      <img src="@/assets/img/mydel.png"  style="margin-left: auto">-->
          <!--                    </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <div>
            <el-checkbox :disabled="miss_free1.length>0" label=2 v-model="miss_free3">送优惠卷
            </el-checkbox>
            <span @click="openCoupon" class="select" v-if="miss_free3.length>0">选择优惠券</span>
            <div v-if="miss_free3.length>0">
              <div :key="index" class="coupons" v-for="(item,index) of productData">
                {{item.Coupon_Subject}}
                <img @click="del(index)" class="del-img" src="@/assets/img/productAdd/del.png">
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="免单商品：">
          <span @click="openPro" class="select" style="margin-left: 0">选择商品</span>

          <div class="give-div" style="margin-left: -90px" v-if="productDatas.length>0">
            <div :key="index" class="give-div-item flex flex-align-c"
                 style="width: 660px" v-for="(item,index) of productDatas">
              <img :src="item.ImgPath" class="imgs">
              <span style="width: 400px;overflow-x: hidden">{{item.Products_Name}}</span>
              <div @click="changeStatus(index)" class="tui-btn disableds" v-if="item.checked">取消推荐
              </div>
              <div @click="changeStatus(index)" class="tui-btn " v-else>推荐</div>
              <el-tooltip class="item" content="Top Left 提示文字" effect="dark" placement="top-start"
                          v-if="!item.checked">
                <img src="@/assets/img/wen.png" style="margin-left: auto">
              </el-tooltip>
              <img @click="delPro(index)" src="@/assets/img/mydel.png" style="margin-left: auto">
            </div>
          </div>
        </el-form-item>

        <el-form-item label="活动须知：">
          <el-input
            :autosize="{ minRows: 6, maxRows: 10}"
            placeholder="请输入内容"
            style="width: 480px"
            type="textarea"
            v-model="descr">
          </el-input>
        </el-form-item>


      </el-form>
    </div>

    <div class="submit-div" v-if="status">
      <div @click="saveActive" class="submit">保存</div>
    </div>


    <el-dialog
      :visible.sync="isShow"
      @close="closeDialog"
      append-to-body
      class="setting"
      title="选择优惠券"
      width="60%"
    >
      <fun-table
        :_pageSize="dataTableOpt.pageSize"
        :_totalCount="dataTableOpt.totalCount"
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :formSize="'small'"
        :has.sync="selectValue"
        :isRow="false"
        :is_paginate="dataTableOpt.is_paginate"
        @closeDialog="closeDialog"
        @currentChange="currentChanges"
        @handleSizeChange="handleSizeChange"
        @reset="reset"
        @selectVal="selectVal"
        @submit="submit"
        ref="funTableComp"
        v-if="isShow"
        vkey="Coupon_ID"
      >
      </fun-table>
      <div class="myButton">
        <el-button @click="isShow=false" size="small" type="primary">保存</el-button>
      </div>
    </el-dialog>


    <el-dialog
      :visible.sync="isShows"
      @close="closeDialogs"
      append-to-body
      class="setting"
      title="选择商品"
      width="60%"
    >
      <fun-table
        :_pageSize="dataTableOpts.pageSize"
        :_totalCount="dataTableOpts.totalCount"
        :columns="dataTableOpts.columns"
        :dataList="dataTableOpts.dataList"
        :formSize="'small'"
        :has.sync="selectValues"
        :isRow="false"
        :is_paginate="dataTableOpts.is_paginate"
        @closeDialog="closeDialogs"
        @currentChange="currentChangess"
        @handleSizeChange="handleSizeChanges"
        @reset="resets"
        @selectVal="selectVals"
        @submit="submits"
        ref="funTableComps"
        v-if="isShows"
        vkey="Products_ID"
      >
      </fun-table>
      <div class="myButton">
        <el-button @click="isShows=false" size="small" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getActiveInfo, getCouponLists, getProductList, opActive} from '@/common/fetch'
import {findArrayIdx} from '@/common/utils';

@Component({
  mixins: [],
  components: {}
})

export default class FreeSetting extends Vue {

  status = true
  value2 = ''
  first = ''
  after = ''
  top_free = ''
  miss_free1 = []
  miss_free2 = []
  miss_free3 = []
  descr = ''
  isShow = false
  dataTableOpt = {
    act: '',
    dataList: [],
    page: 1,
    totalCount: 100,
    pageSize: 10,
    is_paginate: true,//是否显示分页 默认显示
    columns: [
      {
        prop: "Coupon_ID",
        label: "优惠券ID",
        align: 'center',
        search: false //不需要搜索ID,所以都不需要了

      }, {
        prop: "Coupon_Subject",
        label: "优惠券名称",
        align: 'center',
        search: false //不需要搜索ID,所以都不需要了

      }
    ]
  }
  selectValue = []
  productData = []
  isShows = false
  dataTableOpts = {
    act: '',
    dataList: [],
    page: 1,
    totalCount: 100,
    pageSize: 10,
    is_paginate: true,//是否显示分页 默认显示
    columns: [
      {
        prop: "Products_ID",
        label: "商品ID",
        align: 'center',
        search: false //不需要搜索ID,所以都不需要了

      }, {
        prop: "Products_Name",
        label: "商品名称",
        value: '',
        align: 'center',
        field: "Products_Name",
        // align: "center",
        // sortable: true,
        //后面这些是filter使用的
        required: true,
        search: {
          type: 'input',
          operate: 'like',
        }
      },
      {
        prop: "Products_PriceX",
        label: "商品价格",
        width: 120,
        align: 'center',
        search: false
      },
      {
        prop: "Products_Sales",
        label: "销量/库存",
        align: 'center',
        width: 150,
        search: false
      }
    ]
  }
  selectValues = []
  productDatas = []
  activeData = {}

  saveActive() {

    if (this.value2.length <= 0) {
      this.$message.error('请选择开始时间和结束时间');
      return
    }
    if (!this.first || !this.after) {
      this.$message.error('请输入免单概率');
      return
    }
    if (!this.top_free) {
      this.$message.error('请输入最高免单金额');
      return
    }
    if (this.productDatas.length <= 0) {
      this.$message.error('请选择免单商品');
      return
    }

    let str = ''
    let com_pid = ''
    let pid = ''
    let arr = []
    let arrs = []
    if (this.selectValue.length > 0) {
      str = this.selectValue.join(',')
    }
    for (let item of this.productDatas) {
      if (item.checked) {
        arr.push(item.Products_ID)
      } else {
        arrs.push(item.Products_ID)
      }
    }
    com_pid = arr.join(',')
    pid = arrs.join(',')


    let data = {
      type: 'freeorder',
      status: this.status ? 1 : 0,
      start_time: this.value2[0],
      end_time: this.value2[1],
      descr: this.descr
    }
    let objData = {
      probability: {
        first: this.first,
        after: this.after
      },
      top_free: this.top_free,
      miss_free: {
        act: this.miss_free1.length > 0 ? 0 : 2,
        value: this.miss_free1.length > 0 ? '' : str
      },
      recommend_prod_id: com_pid,
      prod_id: pid
    }


    data.active_info = JSON.stringify(objData)
    opActive(data).then(res => {
      this.$message({
        message: res.msg,
        type: 'success'
      })
      setTimeout(function () {
        this.init()
      }, 1000)
    }).catch(e => {
      console.log(e, "ss")
    })
  }

  del(idx) {
    this.selectValue = []
    this.productData.splice(idx, 1)
    this.productData.map(item => {
      this.selectValue.push(item.Coupon_ID)
    })
    // setTimeout(()=>{
    //   this.$refs.funTableComp.hasCreated()
    // },50)
  }

  openCoupon() {
    this.isShow = true;
    this.selectValue = []
    this.productData.map(item => {
      this.selectValue.push(item.Coupon_ID)
    })

  }

  closeDialog() {
    this.isShow = false
  }

  //获取选中数据
  selectVal(val, vals) {
    this.selectValue = []
    this.productData = []

    for (let item of val) {
      this.productData.push(item)
      if (this.selectValue.indexOf(item.Coupon_ID) == -1) {
        this.selectValue.push(item.Coupon_ID)
        //this.productData.push(item)
      }
    }
    for (let it of vals) {
      for (let i = 0; i < this.selectValue.length; i++) {
        if (this.selectValue[i] == it.Coupon_ID) {
          this.selectValue.splice(i, 1)
          //this.productData.splice(i,1)
        }
      }
    }

  }

  //重置
  reset() {
    console.log("11111111")
    for (let it in this.dataTableOpt.columns) {
      this.dataTableOpt.columns[it].value = ''
    }
    this.selectValue = []
    this.getProduct()
  }

  //商品选择

  //搜索
  submit() {
    this.getProduct()
  }

  //一页多少行
  handleSizeChange(val) {
    this.dataTableOpt.pageSize = val
    this.getProduct()
  }

  //当前页数
  currentChanges(val) {
    this.dataTableOpt.page = val
    this.getProduct()
  }

  getProduct(item) {
    let data = {
      pageSize: this.dataTableOpt.pageSize,
      page: this.dataTableOpt.page,
      User_ID: '',
      front_show: 2,
      status: 1,
      biz_id: -1
    }

    getCouponLists(data).then(res => {
      if (item == 'init') {
        this.init()
      }
      if (res.errorCode == 0) {
        this.dataTableOpt.dataList = res.data
        this.dataTableOpt.totalCount = res.totalCount
      }
    })
  }

  changeStatus(index) {

    //this.productDatas[index].checked=!this.productDatas[index].checked
    this.$set(this.productDatas[index], 'checked', !this.productDatas[index].checked)
    this.productDatas.push({})
    this.productDatas.pop()

  }

  openPro() {
    this.isShows = true;
    this.selectValues = []
    this.productDatas.map(item => {
      this.selectValues.push(item.Products_ID)
    })

  }

  delPro(idx) {
    this.selectValues = []
    this.productDatas.splice(idx, 1)
    this.productDatas.map(item => {
      this.selectValues.push(item.Products_ID)
    })
  }

  closeDialogs() {
    this.isShows = false
  }

  //获取选中数据
  selectVals(val, vals) {
    this.selectValues = []
    this.productDatas = []

    for (let item of val) {
      this.productDatas.push(item)
      if (this.selectValues.indexOf(item.Products_ID) == -1) {
        this.selectValues.push(item.Products_ID)
        //this.productData.push(item)
      }
    }
    for (let it of vals) {
      for (let i = 0; i < this.selectValues.length; i++) {
        if (this.selectValues[i] == it.Products_ID) {
          this.selectValues.splice(i, 1)
          //this.productData.splice(i,1)
        }
      }
    }
    this.productDatas = this.productDatas.map(item => {
      return {...item, checked: false}
    })


  }

  //重置
  resets() {
    console.log("11111111")
    for (let it in this.dataTableOpts.columns) {
      this.dataTableOpts.columns[it].value = ''
    }
    this.selectValues = []
    this.getProducts()
  }

  //搜索
  submits() {
    this.getProducts()
  }

  //一页多少行
  handleSizeChanges(val) {
    this.dataTableOpts.pageSize = val
    this.getProducts()
  }

  //当前页数
  currentChangess(val) {
    this.dataTableOpts.page = val
    this.getProducts()
  }

  getProducts(item) {
    let nameIdx = findArrayIdx(this.dataTableOpts.columns, {prop: 'Products_Name'})
    let data = {
      pageSize: this.dataTableOpts.pageSize,
      page: this.dataTableOpts.page,
      Products_Name: this.dataTableOpts.columns[nameIdx].value
    }

    getProductList(data).then(res => {
      if (item == 'init') {
        this.init()
      }
      if (res.errorCode == 0) {
        this.dataTableOpts.dataList = res.data
        this.dataTableOpts.totalCount = res.totalCount
      }
    })
  }

  init() {

    getActiveInfo({type: 'freeorder'}).then(res => {
      this.activeData = res.data
      let initData = this.activeData.active_info
      if (initData) {
        this.first = initData.probability.first
        this.after = initData.probability.after
        this.top_free = initData.top_free
        this.descr = this.activeData.descr
        this.status = this.activeData.status == 1 ? true : false

        this.value2 = []
        this.value2[0] = this.format(this.activeData.start_time * 1000)
        this.value2[1] = this.format(this.activeData.end_time * 1000)

        if (initData.miss_free.act == 2) {
          this.miss_free3 = ['2']
          if (initData.miss_free.value.length > 1) {
            this.selectValue = initData.miss_free.value.split(',')
          } else {
            this.selectValue = [Number(initData.miss_free.value)]
          }
          this.productData = []
          for (let item of this.dataTableOpt.dataList) {
            for (let it of this.selectValue) {
              if (item.Coupon_ID == it) {
                this.productData.push(item)
              }
            }
          }

        } else if (initData.miss_free.act == 0) {
          this.miss_free1 = ['0']
        }
      }
      let prod_id = []
      let checkId = []
      if (initData.prod_id != '') {
        let arr = initData.prod_id.split(',')
        for (let item of arr) {
          prod_id.push(item)
        }
      }
      if (initData.recommend_prod_id != '') {
        let arr = initData.recommend_prod_id.split(',')
        checkId = [...arr]
        for (let item of arr) {
          prod_id.push(item)
        }
      }
      console.log(prod_id, "sss")
      this.productDatas = []
      for (let item of this.dataTableOpts.dataList) {
        for (let it of prod_id) {
          if (item.Products_ID == it) {
            item.checked = false
            this.productDatas.push(item)
          }
        }
      }

      for (let item of this.productDatas) {
        for (let it of checkId) {
          if (item.Products_ID == it) {
            item.checked = true
          }
        }
      }


    }).catch(e => {
      this.$notify.error({
        title: '错误',
        message: e.msg
      })
    })
  }

  addTime(m) {
    return m < 10 ? '0' + m : m
  }

  format(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.addTime(m) + '-' + this.addTime(d) + ' ' + this.addTime(h) + ':' + this.addTime(mm) + ':' + this.addTime(s);
  }

  async created() {
    await this.getProduct('init')
    await this.getProducts('init')

  }


}

</script>
<style lang="less" scoped>
  .submit-div {
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.2);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .submit {
    width: 72px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    background: rgba(66, 140, 247, 1);
    border-radius: 5px;
    font-size: 14px;
    color: #FFFFFF;
    cursor: pointer;
  }

  .tui-btn {
    cursor: pointer;
    width: 60px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    color: #FFFFFF;
    background-color: #428CF7;
    margin-left: 48px;
  }

  .disableds {
    background-color: #D3D3D3 !important;
  }

  .del-img {
    position: absolute;
    top: -6px;
    right: -6px;
  }

  .coupons {
    margin-top: 10px;
    padding: 0px 13px;
    background-color: #F8F8F8;
    position: relative;
    width: fit-content;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    display: inline-block;
    margin-right: 20px;
  }

  .give-div {
    width: 566px;
    padding: 4px 20px 24px 20px;
    background-color: #F9F9F9;
    font-size: 12px;
    color: #888888;
  }

  .active {
    background-color: #428CF7 !important;
  }

  .imgs {
    width: 30px;
    height: 30px;
    margin-right: 14px;
  }

  .give-div-item {
    height: 54px;
    border-bottom: 1px dotted rgba(219, 219, 219, 1);
  }

  .free-all {
    background-color: #FFFFFF;
    padding: 20px 0px 40px 20px;
    box-sizing: border-box;
  }

  .free-content {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    padding: 30px;
    box-sizing: border-box;
  }

  .free-top {
    width: 734px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F8F8F8;
    padding: 0px 24px;
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
  }

  .inputs {
    width: 120px;
    height: 40px;
    margin-left: 14px;
    margin-right: 10px;
  }

  .flex {
    display: flex;
  }

  .flex-align-c {
    align-items: center;
  }

  .c8 {
    color: #888888;
  }

  .c6 {
    color: #666666;
  }

  .select {
    font-size: 14px;
    color: #428CF7;
    cursor: pointer;
    margin-left: 22px;
  }

  .myButton {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
</style>
