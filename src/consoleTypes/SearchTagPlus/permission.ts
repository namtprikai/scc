import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import { Auth } from "@/utils/auth";
import { Route } from "vue-router";
import { UserModule } from "@/store/modules/user";
import { eventHub } from "@/init/eventHub";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];
let flg = true;
router.beforeEach(async (to: Route, from: Route, next: any) => {
	console.log("before");
	console.log(UserModule);
	NProgress.start();
	const token = await Auth.getToken();
	if (token) {
		if (flg) {
			eventHub.$emit("loginAfterInit");
			flg = false;
		}

		if (whiteList.indexOf(to.path) != -1) {
			next({ path: "/" });
			NProgress.done(); // If current page is dashboard will not trigger afterEach hook, so manually handle it
		} else {
			if (UserModule.Role.size === 0) {
				UserModule.GetInfo()
					.then(() => {
						next();
						console.log(UserModule);
					})
					.catch((err: any) => {
						console.log("Error UserModule");
						UserModule.FedLogOut().then(() => {
							Message.error(err || "Verification failed, please login again");
							next({ path: "/" });
						});
					});
			} else {
				next();
			}
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			next();
		} else {
			next(`/login?redirect=${to.path}`); // Redirect to login page
		}
	}
});

router.afterEach(() => {
	NProgress.done();
});
