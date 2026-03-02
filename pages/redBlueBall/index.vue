<template>
	<view class="caipiao-view w-100 h-100 flex-col">
		<view class="caipiao-title flex-row flex-0-0 justify-between">
			<view class="flex-1-1 flex-col gap-2">
				<view class="flex-row gap-4">
					<text>数据来源： 广东福利彩票</text>
					<text v-if="listTotal != null">近 {{listTotal}} 期数据</text>
				</view>
				<view class="flex-row gap-2" v-if="lastItem">
					<BollCircle v-for="num in lastItem.redArr" :key="'lastItem-r'+num" :number="num" type="red">
					</BollCircle>
					<BollCircle v-for="num in lastItem.blueArr" :key="'lastItem-b'+num" :number="num" type="blue">
					</BollCircle>
				</view>
			</view>
			<view class="flex-0-0 flex-col text-primary font-bold text-center">
				<text @click="openSelectCode">我要选号</text>
				<text @click="selectCodeList">选号记录</text>
			</view>
		</view>
		<view class="caipiao-content flex-1-1">
			<LoopList :list="list" class="caipiao-number-list" @loadDateScroll="loadDateScroll"
				@scrollLower="scrollLower">
				<template #default={item}>
					<view class="caipiao-number-item flex-col gap-1">
						<view class="font-bold">
							<text>{{item.code}} 期 -- 开奖日期: {{item.day}}</text>
						</view>
						<view class="flex-row gap-2">
							<BollCircle v-for="num in item.redArr" :key="item.code+'r'+num" :number="num" type="red">
							</BollCircle>
							<BollCircle v-for="num in item.blueArr" :key="item.code+'b'+num" :number="num" type="blue">
							</BollCircle>
						</view>
					</view>
				</template>
			</LoopList>
		</view>
		<view class="select-number-modal flex-col" v-if="selectNumberVisible">
			<text class="modal-close close-icon" @click="closeSelectNum()">X</text>
			<view class="modal-title">
				<text>选择号码</text>
			</view>
			<view class="modal-body flex-col">
				<view class="select-number-area flex-col gap-1">
					<text>红球区</text>
					<view class="flex-row flex-0-0 gap-1 flex-wrap">
						<BollCircle v-for="num in 33" :key="'select-red'+num" :number="num" :type="setColor(num,'red')">
						</BollCircle>
					</view>
					<text>蓝球区</text>
					<view class="flex-row flex-0-0 gap-1 flex-wrap">
						<BollCircle v-for="num in 16" :key="'select-blue'+num" :number="num" :type="setColor(num,'blue')">
						</BollCircle>
					</view>
					<button type="primary" @click="randomNumber">机选号码{{ selectNumberNo <= 0 ?'':selectNumberNo}}</button>
				</view>
			</view>
			<view class="modal-footer flex-row ">
				<button type="default" @click="cancelSelect">取消</button>
				<button type="primary" @click="confirmSelect">确认</button>
			</view>
		</view>
		<view></view>
	</view>
</template>

<script>
	import LoopList from "../../componentes/LoopList.vue";
	import BollCircle from "./boll-circle.vue";
	import selectNumber from "../../mixin/selectNumber";
	export default {
		mixins:[selectNumber],
		components: {
			LoopList,
			BollCircle
		},
		data() {
			return {
				loading: false,
				pageNo: 1,
				limit: 20,
				listTotal: null,
				list: [],
				selectNumberVisible: false,
				// lastItem: {}
			}
		},
		computed: {
			lastItem() {
				return this.list[0];
			},
		},
		created() {
			const allCaipiaoData = uni.getStorageSync("allCaipiaoData");
			if (
				allCaipiaoData === undefined ||
				allCaipiaoData.length <= 0
			) {
				this.loadData(true);
			} else {
				this.list = allCaipiaoData;
				this.listTotal = allCaipiaoData.length;
			}

		},
		mounted() {

		},
		methods: {
			// 获取彩票 数据
			loadData() {
				let list = [];
				let param = {
					type: "ssq",
					page: this.pageNo || 1,
					limit: this.limit
				};
				this.loading = true;
				uni.request({
					url: "http://api.huiniao.top/interface/home/lotteryHistory",
					method: "GET",
					data: param,
					complete: (res) => {
						if (res.statusCode !== 200) {
							console.error(res.errMsg);
							return;
						}
						// 处理成功逻辑(接口特殊)
						let result = res.data.data.data;
						let lastResult = res.data.data.last;
						list = result.list.map((item) => {
							let newObj = setRewardCode(item);
							return {
								...item,
								...newObj,
							};
						});
						this.todoShowList(list);
					}
				});

				function setRewardCode(item) {
					let arr = ["one", "two", "three", "four", "five", "six", "seven"];
					let redArr = [];
					let blueArr = [];
					arr.forEach((e) => {
						if (e == "seven") {
							blueArr.push(parseInt(item[e]));
						} else {
							redArr.push(parseInt(item[e]));
						}
					});
					return {
						...item,
						redArr: redArr,
						blueArr: blueArr,
					};
				}
			},
			todoShowList(list) {
				this.list = [...this.list, ...list];
				this.listTotal = this.pageNo * this.limit;
				this.loading = false;
				uni.setStorageSync("allCaipiaoData", this.list);
			},
			loadDateScroll(e) {
				console.log("loadDateScroll", e);
				this.pageNo += 1;
				this.loadData();
			},
			scrollLower() {
				console.log("scrollLower");
				this.pageNo += 1;
				this.loadData();
			},
			closeSelectNum() {
				this.selectNumberVisible = false;
			},
			selectCodeList() {
				// 选号记录
			},
		}
	}
</script>

<style lang="less" scoped>
	@primary-color: #1890ff;

	.caipiao-view {
		overflow: hidden;

		.caipiao-title {
			width: 100%;
			padding: .5rem .325rem;
			border-bottom: 1px solid #c3c3c3;

			.text-primary {
				padding: 0 .75rem;
				font-size: 1rem;
				color: @primary-color;
				line-height: 2;
			}
		}

		.caipiao-content {
			overflow: hidden;

			.caipiao-number-list {
				.caipiao-number-list {
					padding: 0rem .325rem;
				}

			}
		}

		.select-number-modal {
			position: fixed;
			width: calc(100vw - 2rem);
			max-height: calc(100vh - 4rem);
			border: 1px #c3c3c3 solid;
			background-color: #fff;
			border-radius: .5rem;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);

			.modal-close {
				position: absolute;
				right: .5rem;
				top: .25rem;
				font-size: 1.25rem;
				color: #333;
			}

			.modal-title {
				width: calc(100% - 2rem);
				padding: 0.25rem .5rem;
				font-size: 1.25rem;
				line-height: 2;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.modal-body {
				width: 100%;
				min-height: 2.75rem;
				max-height: 100%;
				padding: .5rem;
				border-top: 1px #c3c3c3 solid;
				border-bottom: 1px #c3c3c3 solid;
				overflow: hidden auto;
				
				.select-number-area{}
			}

			.modal-footer {
				button {
					width: 50%;
					border-radius: 0;
				}
			}
		}
	}
</style>