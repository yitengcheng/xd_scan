<template>
	<view class="content"  style="align-items: center;">
		<view class="top_box">
			<u-button type="primary" size="mini" @click="showProductInfo">入库</u-button>
		</view>
		<u-tabs :current="currentIndex" :list="list" @click="changeIndex" style="width: 100%;"></u-tabs>
		<u-empty mode="list" text="暂无数据" v-if="productList.length === 0" />
		<view v-for="(product, index) in productList" :key="index" @click="showInfo(product)" class="product_box">
			<view class="product_row">
				<view>编号：{{ product.id || '无' }}</view>
				<view>产品名称：{{ product.name || '无' }}</view>
				
			</view>
			<view class="product_row">
				<view>购买/租赁：{{ product.payMethod || '无' }}</view>
				<view>mac地址：{{ product.macAddress || '无' }}</view>
			</view>
			<view class="product_row">
				<view>收货地址：{{ product.retrievalAddress || '无' }}</view>
			</view>
			<view class="product_row">
				<view>快递单号：{{ product.logisticsNumber || '无' }}</view>
			</view>
			<u-divider>我是分割线</u-divider>
		</view>
		<u-popup :show="showAddModal" mode="bottom" v-model="showAddModal" @close="() => showAddModal = false">
			<u-form ref="addForm" :model="formAddData" :rules="addRules" label-width="180" class="product_form">
				<u-form-item label="产品名称" prop="title" :required="true">
					<u-input v-model="formAddData.title" placeholder="请输入产品名称" :clearable="true"></u-input>
				</u-form-item>
				<u-form-item label="产品型号" prop="model" :required="true">
					<u-input v-model="formAddData.model" placeholder="请输入产品型号" :clearable="true"></u-input>
				</u-form-item>
				<u-form-item label="mac地址" prop="macAddress" :required="true">
					<u-input v-model="formAddData.macAddress" placeholder="请输入mac地址" :clearable="true"></u-input>
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="addProduct">入库</u-button>
		</u-popup>
		<u-popup :show="showInfoModal" mode="center" v-model="showInfoModal" @close="() => {showInfoModal = false; selectObj = {}}" closeOnClickOverlay>
			<u-form ref="infoForm" :model="formInfoData" :rules="infoRules" label-width="180" class="product_form">
				<u-form-item label="快递单号" prop="logisticsNumber" :required="true">
					<u-input v-model="formInfoData.logisticsNumber" placeholder="请输入快递单号" :clearable="true"></u-input>
				</u-form-item>
				<u-button type="error" @click="outProduct" class="out_btn">出库</u-button>
			</u-form>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	import api from '../../api/index.js';
	export default {
		data() {
			return {
				productList: [],
				pageNum: 1,
				status: '',
				currentIndex: 0,
				selectObj: {},
				list: [{
					name: '全部',
					value: '',
				}, {
					name: '待出库',
					value: '1',
				}, {
					name: '空闲',
					value: '2'
				}, {
					name: '已出库',
					value: '3'
				}],
				showAddModal: false,
				showInfoModal: false,
				formAddData: {
					title: '',
					model: '',
					macAddress: '',
				},
				formInfoData: {
					logisticsNumber: '',
				},
				addRules: {
					name: [{
						required: true,
						message: '请输入产品名称',
						trigger: ['change', 'blur'],
					}],
					model: [{
						required: true,
						message: '请输入产品型号',
						trigger: ['change', 'blur'],
					}],
					macAddress: [{
						required: true,
						message: '请输入MAC地址',
						trigger: ['change', 'blur'],
					}],
				},
				infoRules: {
					logisticsNumber: [{
						required: true,
						message: '请输入快递单号',
						trigger: ['change', 'blur'],
					}]
				}
			};
		},
		mounted() {
			this.initProduct(1);
		},
		onPullDownRefresh() {
			this.initProduct(1);
		},
		onReachBottom() {
			this.initProduct(this.pageNum);
		},
		methods: {
			changeIndex(e) {
				this.currentIndex = e.index;
				this.status = e.value
				this.$nextTick(() => {
					this.initProduct(1)
				});
			},
			showInfo(product){
				if(this.currentIndex === 1){
					this.showInfoModal = true;
					this.selectObj = product
				}
			},
			initProduct(pageNum) {
				api.products({
					pageNum,
					pageSize: 20,
					status: this.status,
				}).then(res => {
					uni.stopPullDownRefresh();
					if(res?.total === 0){
						this.productList = [];
						this.pageNum = 1;
						return;
					}
					if (res?.rows?.length > 0) {
						let { rows } = res;
						let tmp = [];
						rows.forEach(row => {
							tmp.push({
								name: row.title,
								macAddress: row.macAddress,
								id: row.id,
								retrievalAddress: row.retrievalAddress,
								payMethod: row.payMethod,
								logisticsNumber: row.logisticsNumber,
							});
						});
						pageNum === 1 ? this.pageNum = pageNum + 1 : this.pageNum = this.pageNum + 1;
						pageNum === 1 ? this.productList = tmp : this.productList = this._.concat(this.productList,tmp);
					}
				});
			},
			showProductInfo() {
				let token = uni.getStorageSync('token');
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							title: '识别中',
							mask: true,
						})
						uni.uploadFile({
							url: `${config.API_URL}/tool/ocr/text`,
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								Authorization: 'Bearer ' + token
							},
							success: (res) => {
								let result = JSON.parse(res.data);
								let {
									results
								} = result.data.ocr;
								this.showAddModal = true;
								this.formAddData.title = results[this._.findIndex(results, o => {
									return o.text === '产品名称：'
								}) + 1].text;
								this.formAddData.model = results[this._.findIndex(results, o => {
									return o.text === '产品型号：'
								}) + 1].text;
								let tmpmac = '';
								let tmp = results[this._.findIndex(results, o => {
									return o.text === 'MAC地址：'
								}) + 1].text.split('');
								tmp.forEach((chart, index) => {
									if (index % 2 !== 0 && index + 1 !== tmp.length) {
										tmpmac = tmpmac + chart + ':';
									} else {
										tmpmac = tmpmac + chart;
									}
								})
								this.formAddData.macAddress = tmpmac;
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				})
			},
			addProduct() {
				this.$refs.addForm.validate().then(valid => {
					if (valid) {
						this.showAddModal = false;
						api.addProduct({
							productId: 1,
							...this.formAddData
						}).then(res => {
							if ((res || {}).data) {
								uni.showAddModal({
									title: '入库成功',
									content: `新增设备编号：${res.data}`,
									showCancel: false,
									success: () => {
										this.initProduct(1);
									}
								})
							}
						});
					}
				});
			},
			outProduct() {
				this.$refs.infoForm.validate().then(valid => {
					if (valid) {
						api.outProduct({
							leaseBeginTime: this.dayjs().format('YYYY-MM-DD HH:mm:ss'), //设备租期起始时间
							leaseEndTime: this.dayjs().add(this.selectObj.leaseTerm, 'month').format('YYYY-MM-DD HH:mm:ss'), //设备租期结束时间
							id: this.selectObj.id,
							logisticsNumber: this.formInfoData.logisticsNumber,
						}).then(res => {
							this.showInfoModal = false;
							if(res.code == 200){
								uni.showModal({
									title: '提示',
									content: '成功出库'
								});
							} else {
								uni.showModal({
									title: '提示',
									content: res.msg,
									showCancel: false,
								});
							}
							
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top_box {
		padding: 5px;
		width: 90%;
	}

	.product_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		padding: 10px;
	}

	.product_row {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product_form {
		padding: 0px 10px 0px 10px
	}

	.out_btn {
		margin-bottom: 10px;
	}
</style>
