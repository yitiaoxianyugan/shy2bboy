import axios from "axios";


//设置baseURL
axios.defaults.baseURL = '';
// 请求超时时间
axios.defaults.timeout = 60 * 1000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

function handleUrlParams(url, config) {
	
}
// 添加请求拦截器
axios.interceptors.request.use(
	config => {
		// 在发送请求之前做些什么
		return config;
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);
// 添加响应拦截器
axios.interceptors.response.use(
	response => {
		// 对响应数据做点什么
		return Promise.resolve(response);
	},
	error => {
		// 对响应错误做点什么
		return Promise.reject(error.response);
	}
);

// get方法，对应get请求
export function getAction(url, params, config = {}) {
	config.params = params;
	return new Promise((resolve, reject) => {
		axios.get(url, config).then(res => {
			// 返回接口数据
			resolve(res.data)
		}).catch(err => {
			reject(err)
		});
	});
}
// post方法，对应post请求
export function postAction(url, params, config = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, config).then(
			res => {
				// 返回接口数据
				resolve(res.data)
			},
			err => {
				reject(err)
			}
		).catch(err => {
			reject(err)
		});
	});
}
// put方法，对应put请求
export function putAction(url, params, config = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, params, config).then(
			res => {
				// 返回接口数据
				resolve(res.data)
			},
			err => {
				reject(err)
			}
		).catch(err => {
			reject(err)
		})
	});
}
// delete方法，对应delete请求
export function deleteAction(url, params) {
	return new Promise((resolve, reject) => {
			axios.delete(url, {
				params: params
			}).then(
				res => {
					resolve(res.data)
				}).catch(err => {
				reject(err)
			});
		}
	}