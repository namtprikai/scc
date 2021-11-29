import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { Auth } from "@/utils/auth";
import { UserModule } from "@/store/modules/user";
import { apiUrl } from "@consoletype/utils/configration";
import { AjaxService } from "@/services/ajax";
const service = axios.create({
	baseURL: apiUrl,
	timeout: 15000,
});
// Request interceptors
service.interceptors.request.use(
	async (config) => {
		const token = await AjaxService.getInstance().getToken();
		if (token) {
			// config.headers['Token'] = token;
			config.headers.Authorization = `Bearer ${token}`;
			config.headers["Content-type"] = "application/json";
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

// Response interceptors
service.interceptors.response.use(
	(response) => {
		console.log(response);
		// Some example codes here:
		// code == 20000: valid
		// code == 50008: invalid token
		// code == 50012: already login in other place
		// code == 50014: token expired
		// code == 60204: account or password is incorrect
		// You can change this part for your own usage.
		const status = response.status;
		const res = response.data;
		if (status !== 200 && status !== 304) {
			console.log("error");
			Message({
				message: res.message,
				type: "error",
				duration: 5 * 1000,
			});
			if (status === 500 || status === 400 || status === 401) {
				console.log("logout");
				MessageBox.confirm("エラー", "エラー", {
					confirmButtonText: "エラー",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					UserModule.FedLogOut().then(() => {
						// location.reload(); // To prevent bugs from vue-router
					});
				});
			}
			return Promise.reject("error with code: " + res.code);
		} else {
			return response.data;
		}
	},
	(error) => {
		console.log("error");
		const response = error.response;
		const status = response.status;
		if (status !== 304) {
			Message({
				message: error.message,
				type: "error",
				duration: 5 * 1000,
			});
		}

		if (status === 500 || status === 400 || status === 401) {
			console.log("logout");
			UserModule.FedLogOut().then(() => {
				// location.reload(); // To prevent bugs from vue-router
			});
		}
		return Promise.reject(error);
	}
);

export default service;
