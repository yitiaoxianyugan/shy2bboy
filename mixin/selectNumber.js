import {
	includes
} from "lodash";

export default {
	data() {
		return {
			selectNumberNo: 0,
			selectNumber: {
				red: [],
				blue: []
			},
			waitSelectNumber:{
				red: [],
				blue: []
			}
		}
	},
	// computed:{
	// 	let arr = this.selectNumber.red;
	// 	function findAllMissingConsecutive(arr, end) {
			
	// 	}
	// },
	methods: {
		setColor(num, color) {
			color = color || 'red';
			let filterArr = this.selectNumber[color] || [];
			if (!filterArr.includes(num)) {
				color = ""
			}

			return color;
		},
		openSelectCode() {
			// 我要选号
			this.selectNumberVisible = true;
			this.selectNumber.red = this.lastItem.redArr;
			this.selectNumber.blue = this.lastItem.blueArr;
		},
		cancelSelect() {},
		confirmSelect() {
			let red = this.selectNumber.red;
			let blue = this.selectNumber.blue;
			let abc = findAllMissingConsecutive(red, 33)
			console.log("confirmSelect",red, abc);

			function findAllMissingConsecutive(arr, end) {
				arr.sort((a, b) => a-b);
				let diff = 0;
				let missingNumbers = [];
				if (arr[0] > 1) {
					for (let j = 1; j < arr[0]; j++) {
						missingNumbers.push(j);
					}
				}
				console.log("findAllMissingConsecutive",missingNumbers)
				for (let i = 0; i < arr.length - 1; i++) {
					diff = arr[i + 1] - arr[i];
					if (diff > 1) {
						for (let j = arr[i] + 1; j < arr[i + 1]; j++) {
							missingNumbers.push(j);
						}
					}
				}
				diff = end - arr[arr.length-1];
				if(diff = 1){
					missingNumbers.push(end);
				}else if(diff > 1){
					for (let j = 0; j<diff; j++) {
						missingNumbers.push(end - j);
					}
				}else{}
				return missingNumbers;
			}

			// this.closeSelectNum();
		},
		randomNumber() {
			let self = this;
			let totalCount = 326;
			let red = 33;
			let blue = 16;
			let jixuanObj = {
				redObj: {},
				blueObj: {},
				redArr: [],
				blueArr: []
			}

			function tempGenArr(total) {
				let tempArr = [];
				for (let i = 0; i <= total; i++) {
					tempArr.push(i)
				}
				return tempArr;
			}

			function getNum(totalCount) {
				for (let i = 0; i < totalCount; i++) {
					let redNumList = tempGenArr(red);
					let blueNumList = tempGenArr(blue);
					aArrData(redNumList, 6, red);
					aArrData(blueNumList, 1, blue);
				}
			}

			function aArrData(arr, len, jishu) {
				let tempArr = [];
				for (let i = 0; i < len; i++) {
					let ranNumm = randomNum(1, jishu - i);
					let num = arr[ranNumm];
					tempArr.push(num);
					arr = arr.filter(item => item !== num);
					let tempObj = len >= 6 ? jixuanObj.redObj : jixuanObj.blueObj;
					if (tempObj[num]) {
						tempObj[num]++;
					} else {
						tempObj[num] = 1;
					}
					let tempArrF = Object.entries(tempObj).sort((a, b) => a[1] - b[1]);
					tempArr = [];
					let state = true;
					for (let i = 0; i < tempArrF.length - 1 && state; i++) {
						let item = tempArrF[i];
						let tempItem = tempArrF[i + 1];
						if (item[1] == tempItem[1] || tempArr.length < len) {
							tempArr.push(parseInt(item[0]));
						} else {
							state = false;
						}
					}
					tempArr.sort((a, b) => a - b),
						len >= 6 ? jixuanObj.redArr = tempArr : jixuanObj.blueArr = tempArr;
				}
			}

			function randomNum(min, max) {
				let num = 1;
				num = Math.floor(Math.random() * (max - min) + min);
				return num;
			}
			getNum(totalCount);
			self.selectNumberNo += 1;
			self.selectNumber.red = [...self.selectNumber.red, ...jixuanObj.redArr];
			self.selectNumber.blue = [...self.selectNumber.blue, ...jixuanObj.blueArr];
		}
	}
}