class Resource {
	readyPromise: any;
	constructor() {
		// this.ready();
	}

	ready(scriptPackage: any) {
		if (!this.readyPromise) {
			this.readyPromise = scriptPackage;
		}
		return this.readyPromise;
	}

	async prepare() {
		const startTime = new Date().getTime();
		const response = require('./static/script_package.json');
		const data = response;
		console.log('script_package fetch time', new Date().getTime() - startTime);
		return data;
	}
}

const resource = new Resource();

export default resource;
