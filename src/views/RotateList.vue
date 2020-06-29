<template>
  <div class="RotateAll">
    <div class="condition">
      <el-select class="select2" placeholder="请选择活动状态" v-model="state">
        <template v-for="(it,ind) of statuss">
          <el-option
            :label="it"
            :value="ind">
          </el-option>
        </template>
      </el-select>
      <el-input class="input-name" placeholder="请输入活动名称" v-model="active_name"></el-input>
      <el-button @click="searchLists" type="primary">查询</el-button>

      <el-button @click="goRotate" style="margin-left: 300px;width: 150px" type="primary">新增抽奖活动
      </el-button>
    </div>
    <!-- 筛选end -->
    <!-- 列表start -->
    <div class="list">
      <el-table
        :data="scenesList"
        style="width: 80%">
        <el-table-column
          label="序号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          label="活动名称"
          prop="title"
        >
        </el-table-column>
        <el-table-column
          label="活动时间"
          prop="act_time"
          width="300">
        </el-table-column>
        <el-table-column
          label="活动状态"
          prop="status_txt"
          width="145">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          width="145">
        </el-table-column>
        <el-table-column
          label="二维码"
          prop="create_time"
          width="100">
          <template slot-scope="scope">
            <el-image
              :preview-src-list="imgPro"
              :src="scenesList[scope.$index].qrcode"
              @click="changeImg(scenesList[scope.$index].qrcode)"
              style="width: 70px; height: 70px;cursor: pointer">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="handle"
          width="250">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index)" size="small" type="text">查看编辑</el-button>
            <el-button @click="stopScenes(scope.$index)" size="small" type="text"
                       v-if="scenesList[scope.$index].status!=2">终止
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 列表end -->
    <!-- 分页start -->
    <div class="fenye">
      <el-pagination
        :page-size="pageSize"
        :total="totalCount"
        @current-change="currentChange"
        background
        layout="prev, pager, next">
      </el-pagination>
    </div>
    <!-- 分页end -->
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getTurns, stopTurn} from '@/common/fetch';

@Component({
  mixins: [],
  components: {}
})

export default class RotateList extends Vue {

  imgPro = []
  active_name = ''
  statuss = []
  scenesList = [];//列表数据
  totalCount = 0;//数量
  state = '';//活动状态值
  pageSize = 10;
  page = 1;

  changeImg(url) {
    this.imgPro = []
    this.imgPro.push(url)
  }

  goRotate() {
    this.$router.push({
      name: 'Rotate'
    })
  }

  currentChange(val) {
    this.page = val;
    this.searchList();
  }

  //详情
  handleClick(index) {
    let id = this.scenesList[index].id;
    this.$router.push({
      name: 'Rotate',
      query: {
        id: id
      }
    })
  }

  stopScenes(index) {
    let id = this.scenesList[index].id;
    let that = this
    this.$confirm('你确定要终止这个活动吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      stopTurn({id: id}).then(res => {
        if (res.errorCode == 0) {
          this.$message({
            message: '终止成功',
            type: 'success'
          });
          setTimeout(function () {
            that.searchList();
          }, 1000)
        }
      })
    }).catch(() => {

    });

  }

  searchLists() {
    this.page = 1
    this.searchList()
  }

  searchList() {
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      title: this.active_name,
      status: this.state
    }
    getTurns(data).then(res => {
      this.scenesList = res.data;
      this.totalCount = res.totalCount;
      this.statuss = res.statuss
    })
  }

  created() {
    this.searchList()
  }
}

</script>

<style lang="less" scoped>
  html, body {
    height: 100%;
  }

  .page-wrap {
    height: 100%;
    background: #f6f6f6;
    padding: 20px 0 0 20px;
  }

  .tabs {
    width: 1240px;
    display: flex;
    justify-content: space-between;

    .tab {
      position: relative;

      .tab-item {
        position: absolute;
      }

      .item1 {
        top: 70px;
        left: 58px;
      }

      .item2 {
        top: 73px;
        left: 125px;
        font-size: 22px;
        color: #fff;
        font-weight: 700;
      }

      .item3 {
        top: 126px;
        left: 125px;
        width: 90px;
        height: 35px;
        color: #fff;
        line-height: 35px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }

  .condition {
    display: flex;
    align-items: center;
    padding-left: 6px;
    margin-top: 47px;
    margin-bottom: 20px;

    .el-input {
      width: 175px;
      height: 35px !important;
      line-height: 35px !important;
    }

    /deep/ .el-input__inner {
      height: 35px;
      line-height: 35px;
    }

    .input-name {
      margin: 0 20px 0 10px;
    }

    .select2 {
      margin-left: 20px;
    }

    /deep/ .el-button {
      width: 60px;
      height: 30px;
      line-height: 30px;
      padding: 0;
    }
  }

  .list {
    margin-left: 26px;

    /deep/ .el-table {
      .el-table--scrollable-x .el-table__body-wrapper {
        overflow: hidden !important;
      }

      th {
        text-align: center;
        border-bottom: 0;
        border-left: 1px solid #eaeaea;
        border-top: 1px solid #eaeaea;
        background-color: #F9FAFC;
        color: #333;
      }

      & th:nth-last-child(2) {
        border-right: 1px solid #eaeaea;
      }
    }

    /deep/ .el-table {
      td {
        color: #666;
        text-align: center;
        border-left: 1px solid #eaeaea;
        border-top: 1px solid #eaeaea;
        border-bottom: 0;
      }

      & td:last-child {
        border-right: 1px solid #eaeaea;
      }

      .el-table__body {
        border-bottom: 1px solid #eaeaea;
      }
    }

    /deep/ .el-table::before {
      width: 0;
    }
  }

  .fenye {
    margin-top: 48px;
    width: 1240px;
    margin-left: 26px;
    text-align: center;
    padding-bottom: 76px;
  }

</style>
