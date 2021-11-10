<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	.content {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex: 1;
	}
	uni-page-wrapper {
		display: flex;
	}
	uni-page-body {
		display: flex;
	}
</style>
