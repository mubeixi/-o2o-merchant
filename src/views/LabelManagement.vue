<template>
	<div class="labelManagement">
		<div class="labelMain">
			<div style="margin-bottom: 15px">
				<el-select placeholder="请选择标签类型" size="small" style="width: 175px;margin-right: 10px;"
				           v-model="types">
					<el-option
					:label="it"
					:value="ind"
					v-for="(it,ind) in typesList">
					</el-option>
				</el-select>
				<el-input placeholder="请输入标签名称" size="small" style="width: 175px"
				          v-model="labelName"></el-input>
				<el-button @click="searchList" class="el-button" size="small" style="margin-left: 23px">搜索
				</el-button>
				<!--              <el-button size="mini" class="el-button">导出标签</el-button>-->
				<el-button @click="goAddLabel" class="el-button floatRight" size="small">新建标签</el-button>
			</div>
			<el-table
			:data="tableData"
			border
			class="wzw-tableS"
			style="width: 80%">
				<el-table-column
				align="center"
				label="标签名"
				prop="name"
				width="230">
				</el-table-column>
				<el-table-column
				align="center"
				label="客户"
				prop="tag_num"
				width="180">
				</el-table-column>
				<el-table-column
				align="center"
				label="标签类型"
				prop="type_txt"
				width="140">
				</el-table-column>
				<el-table-column
				align="center"
				label="打标条件"
				prop="label_rule">
					<template slot-scope="scope">
						<template v-for="(item,index) of tableData[scope.$index].conditions">
							<div class="divLeft" v-if="index==0">{{item}}</div>
						</template>
						<div @click="lookDetail(scope.$index)" class="divLeft curr"
						     v-if="tableData[scope.$index].conditions">查看详情
						</div>
					</template>
				</el-table-column>
				<el-table-column
				align="center"
				label="操作"
				width="180"
				>
					<template slot-scope="scope">
						<span @click="ediT(tableData[scope.$index].id)" class="spans">编辑</span><span
					class="spans">|</span><span @click="delList(tableData[scope.$index].id)" class="spans">删除</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
			:page-size="pageSize"
			:total="totalCount"
			@current-change="currentChange"
			background
			class="pagination"
			layout="prev, pager, next">
			</el-pagination>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {delTag, getTags} from '@/common/fetch'

@Component({
  mixins: [],
  components: {}
})

export default class AddProduct extends Vue {

  tableData = []
  typesList = []
  types = ''
  labelName = ''
  page = 1
  pageSize = 10
  totalCount = 0

  lookDetail(index) {
    let msg = this.tableData[index].condition
    let arr = `<div style="height: 24px;font-size: 14px;color: #333333;line-height: 24px;margin-top: 5px !important;margin-bottom: 5px !important;font-weight: bold;">${msg}</div>`
    for (let item of this.tableData[index].conditions) {
      arr += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item}</br>`
    }
    this.$alert(arr, '打标条件', {
      dangerouslyUseHTMLString: true
    })
  }

  //编辑
  ediT(index) {
    this.$router.push({
      name: 'LabelAdd',
      params: {
        id: index
      }
    })
  }

  //新建标签
  goAddLabel() {
    this.$router.push({
      name: 'LabelAdd'
    })
  }

  //删除标签
  delList(id) {
    this.$confirm('你确定要删除这个标签吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delTag({id: id}).then(res => {
        if (res.errorCode == 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.searchList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }).catch(() => {

    })
  }

  //切页数
  currentChange(val) {
    this.page = val
    this.searchList()
  }

  searchList() {
    let search = {
      name: this.labelName,
      type: this.types,
      page: this.page,
      pageSize: this.pageSize
    }
    getTags(search).then(res => {
      if (res.errorCode == 0) {
        this.tableData = res.data
        this.typesList = res.types
        this.totalCount = res.totalCount
      }
    })
  }

  async created() {
    this.searchList()
  }


}

</script>

<style lang="less" scoped>
	@bgColor: #428CF7;
	.labelManagement {
		background-color: #f6f6f6;
		padding-top: 18px;
		padding-left: 19px;
		width: 100%;
		box-sizing: border-box;

		.labelMain {
			background-color: #FFFFFF;
			width: 100%;
			box-sizing: border-box;
			padding-top: 30px;
			padding-left: 24px;
		}

	}

	.spans {
		color: @bgColor;
		margin-left: 2px;
		margin-right: 2px;
		cursor: pointer;
	}

	.el-button {
		background-color: @bgColor;
		color: #FFFFFF;
	}

	.wzw-tableS th {
		color: #333 !important;
		background-color: #F9FAFC !important;
		border: none !important;
		border-top: 1px solid #EAEAEA !important;
		border-left: 1px solid #EAEAEA !important;
	}

	.pagination {
		padding-top: 73px;
		margin-left: 30%;
	}

	.floatRight {
		margin-right: 20%;
		float: right;
	}

	.divLeft {
		line-height: 20px;
		text-align: left;
		margin-left: 30px;
	}

	.curr {
		color: #428CF7;
		cursor: pointer;
	}
</style>
