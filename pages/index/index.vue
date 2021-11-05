<template>
	<view class="content">
		<u-form :model="form" label-width="140" class="login_form">
			<u-image src="/static/logo.png" width="80" height="80" class="head_img"></u-image>
			<u-form-item label="用户名">
				<u-input v-model="form.userName" placeholder="请输入用户名" :clearable="true"></u-input>
			</u-form-item>
			<u-form-item label="密码">
				<u-input v-model="form.password" placeholder="请输入密码" type="password"></u-input>
			</u-form-item>
		</u-form>
		<u-button class="login_btn" type="primary" @click="login">登录</u-button>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	export default {
		data() {
			return {
				form:{
					userName: '',
					password: '',
				}
			}
		},
		onLoad() {

		},
		methods: {
			login(){
				api.login(){
					
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login_form {
		display: flex;
		flex-direction: column;
		margin-top: 400rpx;
		width: 80%;
	}
	.head_img {
		align-self: center;
	}
	.login_btn {
		margin-top: 50rpx;
		width: 60%;
	}
</style>
