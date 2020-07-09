<template>
	<div class="home-wrap p-20 flex flex-column">
		<div class="tabs-wrap flex1">
			<el-tabs @tab-click="handleClick" v-model="activeName">
				<el-tab-pane label="通用设置" name="base">
					<div v-if="formsByBase.length>0">
						<diy-form-format label-width="160px" @update="upFormData" ref="base" form-size="default" img-size="mini"
						                 :forms="formsByBase"></diy-form-format>
					</div>
				</el-tab-pane>
				<el-tab-pane label="订单设置" name="order">
					<div v-if="formsByOrder.length>0">
						<diy-form-format label-width="160px" @update="upFormData" ref="order" form-size="default" img-size="mini"
						                 :forms="formsByOrder"></diy-form-format>
					</div>
				</el-tab-pane>
				<el-tab-pane label="开关配置" name="feature">
					<div v-if="formsByFeature.length>0">
						<diy-form-format label-width="160px" @update="upFormData" ref="feature" form-size="default" img-size="mini"
						                 :forms="formsByFeature"></diy-form-format>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="action-wrap flex flex-vertical-c flex-justify-c">
			<el-button @click="subFn" class="m-r-20" type="primary" :loading="onSend">保存</el-button>
			<el-button>返回</el-button>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import DiyFormFormat from "../components/diy-form-format/diy-form-format.vue";
import {checkValue, findArrayIdx, objTranslate} from "../common/utils";
import {fun} from "../common";
import {operateShopConfig} from "../common/fetch";

/**
 * with属性如果为多个，就用数组申明，然后遍历数组就好了。单个的话就是字符串
 * 也不用怕后续一个表单会控制多个表单是否显示、和是否必填
 */
const infoTmplByBase = [
	{label: '商城名称', name: 'ShopName', required: false, type: 'input', value: '', desc: '', autoDesc: true},
	{label: '商城简介', name: 'description', required: false, type: 'textarea', value: '', desc: '', autoDesc: true},
	{
		label: '商城Logo',
		name: 'ShopLogo',
		required: false,
		type: 'img',
		limit: 1,
		count: 0,
		value: '',
		desc: '',
		autoDesc: true
	},
	{
		label: '自定义分享图',
		name: 'ShareLogo',
		required: false,
		type: 'img',
		limit: 1,
		count: 0,
		value: '',
		desc: '用户分享商城时，展示的封面图片，一个好看的封面更能吸引消费者点击',
		autoDesc: true
	},
	{
		label: '自定义分享语',
		name: 'ShareIntro',
		required: false,
		type: 'input',
		value: '',
		desc: '用户分享商城时，展示的分享文案，一段好的文案可能会吸引更多的流量',
		autoDesc: true
	},
	{
		label: '短信签名',
		name: 'sms_sign',
		required: false,
		type: 'input',
		value: '',
		desc: '使用到短信功能时，短信内容前面会包含该签名   如【好分销】，签名前后用实心方头括号【】包含',
		autoDesc: true
	},
	{
		label: '一键拨号',
		name: 'CallEnable',
		required: false,
		type: 'radio',
		value: '',
		desc: '如开启该功能，客户端首页会展示一键拨号图标，消费者可直接拨打电话',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}],
		with: 'CallPhoneNumber'
	},
	{
		label: '一键拨号号码',
		name: 'CallPhoneNumber',
		required: false,
		type: 'input',
		value: '',
		desc: '',
		autoDesc: true,
		hide: true
	},
]


const infoTmplByOrder = [
	{
		label: '自动确认收货时间',
		name: 'Confirm_Time',
		required: false,
		type: 'input',
		value: '',
		desc: ' 单位（天）,商家发货到达该项设置的时间后，订单会自动确认收货',
		autoDesc: true
	},
	{
		label: '自动收货延长时间',
		name: 'Order_overtime',
		required: false,
		type: 'input',
		value: '',
		desc: ' 消费者到达自动确认收货时间还没收到货，可点击延长收货，会延长自动确认收货时间',
		autoDesc: true
	},
	{
		label: '确认收货延长发放佣金',
		name: 'Commission_withdraw',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启该设置，订单确认收货，将在收货该项设置时间后才会发放相关佣金',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}],
		with: 'Commission_withdraw_day'
	},
	{
		label: '延长发放佣金时间',
		name: 'Commission_withdraw_day',
		required: false,
		type: 'input',
		value: '',
		desc: '单位为天',
		autoDesc: true,
		hide: true
	},
	{
		label: '评论审核',
		name: 'Commit_Check',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启该设置，消费者的评论需要审核后才能显示',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}]
	},
	{
		label: '订单短信通知',
		name: 'SendSms',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启并输入通知手机号，当有新订单时，会通过短信通知到商家',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}],
		with: 'MobilePhone'
	},
	{
		label: '订单短信通知手机号',
		name: 'MobilePhone',
		required: false,
		type: 'input',
		value: '',
		desc: '',
		autoDesc: true,
		hide: true
	},
	{
		label: '退款手续费',
		name: 'Factorage',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启该配置，消费者订单退款时，会扣除相应的手续费，为了客户体验，请慎重开启该功能',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}],
		with: [
			{val: 0, showRow: [''], hideRow: ['Factorage_type', 'Factorage_fixprice', 'Factorage_percent']},
			{val: 1, showRow: ['Factorage_type'], hideRow: ['']}
		]
	},
	{
		label: '退款手续费收取方式',
		name: 'Factorage_type',
		required: false,
		type: 'radio',
		value: '',
		desc: '请慎重开启该功能',
		autoDesc: true,
		options: [{label: '固定金额', val: 0}, {label: '按订单百分比', val: 1}],
		hide: true,
		with: [
			{val: 0, showRow: ['Factorage_fixprice'], hideRow: ['Factorage_percent']},
			{val: 1, showRow: ['Factorage_percent'], hideRow: ['Factorage_fixprice']}
		]
	},
	{
		label: '退款手续费固定金额',
		name: 'Factorage_fixprice',
		required: false,
		type: 'input',
		value: '',
		desc: '请慎重开启该功能',
		autoDesc: true,
		hide: true
	},
	{
		label: '退款手续费百分比',
		name: 'Factorage_percent',
		required: false,
		type: 'input',
		value: '',
		desc: '请慎重开启该功能',
		autoDesc: true,
		hide: true
	},
]


const infoTmplByFeature = [
	{
		label: '分销总开关',
		name: 'DisSwitch',
		required: false,
		type: 'radio',
		value: '',
		desc: '商城整体的分享功能开关，关闭后，商城将无法实现分销功能，也不会再发放佣金，请慎重操作',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}]
	},
	{
		label: '余额提现开关',
		name: 'remainder_withdraw',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启后，会员的余额可以申请提现，请注意，如果您设置了充值送余额，就不建议开启该功能，否则可能会出现消费者充值100到账120，直接提现的情况',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}]
	},
	{
		label: '商品强制拼团开关',
		name: 'pintuan_switch',
		required: false,
		type: 'radio',
		value: '',
		desc: '开启该功能，商家发布商品时，需要填写拼团人数和拼团价格，关闭该功能，发布商品不再需要填写，商家可在推广营销处针对某个商品开启拼团',
		autoDesc: true,
		options: [{label: '开启', val: 1}, {label: '关闭', val: 0}]
	}
]

@Component({
	components: {DiyFormFormat}
})
export default class SystemConf extends Vue {

	action = ''
	formsByBase = []
	formsByOrder = []
	formsByFeature = []
	postData = {}
	activeName = 'base'
	onSend = false

	forms = []

	handleClick(tab, event) {
		const {index, name} = tab
		console.log(name)

		switch (name) {
			case 'base':
				this.$set(this, 'forms', [].concat(infoTmplByBase))
				this.$refs.base.refreshData()
				break;
			case 'order':
				this.$set(this, 'forms', [].concat(infoTmplByOrder))
				this.$refs.order.refreshData()
				break;
			case 'feature':
				this.$set(this, 'forms', [].concat(infoTmplByFeature))
				this.$refs.feature.refreshData()
				break;
		}
	}

	upFormData(data) {
		var _data = objTranslate(data)

		const forms = this.forms

		for (const key in _data) {
			const row = _data[key]

			// 这个是针对radio类型的
			if (row.type === 'radio') {
				// 不能直接用key去取，有的行可能是隐藏的。利用name是最靠谱的，同一个表单不能有两个相同的name
				const rowIdx = findArrayIdx(forms, {name: row.name})
				if (rowIdx === false) {
					console.log(row)
					throw Error('同步设置值失败' + row.name)
				}

				//  这里的值其实是label
				const currentRadioOptionsIdx = findArrayIdx(forms[rowIdx].options, {label: row.value})
				if (currentRadioOptionsIdx !== false) {
					_data[key].value = forms[rowIdx].options[currentRadioOptionsIdx].val
				}
			}


			// 如果存在with属性，则代表关联
			if (row.with) {

				console.log(row.label,row.name,row.value,row.with,row.hide)
				if (typeof row.with === 'string') {
					const tempIdx = findArrayIdx(forms, {name: row.with})
					if (tempIdx !== false && this.$refs[this.activeName]) {
						this.$refs[this.activeName].taggleHide(tempIdx, _data[key].value ? false : true)
					}
				}

				//with可以配置为数组，应对某个开关需要对应隐藏/显示单个的情况的情况
				//而且自身不能被隐藏
				if (row.hide !== true && Array.isArray(row.with)) {
					const filterRowIdx = findArrayIdx(row.with, {val: row.value})
					if (filterRowIdx === false) continue;

					const {showRow = [], hideRow = []} = row.with[filterRowIdx]
					for (var rowName of showRow) {
						const tempIdx = findArrayIdx(forms, {name: rowName})
						if (tempIdx !== false && this.$refs[this.activeName]) {
							this.$refs[this.activeName].taggleHide(tempIdx, false)
							_data[tempIdx].hide = false
						}
					}
					for (var rowName of hideRow) {
						const tempIdx = findArrayIdx(forms, {name: rowName})
						if (tempIdx !== false && this.$refs[this.activeName]) {
							this.$refs[this.activeName].taggleHide(tempIdx, true)
							_data[tempIdx].hide = true
						}
					}

					console.log(objTranslate(_data))

				}

			}


			// console.log(row)
			// // 如果有回调的话
			// row.handler && row.handler(row)

		}

		this.postData = _data
	}

	async subFn() {
		const loadInstance = this.$loading({
			fullscreen: true,
			text: '保存中',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.3)'
		})
		this.onSend = true
		try {

			var formatFormData = {}


			const forms = this.forms

			for (const key in this.postData) {
				const row = this.postData[key]
				//可以是0 或者'0'
				if (row.required && checkValue(row.value, [null, undefined, '', 'null', 'undefined'])) {
					throw Error(`${row.label}必须设置`)
				}
				if (forms[key].hasOwnProperty('match') && !forms[key].match.test(row.value)) {
					throw Error(`${row.label}格式不正确`)
				}
				formatFormData[row.name] = row.value
			}
			console.log(formatFormData)
			await operateShopConfig(formatFormData).catch(e => {
				throw Error(e.msg || '保存失败')
			})
			fun.success({msg: '配置保存成功'})
		} catch (e) {
			fun.error({msg: e.message})
		} finally {
			this.onSend = false
			loadInstance.close();
		}
	}

	async created() {

		this.$set(this, 'forms', [].concat(infoTmplByBase))

		// 自动加desc
		for (const row of infoTmplByBase) {
			if (row.type === 'input' && !row.desc && row.autoDesc) row.desc = `请设置${row.label}`
		}
		for (const row of infoTmplByOrder) {
			if (row.type === 'input' && !row.desc && row.autoDesc) row.desc = `请设置${row.label}`
		}
		for (const row of infoTmplByFeature) {
			if (row.type === 'input' && !row.desc && row.autoDesc) row.desc = `请设置${row.label}`
		}

		const {shop_config: vo} = await operateShopConfig().then(res => res.data).catch(e => {
			throw Error(e.msg || '数据初始化失败')
		})

		if (vo) {
			console.log(vo)
			this.action = 'edit'

			// // 用服务器上的值覆盖默认值
			for (var row of infoTmplByBase) {
				if (vo.hasOwnProperty(row.name)) {
					row.value = vo[row.name]
					if (row.with) {

						if (typeof row.with === 'string') {
							const tempIdx = findArrayIdx(infoTmplByBase, {name: row.with})
							if (tempIdx !== false) {
								infoTmplByBase[tempIdx].hide = row.value ? false : true
							}
						}

						//with可以配置为数组，应对某个开关需要对应隐藏/显示单个的情况的情况
						if (Array.isArray(row.with)) {
							const filterRowIdx = findArrayIdx(row.with, {val: row.value})
							if (filterRowIdx === false) continue;
							const {showRow = [], hideRow = []} = row.with[filterRowIdx]
							for (var rowName of showRow) {
								const tempIdx = findArrayIdx(infoTmplByBase, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByBase[tempIdx].hide = false
								}
							}
							for (var rowName of hideRow) {
								const tempIdx = findArrayIdx(infoTmplByBase, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByBase[tempIdx].hide = true
								}
							}

						}

					}
				}
			}

			for (var row of infoTmplByOrder) {
				if (vo.hasOwnProperty(row.name)) {
					row.value = vo[row.name]
					if (row.with) {

						if (typeof row.with === 'string') {
							const tempIdx = findArrayIdx(infoTmplByOrder, {name: row.with})
							if (tempIdx !== false) {
								infoTmplByOrder[tempIdx].hide = row.value ? false : true
							}
						}

						//with可以配置为数组，应对某个开关需要对应隐藏/显示单个的情况的情况
						if (Array.isArray(row.with)) {

							const filterRowIdx = findArrayIdx(row.with, {val: row.value})
							if (filterRowIdx === false) continue;
							const {showRow = [], hideRow = []} = row.with[filterRowIdx]
							console.log(row.with[filterRowIdx])
							for (var rowName of showRow) {
								const tempIdx = findArrayIdx(infoTmplByOrder, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByOrder[tempIdx].hide = false
								}
							}

							for (var rowName of hideRow) {
								const tempIdx = findArrayIdx(infoTmplByOrder, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByOrder[tempIdx].hide = true
								}
							}

						}

					}
				}
			}

			console.log(infoTmplByOrder)

			for (var row of infoTmplByFeature) {
				if (vo.hasOwnProperty(row.name)) {
					row.value = vo[row.name]
					if (row.with) {

						if (typeof row.with === 'string') {
							const tempIdx = findArrayIdx(infoTmplByFeature, {name: row.with})
							if (tempIdx !== false) {
								infoTmplByFeature[tempIdx].hide = row.value ? false : true
							}
						}

						//with可以配置为数组，应对某个开关需要对应隐藏/显示单个的情况的情况
						if (Array.isArray(row.with)) {
							const filterRowIdx = findArrayIdx(row.with, {val: row.value})
							if (filterRowIdx === false) continue;
							const {showRow = [], hideRow = []} = row.with[filterRowIdx]
							for (var rowName of showRow) {
								const tempIdx = findArrayIdx(infoTmplByFeature, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByFeature[tempIdx].hide = false
								}
							}
							for (var rowName of hideRow) {
								const tempIdx = findArrayIdx(infoTmplByFeature, {name: rowName})
								if (tempIdx !== false) {
									infoTmplByFeature[tempIdx].hide = true
								}
							}

						}

					}
				}
			}

		}

		console.log(infoTmplByOrder)
		//不要带函数过去，只要简单值就好啦
		this.$set(this, 'formsByBase', objTranslate(infoTmplByBase))
		this.$set(this, 'formsByOrder', objTranslate(infoTmplByOrder))
		this.$set(this, 'formsByFeature', objTranslate(infoTmplByFeature))


	}

}
</script>
<style lang="scss" scoped>
	.home-wrap {
		min-height: 100vh;
		box-sizing: border-box;
	}

	.action-wrap {
		border-top: 1px solid #e7e7e7;
		padding-top: 20px;
		height: 50px;
	}
</style>
