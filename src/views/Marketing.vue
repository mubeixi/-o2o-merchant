<template>
	<div class="page-wrap">
		<div class="content">
			<div class="tabs">
				<div class="tab">
					<div class="tab-item item1">
						<img alt="" src="../assets/img/marketing/v.png">
					</div>
					<div class="tab-item item2">
						会员日营销
					</div>
					<div @click="vipAdd" class="tab-item item3">
						立即新建
					</div>
					<img alt="" src="../assets/img/marketing/bg1.png">
				</div>
				<div class="tab">
					<div class="tab-item item1">
						<img alt="" src="../assets/img/marketing/s.png">
					</div>
					<div class="tab-item item2">
						生日营销
					</div>
					<div @click="birthdayAdd" class="tab-item item3">
						立即新建
					</div>
					<img alt="" src="../assets/img/marketing/bg2.png">
				</div>
				<div class="tab">
					<div class="tab-item item1">
						<img alt="" src="../assets/img/marketing/j.png">
					</div>
					<div class="tab-item item2">
						节日营销
					</div>
					<div @click="festivalAdd" class="tab-item item3">
						立即新建
					</div>
					<img alt="" src="../assets/img/marketing/bg3.png">
				</div>
			</div>
			<!--             筛选start-->
			<div class="condition">
				<el-select placeholder="请选择活动类型" v-model="typeValue">
					<template v-for="(item,index) in types">
						<el-option
						:label="item"
						:value="index">
						</el-option>
					</template>
				</el-select>
				<el-select class="select2" placeholder="请选择活动状态" v-model="state">
					<template v-for="(it,ind) in statuss">
						<el-option
						:label="it"
						:value="ind">
						</el-option>
					</template>
				</el-select>
				<el-input class="input-name" placeholder="请输入活动名称" v-model="active_name"></el-input>
				<el-button @click="searchList" type="primary">查询</el-button>
			</div>
			<!-- 筛选end -->
			<!-- 列表start -->
			<div class="list">
				<el-table
				:data="scenesList"
				style="width: 100%">
					<el-table-column
					label="活动名称"
					prop="name"
					width="239">
					</el-table-column>
					<el-table-column
					label="活动类型"
					prop="type_txt"
					width="187">
					</el-table-column>
					<el-table-column
					label="活动时间"
					prop="act_time"
					width="300">
					</el-table-column>
					<el-table-column
					label="会员范围"
					prop="rights"
					width="191">
					</el-table-column>
					<el-table-column
					label="状态"
					prop="status_txt"
					width="145">
					</el-table-column>
					<el-table-column
					label="操作"
					prop="handle"
					width="254">
						<template slot-scope="scope">
							<el-button @click="handleClick(scope.$index)" size="small" type="text">详情</el-button>
							<el-button @click="editScenes(scenesList[scope.$index].id,scenesList[scope.$index].type)" size="small"
							           type="text"
							           v-if="scenesList[scope.$index].status==0">
								编辑
							</el-button>
							<!--                            <el-button type="text" size="small">删除</el-button>-->
							<el-button @click="stopScenes(scenesList[scope.$index].id)" size="small" type="text"
							           v-if="scenesList[scope.$index].status<2">终止
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
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {getScenes, initScenes, stopScene} from '@/common/fetch'

@Component
export default class Marketing extends Vue {
  active_name = ''

  scenesList = []//列表数据
  totalCount = 0//数量
  statuss = {}//活动状态列表
  state = ''//活动状态值
  types = {}//活动类型列表
  typeValue = ''//活动列表值
  pageSize = 10
  page = 1
  init = {}//初始化 生日营销节日营销

  //跳转编辑页面
  editScenes(index, type) {
    this.$router.push({
      name: 'DayMark',
      query: {
        id: index,
        type: type
      }
    })
  }

  //会员日新建营销
  vipAdd() {
    if (this.init.btn1.status == 1) {
      this.$router.push({
        name: 'DayMark',
        query: {
          type: '1'
        }
      })
    } else {
      this.$message({
        message: this.init.btn1.tip,
        type: 'warning'
      })
    }
  }

  //生日新建营销
  birthdayAdd() {
    if (this.init.btn2.status == 1) {
      this.$router.push({
        name: 'DayMark',
        query: {
          type: '2'
        }
      })
    } else {
      this.$message({
        message: this.init.btn2.tip,
        type: 'warning'
      })
    }
  }

  //节日新建营销
  festivalAdd() {
    this.$router.push({
      name: 'DayMark',
      query: {
        type: '3'
      }
    })
  }

  currentChange(val) {
    this.page = val
    this.searchList()
  }

  //详情
  handleClick(index) {
    let id = this.scenesList[index].id
    this.$router.push({
      name: 'DayMarkDetail',
      query: {
        id: id
      }
    })
  }

  stopScenes(index) {

    this.$confirm('你确定要终止这个活动吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      stopScene({id: index}).then(res => {
        if (res.errorCode == 0) {
          this.$message({
            message: '终止成功',
            type: 'success'
          })
          this.searchList()
        }
      })

    }).catch(() => {

    })

  }

  searchList() {
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      name: this.active_name,
      status: this.state,
      type: this.typeValue
    }
    getScenes(data).then(res => {
      this.scenesList = res.data
      this.totalCount = res.totalCount
      this.statuss = res.statuss
      this.types = res.types
    })
  }

  initScenes() {
    initScenes().then(res => {
      if (res.errorCode == 0) {
        this.init = res.data
      }
    })
  }

  created() {
    this.searchList()
    this.initScenes()
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

	.content {
		min-width: 1200px;
		height: 100%;
		padding: 15px 0 0 14px;
		background: #fff;

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
			text-align: center;
			padding-bottom: 76px;
		}
	}
</style>
