<template>
  <div class="home-wrap">
    <div class="padding10">
      <el-button size="mini" class="" type="primary" @click="goAdd">新增公告</el-button>
    </div>
    <fun-table
    :isSelect="false"
    :_page="dataTableOpt.page"
    :_pageSize="dataTableOpt.pageSize"
    :_totalCount="dataTableOpt.totalCount"
    :columns="dataTableOpt.columns"
    :dataList="dataTableOpt.dataList"
    :is_paginate="dataTableOpt.is_paginate"
    @handleSizeChange="handleSizeChange"
    @currentChange="currentChange"
    >
      <template slot="created_at-column" slot-scope="props">
        <span>{{props.row.created_at|formatetime}}</span>
      </template>
      <template slot="operate-column" slot-scope="props">
        <div class="flex">
          <el-button size="mini" type="primary" @click="edit(props)" class="m-r-15">查看</el-button>
          <el-button size="mini" type="danger" @click="del(props)" class="">删除</el-button>
        </div>
      </template>
    </fun-table>
<!--    <ul class="message-list" v-infinite-scroll="load" style="overflow:auto">-->
<!--      <li v-for="(row,idx) in messageList" class="message-item">-->
<!--        <span>{{row.title}}</span>-->
<!--        <span>{{row.created_at|formatetime}}</span>-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {delBizMessage, getBizMessageList} from "../common/fetch";
import {Exception} from "../common/Exception";
import {fun} from "../common";


@Component({
  components: {


  }
})
export default class MessageList extends Vue {

  dataTableOpt = {
    act: 'get_self_store_prod',
    dataList: [],
    page: 1,
    totalCount: 100,
    pageSize: 10,
    is_paginate: true,//是否显示分页 默认显示
    columns: [
      {
        prop: "id",
        label: "id",
        align: 'center',
        width: 138,
        // align: "center",
        // sortable: true,
        //后面这些是filter使用的
        search: false //不需要搜索ID,所以都不需要了
      },
      {
        prop: "title",
        label: "名称",
        value: '',
        align: 'center',
        search: false
      },
      {
        prop: "created_at",
        label: "发布时间",
        align: 'center',
        search: false
      },
      {
        prop: "operate",
        label: "操作",
        align: 'center',
        search: false
      }
    ]
  }

  //一页多少行
  handleSizeChange(val) {
    this.dataTableOpt.pageSize = val
    this.getList()
  }

  //当前页数
  currentChange(val) {
    this.dataTableOpt.page = val
    this.getList()
  }
  goAdd(){
    this.$router.push({
      name:'MessageForm'
    })
  }
  edit(props){
    const {id} = props.row
    this.$router.push({
      name:'MessageForm',
      query:{
        id
      }
    })
  }
  del(props){
    const {id,idx} = props.row

    this.$confirm('确认要删除所选记录?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delBizMessage({msg_id:id}).then(res=>{
        this.getList()
      }).catch(err=>{
        fun.error({msg:err.msg})
      })
    }).catch(() => {

    });

  }
  async getList () {

    try {
      const res = await getBizMessageList({page:this.dataTableOpt.page,pageSize:this.dataTableOpt.pageSize}).catch(err=>{ throw Error(err.msg)})
      this.dataTableOpt.dataList = res.data
      this.dataTableOpt.totalCount = res.totalCount

    }catch (e) {
      Exception.handle(e)
    }
  }

  async created() {
    this.getList()
  }

}
</script>
<style lang="scss" scoped>
.message-list{
  padding: 15px;
}
.message-item{
  padding: 10px;
  border-bottom: 1px solid $fun-border-color;
  display: flex;
  justify-content: space-between;
}
</style>
