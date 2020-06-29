<template>
  <div class="labelManagement">
    <div class="labelMain flex">
      <div class="floatRight">
        <el-form size="small">
          <el-form-item class="flexCenter" label="群发对象：">
            <el-select placeholder="请选择" style="width: 200px" v-model="crowdId">
              <template v-for="(shop,shopIn) in crowdList">
                <el-option :label="shop.name" :value="shop.id"></el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-form-item class="flex" label="短信内容：">
            <el-input
              :autosize="{ minRows: 4}"
              class="haihong"
              placeholder="此处为短信模板内容"
              resize="none"
              type="textarea"
              v-model="content">
            </el-input>


          </el-form-item>

          <el-form-item class="flex" label="发送时间：">
            <el-radio-group v-model="times">
              <el-radio class="radioTop" label="0">
                立即发送
              </el-radio>
              <el-radio class="radioBottom" label="1">
                定时发送
                <el-date-picker
                  class="dateTime"
                  placeholder="选择日期时间"
                  type="datetime"
                  v-model="send_time"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="all">
            <el-button @click="cancelPro" style="margin-left: 60px">取消</el-button>
            <el-button :loading="loading" @click="saveData" style="margin-left: 100px"
                       type="primary">保存
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {addBatch, getCrowds} from '@/common/fetch'

@Component({
  mixins: [],
  components: {}
})


export default class AddProduct extends Vue {
  content = ''
  loading = false
  send_time = ''
  times = "0"
  crowdList = []
  crowdId = ''

  cancelPro() {
    this.$router.push({
      name: 'CrowdClient'
    })
  }

  //保存
  saveData() {
    if (this.loading) return
    this.loading = true
    let data = {
      type: 2,
      crowd_id: this.crowdId,
      content: this.content
    }
    if (this.times == 0) {
      data.send_time = 0
    } else if (this.times == 1) {
      data.send_time = this.send_time
    }
    addBatch(data).then(res => {
      if (res.errorCode == 0) {
        this.$message({
          type: 'success',
          message: res.msg
        });
        let that = this
        setTimeout(function () {
          that.$router.push({
            name: 'CrowdClient'
          })
        }, 1000)
      }
    }).catch(e => {
      this.loading = false
    })

  }

  async created() {
    let id = this.$route.params.id
    //获取人群列表
    getCrowds({page: 1, pageSize: 10000}).then(res => {
      if (res.errorCode == 0) {
        this.crowdList = res.data
        if (id) {
          this.crowdId = id
        }
      }
    })
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
      padding-top: 70px;
      padding-left: 24px;
    }
  }

  .flex {
    display: flex;
  }

  .flexCenter {
    display: flex;
    align-items: center
  }

  .floatRight {
    margin-left: 200px;
  }

  .error {
    color: #F43131;
    font-size: 12px;
  }

  .haihong {
    min-height: 85px;
    border: 0px;
    width: 280px;
    margin-top: 8px;
  }

  .radioTop {
    display: block;
    margin-bottom: 15px;
    padding-top: 8px
  }

  .radioBottom {
    display: block;
    margin-bottom: 15px;
  }

  .submit {
    background-color: #428CF7;
    color: #FFFFFF;
    width: 90px;
    text-align: center;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    margin-left: 120px;
    margin-top: 20px;
  }

  .dateTime {
    margin-left: 18px;
    width: 180px;

  }

  .dateTime /deep/ input {
    padding-right: 0px
  }

  .textarea /deep/ textarea {
    border: 0px !important;
  }
</style>
