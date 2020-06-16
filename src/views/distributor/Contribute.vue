<template>
  <div class="padding15">
    <div class="padding10-r">
      <el-button @click="addDialogOpen" class="" size="small" type="primary">新建奖项</el-button>

    </div>
    <fun-table
      :act="dataTableOpt.act"
      :columns="dataTableOpt.columns"
      :formSize="'small'"
      :isSelect="dataTableOpt.isSelect"
      :is_paginate="dataTableOpt.is_paginate"
      ref="dataTable"
    >
      <template slot="time-column" slot-scope="props">
        <div style="display: flex;align-items: center;">
          {{props.row.statistics_start}}-{{props.row.statistics_end}}
        </div>
      </template>

      <template slot="status-column" slot-scope="props">
        <span :class="getStyleFn(props.row.status)">{{props.row.status|statusFilter}}</span>
      </template>
      <template slot="sha_statistics_level-column" slot-scope="props">
        <span>{{props.row.sha_statistics_level|levelFilter}}</span>
      </template>
      <template slot="reward_rules-column" slot-scope="props">
        <template v-for="(item,index) of props.row.reward_rules">
          <el-tag class="line6" size="mini" style="margin-right: 6px">{{item.start}}
            <template v-if="item.end>0">-{{item.end}}</template>
            <template v-else>以上</template>
          </el-tag>
        </template>
      </template>
      <template slot="total_sales-column" slot-scope="props">
        <span class="danger-color">￥{{props.row.total_sales}}</span>
      </template>
      <template slot="operate-column" slot-scope="props">
        <!--        status=0 操作列显示 开始统计 编辑-->
        <!--        status=1 操作列显示 编辑-->
        <!--        status=2 操作列显示 查看详情 编辑-->
        <template v-if="inArray(props.row.status,[0,1,2])">
          <el-button @click="editFn(props.row)" size="mini" type="primary">编辑</el-button>
          <span class="padding4-c"></span></template>
        <template>
          <el-button @click="toDetail(props.row)" size="mini" type="warning">查看详情</el-button>
        </template>
        <template v-if="inArray(props.row.status,[0])">
          <el-button @click="startFn(props.row)" size="mini" type="green"
                     v-loading="handleRowId==props.row.id">开始统计
          </el-button>
        </template>

        <!--        <span style="cursor: pointer" class="color-red js-del">删除</span>-->
      </template>

    </fun-table>

    <el-dialog
      :visible.sync="addDialogInstance.innerVisible"
      @close="addDialogCancel"
      append-to-body
      center
      title="新建奖项"
    >
      <div class="container-wrap">
        <el-form :model="addForm" :rules="addRules" class="form" label-width="100px" ref="addForm"
                 status-icon>
          <el-form-item label="奖项名称" prop="reward_name">
            <el-input placeholder="请输入奖项名称" type="text" v-model="addForm.reward_name"></el-input>
          </el-form-item>
          <el-form-item label="统计时间" prop="time">
            <!--            <div class="flex">-->
            <!--              <el-input  v-model="addForm.statistics_start" placeholder="请输入大于0的整数" type="number" ></el-input>-->
            <!--              <div class="w10"></div>-->
            <!--              <el-input  v-model="addForm.statistics_end" placeholder="请输入大于0的整数" type="number" ></el-input>-->
            <!--            </div>-->
            <el-date-picker
              align="right"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              type="datetimerange"
              v-model="addForm.time"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="统计规则" prop="rule_list"
                        style="position:relative;padding-bottom: 36px">
            <div :key="idx" class="rule-row flex line10"
                 style="align-items: center" v-for="(row,idx) in addForm.rule_list">
              <el-input placeholder="最小值,输入0则代表不限制" type="number"
                        v-model.number="row.start"></el-input>
              <div class="w10"></div>
              <el-input :min="row.start" placeholder="最大值,输入0则代表不限制" type="number"
                        v-model.number="row.end"></el-input>
              <div class="w10"></div>
              <i @click="removeRow(idx)" class="el-icon-delete font18" style="cursor: pointer"></i>
            </div>
            <div style="position: absolute;right: 0;">
              <el-button @click="addRulesRow" size="mini" type="primary">添加</el-button>
            </div>
          </el-form-item>

        </el-form>
        <div style="text-align: center">
          <el-button :loading="addDialogInstance.loading" @click="addFn" type="primary">提交
          </el-button>
          <el-button @click="resetFormFn">重置</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {fun} from '../../common';
import {emptyObject, objTranslate} from '../../common/utils';
import _ from 'underscore'
import {beginDistributorStatistics, createdDistributorContribute} from '../../common/fetch';

@Component({
  mixins: [],
  components: {},
  watch: {
    'addForm.time': {
      deep: true,
      immediate: true,
      handler(val) {
        if (_.isArray(val)) {
          this.addForm.statistics_start = val[0]
          this.addForm.statistics_end = val[1]
        }

      }
    }
  },
  filters: {
    levelFilter(val) {
      if (val == 0) return '无限级';
      return val
    },
    statusFilter(val) {
      //0为待统计，1为统计中，2为待发放，3为已发放 <number>
      let arr = ['待统计', '统计中', '待发放', '已发放']
      return arr[val] ? arr[val] : ''
    }
  }
})



export default class Contribute extends Vue {

  handleRowId = -1
  addDialogInstance = {
    mode: 'add',
    innerVisible: false,
    loading: false
  }
  dataTableOpt = {
    act: 'contributeRules',
    dataList: [],
    isSelect: false,
    is_paginate: true,//是否显示分页 默认显示
    columns: [
      {
        prop: "reward_name",
        label: "奖项名称",
        width: 260,
        search: false
      },
      {
        prop: "time",
        label: "统计时间",
        width: '300px',
        search: false
      },
      {
        prop: "total_sales",
        label: "区间营业额",
        width: 160,
        search: false
      },
      {
        prop: "reward_rules",
        label: "统计规则",
        search: false
      },
      {
        prop: "sha_statistics_level",
        label: "统计级别",
        width: '80px',
        search: false
      },
      {
        prop: "status",
        label: "发放状态",
        width: '80px',
        search: false
      },
      {
        prop: "operate",
        label: "操作",
        align: 'center',
        width: 300,
        search: false
      }
    ]
  }
  addForm = {
    rule_id: '',
    reward_name: '',
    time: '',
    statistics_start: null,
    statistics_end: null,
    rule_list: []
  }
  validateFn = {
    timeFn: (rule, value, callback) => {
      console.log(this.addForm)
      if (!this.addForm.statistics_end || !this.addForm.statistics_start) {
        callback(new Error('两项均必填'));
      } else {
        if (this.addForm.statistics_end <= this.addForm.statistics_start) {
          callback(new Error('结束时间应该大于开始时间'));
        } else {
          callback();
        }

      }
    },
    rulesFn: (rule, value, callback) => {

      if (this.addForm.rule_list.length < 1) {
        callback(new Error('请至少设置一个统计规则'));
        return;
      }

      let check = true
      for (var rule of this.addForm.rule_list) {
        if (rule.start > 0 || rule.end > 0) {
          if (rule.end && parseFloat(rule.start) >= parseFloat(rule.end)) {
            check = false
            callback(new Error('左侧阈值应该小于右侧阈值'));
            break;
          }
        } else {
          check = false
          callback(new Error('每行阈值至少填写一个'));
          break;
        }
      }
      check && callback();
    },
  }
  addRules = {
    reward_name: [
      {required: true, message: '请输入奖品名称', trigger: 'blur'}
    ],
    time: [
      {required: true, validator: this.validateFn.timeFn, trigger: 'change'}
    ],
    rule_list: [
      {required: true, validator: this.validateFn.rulesFn, trigger: 'blur'}
    ]
  }

  toDetail(row) {
    this.$router.push({
      name: 'DistributorContribute',
      query: {id: row.id}
    })
  }

  getStyleFn(status) {
    let arr = ['color-gray', 'color-blue', 'color-red', 'color-green']
    return arr[status]
  }

  inArray(val, arr) {
    return arr.indexOf(val) != -1
  }

  async startFn(row) {

    this.handleRowId = row.id
    await beginDistributorStatistics({rule_id: row.id}).then(res => {
      if (res.data.hasOwnProperty('status')) {
        setTimeout(() => {
          fun.success({msg: res.msg})

          row.status = res.data.status;
        }, 500)
      }
    }).catch()
    this.handleRowId = -1;

  }

  editFn(row) {
    this.addDialogInstance.mode = 'edit'
    let {reward_name, statistics_start, statistics_end, reward_rules, id} = row
    let time = [`${statistics_start} 00:00:00`, `${statistics_end} 00:00:00`]
    // let editForm = {
    //     reward_name,time,rule_list:reward_rules,rule_id:id
    // }
    this.$set(this.addForm, 'reward_name', reward_name)
    this.$set(this.addForm, 'time', time)
    this.$set(this.addForm, 'rule_list', objTranslate(reward_rules))
    this.$set(this.addForm, 'rule_id', id)

    this.addDialogInstance.innerVisible = true
  }

  addDialogCancel() {
    this.addForm = {
      rule_id: '',
      reward_name: '',
      time: '',
      statistics_start: null,
      statistics_end: null,
      rule_list: []
    }
    this.addDialogInstance.innerVisible = false
  }

  addDialogOpen() {
    this.addDialogInstance.mode = 'add'
    this.addRulesRow()
    this.addDialogInstance.innerVisible = true
  }

  removeRow(idx) {
    if (this.addForm.rule_list.length == 1) {
      fun.error({msg: '最少设置1个'})
      return
    }
    this.addForm.rule_list.splice(idx, 1)
  }

  addRulesRow() {
    if (this.addForm.rule_list.length > 5) {
      fun.error({msg: '最多允许设置6个'})
      return
    }
    this.addForm.rule_list.push({start: '', end: ''})
  }

  async addFn() {
    if (this.addDialogInstance.loading) {
      fun.error({msg: '请求太快'})
      return;
    }
    let formName = 'addForm'
    let formValidata = false
    this.$refs[formName].validate((valid) => {
      if (valid) {
        formValidata = true
      } else {
        console.log('error submit!!');
        formValidata = false;
      }
    });
    if (!formValidata) return;

    let {reward_name = '', statistics_start, statistics_end, rule_id} = this.addForm;
    let reward_rules = this.addForm.rule_list.map(rule => {
      return {start: rule.start ? rule.start : 0, end: rule.end ? rule.end : 0}
    })

    let postData = {
      reward_name,
      statistics_start,
      statistics_end,
      reward_name,
      reward_rules: JSON.stringify(reward_rules)
    };
    if (this.addDialogInstance.mode == 'edit') {
      postData.rule_id = rule_id
    }
    if (!emptyObject(postData, 1)) {
      fun.error({msg: '请正确填写信息'})
      return;
    }

    this.addDialogInstance.loading = true
    await createdDistributorContribute(postData).then(res => {
      this.$refs.dataTable.loadData()
    }).catch(e => {
    })
    this.addDialogInstance.loading = false


    this.addDialogCancel()


  }

  resetFormFn() {
    let formName = 'addForm'
    this.$refs[formName].resetFields();
  }


}

</script>

<style lang="less" scoped>
  /*.js-edit{*/
  /*  cursor: pointer;*/
  /*}*/
  /*.js-del{*/
  /*  cursor: pointer;*/
  /*}*/
  .el-icon-delete {
    &:hover {
      color: #F43131;
    }
  }
</style>
