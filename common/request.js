import {
	convertSerialize
} from './utils.js'
import config from './config.js';
const request = {}
const headers = {}

request.globalRequest = (url, method, data) => {
	uni.showLoading({
		title: '加载中...',
		mask:true,
	})
	let header = {}
	let token = uni.getStorageSync('tonken');
	header['Authorization'] = 'Bearer ' + token;
	header['content-type'] = 'application/json';

	//接口公共参数
	const obj = {
		complanyIds: uni.getStorageSync('complanyId'),
	}
	let JSONParams = {
		url: `${config.API_URL}${url}`,
		method: method,
		data: {
			...obj,
			...data
		},
		dataType: 'JSON',
		header: header,
		sslVerify: "false",
	}
	// #ifdef APP-PLUS
	console.log('request:', JSONParams);
	// #endif

	return uni.request(JSONParams).then(res => {
		uni.hideLoading();
		console.log('response:', res.length > 1 ? res[1].data : res);
		if (res[1]) {
			let data = '';
			// #ifdef MP-WEIXIN
			data = JSON.parse(res[1].data);
			//#endif

			// #ifdef H5
			data = res[1].data;
			// #endif

			// #ifdef APP-PLUS
			data = res[1].data;
			// #endif
			//TODO 根据实际后台返回格式修改
			if (data.code == 200) {
				return data;
			} else {
				throw data;
			}
		}
	}).catch(params => {
		if (params.code === 401) {
			uni.showToast({
				title: '登录会话过期，请重新登录',
				icon: 'none'
			});
			uni.redirectTo({
				url: '/pages/model/login/Login',
			});
		} else {
			uni.showModal({
				title: params.msg || '服务器返回错误',
				icon: 'none'
			});
		}
	})
}

export default request
