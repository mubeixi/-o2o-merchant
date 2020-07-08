<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item class="marginLR" label="级别名称：" style="margin-left: 57px">
          <el-input style="width: 350px" v-model="Level_Name"></el-input>
        </el-form-item>

        <el-form-item class="marginLR" label="级别描述：" style="margin-left: 57px">
          <el-input
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="请输入内容"
            resize="none"
            style="width: 480px"
            type="textarea"
            v-model="Level_Description">
          </el-input>
        </el-form-item>

        <el-form-item class="marginLR labelCenter" label="级别标识：" style="margin-left: 57px">
          <div class="divFlex">
            <upload-components
              :limit="1"
              :onSuccess="upThumbSuccessCall"
              ref="thumb"
              size="mini"
              tip="上传标识图片"
            />
            <div class="labelDiv">
              图片建议尺寸：30*30像素
            </div>
          </div>
        </el-form-item>

        <el-form-item class="marginLR labelCenter" label="级别背景：" style="margin-left: 57px">
          <div class="divFlex">
            <upload-components
              :limit="1"
              :onSuccess="upThumbSuccess"
              ref="thumbs"
              size="mini"
              tip="上传级别背景图片"
            />
            <div class="labelDiv">
              图片建议尺寸：665x325像素
            </div>
          </div>
        </el-form-item>

        <el-form-item class="marginLRS divFlex" label="佣金人数限制：">
          <div class="divFlex">
            <div class="marginRight" v-if="level>=1">
              一级
              <el-input class="inputMargin" v-model="Level_PeopleLimit[0]"></el-input>
              个
            </div>
            <div class="marginRight" v-if="level>=2">
              二级
              <el-input class="inputMargin" v-model="Level_PeopleLimit[1]"></el-input>
              个
            </div>
            <div class="marginRight" v-if="level>=3">
              三级
              <el-input class="inputMargin" v-model="Level_PeopleLimit[2]"></el-input>
              个
            </div>
          </div>
          <div class="fontSize">
            注：此级别的分销商获得佣金的人数限制。如：一级 3、二级 -1、三级 -1，说明此级别分销商只能获得3个下属的一级佣金，不能获得二级、三级佣金；
            0表示不限制，-1 表示禁止获得此级别佣金。此设置对于发展下级会员人数不起作用
          </div>
        </el-form-item>


        <el-form-item class="marginLRS divFlex" label="达标方式选择：">
          <el-radio-group v-model="arrive_limit">
            <el-radio label="3">满足任一条件</el-radio>
            <el-radio label="4">满足全部条件</el-radio>
            <el-radio label="1">不限制</el-radio>
            <el-radio label="2">手动申请</el-radio>
          </el-radio-group>
          <block v-if="arrive_limit==3||arrive_limit==4">
            <div class="myCenter">
              <!--     消费额       -->
              <el-checkbox-group :disabled="direct_buy.checked" v-model="pay_money.checked">
                <el-checkbox label="lastTime" name="lastTime">消费额</el-checkbox>
              </el-checkbox-group>
              <div class="first">
                <el-form-item class="divFlex" label="消费类型：">
                  <el-radio-group :disabled="!pay_money.checked||direct_buy.checked"
                                  v-model="pay_money.value.type">
                    <el-radio label="1">商城总消费</el-radio>
                    <el-radio label="2">一次性消费</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="divFlex" label="消费金额：">
                  <el-input :disabled="!pay_money.checked||direct_buy.checked"
                            class="widthInput"
                            v-model="pay_money.value.money"></el-input>
                  元 <span class="spans">（注：用户需消费此额度才能成为该级别分销商）</span>
                </el-form-item>
                <el-form-item class="divFlex" label="生效状态：">
                  <el-radio-group :disabled="!pay_money.checked||direct_buy.checked"
                                  v-model="pay_money.value.arrive_status">
                    <el-radio label="2">订单付款后计入</el-radio>
                    <el-radio label="4">订单确认收货后计入</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <!--     购买礼包       -->
              <el-checkbox-group :disabled="direct_buy.checked" v-model="buy_prod.checked">
                <el-checkbox label="lastTime" name="lastTime">购买礼包</el-checkbox>
                <el-radio-group :disabled="!buy_prod.checked||direct_buy.checked" class="productRadio"
                                v-model="buy_prod.value.type">
                  <el-radio label="1">任意商品</el-radio>
                  <el-radio label="2">特定商品</el-radio>
                </el-radio-group>
                <span @click="showSetting" class="selects"
                      v-if="buy_prod.value.type=='2'&&buy_prod.checked">选择商品</span>
              </el-checkbox-group>
              <div class="first second" v-if="buy_prod.checked">
                <block v-if="buy_prod.value.type=='2'">
                  <div class="listLine" v-for="(item,index) of productData">
                    <img :src="item.img_url||item.ImgPath" class="lineImg">
                    <div class="lineDiv">{{item.Products_Name}}</div>
                  </div>
                </block>
                <el-form-item class="divFlex" label="生效状态："
                              style="margin-top: 10px;margin-bottom: 0px;">
                  <el-radio-group :disabled="!buy_prod.checked||direct_buy.checked"
                                  v-model="buy_prod.value.arrive_status">
                    <el-radio label="2">订单付款后计入</el-radio>
                    <el-radio label="4">订单确认收货后计入</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>


              <!--    购买商品次数      -->
              <el-checkbox-group :disabled="direct_buy.checked" class="marginBo"
                                 v-model="buy_times.checked">
                <el-checkbox label="lastTime" name="lastTime">购买商品次数</el-checkbox>
                <el-input :disabled="!buy_times.checked" class="inputMy"
                          v-model="buy_times.value"></el-input>
                <span class="oneFont">次</span>
              </el-checkbox-group>
              <!--    团队销售额      -->
              <el-checkbox-group :disabled="direct_buy.checked" class="marginBo"
                                 v-model="team_sales.checked">
                <el-checkbox label="lastTime" name="lastTime">团队销售额</el-checkbox>
                <el-input :disabled="!team_sales.checked" class="inputMy" style="margin-left: 38px"
                          v-model="team_sales.value"></el-input>
                <span class="oneFont">元</span>
              </el-checkbox-group>
              <!--    直接购买身份      -->
              <el-checkbox-group class="marginBo inputMyDa" v-model="direct_buy.checked">
                <el-checkbox label="lastTime" name="lastTime">直接购买身份</el-checkbox>
                <el-select :disabled="!direct_buy.checked" lass="inputMy"
                           style="margin-left: 24px;width: 140px" v-model="direct_buy.value.type">
                  <el-option label="直接购买" value="1"></el-option>
                  <el-option label="送产品" value="2"></el-option>
                  <el-option label="存入余额" value="3"></el-option>
                </el-select>
                <block>
                  <el-input :disabled="!direct_buy.checked" class="inputMy inputT"
                            placeholder="级别金额" v-model="direct_buy.value.money"></el-input>
                  <span class="oneFont">元</span>
                </block>
                <block v-if="direct_buy.value.type==3">
                  <el-input :disabled="!direct_buy.checked" class="inputMy inputT"
                            placeholder="赠送金额" v-model="direct_buy.value.present"></el-input>
                  <span class="oneFont">元</span>
                </block>
                <block v-if="direct_buy.value.type==2">
                  <span @click="selectGi" class="selects">选择赠品</span>
                  <el-tooltip :content="text" effect="light" placement="top">
                    <div
                      style="display:inline-block;height: 20px;line-height: 20px;font-size: 14px">
                      <div class="lst" style="display: block" v-if="text">{{text}}</div>
                    </div>
                  </el-tooltip>
                </block>
              </el-checkbox-group>
              <!--    直邀等级数量      -->
              <el-checkbox-group :disabled="direct_buy.checked" class="marginBo"
                                 style="display: flex" v-model="direct_sons.checked">
                <el-checkbox label="lastTime" name="lastTime">直邀等级数量</el-checkbox>
                <div>
                  <div style="margin-bottom: 10px" v-for="(item,index) of direct_sons.value">
                    <el-input :disabled="!direct_sons.checked" class="inputMy inputT"
                              v-model="item.count"></el-input>
                    <span class="oneFont">人</span>
                    <el-select :disabled="!direct_sons.checked" lass="inputMy"
                               placeholder="请选择分销等级"
                               style="margin-left: 24px;width: 140px" v-model="item.level_id">
                      <block :key="md" v-for="(mb,md) of disList">
                        <el-option :label="mb.Level_Name" :value="mb.Level_ID"></el-option>
                      </block>
                    </el-select>
                    <span @click="addDirect" class="addSpan" v-if="index==0">添加</span>
                    <span @click="delDirect(index)" class="addSpan" v-else>删除</span>
                  </div>
                </div>
              </el-checkbox-group>
              <!--    团队等级数量      -->
              <el-checkbox-group :disabled="direct_buy.checked" class="marginBo" style="display: flex"
                                 v-model="team_sons.checked">
                <el-checkbox label="lastTime" name="lastTime">团队等级数量</el-checkbox>
                <div>
                  <div style="margin-bottom: 10px" v-for="(it,ind) of team_sons.value">
                    <el-input :disabled="!team_sons.checked" class="inputMy inputT"
                              v-model="it.count"></el-input>
                    <span class="oneFont">人</span>
                    <el-select :disabled="!team_sons.checked" lass="inputMy" placeholder="请选择等级"
                               style="margin-left: 24px;width: 140px" v-model="it.level_id">
                      <block :key="md" v-for="(mb,md) of disList">
                        <el-option :label="mb.Level_Name" :value="mb.Level_ID"></el-option>
                      </block>
                    </el-select>
                    <span @click="addTeam" class="addSpan" v-if="ind==0">添加</span>
                    <span @click="delTeam(ind)" class="addSpan" v-else>删除</span>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
          </block>

          <block v-if="arrive_limit==2">
            <div class="amu">
              <div class="th">
                <div class="td">字段类型</div>
                <div class="td">字段名称</div>
                <div class="td">初始内容</div>
                <div class="td" style="width: 125px">操作</div>
              </div>
              <div class="tr" v-for="(item,index) of manual_rules">
                <div class="td">
                  <el-select class="widthmbx" v-model="item.type">
                    <el-option label="文本框" value="input"></el-option>
                    <el-option label="选择框" value="select"></el-option>
                    <el-option label="地区选择" value="address"></el-option>
                  </el-select>
                </div>
                <div class="td">
                  <el-input class="widthmbx" maxlength="10" v-model="item.name"></el-input>
                </div>
                <div class="td">
                  <el-input :disabled="item.type=='address'" class="widthmbx" maxlength="10"
                            placeholder="多个值以|分隔" v-model="item.place"></el-input>
                </div>
                <div class="td" style="width: 125px">
                  <img @click="delManual(index)" src="@/assets/img/mydel.png"
                       style="cursor:pointer;">
                </div>
              </div>
              <el-button @click="addManual" style="margin-top: 20px" type="primary">增加</el-button>
            </div>
          </block>
        </el-form-item>

        <el-form-item class="marginLRS divFlex" label="佣金发放限制："
                      v-if="direct_buy.checked&&(arrive_limit==3||arrive_limit==4)">
          <div class="divFlex">
            <div class="marginRight" v-if="level>=1">
              一级
              <el-input class="inputMargin" v-model="commi_rules[0]"></el-input>
              元
            </div>
            <div class="marginRight" v-if="level>=2">
              二级
              <el-input class="inputMargin" v-model="commi_rules[1]"></el-input>
              元
            </div>
            <div class="marginRight" v-if="level>=3">
              三级
              <el-input class="inputMargin" v-model="commi_rules[2]"></el-input>
              元
            </div>
          </div>
          <div class="fontSize">
            注：会员购买此级别时，其上级获得的佣金
          </div>
        </el-form-item>

        <el-form-item class="submit">
          <el-button @click="backLev" class="close">返回</el-button>
          <el-button :loading="loadingSubmit" @click="saveData" class="submits" type="primary">确定
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="settingShow" class="myProduct" style="height: 900px;overflow: auto" title="选择商品"
               width="80%">
      <fun-table
        :_pageSize="dataTableOpt.pageSize"
        :_totalCount="dataTableOpt.totalCount"
        :act="dataTableOpt.act"
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :formSize="'small'"
        :has="selectValue"
        :isRow="false"
        :is_paginate="dataTableOpt.is_paginate"
        :showSave=true
        @closeDialog="closeDialog"
        @currentChange="currentChanges"
        @handleSizeChange="handleSizeChange"
        @reset="reset"
        @selectVal="selectVal"
        @submit="submit"
        ref="funTableComp"
        vkey="Products_ID"
      >
        <template slot="Products_Name-column" slot-scope="props">
          <div style="display: flex;align-items: center;margin-left: 10px">
            <img :src="props.row.ImgPath" height="100px" width="90px">
            <span style="margin-left: 10px">{{props.row.Products_Name}}</span>
          </div>
        </template>
        <template slot="Products_PriceX-column" slot-scope="props">
          <span>¥ {{props.row.Products_PriceX}}</span>
        </template>
        <template slot="Products_Sales-column" slot-scope="props">
          <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>
        </template>
      </fun-table>
    </el-dialog>

    <el-dialog
      :visible.sync="isShow"
      @close="cardCancel"

      append-to-body
      class="setting"
      title="选择赠品"
      width="60%"
    >
      <div class="cardTitle" style="margin-bottom: 10px">
        <div class="cardTitle" style="margin-right: 10px">
          产品名称：
          <el-input class="sortInput" style="width: 100px" v-model="nameMbx"></el-input>
        </div>
        <el-button @click="searchList" type="primary">搜索</el-button>
      </div>
      <el-table
        :data="GivingGifts"
        @current-change="handleSelectionChange"
        highlight-current-row
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
      >
        <el-table-column
          label="#"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          label="赠品名称"
          prop="gift_name"
          width="120">
        </el-table-column>
        <el-table-column
          label="产品名称"
          prop="Products_Name"
          width="300px"
        >
          <template slot-scope="scope">
            <div class="fixDisplay">
              <div style="width: 100px;height: 100px">
                <img :src="GivingGifts[scope.$index].img_url" style="width: 100%;height: 100%">
              </div>
              <div style="width: 200px;margin-left: 10px;">
                {{GivingGifts[scope.$index].Products_Name}}
              </div>
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="valid_days"-->
        <!--          label="领取有效天数"-->
        <!--          show-overflow-tooltip>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="limit_times"-->
        <!--          label="限制领取次数"-->
        <!--          show-overflow-tooltip>-->
        <!--        </el-table-column>-->
        <el-table-column
          label="剩余库存"
          prop="Products_Count"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        :total="totalCount"
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import UploadComponents from "@/components/comm/UploadComponents.vue";
import {createTmplArray, findArrayIdx, objTranslate, plainArray} from '@/common/utils';
import {
  getGivingGifts,
  getProductCategory, getProductList,
  getProducts,
  systemLevelAdd,
  systemLevelDetail,
  systemLevelEdit,
  systemLevelList
} from '@/common/fetch'

const getParentsCount = (arr, key, pkey, val, tempArr) => {
  var idx = false
  for (var i in arr) {
    let item = arr[i]
    if (item[key] == val[pkey]) {
      idx = i
      break;
    }
  }
  if (idx !== false) {
    tempArr.push(1)
    //循环
    getParentsCount(arr, key, pkey, arr[idx], tempArr)
  }
}
const restArr = (arr, key) => {
  let plainArr = []
  plainArray(arr, key, plainArr)
  for (var i in plainArr) {
    let item = plainArr[i]
    item.parent_count = 0;
    let tempArr = []
    if (item['Category_ParentID']) {
      getParentsCount(plainArr, 'Category_ID', 'Category_ParentID', item, tempArr)
      item.parent_count = objTranslate(tempArr).length
    }
    item.new_name = createTmplArray('　├　', item.parent_count).join('') + item.Category_Name
  }
  return plainArr
}
@Component({
  mixins: [],
  components: {
    UploadComponents
  }
})

export default class DistributorLevel extends Vue {
  //赠品操作
  isShow = false
  nameMbx = '';
  GivingGifts = []
  text = ''
  send_id = ''
  totalCount = 0
  page = 1
  pageSize = 8
  settingShow = false
  cate = []
  dataTableOpt = {
    act: 'get_self_store_prod',
    dataList: [],
    page: 1,
    totalCount: 100,
    pageSize: 10,
    is_paginate: true,//是否显示分页 默认显示
    columns: [
      {
        prop: "Products_ID",
        label: "产品ID",
        align: 'center',
        width: 138,
        // align: "center",
        // sortable: true,
        //后面这些是filter使用的
        search: false //不需要搜索ID,所以都不需要了
      },
      {
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
        prop: "Product_Cate",
        label: "商品分类",
        align: 'center',
        showIf: (row) => false,
        value: '',
        search: {
          type: 'select',
          operate: 'like',
          option: []
        }
      },
      {
        prop: "Products_CreateTime",
        label: "发布时间",
        align: 'center',
        width: 150,
        search: false
      },
      {
        prop: "Products_Sales",
        label: "销量/库存",
        align: 'center',
        width: 150,
        search: false
      },
    ]
  }
  selectValue = []
  productData = []

  //赠品结束
  Level_Name = ''//级别名称
  Level_Description = ''//等级描述
  Level_Icon = ''//级别标识
  Level_BackImg = ''//背景图
  level = 3 //级别等级
  //佣金人数限制
  Level_PeopleLimit = ['', '', '']
  //发放佣金设置
  commi_rules = ['', '', '']
  arrive_limit = '3' //达标方式
  //消费额
  pay_money = {
    checked: false,
    value: {
      type: '1',
      arrive_status: '2',
      money: ''
    }
  }
  //直接购买
  direct_buy = {
    checked: false,
    value: {
      type: '1',
      money: '',
      present: '',
      gift_id: ''
    }
  }
  //购买商品
  buy_prod = {
    checked: false,
    value: {
      type: '1',
      prod: '',
      arrive_status: '2'
    }
  }
  //购买商品次数
  buy_times = {
    checked: false,
    value: ''
  }
  //团队销售额
  team_sales = {
    checked: false,
    value: ''
  }
  //直接邀请
  direct_sons = {
    checked: false,
    value: [
      {
        level_id: '',
        count: ''
      }
    ]
  }
  //团队等级数量
  team_sons = {
    checked: false,
    value: [
      {
        level_id: '',
        count: ''
      }
    ]
  }
  //手动申请
  manual_rules = [
    {type: "input", name: "", place: ""}
  ]
  loadingSubmit = false
  disList = []
  LevelID = ''

  currentChange(val) {
    this.page = val;
    this.searchList()
  }

  //取消
  cardCancel() {
    this.isShow = false
  }

  selectGi() {
    this.searchList();
    this.isShow = true;
  }

  searchList() {
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      pro_name: this.nameMbx
    }
    getGivingGifts(data).then(res => {
      if (res.errorCode == 0) {
        this.GivingGifts = res.data;
      }
    })
  }

  handleSelectionChange(val) {
    if (val) {
      console.log(val.Products_Name, "sss")
      this.isShow = false
      this.text = val.Products_Name
      this.send_id = val.id
      this.direct_buy.value.gift_id = val.id
      this.$refs.multipleTable.setCurrentRow();
    }
  }

  closeDialog() {
    this.settingShow = false
  }

  backLev() {
    window.location.href = window.parent.location.origin + '/member/distribute/level.php?level=' + this.level
  }

  //获取选中数据
  selectVal(val, vals) {
    console.log(val, vals, "sssss")
    this.selectValue = []
    this.productData = []

    for (let item of val) {
      this.productData.push(item)
      if (this.selectValue.indexOf(item.Products_ID) == -1) {
        this.selectValue.push(item.Products_ID)
        //this.productData.push(item)
      }
    }
    for (let it of vals) {
      for (let i = 0; i < this.selectValue.length; i++) {
        if (this.selectValue[i] == it.Products_ID) {
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

  getProduct() {
    let nameIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Products_Name'})
    let oattrIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'attr'})
    let cateIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Product_Cate'})
    let data = {
      pageSize: this.dataTableOpt.pageSize,
      page: this.dataTableOpt.page,
      Products_Name: this.dataTableOpt.columns[nameIdx].value,
      Cate_ID: this.dataTableOpt.columns[cateIdx].value,
      store_id: ''
    }

    getProductList(data).then(res => {
      if (res.errorCode == 0) {
        this.dataTableOpt.dataList = res.data
        this.dataTableOpt.totalCount = res.totalCount
      }
    })
  }

  showSetting() {
    this.getProduct()
    this.settingShow = true
  }

  //添加手动申请
  addManual() {
    this.manual_rules.push({type: "input", name: "", place: ""})
  }

  //删除某条
  delManual(index) {
    if (this.manual_rules.length <= 1) return
    this.manual_rules.splice(index, 1)
  }

  //添加直接邀请
  addDirect() {
    if (!this.direct_sons.checked) return
    this.direct_sons.value.push({level_id: '', count: ''})
  }

  delDirect(index) {
    this.direct_sons.value.splice(index, 1);
  }

  //团队等级数量
  addTeam() {
    if (!this.team_sons.checked) return
    this.team_sons.value.push({level_id: '', count: ''})
  }

  delTeam(index) {
    this.team_sons.value.splice(index, 1);
  }

  upThumbSuccessCall(url_list) {
    if (url_list.length > 0) {
      this.Level_Icon = url_list[0].url
      return
    }
    this.Level_Icon = ''
  }

  upThumbSuccess(url_list) {
    if (url_list.length > 0) {
      this.Level_BackImg = url_list[0].url
      return
    }
    this.Level_BackImg = ''

  }

  saveData() {
    if (this.loadingSubmit) return
    this.loadingSubmit = true

    if (!this.Level_Name) {
      this.$notify.error({
        title: '错误',
        message: '请填写分销商名称'
      });
      this.loadingSubmit = false
      return;
    }
    let info = {
      Level_Name: this.Level_Name,
      Level_Icon: this.Level_Icon,
      Level_BackImg: this.Level_BackImg,
      arrive_limit: this.arrive_limit,
      Level_Description: this.Level_Description
    }
    info.Level_PeopleLimit = {}
    if (this.direct_buy.checked) {
      info.commi_rules = {}
    }
    for (let i = 0; i < this.level; i++) {
      info.Level_PeopleLimit[i + 1] = this.Level_PeopleLimit[i]
      if (this.direct_buy.checked) {
        info.commi_rules[i + 1] = this.commi_rules[i]
      }
    }
    if (this.direct_buy.checked) {
      info.commi_rules = JSON.stringify(info.commi_rules)
    }
    info.Level_PeopleLimit = JSON.stringify(info.Level_PeopleLimit)
    if (this.arrive_limit == '3' || this.arrive_limit == '4') {
      info.level_rules = {
        pay_money: {...this.pay_money},
        direct_buy: {...this.direct_buy},
        buy_prod: {...this.buy_prod},
        buy_times: {...this.buy_times},
        team_sales: {...this.team_sales},
        direct_sons: {...this.direct_sons},
        team_sons: {...this.team_sons}
      }
      if (info.level_rules.buy_prod.value.type == 1) {
        info.level_rules.buy_prod.value.prod = 0
      } else {
        let str = ''
        for (let item of this.selectValue) {
          str += item + ','
        }
        str = str.slice(0, str.length - 1)
        info.level_rules.buy_prod.value.prod = str
      }
      for (let my in info.level_rules) {
        info.level_rules[my].checked = info.level_rules[my].checked ? '1' : '0'
      }
      // console.log(info.level_rules,"sss")
      // return
      info.level_rules = JSON.stringify(info.level_rules)
    }
    if (this.arrive_limit == '2') {
      info.manual_rules = JSON.stringify(this.manual_rules)
    }

    let that = this


    if (this.LevelID) {
      info.level_id = this.LevelID

      systemLevelEdit(info).then(res => {
        // this.$message({
        //     message: res.msg,
        //     type: 'success'
        // });
        this.loadingSubmit = false
        window.location.href = window.parent.location.origin + '/member/distribute/level.php?level=' + that.level
        // setTimeout(function () {
        //     window.location.href=window.parent.location.origin+'/member/distribute/level.php?level='+that.level
        // },1000)
      }).catch(e => {
        this.loadingSubmit = false
      })
    } else {
      systemLevelAdd(info).then(res => {
        // this.$message({
        //     message: res.msg,
        //     type: 'success'
        // });
        this.loadingSubmit = false
        window.location.href = window.parent.location.origin + '/member/distribute/level.php?level=' + that.level
        // setTimeout(function () {
        //     window.location.href=window.parent.location.origin+'/member/distribute/level.php?level='+that.level
        // },1000)
      }).catch(e => {
        this.loadingSubmit = false
      })
    }
    this.isLoading = false
  }

  async created() {

    if (this.$route.query.level) {
      this.level = this.$route.query.level
    }
    this.LevelID = this.$route.query.LevelID
    if (this.LevelID) {
      systemLevelDetail({level_id: this.LevelID}).then(res => {
        let dataList = res.data
        if (res.errorCode == 0) {
          this.Level_Name = dataList.Level_Name
          this.Level_Description = dataList.Level_Description
          this.arrive_limit = dataList.arrive_limit
          //缩略图
          //@ts-ignore
          this.Level_Icon = dataList.Level_Icon
          //组件里面初始化
          if (this.Level_Icon) {
            //@ts-ignore
            this.$refs.thumb.handleInitHas([this.Level_Icon])
          }

          //缩略图
          //@ts-ignore
          this.Level_BackImg = dataList.Level_BackImg
          //组件里面初始化
          if (this.Level_BackImg) {
            //@ts-ignore
            this.$refs.thumbs.handleInitHas([this.Level_BackImg])
          }


          this.Level_PeopleLimit = []
          this.commi_rules = []
          for (let it in dataList.Level_PeopleLimit) {
            this.Level_PeopleLimit.push(dataList.Level_PeopleLimit[it])
          }
          for (let it in dataList.commi_rules) {
            this.commi_rules.push(dataList.commi_rules[it])
          }
          for (let item in dataList.level_rules_edit) {
            dataList.level_rules_edit[item].checked = dataList.level_rules_edit[item].checked == 1 ? true : false
          }

          this.pay_money = dataList.level_rules_edit['pay_money']
          this.direct_buy = dataList.level_rules_edit['direct_buy']
          this.buy_prod = dataList.level_rules_edit['buy_prod']
          this.buy_times = dataList.level_rules_edit['buy_times']
          this.team_sales = dataList.level_rules_edit['team_sales']
          this.direct_sons = dataList.level_rules_edit['direct_sons']
          this.team_sons = dataList.level_rules_edit['team_sons']

          if (this.buy_prod.checked && this.buy_prod.value.type == '2') {
            for (let item of this.buy_prod.data) {
              this.selectValue.push(item.Products_ID)
            }
          }

          if (this.direct_sons.value.length <= 0) {
            this.direct_sons.value = [{
              level_id: '',
              count: ''
            }]
          }
          if (this.team_sons.value.length <= 0) {
            this.team_sons.value = [{
              level_id: '',
              count: ''
            }]
          }

          //手动申请
          if (dataList.manual_rules.length > 0) {
            this.manual_rules = dataList.manual_rules
          }
          //赠品
          if (this.direct_buy.checked && this.direct_buy.value.type == '2') {
            this.text = this.direct_buy.data.Products_Name
          }

          //选择商品循环出来
          if (this.buy_prod.data.length > 0) {
            this.productData = this.buy_prod.data
            let arr = this.buy_prod.value.prod.split(',')
            this.selectValue = arr
          }

        }

      })
    }
    systemLevelList().then(res => {
      if (res.errorCode == 0) {
        this.disList = res.data
      }
    })
    getProductCategory().then(res => {
      let cates = res.data
      // arr2table(newArr,'Category_ID','Category_ParentID')
      this.cates = restArr(cates, 'child')
      //修改
      let idx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Product_Cate', label: '商品分类'})
      console.log(idx)
      if (idx !== false) {
        this.dataTableOpt.columns[idx].search.option = this.cates.map(item => {
          return {label: item.new_name, value: item.Category_ID}
        })
      }
    })

  }


}

</script>

<style lang="less" scoped>
  .labelMain {
    padding: 20px 0px;

    .marginLR {
      margin-left: 30px;
    }

    .marginLRS {
      margin-left: 30px;
    }
  }

  .inputMyDa /deep/ .el-input__inner {
    padding-left: 10px;
  }

  .divFlex {
    display: flex;
  }

  .labelCenter {
    display: flex;

    .labelDiv {
      font-size: 7px;
      color: #BCBCBC;
      margin-top: 25px;
      margin-left: 12px;
    }
  }

  .labelCenter /deep/ .el-form-item__label {
    margin-top: 25px;
  }

  .marginRight {
    margin-right: 20px;
    font-size: 8px;
    color: #777777;
  }

  .inputMargin {
    margin-left: 10px;
    margin-right: 6px;
    width: 85px;
  }

  .widthInput {
    width: 85px;
  }

  .fontSize {
    color: #BCBCBC;
    font-size: 12px;
    width: 630px;
    margin-top: 10px;
  }

  .myCenter {
    margin-top: 10px;
    background-color: #F8F8F8;
    padding: 11px 152px 21px 17px;

    .first {
      margin-left: 18px;
      margin-bottom: 15px;
      background-color: #ffffff;
      padding: 10px 50px 20px 16px;

      .spans {
        font-size: 12px;
        color: #BCBCBC;
        margin-left: 17px;
      }
    }

    .productRadio {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
    }
  }

  .selects {
    color: #428CF7;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
    display: inline-block;
  }

  .second {
    padding: 5px 22px 12px 16px !important;

    .listLine {
      height: 46px;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #DBDBDB;

      .lineImg {
        width: 30px;
        height: 30px;
      }

      .lineDiv {
        color: #999999;
        font-size: 12px;
        margin-left: 14px;
      }
    }
  }

  .oneFont {
    font-size: 14px;
    margin-left: 8px;
    color: #777777
  }

  .inputMy {
    width: 75px;
    margin-left: 24px
  }

  .inputT {
    margin-left: 20px;

    & /deep/ .el-input__inner {
      padding-right: 0px;
    }
  }

  .marginBo {
    margin-bottom: 20px;
  }

  .addSpan {
    color: #428CF7;
    font-size: 12px;
    margin-left: 12px;
    cursor: pointer;
  }

  .submit {
    margin-left: 380px;
    margin-top: 84px;

    .close {
      margin-right: 20px;
    }
  }

  .amu {
    background-color: #F8F8F8;
    width: 925px;
    padding: 24px 95px 38px 42px;
    box-sizing: border-box;
    border: 1px solid #EEEEEE;
    margin-top: 10px;

    .th {
      background-color: #F2F7FF;
      display: flex;
      align-items: center;
      height: 48px;

      .td {
        text-align: center;
        width: 220px;
        border-right: 1px solid #EEEEEE;

        &:last-child {
          border: 0px;
        }
      }
    }

    .widthmbx {
      width: 120px;
    }

    .tr {
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-top: 1px solid #EEEEEE;

      .td {
        width: 220px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-right: 1px solid #EEEEEE;

        &:last-child {
          border: 0px;
        }
      }
    }
  }

  /*赠品*/
  .cardTitle {
    display: flex;
    align-items: center;
  }

  .current {
    cursor: pointer;
    color: #79B0FF;
    margin-left: 10px;
  }

  .fixDisplay {
    display: flex;
    align-items: center;
  }

  .lst {
    margin-left: 10px;
    width: 100px;
    overflow: hidden;
    height: 17px;
    line-height: 23px;
    display: inline-block;
  }

  /deep/ .el-table__row {
    cursor: pointer;
  }

  .myProduct /deep/ .el-dialog {
    height: 600px;
    overflow: auto;
  }

</style>
