<template>
	<div class="RotateAll">
		<el-form size="small">
			<div class="rotateName line15">
				<el-form-item label="活动名称：">
					<el-input :disabled="!editCan" style="width: 350px" v-model="title"></el-input>
				</el-form-item>
			</div>

			<div class="rotateName line15">
				<el-form-item label="活动时间：">
					<el-date-picker
					:default-time="['12:00:00']"
					:disabled="!editCan"
					align="right"
					end-placeholder="结束日期"
					start-placeholder="开始日期"
					type="datetimerange"
					v-model="dateValue"
					value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
					<span style="color: red;margin-left: 10px">(先选择时间区间，再选取时间点)</span>
				</el-form-item>
			</div>

			<div class="rotateName line15 " style="padding-left: 24px">
				<el-form-item label="每人参与总次数：">
					<el-input :disabled="!editCan" style="width: 75px" v-model="total_count"></el-input>
					<span class="paddingL10">次</span>
				</el-form-item>
			</div>
			<div class="rotateName line15 paddingL10">
				<el-form-item label="每人每天参与总次数：">
					<el-input :disabled="!editCan" style="width: 75px" v-model="day_count"></el-input>
					<span class="paddingL10">次</span>
				</el-form-item>
			</div>

			<div class="rotateLast line10">
				<div :key="index" class="rotateList line10" v-for="(item,index) of rotateList">
					<div class="rotateDiv">
						<el-form-item label="奖品设置：">
							<el-select :disabled="!editCan" @change="changeSelect(index)" placeholder="请选择奖品"
							           style="width: 130px" v-model="item.type">
								<!--                    <el-option label="赠品" value="gift"></el-option>-->
								<template v-if="active_for=='user'">
                  <el-option label="优惠券" value="coupon"></el-option>
                  <el-option label="积分" value="score"></el-option>
                </template>
                <template v-else>
                  <el-option label="激活码" value="active_code"></el-option>
                </template>
							</el-select>
              <template v-if="item.type==='active_code'">
                <el-input :disabled="!editCan" placeholder="请输入激活码天数" style="width: 140px;margin-left: 15px"
                          v-model="item.value"></el-input>
              </template>
							<template v-if="item.type==='score'">
								<el-input :disabled="!editCan" placeholder="请输入积分数量" style="width: 130px;margin-left: 15px"
								          v-model="item.value"></el-input>
							</template>
							<template v-if="item.type==='gift'">
								<span @click="selectGi(index)" class="spans">选择赠品</span>
							</template>
							<template v-if="item.type==='coupon'">
								<span @click="selectGis(index)" class="spans">选择优惠券</span>
							</template>
						</el-form-item>
						<div class="first second" v-if="item.type==='gift'">
							<div class="listLine" v-if="item.pname||item.lose_txt">
								<img :src="item.img_url" class="lineImg">
								<div class="lineDiv" v-if="item.pname">{{item.pname}}</div>
								<div class="lineDiv" style="color: red" v-else>{{item.lose_txt}}</div>
							</div>
						</div>

						<div class="first second" v-if="item.type==='coupon'">
							<div class="listLine" style="height: 37px" v-if="item.cname||item.lose_txt">
								<div class="lineDiv" style="margin-left: 0px" v-if="item.cname">{{item.cname}}</div>
								<div class="lineDiv" style="margin-left: 0px;color: red" v-else>{{item.lose_txt}}
								</div>
							</div>
						</div>
						<el-form-item label="奖品数量：">
							<el-input :disabled="!editCan" style="width: 75px" type="number"
							          v-model="item.count"></el-input>
							<span class="paddingL10">个</span>
						</el-form-item>
						<el-form-item label="奖品概率：">
							<el-input :disabled="!editCan" style="width: 75px" v-model="item.rate"></el-input>
							<span class="paddingL10">%</span>
						</el-form-item>
					</div>
					<div class="rotateImg">
						<img @click="addList" class="imgWidth" src="@/assets/img/rotateAdd.png" v-if="index==0">
						<img @click="delList(index)" class="imgWidth" src="@/assets/img/rotateDel.png" v-else>
					</div>
				</div>

			</div>

			<div class="rotateRule">
				<el-form-item label="活动规则：">
					<el-input :autosize="{ minRows: 5, maxRows: 10}" :disabled="!editCan" resize="none" style="width: 500px"
					          type="textarea" v-model="describe"></el-input>
				</el-form-item>
			</div>

			<div class="bottomFixed">
				<el-button :disabled="!editCan" :loading="isLoadng" @click="saveTurn" size="small"
				           type="primary">保存提交
				</el-button>
				<el-button @click="goBack" size="small">返回</el-button>
			</div>
		</el-form>


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
				>
				</el-table-column>
				<el-table-column
				label="赠品名称"
				prop="gift_name"
				>
				</el-table-column>
				<el-table-column
				label="产品名称"
				prop="Products_Name" width="300px"
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


		<el-dialog
		:visible.sync="isShows"
		@close="cardCancels"
		append-to-body
		class="setting"
		title="选择优惠券(点击即可选中)"
		width="40%"
		>
			<div class="cardTitle" style="margin-bottom: 10px">
				<div class="cardTitle" style="margin-right: 10px">
					优惠券名称：
					<el-input class="sortInput" style="width: 100px" v-model="nameMbxs"></el-input>
				</div>
				<el-button @click="searchLists" type="primary">搜索</el-button>
			</div>
			<el-table
			:data="GivingGiftss"
			@current-change="handleSelectionChanges"
			highlight-current-row
			ref="multipleTables"
			style="width: 100%"
			tooltip-effect="dark"
			>
				<el-table-column
				label="#"
				type="index"
				>
				</el-table-column>
				<el-table-column
				label="优惠券ID"
				prop="Coupon_ID"
				>
				</el-table-column>
				<el-table-column
				label="优惠券名称"
				prop="Coupon_Subject"
				>
				</el-table-column>
			</el-table>
			<el-pagination
			:page-size="pageSizes"
			:total="totalCounts"
			@current-change="currentChanges"
			background
			layout="prev, pager, next"
			style="margin-top: 20px;text-align: center;">
			</el-pagination>
		</el-dialog>


	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {addTurn, getCouponLists, getGivingGifts, getTurn} from '@/common/fetch'

@Component({
  mixins: [],
  components: {}
})

export default class Rotate extends Vue {
  //静态页面使用
  title = ''
  total_count = ''
  day_count = ''
  dateValue = []
  describe = '1、抽中积分，将直接赠送到您的积分账户，可在个人中心>积分中查看。\n' +
    // '2、抽中赠品，请点击个人中心>赠品中心进行领取\n' +
    '2、抽中优惠券，将直接赠送到您的优惠券账户，可在个人中心>优惠券查看，也可直接购买商品抵扣\n'//活动描述

  rotateList = [{
    type: 'score',
    value: '',
    count: '',
    rate: ''
  }]
  rotateIndex = 0 //当前点击的是
  //赠品操作
  isShow = false
  nameMbx = ''
  GivingGifts = []
  totalCount = 0
  page = 1
  pageSize = 8
  //优惠券操作
  isShows = false
  nameMbxs = ''
  GivingGiftss = []
  totalCounts = 0
  pages = 1
  pageSizes = 8

  //赠品结束
  isLoadng = false
  editCan = true

  changeSelect(index) {
    for (let it in this.rotateList[index]) {
      if (it == 'type') continue
      this.rotateList[index][it] = ''

    }
  }

  currentChange(val) {
    this.page = val
    this.searchList()
  }

  //取消
  cardCancel() {
    this.isShow = false
  }

  selectGi(index) {
    if (!this.editCan) return
    this.rotateIndex = index
    this.searchList()
    this.isShow = true
  }

  searchList() {
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      pro_name: this.nameMbx
    }
    getGivingGifts(data).then(res => {
      if (res.errorCode == 0) {
        this.GivingGifts = res.data
        this.totalCount=res.totalCount
      }
    })
  }

  handleSelectionChange(val) {
    if (val) {
      this.isShow = false
      console.log(val)
      this.rotateList[this.rotateIndex].img_url = val.img_url
      this.rotateList[this.rotateIndex].pname = val.Products_Name
      this.rotateList[this.rotateIndex].value = val.id
      this.$refs.multipleTable.setCurrentRow()
    }
  }

  currentChanges(val) {
    this.pages = val
    this.searchLists()
  }

  //取消
  cardCancels() {
    this.isShows = false
  }

  selectGis(index) {
    if (!this.editCan) return
    this.rotateIndex = index
    this.searchLists()
    this.isShows = true
  }

  //优惠券结束

  searchLists() {
    let data = {
      status: 1,
      page: this.pages,
      pageSize: this.pageSizes,
      cou_name: this.nameMbxs,
      biz_id: -1,
      User_ID: null,//不能传用户id
      front_show: 2
    }
    getCouponLists(data).then(res => {
      this.GivingGiftss = res.data
      this.totalCounts=res.totalCount
    })
  }

  handleSelectionChanges(val) {
    console.log(val)
    // Coupon_Cash: 20
    // Coupon_Condition: 100
    // Coupon_Discount: "0.00"
    // Coupon_EndTime: "2020-07-12 09:47:44"
    // Coupon_ID: 55
    // Coupon_PhotoPath: ""
    // Coupon_StartTime: "2020-07-05 09:47:44"
    // Coupon_Subject: "通用优惠券100-20"
    // Coupon_UseType: 1
    // Coupon_UsedTimes: 1
    // biz_id: 0
    // coupon_prod: "0"
    // front_show: 2
    if (val) {
      this.isShows = false
      this.rotateList[this.rotateIndex].cname = val.Coupon_Subject
      this.rotateList[this.rotateIndex].value = val.Coupon_ID
      this.$refs.multipleTables.setCurrentRow()
    }
  }

  addList() {
    if (!this.editCan) return

    if (this.rotateList.length < 8) {


      if(this.active_for=='biz'){
        this.rotateList.push({
          type: 'active_code',
          value: '',
          count: '',
          rate: ''
        })
      }else{
        this.rotateList.push({
          type: 'score',
          value: '',
          count: '',
          rate: ''
        })
      }

    } else {
      this.$message({
        message: '最多设置8个活动',
        type: 'warning'
      })
    }
  }

  delList(index) {
    if (!this.editCan) return
    this.rotateList.splice(index, 1)
  }

  saveTurn() {
    this.isLoadng = true

    let info = {
      title: this.title,
      describe: this.describe,
      total_count: this.total_count,
      day_count: this.day_count,
      prize_rule: JSON.stringify(this.rotateList),
      active_for:this.$route.query.active_for
    }
    if (this.dateValue.length == 2) {
      info.start_time = this.dateValue[0]
      info.end_time = this.dateValue[1]
    }
    let id = this.$route.query.id
    if (id) {
      info.id = id
    }
    let that = this
    addTurn(info).then(res => {
      if (res.errorCode == 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        setTimeout(function () {
          that.$router.push({
            name: 'RotateList',
            query: {
              active_for:this.$route.query.active_for
            }
          })
        }, 1000)
      }

    }).catch(e => {
      this.isLoadng = false
    })

  }

  goBack() {
    this.$router.push({
      name: 'RotateList',
      query: {
        active_for:this.$route.query.active_for
      }
    })
  }
  active_for=''
  created() {
    this.active_for=this.$route.query.active_for
    if(this.active_for=='biz'){
      this.rotateList = [{
        type: 'active_code',
        value: '',
        count: '',
        rate: ''
      }]
    }

    let id = this.$route.query.id
    if (id) {
      getTurn({id: id}).then(res => {
        if (res.errorCode == 0) {
          console.log(res, "ss")
          this.day_count = res.data.day_count
          this.total_count = res.data.total_count
          this.title = res.data.title
          this.dateValue.push(res.data.start_time)
          this.dateValue.push(res.data.end_time)
          this.rotateList = res.data.rules
          this.describe = res.data.describe
          this.editCan = res.data.status == 0 ? true : false
        }
      })
    }

  }

}

</script>

<style lang="less" scoped>

	.RotateAll {
		width: 100%;
		padding: 20px 24px 64px 44px;
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.rotateName {
		width: 100%;
		height: 65px;
		line-height: 65px;
		background-color: #F8F8F8;
		padding-top: 16px;
		box-sizing: border-box;
		padding-left: 66px;
	}

	.paddingL10 {
		padding-left: 10px !important;
	}

	.rotateLast {
		width: 100%;
		padding: 15px 0px 28px 30px;
		background-color: #F8F8F8;
		box-sizing: border-box;
	}

	.rotateList {
		width: 100%;
		display: flex;

		.rotateDiv {
			width: 450px;
			background-color: #fff;
			margin-right: 25px;
			padding: 15px 33px 15px 20px;
			box-sizing: border-box;
		}
	}

	.rotateImg {
		width: 30px;
		height: 30px;
		cursor: pointer;

		.imgWidth {
			width: 100%;
			height: 100%
		}
	}

	.spans {
		color: #428CF7;
		cursor: pointer;
		margin-left: 17px;
		font-size: 12px;
	}

	.second {
		width: 100%;
		padding: 5px 22px 12px 0px !important;

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

	.rotateRule {
		width: 100%;
		padding: 15px 0px 15px 66px;
		background-color: #F8F8F8;
		box-sizing: border-box;
	}

	.myButton {
		margin-top: 44px;
		margin-left: 275px;
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

	.bottomFixed {
		position: fixed;
		padding: 10px 0;
		box-sizing: border-box;
		bottom: 0;
		width: 100%;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: center;
		justify-content: center;
		background-color: #fff;
		box-shadow: 0 -3px 5px #eee;
		z-index: 1;
		transition: right .2s ease;
	}
</style>
