<template>
	<view :class="{
		'circle flex-row flex-0 flex-center':true,
		'red-circle':type == 'red',
		'blue-circle':type == 'blue',
		'yellow-circle':type == 'yellow'
	}">
		{{number < 10 ? "0"+number : number}}
	</view>
</template>

<script>
	export default {
		props: {
			number: {
				type: Number
			},
			type: {
				type: String
			},
		}
	}
</script>
<style lang="less" scoped>
	.circle {
		width: 1.625rem;
		font-size: 0.875rem;
		aspect-ratio: 1/1;
		border-radius: 50%;
		font-weight: 600;
		color: #fff;
		background-color: #b1b1b1;
	}

	.red-circle {
		background-color: #d0232f;
	}

	.blue-circle {
		background-color: #2571df;
	}
	.yellow-circle{
		background-color: #b1b1b1;
		color: yellow;
	}
</style>