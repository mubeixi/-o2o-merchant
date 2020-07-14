<template>
  <div class="home-wrap">
    <div style="padding: 20px">
      <!--      get_self_store_prod-->
      <el-tabs @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="出售中" name="1"></el-tab-pane>
        <el-tab-pane label="已售完" name="2"></el-tab-pane>
        <el-tab-pane label="已下架" name="3"></el-tab-pane>
        <el-tab-pane label="待审核" name="4"></el-tab-pane>
        <el-tab-pane label="已驳回" name="5"></el-tab-pane>
      </el-tabs>
      <div class="padding10">
        <!--        <el-button size="mini" class="" type="primary" @click="goProduct">发布商品</el-button>-->
        <el-button @click="batch(4)" class="" size="mini" type="primary">批量设置佣金</el-button>
        <el-button @click="batch(3)" class="" size="mini" type="primary">批量重生二维码</el-button>
        <el-button @click="batch(2)" class="" size="mini" type="primary">批量上架</el-button>
        <el-button @click="batch(1)" class="" size="mini" type="primary">批量下架</el-button>
        <el-button @click="batch(5)" class="" size="mini" type="primary">批量审核</el-button>
        <el-button @click="batch(6)" class="" size="mini" type="primary">批量禁售</el-button>
<!--        <el-button @click="batch(7)" class="" size="mini" type="primary">批量删除</el-button>-->
      </div>
      <fun-table
        :_pageSize="dataTableOpt.pageSize"
        :_totalCount="dataTableOpt.totalCount"
        :act="dataTableOpt.act"
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :formSize="'small'"
        :isRow="true"
        :is_paginate="dataTableOpt.is_paginate"
        @currentChange="currentChange"
        @handleSizeChange="handleSizeChange"
        @reset="reset"
        @selectVal="selectVal"
        @submit="submit"
      >
        <template slot="Products_Name-column" slot-scope="props">
          <div style="display: flex;align-items: center;margin-left: 10px">
            <img :src="props.row.img_url" height="100px" width="90px">
            <span style="margin-left: 10px">{{props.row.Products_Name}}</span>
          </div>
        </template>
        <template slot="Products_Profit-column" slot-scope="props">
          <span @click="dissetting(props.row.Products_ID)" class="spans" style="margin-right: 0px">查看详情</span>
        </template>
        <template slot="Products_Qrcode-column" slot-scope="props">
          <el-image
            :preview-src-list="imgPro"
            :src="props.row.Products_Qrcode"
            @click="changeImg(props.row.Products_Qrcode)"
            style="width: 70px; height: 70px">
          </el-image>
          <!--          <img height="70px" width="70px" :src="props.row.Products_Qrcode">-->
        </template>
        <template slot="attr-column" slot-scope="props">
          <div v-for="(item,index) of props.row.oattrs">
            <el-tag style="width:80px;margin:0 auto;margin-bottom: 5px;display: block;">{{item}}
            </el-tag>
          </div>
        </template>
        <template slot="Products_PriceX-column" slot-scope="props">
          <span>¥ {{props.row.Products_PriceX}}</span>
        </template>

        <template slot="Products_Sales-column" slot-scope="props">
          <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>
        </template>
        <template slot="operate-column" slot-scope="props">
          <span @click="goEdit(props)" class="spans">查看</span>
<!--          <span @click="delProduct(props)" class="spans">删除</span>-->
          <span @click="agreePro(props)" class="spans"
                v-if="Number(activeName)===4||Number(activeName)===5">审核</span>
        </template>
      </fun-table>
    </div>


    <el-dialog :visible.sync="settingShow" title="商品佣金详情">
      <el-table :data="settingData">
        <el-table-column align="center" label="序号" type="index" width="150"></el-table-column>
        <el-table-column align="center" label="级别名称" property="level_name"
                         width="200"></el-table-column>
        <el-table-column align="center" label="佣金明细">
          <template slot-scope="scope">
            <div v-for="(item,index) of settingData[scope.$index].commisions">
              {{item.label}}{{item.value}}(佣金比例的百分比)
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--    <el-dialog-->
    <!--      :visible.sync="centerDialogVisible"-->
    <!--      modal-->
    <!--      close-on-click-modal-->
    <!--      custom-class="dialog"-->
    <!--    >-->
    <!--      <el-carousel :autoplay="false" arrow="always">-->
    <!--        <el-carousel-item v-for="item in data" :key="item">-->
    <!--          <img :src="item">-->
    <!--        </el-carousel-item>-->
    <!--    </el-carousel>-->
    <!--    </el-dialog>-->
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {
  batchSetting,
  bizProdList,
  delProduct,
  getProductCategory,
  getShippingTemplate,
  lookDissetting
} from '@/common/fetch';
import {createTmplArray, findArrayIdx, objTranslate, plainArray} from '@/common/utils';

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

// import Cookies from 'js-cookie';
// const Stores_ID = Cookies.get('Stores_ID')
// const User_ID = Cookies.get('Stores_Bind_User_ID')

@Component({
  mixins: [],
  components: {}
})

export default class ProductList extends Vue {

  imgPro = []
  activeName = '1'
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
        width: 300,
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
        prop: "Products_Profit",
        label: "分销佣金",
        width: 120,
        align: 'center',
        search: false,
        // render:function(h,optScope){
        //     console.log(h,optScope)
        // }
      },
      {
        prop: "Products_PriceX",
        label: "商品价格",
        width: 120,
        align: 'center',
        search: false
      },
      {
        prop: "Products_Qrcode",
        label: "二维码",
        align: 'center',
        width: 150,
        // showIf:(row)=>false,
        search: false
      },
      {
        prop: "express_show",
        label: "物流方式",
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
        prop: "attr",
        label: "特殊属性",
        align: 'center',
        width: 150,
        value: '',
        search: {
          option: '',
          type: 'select',
          operate: 'like',
        }
      },
      {
        prop: "logistics",
        label: "物流方式筛选",
        align: 'center',
        width: 150,
        value: '',
        showIf: (row) => false,
        search: {
          option: '',
          type: 'select',
          operate: 'like',
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
      {
        prop: "operate",
        label: "操作",
        align: 'center',
        width: 150,
        search: false
      }
    ]
  }
  settingShow = false
  settingData = []
  cates = []
  selectValue = []

  changeImg(url) {
    this.imgPro = []
    this.imgPro.push(url)
  }

  handleClick() {
    this.dataTableOpt.page=1
    this.getProduct()
  }

  //重置
  reset() {
    for (let it in this.dataTableOpt.columns) {
      this.dataTableOpt.columns[it].value = ''
    }
    this.getProduct()
  }

  //搜索
  submit() {
    this.getProduct()
  }

  dissetting(id) {
    this.settingShow = true
    lookDissetting({id: id}).then(res => {
      if (res.errorCode == 0) {
        this.settingData = res.data
      }
    })
  }

  goProduct() {
    this.$router.push({
      name: 'product'
    })
  }

  // agreePro(props){
  //   let pid =props.row.Products_ID
  //
  //   let data={
  //     type:5,
  //     ids:JSON.stringify([pid])
  //   }
  //
  //   this.$confirm('此操作将会审核，您确定吗？', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   }).then(() => {
  //     batchSetting(data).then(res=>{
  //       if(res.errorCode==0){
  //         this.$message({
  //           message: res.msg,
  //           type: 'success'
  //         });
  //         this.getProduct()
  //       }
  //     })
  //
  //   }).catch(() => {
  //
  //   });
  // }

  //批量操作type 1:批量下架 2：批量上架 3：批量生成二维码 4：批量设置佣金
  batch(type) {
    let data = {
      type: type,
      ids: JSON.stringify(this.selectValue)
    }
    if (type == 4) {
      this.$confirm('此操作将会按照默认佣金设置对您选择的商品佣金进行重置，您确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetting(data).then(res => {
          if (res.errorCode == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getProduct()
          }
        })

      }).catch(() => {

      });
    } else if (type == 5) {
      this.$confirm('此操作将会审核，您确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetting(data).then(res => {
          if (res.errorCode == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getProduct()
          }
        })

      }).catch(() => {

      });
    } else if (type == 6) {
      this.$confirm('此操作将会禁售，您确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetting(data).then(res => {
          if (res.errorCode == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getProduct()
          }
        })

      }).catch(() => {

      });
    } else if (type == 7) {
      this.$confirm('此操作将会删除，您确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSetting(data).then(res => {
          if (res.errorCode == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getProduct()
          }
        })

      }).catch(() => {

      });
    } else {
      batchSetting(data).then(res => {
        if (res.errorCode == 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getProduct()
        }
      })
    }

  }

  //删除
  delProduct(props) {
    let id = [props.row.Products_ID]
    console.log(id,"sss")
    this.$confirm('你确定要删除这个商品吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      batchSetting({ids: id,type:7}).then(res => {
        if (res.errorCode == 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getProduct();
        }
      })

    }).catch(() => {

    });
  }

  //跳转编辑页面
  goEdit(props) {
    this.$router.push({
      name: 'product',
      query: {
        prod_id: props.row.Products_ID,
        biz_id: props.row.biz_id,
        isLook: 1
      }
    })
  }

  agreePro(props) {
    this.$router.push({
      name: 'product',
      query: {
        prod_id: props.row.Products_ID,
        biz_id: props.row.biz_id
      }
    })
  }

  //获取选中数据
  selectVal(val) {
    this.selectValue = []
    for (let item of val) {
      this.selectValue.push(item.Products_ID)
    }
  }

  //一页多少行
  handleSizeChange(val) {
    this.dataTableOpt.pageSize = val
    this.getProduct()
  }

  //当前页数
  currentChange(val) {
    this.dataTableOpt.page = val
    this.getProduct()
  }

  getProduct() {
    let nameIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Products_Name'})
    let oattrIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'attr'})
    let cateIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Product_Cate'})

    let oattrIdxs = findArrayIdx(this.dataTableOpt.columns, {prop: 'logistics'})
    let data = {
      pageSize: this.dataTableOpt.pageSize,
      page: this.dataTableOpt.page,
      pro_name: this.dataTableOpt.columns[nameIdx].value,
      sel_oattr: this.dataTableOpt.columns[oattrIdx].value,
      sel_cate: this.dataTableOpt.columns[cateIdx].value,
      shipping_id: this.dataTableOpt.columns[oattrIdxs].value,
      status: this.activeName,
      store_id: ''
    }
    getShippingTemplate().then(res => {
      let datas = res.data
      for (let item of datas) {
        item.label = item.Template_Name
        item.value = item.Template_ID
      }
      datas.push({label: '固定运费', value: '-1'})
      this.dataTableOpt.columns[oattrIdxs].search.option = datas
    })
    bizProdList(data).then(res => {
      if (res.errorCode == 0) {
        this.dataTableOpt.dataList = res.data
        this.dataTableOpt.totalCount = res.totalCount
        this.dataTableOpt.columns[oattrIdx].search.option = res.oattrs
      }
    })
  }

  created() {
    let pro_name = this.$route.query.pro_name
    let activeNames = this.$route.query.status

    let nameIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'Products_Name'})
    let oattrIdx = findArrayIdx(this.dataTableOpt.columns, {prop: 'attr'})
    if (pro_name) {
      this.dataTableOpt.columns[nameIdx].value = pro_name
    }
    if (activeNames) {
      this.activeName = activeNames
    }

    this.getProduct()
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
  .spans {
    color: #428CF7;
    margin-right: 4px;
    cursor: pointer;
  }


</style>
