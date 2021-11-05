let API_URL = ""
let IMG_URL = ""
//默认路径应与 manifest.json 一致，同时修改
let DEVELOPMENT_API_URL = "https://xd.qiantur.com/stage-api";
// let DEVELOPMENT_API_URL = "http://192.168.2.5:8080";
// let PRODUCT_API_URL = "https://xd.qiantur.com/prod-api/";
let PRODUCT_API_URL = "https://xd.qiantur.com/stage-api";
let DEFAULT_IMG_URL = 'https://xd.qiantur.com/minio';
let PRODUCT_IMG_URL = 'https://xd.qiantur.com/minio';

if (process.env.NODE_ENV === 'development') {
	// #ifdef H5
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

	// #ifdef MP-WEIXIN
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

	// #ifdef APP-PLUS
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

} else {
	API_URL = PRODUCT_API_URL
	IMG_URL = PRODUCT_IMG_URL
}

export default {
	API_URL,
	IMG_URL,
}