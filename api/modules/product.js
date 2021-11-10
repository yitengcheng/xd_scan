import request from '../../common/request.js'

const product = {
	products:(data)=>{
		return request.globalRequest('/product/goods/list', 'post', data);
	},
	addProduct: (data) => {
		return request.globalRequest('/product/insert/goods', 'post', data);
	},
	outProduct: (data) => {
		return request.globalRequest('/product/deliver/goods ', 'post', data);
	},
}


export default product