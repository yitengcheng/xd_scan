import request from '../../common/request.js'

const user = {
	login:(data)=>{
		return request.globalRequest('/auth/app/login', 'post', data);
	},
}


export default user