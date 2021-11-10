<template>
	<view class="content">
		<u-form ref="form" :model="formDate" label-width="140" class="login_form" :rules="rules">
			<u-image src="/static/logo.png" width="80" height="80" class="head_img"></u-image>
			<u-form-item label="用户名" prop="userName">
				<u-input v-model="formDate.userName" placeholder="请输入用户名" :clearable="true"></u-input>
			</u-form-item>
			<u-form-item label="密码" prop="password">
				<u-input v-model="formDate.password" placeholder="请输入密码" type="password"></u-input>
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
				formDate: {
					userName: '',
					password: '',
				},
				rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}],
				}
			}
		},
		methods: {
			login() {
				this.$refs.form.validate(valid => {
					if(valid){
						api.login(this.formDate).then(res => {
							uni.setStorageSync('token' , res.token);
							uni.navigateTo({
								url: '/pages/index/Table'
							})
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login_form {
		display: flex;
		flex-direction: column;
		margin-top: 300rpx;
		width: 80%;
		align-self: center;
	}

	.head_img {
		align-self: center;
	}

	.login_btn {
		margin-top: 50rpx;
		width: 60%;
	}
</style>
