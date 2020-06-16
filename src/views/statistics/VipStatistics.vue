<template>
  <div class="mainVip">
    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员增长情况</div>
        <div class="titleButton">
          <el-button @click="firstMethod('out')" size="small" type="primary">导出数据</el-button>

          <el-select @change="firstMethod('firstDay')" class="selectClass" placeholder="按月统计"
                     size="small" v-model="firstDay">
            <el-option
              label="按日统计"
              value="day">
            </el-option>
            <el-option
              label="按月统计"
              value="month">
            </el-option>
            <el-option
              label="按年统计"
              value="year">
            </el-option>
          </el-select>

          <el-date-picker
            @change="firstMethod"
            class="selectDate"
            placeholder="选择日期"
            size="small"
            type="date"
            v-if="firstDay=='day'"
            v-model="firstTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-date-picker
            @change="firstMethod"
            class="selectDate"
            placeholder="选择月"
            size="small"
            type="month"
            v-if="firstDay=='month'"
            v-model="firstTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-date-picker
            @change="firstMethod"
            class="selectDate"
            placeholder="选择年"
            size="small"
            type="year"
            v-if="firstDay=='year'"
            v-model="firstTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div :loading="firstLoading" ref="firstChart" style="width: 100%;height: 580px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员端口来源</div>
        <div class="titleButton">
          <el-button @click="secondMethod('out')" size="small" type="primary">导出数据</el-button>

          <el-select @change="secondMethod('secondDay')" class="selectClass" placeholder="按月统计"
                     size="small" v-model="secondDay">
            <el-option
              label="按日统计"
              value="day">
            </el-option>
            <el-option
              label="按月统计"
              value="month">
            </el-option>
            <el-option
              label="按年统计"
              value="year">
            </el-option>
          </el-select>

          <el-date-picker
            @change="secondMethod"
            class="selectDate"
            placeholder="选择日期"
            size="small"
            type="date"
            v-if="secondDay=='day'"
            v-model="secondTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-date-picker
            @change="secondMethod"
            class="selectDate"
            placeholder="选择月"
            size="small"
            type="month"
            v-if="secondDay=='month'"
            v-model="secondTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-date-picker
            @change="secondMethod"
            class="selectDate"
            placeholder="选择年"
            size="small"
            type="year"
            v-if="secondDay=='year'"
            v-model="secondTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div ref="secondChart" style="width: 100%;height: 480px;padding-bottom: 100px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员消费金额</div>
        <div class="titleButton">
          <el-button @click="threeMethod('out')" size="small" type="primary">导出数据</el-button>

          <el-select @change="threeMethod('secondDay')" class="selectClass" placeholder="按月统计"
                     size="small" v-model="threeDay">
            <el-option
              label="按日统计"
              value="day">
            </el-option>
            <el-option
              label="按月统计"
              value="month">
            </el-option>
            <el-option
              label="按年统计"
              value="year">
            </el-option>
          </el-select>

          <el-date-picker
            @change="threeMethod"
            class="selectDate"
            placeholder="选择日期"
            size="small"
            type="date"
            v-if="threeDay=='day'"
            v-model="threeTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-date-picker
            @change="threeMethod"
            class="selectDate"
            placeholder="选择月"
            size="small"
            type="month"
            v-if="threeDay=='month'"
            v-model="threeTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-date-picker
            @change="threeMethod"
            class="selectDate"
            placeholder="选择年"
            size="small"
            type="year"
            v-if="threeDay=='year'"
            v-model="threeTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div ref="threeChart" style="width: 100%;height: 580px"></div>
    </div>


  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {
  systemUserBuyStatistic,
  systemUserFromStatistic,
  systemUserGroupStatistic
} from '@/common/fetch'

@Component({
  mixins: [],
  components: {}
})

export default class VipStatistics extends Vue {


  firstOpttion = {
    color: ['#9AC0F3'],
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [{
      data: [],
      type: 'line',
      itemStyle: {normal: {label: {show: true}}},
      smooth: true
    }]
  }
  firstDay = 'month'
  firstTime = ''
  firstLoading = false
  secondOpttion = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: [{}]
    },
    calculable: true,
    color: ['#9AC0F3', '#F1C087', '#6E7788', '#ED84B8', '#8894A8'],
    series: [
      {
        name: '会员端口来源',
        type: 'pie',
        radius: [30, 110],
        center: ['50%', '50%'],
        //roseType : 'area', 突出饼状图
        data: []
      }]
  }
  secondDay = 'month'
  secondTime = ''
  secondLoading = false
  threeOpttion = {
    color: ['#9AC0F3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        name: '元',
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '人数'
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '40',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  }
  threeDay = 'month'
  threeTime = ''
  threeLoading = false

  firstMethod(item) {
    if (this.firstLoading) return
    this.firstLoading = true
    if (item == 'firstDay') {
      this.firstTime = ''
    }
    let that = this
    let data = {
      time: this.firstDay,
      search_time: this.firstTime
    }
    if (item == 'out') {
      data.output = 1
    }
    systemUserGroupStatistic(data).then(res => {
      if (res.errorCode == 0) {
        this.firstLoading = false
        if (item == 'out') {
          res.data.file_path && window.open(res.data.file_path, '_self');
        } else {
          let firstChart = that.$echarts.init(this.$refs.firstChart)
          that.firstOpttion.xAxis.data = res.data.time
          that.firstOpttion.series[0].data = res.data.count
          firstChart.setOption(that.firstOpttion);
        }

      }
    })
    this.firstLoading = false
  }

  secondMethod(item) {
    if (this.secondLoading) return
    this.secondLoading = true
    if (item == 'secondDay') {
      this.secondTime = ''
    }
    let that = this
    let data = {
      time: this.secondDay,
      search_time: this.secondTime
    }
    if (item == 'out') {
      data.output = 1
    }
    systemUserFromStatistic(data, {loading: true}).then(res => {
      if (res.errorCode == 0) {
        this.secondLoading = false
        if (item == 'out') {
          res.data.file_path && window.open(res.data.file_path, '_self');
        } else {
          let secondOpttion = that.$echarts.init(this.$refs.secondChart)
          that.secondOpttion.legend.data = res.data.User_From_desc
          that.secondOpttion.series[0].data = res.data.from_count
          secondOpttion.setOption(that.secondOpttion);
        }

      }
    })
    this.secondLoading = false
  }

  threeMethod(item) {
    if (this.threeLoading) return
    this.threeLoading = true
    if (item == 'secondDay') {
      this.threeTime = ''
    }
    let that = this
    let data = {
      time: this.threeDay,
      search_time: this.threeTime
    }
    if (item == 'out') {
      data.output = 1
    }
    systemUserBuyStatistic(data, {loading: true}).then(res => {
      if (res.errorCode == 0) {
        this.threeLoading = false
        if (item == 'out') {
          res.data.file_path && window.open(res.data.file_path, '_self');
        } else {
          let threeOpttion = that.$echarts.init(this.$refs.threeChart)
          that.threeOpttion.xAxis[0].data = res.data.money_range
          that.threeOpttion.series[0].data = res.data.count
          threeOpttion.setOption(that.threeOpttion);
        }

      }
    })
    this.threeLoading = false
  }


  mounted() {
    this.firstMethod();
    this.secondMethod();
    this.threeMethod();
  }


}


</script>

<style lang="less" scoped>
  .mainVip {
    width: 100%;
    padding: 39px 14% 54px 16%;
    box-sizing: border-box;
  }

  .firstChart {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #E4E4E4;
  }

  //title
  .firstTitle {
    background-color: #f3f3f3;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;

    .titleFont {
      font-size: 14px;
      color: #666666;
      height: 50px;
      line-height: 50px;
      padding-left: 21px;
    }

    .titleButton {
      display: flex;
      align-items: center;
      height: 50px;
      padding-right: 30px;

      .selectClass {
        width: 100px;
        margin-left: 15px;
      }

      .selectDate {
        margin-left: 15px;
        width: 128px;
      }
    }
  }

  .marginB {
    margin-bottom: 30px;
  }

  //title


</style>
